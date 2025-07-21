import express from 'express';
import { analyzeDrugInformation, analyzeMultipleDrugInteractions, generateDrugReport } from '../gemini';

const router = express.Router();

// Analyze single drug with Gemini AI
router.post('/analyze', async (req, res) => {
  try {
    const { drugName, drugDetails } = req.body;
    
    if (!drugName) {
      return res.status(400).json({ error: 'Drug name is required' });
    }

    const analysis = await analyzeDrugInformation(drugName, drugDetails);
    res.json(analysis);
  } catch (error) {
    console.error('Drug analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze drug information' });
  }
});

// Analyze drug interactions
router.post('/interactions', async (req, res) => {
  try {
    const { drugs } = req.body;
    
    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
      return res.status(400).json({ error: 'At least 2 drugs are required for interaction analysis' });
    }

    const interactions = await analyzeMultipleDrugInteractions(drugs);
    res.json(interactions);
  } catch (error) {
    console.error('Drug interaction analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze drug interactions' });
  }
});

// Generate comprehensive drug report
router.post('/report', async (req, res) => {
  try {
    const { drugName, patientInfo } = req.body;
    
    if (!drugName) {
      return res.status(400).json({ error: 'Drug name is required' });
    }

    const report = await generateDrugReport(drugName, patientInfo);
    res.json({ report });
  } catch (error) {
    console.error('Drug report generation error:', error);
    res.status(500).json({ error: 'Failed to generate drug report' });
  }
});

export default router;