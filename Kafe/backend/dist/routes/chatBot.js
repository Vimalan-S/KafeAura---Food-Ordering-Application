"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const text_splitter_1 = require("langchain/text_splitter");
const google_genai_1 = require("@langchain/google-genai");
const config_1 = require("../utils/config");
const fs = require('fs');
const express_1 = __importDefault(require("express"));
const google_genai_2 = require("@langchain/google-genai");
const prompts_1 = require("@langchain/core/prompts");
const logger_1 = __importDefault(require("../utils/logger"));
// Configure Multer for file uploads
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = express_1.default.Router();
// Initialize FAISS vector store from the database
let loadedVectorStore = null;
// Initialize Google Embeddings
var embeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({
    modelName: 'models/text-embedding-004',
    apiKey: "AIzaSyCnBzjRifUt6gTILLm20fZb4nPfEPgKmHo",
});
// Function to Split Text into Chunks
function getTextChunks(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        return yield splitter.createDocuments([text]);
    });
}
// Function to Create FAISS Store
// Function to Create FAISS Store
function createFaissIndex(chunks) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create the vector store from documents
            const vectorStore = yield faiss_1.FaissStore.fromDocuments(chunks, embeddings);
            // Directory to store the FAISS index
            const faissDirectory = './faiss_store';
            yield vectorStore.save(faissDirectory);
            // Read the FAISS index file as binary data
            const faissIndexBuffer = fs.readFileSync(`${faissDirectory}/faiss.index`);
            // Read the docstore.json file (contains document metadata)
            const docstoreData = fs.readFileSync(`${faissDirectory}/docstore.json`, 'utf-8');
            // Optionally serialize the vectorStore (if you need the metadata in a different format)
            // const indexData = await vectorStore.serialize(); // Uncomment if you want to serialize the vector store
            // Save both FAISS index and docstore into your database
            // You can use faissIndexBuffer for FAISS index and docstoreData for document metadata
            return { faissIndexBuffer, docstoreData };
        }
        catch (err) {
            console.error('Error creating FAISS index:', err);
            logger_1.default.error('Error creating FAISS index:', err);
            return { faissIndexBuffer: null, docstoreData: null };
        }
    });
}
// Endpoint to Handle File Upload and Process
router.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).send('No file uploaded.');
        }
        const filePath = req.file.path;
        const fileName = req.file.originalname;
        // Extract text from PDF
        const fileBuffer = fs.readFileSync(filePath);
        const pdfData = yield (0, pdf_parse_1.default)(fileBuffer);
        // Split text into chunks
        const chunks = yield getTextChunks(pdfData.text);
        // Create FAISS index and get the FAISS index binary and docstore data
        const { faissIndexBuffer, docstoreData } = yield createFaissIndex(chunks);
        if (!faissIndexBuffer || !docstoreData) {
            logger_1.default.error('Failed to create FAISS index or retrieve docstore data');
            return res.status(500).json({ error: 'Failed to create FAISS index or retrieve docstore data.' });
        }
        // Save FAISS index and docstore metadata into the database
        const [result] = yield config_1.dbPromise.query('INSERT INTO faiss_store (file_name, index_data, metadata) VALUES (?, ?, ?)', [fileName, faissIndexBuffer, docstoreData]);
        // Clean up uploaded file
        fs.unlinkSync(filePath);
        logger_1.default.info('File processed successfully: ', result.insertId);
        res.status(200).json({ message: 'File processed successfully.', id: result.insertId });
    }
    catch (err) {
        console.error('Error processing file:', err);
        logger_1.default.error('Error processing file:', err);
        res.status(500).json({ error: 'Failed to process file.' });
    }
}));
const vectorStorePromise = (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch embeddings and metadata from the `faiss_store` table
        const [rows] = yield config_1.dbPromise.execute('SELECT * FROM faiss_store');
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
        var embeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({
            modelName: 'models/text-embedding-004',
            apiKey: "AIzaSyCnBzjRifUt6gTILLm20fZb4nPfEPgKmHo",
        });
        // Load the FAISS store from the temporary directory
        loadedVectorStore = yield faiss_1.FaissStore.load(tempDir, embeddings);
        // Clean up temporary files
        try {
            fs.unlinkSync(tempIndexPath);
            fs.unlinkSync(tempDocstorePath);
            fs.rmdirSync(tempDir);
        }
        catch (cleanupError) {
            console.warn('Warning: Error cleaning up temporary files:', cleanupError);
            logger_1.default.warn('Warning: Error cleaning up temporary files:', cleanupError);
        }
        logger_1.default.info('FAISS vector store initialized successfully from the database');
        console.log('FAISS vector store initialized successfully from the database');
        return loadedVectorStore;
    }
    catch (error) {
        console.error('Error initializing FAISS vector store from database:', error);
        logger_1.default.error('Error initializing FAISS vector store from database:', error);
        // Cleanup on error
        try {
            if (fs.existsSync('./temp_faiss')) {
                fs.rmSync('./temp_faiss', { recursive: true, force: true });
            }
        }
        catch (cleanupError) {
            console.warn('Warning: Error cleaning up temporary files after error:', cleanupError);
            logger_1.default.warn('Warning: Error cleaning up temporary files after error:', cleanupError);
        }
        return null;
    }
}))();
// Chat endpoint with conversational history
router.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
        logger_1.default.error("Invalid request: 'question' field is required and must be a string");
        res.status(400).json({ error: "Invalid request: 'question' field is required and must be a string." });
        return;
    }
    try {
        const loadedVectorStore = yield vectorStorePromise;
        if (!loadedVectorStore) {
            logger_1.default.error("Error thrown: Vector store not initialized");
            throw new Error('Vector store not initialized');
        }
        const session = req.session;
        if (session.chat_history == undefined || !session.chat_history) {
            session.chat_history = [];
        }
        const documentCount = 1;
        const desiredK = 5;
        const kValue = Math.min(desiredK, documentCount);
        const chain = getConversationalChain(loadedVectorStore, kValue);
        const response = yield chain({
            question,
            chat_history: session.chat_history,
        });
        session.chat_history.push({ question, answer: response.text });
        res.status(200).json({
            answer: response.text,
            sourceDocuments: response.sourceDocuments.map((doc) => doc.metadata),
        });
    }
    catch (err) {
        console.error(`Error in /chat endpoint: ${err.message}`);
        logger_1.default.error(`Error in /chat endpoint: ${err.message}`);
        res.status(500).json({ error: 'Internal server error.' });
    }
}));
// Function to create Conversational Retrieval QA Chain
function getConversationalChain(loadedVectorStore, kValue = 5) {
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
    const model = new google_genai_2.ChatGoogleGenerativeAI({
        modelName: 'models/gemini-1.5-flash',
        temperature: 0.9,
        apiKey: "AIzaSyCnBzjRifUt6gTILLm20fZb4nPfEPgKmHo",
    });
    const prompt = prompts_1.ChatPromptTemplate.fromTemplate(promptTemplate);
    const retriever = loadedVectorStore.asRetriever({ k: kValue });
    return (_a) => __awaiter(this, [_a], void 0, function* ({ question, chat_history = [], }) {
        const relevantDocs = yield retriever.invoke(question);
        const context = relevantDocs.map((doc) => doc.pageContent).join('\n');
        // Create an array of messages for the model
        const formattedPrompt = yield prompt.format({ chat_history, context, question });
        const messages = [
            {
                type: 'system',
                content: formattedPrompt,
            },
            {
                type: 'user',
                content: question,
            },
        ];
        const response = yield model.invoke(messages); // Pass the array of messages
        return {
            text: response.content,
            sourceDocuments: relevantDocs,
        };
    });
}
exports.default = router;
