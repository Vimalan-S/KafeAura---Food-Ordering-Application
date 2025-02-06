import multer from 'multer';
import pdf from 'pdf-parse';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { dbPromise } from '../utils/config';
const fs: any = require('fs');
import express from 'express';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { BaseMessageLike } from '@langchain/core/messages';
import logger from '../utils/logger';


// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Initialize FAISS vector store from the database
let loadedVectorStore: FaissStore | null = null;

// Initialize Google Embeddings
var embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'models/text-embedding-004',
    apiKey: "AIzaSyCnBzjRifUt6gTILLm20fZb4nPfEPgKmHo",
  });
  
  // Function to Split Text into Chunks
  async function getTextChunks(text: string): Promise<any[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    return await splitter.createDocuments([text]);
  } 
  
  // Function to Create FAISS Store
  // Function to Create FAISS Store
  async function createFaissIndex(chunks: any[]) {
    try {
      // Create the vector store from documents
      const vectorStore: any = await FaissStore.fromDocuments(chunks, embeddings);
  
      // Directory to store the FAISS index
      const faissDirectory = './faiss_store';
      await vectorStore.save(faissDirectory);
  
      // Read the FAISS index file as binary data
      const faissIndexBuffer = fs.readFileSync(`${faissDirectory}/faiss.index`);
  
      // Read the docstore.json file (contains document metadata)
      const docstoreData = fs.readFileSync(`${faissDirectory}/docstore.json`, 'utf-8');
  
      // Optionally serialize the vectorStore (if you need the metadata in a different format)
      // const indexData = await vectorStore.serialize(); // Uncomment if you want to serialize the vector store
  
      // Save both FAISS index and docstore into your database
      // You can use faissIndexBuffer for FAISS index and docstoreData for document metadata
      return { faissIndexBuffer, docstoreData };
    } catch (err) {
      console.error('Error creating FAISS index:', err);
      logger.error('Error creating FAISS index:', err);
      return { faissIndexBuffer: null, docstoreData: null };
    }
  }
  

  
  // Endpoint to Handle File Upload and Process
  router.post('/upload', upload.single('file'), async (req: any, res: any) => {
    try {
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).send('No file uploaded.');
      }
  
      const filePath = req.file.path;
      const fileName = req.file.originalname;
  
      // Extract text from PDF
      const fileBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(fileBuffer);
  
      // Split text into chunks
      const chunks = await getTextChunks(pdfData.text);
  
      // Create FAISS index and get the FAISS index binary and docstore data
      const { faissIndexBuffer, docstoreData } = await createFaissIndex(chunks);
  
      if (!faissIndexBuffer || !docstoreData) {
        logger.error('Failed to create FAISS index or retrieve docstore data');
        return res.status(500).json({ error: 'Failed to create FAISS index or retrieve docstore data.' });
      }
  
      // Save FAISS index and docstore metadata into the database
      const [result]: any = await dbPromise.query(
        'INSERT INTO faiss_store (file_name, index_data, metadata) VALUES (?, ?, ?)',
        [fileName, faissIndexBuffer, docstoreData]
      );
  
      // Clean up uploaded file
      fs.unlinkSync(filePath);
  
      logger.info('File processed successfully: ', result.insertId);
      res.status(200).json({ message: 'File processed successfully.', id: result.insertId });
    } catch (err) {
      console.error('Error processing file:', err);
      logger.error('Error processing file:', err);
      res.status(500).json({ error: 'Failed to process file.' });
    }
  });
  

  const vectorStorePromise = (async () => {
    try {
        // Fetch embeddings and metadata from the `faiss_store` table
        const [rows]: any[] = await dbPromise.execute('SELECT * FROM faiss_store');
        if (rows.length === 0) {
            throw new Error('FAISS store table is empty.');
        }

        // Create temporary directory for FAISS files if it doesn't exist
        const tempDir = './temp_faiss';
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const row = rows[0];
        
        // Write the FAISS index to a temporary file
        const tempIndexPath = `${tempDir}/faiss.index`;
        fs.writeFileSync(tempIndexPath, row.index_data);

        // Convert metadata array/object back to JSON string before writing
        const tempDocstorePath = `${tempDir}/docstore.json`;
        fs.writeFileSync(tempDocstorePath, JSON.stringify(row.metadata));

        // Initialize embeddings
        var embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: 'models/text-embedding-004',
            apiKey: "AIzaSyCnBzjRifUt6gTILLm20fZb4nPfEPgKmHo",
        });

        // Load the FAISS store from the temporary directory
        loadedVectorStore = await FaissStore.load(tempDir, embeddings);

        // Clean up temporary files
        try {
            fs.unlinkSync(tempIndexPath);
            fs.unlinkSync(tempDocstorePath);
            fs.rmdirSync(tempDir);
        } catch (cleanupError) {
            console.warn('Warning: Error cleaning up temporary files:', cleanupError);
            logger.warn('Warning: Error cleaning up temporary files:', cleanupError);
        }

        logger.info('FAISS vector store initialized successfully from the database');
        console.log('FAISS vector store initialized successfully from the database');
        return loadedVectorStore;
    } catch (error) {
        console.error('Error initializing FAISS vector store from database:', error);
        logger.error('Error initializing FAISS vector store from database:', error);

        // Cleanup on error
        try {
            if (fs.existsSync('./temp_faiss')) {
                fs.rmSync('./temp_faiss', { recursive: true, force: true });
            }
        } catch (cleanupError) {
            console.warn('Warning: Error cleaning up temporary files after error:', cleanupError);
            logger.warn('Warning: Error cleaning up temporary files after error:', cleanupError);
        }
        
        return null;
    }
})();
  // Chat endpoint with conversational history
  router.post('/chat', async (req: any, res: any): Promise<void> => {
    const { question } = req.body;
  
    if (!question || typeof question !== 'string') {
      logger.error("Invalid request: 'question' field is required and must be a string");
      res.status(400).json({ error: "Invalid request: 'question' field is required and must be a string." });
      return;
    }
  
    try {
      const loadedVectorStore = await vectorStorePromise;   

      if (!loadedVectorStore) {
        logger.error("Error thrown: Vector store not initialized");
        throw new Error('Vector store not initialized');
      }
  
      const session = req.session as any;
      if (session.chat_history == undefined || !session.chat_history) {
        session.chat_history = [];
      }
  
      const documentCount = 1;  
      const desiredK = 5;
      const kValue = Math.min(desiredK, documentCount);
  
      const chain = getConversationalChain(loadedVectorStore, kValue);
  
      const response = await chain({
        question,
        chat_history: session.chat_history,
      });
  
      session.chat_history.push({ question, answer: response.text });
  
      res.status(200).json({
        answer: response.text,
        sourceDocuments: response.sourceDocuments.map((doc) => doc.metadata),
      });
    } catch (err: any) {
      console.error(`Error in /chat endpoint: ${err.message}`);
      logger.error(`Error in /chat endpoint: ${err.message}`);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });
  
  // Function to create Conversational Retrieval QA Chain
  function getConversationalChain(loadedVectorStore: FaissStore, kValue: number = 5) {

    const promptTemplate = `
    You are an intelligent assistant with access to a vast amount of knowledge about all topics.
  Your primary goal is to provide accurate and helpful answers to user questions.
  You have access to both retrieved context and your own general knowledge.
  If the retrieved context contains relevant information to answer the question, use it.
  If the context does not contain sufficient information or is not relevant to the question, use your own knowledge to provide a comprehensive answer.
  Do not state that you don't have information or that the context doesn't mention something. Instead, provide the best answer you can based on your general knowledge.
  Pay close attention to the chat history and the current question to maintain context awareness, especially when interpreting pronouns or references to previous topics.
  Always strive to give the most accurate and helpful response possible.
  
    Conversation History:
    {chat_history}
  
    Context:
    {context}
  
    Question:
    {question}
  
    Answer:
    `;
  
    const model = new ChatGoogleGenerativeAI({
      modelName: 'models/gemini-1.5-flash',
      temperature: 0.9,
      apiKey: "AIzaSyCnBzjRifUt6gTILLm20fZb4nPfEPgKmHo",
    });
  
    const prompt = ChatPromptTemplate.fromTemplate(promptTemplate);
    const retriever = loadedVectorStore.asRetriever({ k: kValue });
  
    return async ({
      question,
      chat_history = [],
    }: {
      question: string;
      chat_history?: any[];
    }) => {
      const relevantDocs = await retriever.invoke(question);
      const context = relevantDocs.map((doc) => doc.pageContent).join('\n');
  
      // Create an array of messages for the model
      const formattedPrompt = await prompt.format({ chat_history, context, question });
  
      const messages: BaseMessageLike[] = [
        {
          type: 'system',
          content: formattedPrompt,
        },
        {
          type: 'user',
          content: question,
        },
      ];
  
      const response = await model.invoke(messages); // Pass the array of messages

      return {
        text: response.content,
        sourceDocuments: relevantDocs,
      };
    };
  }
  

  export default router;