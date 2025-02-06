import express from 'express';
import { dbPromise, db } from '../utils/config';
import logger from '../utils/logger';
const axios = require('axios');

const router = express.Router();

router.post('/add-kvalue', async (req:any, res:any) => {
    const { kValue, en } = req.body;

    if (!kValue || !en) {
        logger.warn("kValue and English content are required");
        return res.status(400).json({ message: 'kValue and English content are required' });
    }

    try {
        const query = `INSERT INTO kValues (kValue, en, tam) VALUES (?, ?, ?)`;
        await dbPromise.query(query, [kValue, en, "" ]);
        logger.info("kValue added successfully");
        res.status(200).json({ message: 'kValue added successfully' });
    } catch (error) {
        logger.error("Error adding kValue");
        res.status(500).json({ message: 'Error adding kValue', error });
    }
});


router.post('/generate-tamil-translations', async (req: any, res: any) => {
    try {
        // Fetch all k-values and their English content where Tamil translation is missing
        const [rows]: any[] = await dbPromise.query(`SELECT kValue, en FROM kValues WHERE tam = '';`);
        if (rows.length === 0) {
            return res.status(200).json({ message: 'No translations needed', data: [] });
        }

        // Combine all English text into a single string separated by newlines
        const englishText = rows.map((row: any) => row.en).join('\n');

        // Construct the API body
        const contents = [
            {
                parts: [
                    {
                        text: `Im asking this translation for my Food delivery application. The response should strictly not contain even a single English letter. Translate the following list of English text to Tamil in very very very fewer words:\nEnglish: ${englishText}\nTamil:`,
                    },
                ],
            },
        ];

        // Make a POST request to Google Gemini API
        const googleGeminiAPIKey = 'AIzaSyCbrB_IgIlz2hfF7FwH71YaoBdH_hqtY6M';
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + googleGeminiAPIKey,
            { contents },
            { headers: { 'Content-Type': 'application/json' } }
        );

        // Extract Tamil translations from API response
        const translatedText = response.data.candidates[0].content.parts[0].text.split("\n");

        // Update the database with Tamil translations
        for (let i = 0; i < rows.length; i++) {
            const { kValue } = rows[i];
            const tamTranslation = translatedText[i].trim();
            await dbPromise.query(`UPDATE kValues SET tam = ? WHERE kValue = ?`, [tamTranslation, kValue]);
        }

        res.status(200).json({ message: 'Translations generated and updated successfully', data: translatedText });
    } catch (error: any) {
        console.error('Error generating translations:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to generate translations', error: error.message });
    }
});

router.get('/kValues', async (req, res) => {
    const query = `
        SELECT * FROM kValues
    `;

    db.query(query, (err, results) => {
        if (err) {
        console.error('Error fetching all kValues:', err);
        return res.status(500).json({ message: 'Failed to fetch all kValues', error: err });
        }
        res.status(200).json(results);
    });
});


router.put('/kValues', async (req: any, res: any) => {
    const { kValue, en, tam } = req.body; // Get the entire updated object from the request body

    if (!kValue || !en || !tam) {
        return res.status(400).json({ message: 'Invalid request. Missing fields.' });
    }

    try {
        // Update the database
        const [result]: any = await dbPromise.query(
            'UPDATE kValues SET en = ?, tam = ? WHERE kValue = ?',
            [en, tam, kValue]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'kValue not found.' });
        }

        res.status(200).json({ message: 'kValue updated successfully.' });
    } catch (error) {
        console.error('Error updating kValue:', error);
        res.status(500).json({ message: 'Error updating kValue.' });
    }
});

router.delete('/kValues/:kValue', async (req: any, res: any) => {
    const { kValue } = req.params; // Extract kValue from the route parameter
  
    console.log('Deleting kValue:', kValue);
  
    if (!kValue) {
      return res.status(400).json({ message: 'Invalid request. Missing kValue.' });
    }
  
    try {
      // Delete the kValue from the database
      const [result]: any = await dbPromise.query('DELETE FROM kValues WHERE kValue = ?', [kValue]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'kValue not found.' });
      }
  
      res.status(200).json({ message: 'kValue deleted successfully.' });
    } catch (error) {
      console.error('Error deleting kValue:', error);
      res.status(500).json({ message: 'Error deleting kValue.' });
    }
  });
    

export default router;