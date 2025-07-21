// NMRA (National Medicines Regulatory Authority) Licensed Drug Database for Sri Lanka
// This comprehensive database contains medicines registered with NMRA

import { Medicine } from './sriLankanMedicines';

export const nmraDrugDatabase: Medicine[] = [
  {
    id: 'NMRA001',
    name: 'Panadol',
    genericName: 'Paracetamol',
    category: 'Pain Relief',
    manufacturer: 'State Pharmaceuticals Corporation',
    dosageForm: 'Tablet',
    strength: '500mg',
    uses: ['Pain relief', 'Fever reduction', 'Headache', 'Muscle aches', 'Arthritis pain'],
    sideEffects: ['Rare: skin rash', 'Nausea with high doses', 'Allergic reactions (rare)'],
    warnings: ['Do not exceed recommended dose', 'Avoid alcohol consumption', 'Consult doctor if symptoms persist'],
    contraindications: ['Severe liver disease', 'Known hypersensitivity to paracetamol'],
    interactions: ['Warfarin (increased bleeding risk)', 'Phenytoin', 'Rifampicin'],
    dosage: 'Adults: 500mg-1g every 4-6 hours. Maximum 4g daily. Children: 10-15mg/kg every 4-6 hours',
    storage: 'Store below 30°C in original container. Keep away from children.',
    price: 'LKR 35.00 (10 tablets)',
    availability: 'available',
    nmraRegistration: 'NMRA/MD/001/2023',
    locallyManufactured: true,
    activeIngredients: ['Paracetamol 500mg'],
    therapeuticClass: 'Non-opioid analgesic and antipyretic',
    pharmacology: 'Acts centrally on hypothalamic heat-regulating center and peripherally blocks pain impulses through inhibition of prostaglandin synthesis.'
  },
  {
    id: 'NMRA002',
    name: 'Amoxil',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    manufacturer: 'Glaxo Ceylon Ltd',
    dosageForm: 'Capsule',
    strength: '250mg',
    uses: ['Bacterial infections', 'Respiratory tract infections', 'Urinary tract infections', 'Skin infections'],
    sideEffects: ['Nausea', 'Diarrhea', 'Skin rash', 'Abdominal pain', 'Allergic reactions'],
    warnings: ['Complete full course', 'Take with food to reduce stomach upset', 'Inform doctor of penicillin allergy'],
    contraindications: ['Known penicillin allergy', 'Severe renal impairment', 'Infectious mononucleosis'],
    interactions: ['Warfarin', 'Oral contraceptives', 'Allopurinol', 'Probenecid'],
    dosage: 'Adults: 250-500mg every 8 hours. Children: 20-40mg/kg daily in divided doses',
    storage: 'Store below 25°C in a dry place. Protect from moisture.',
    price: 'LKR 120.00 (10 capsules)',
    availability: 'available',
    nmraRegistration: 'NMRA/MD/002/2023',
    locallyManufactured: false,
    activeIngredients: ['Amoxicillin (as trihydrate) 250mg'],
    therapeuticClass: 'Beta-lactam antibiotic (Penicillin)',
    pharmacology: 'Bactericidal antibiotic that inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins.'
  },
  {
    id: 'NMRA003',
    name: 'Nebilet',
    genericName: 'Nebivolol',
    category: 'Cardiovascular',
    manufacturer: 'Berlin Pharmaceutical Industry',
    dosageForm: 'Tablet',
    strength: '5mg',
    uses: ['Hypertension', 'High blood pressure', 'Heart failure', 'Cardiovascular protection'],
    sideEffects: ['Headache', 'Dizziness', 'Fatigue', 'Nausea', 'Slow heart rate'],
    warnings: ['Monitor blood pressure regularly', 'Do not stop suddenly', 'Caution in diabetes'],
    contraindications: ['Severe heart failure', 'Severe liver disease', 'Severe asthma', 'Heart block'],
    interactions: ['Calcium channel blockers', 'Digoxin', 'Insulin', 'Anesthetics'],
    dosage: 'Adults: 5mg once daily, may increase to 10mg if needed. Take at same time daily',
    storage: 'Store below 25°C in original container. Protect from moisture.',
    price: 'LKR 385.00 (28 tablets)',
    availability: 'available',
    nmraRegistration: 'NMRA/MD/003/2023',
    locallyManufactured: false,
    activeIngredients: ['Nebivolol 5mg'],
    therapeuticClass: 'Beta-1 selective adrenergic receptor blocker',
    pharmacology: 'Selective beta-1 adrenergic receptor blocker with vasodilating properties through nitric oxide release.'
  },
  {
    id: 'NMRA004',
    name: 'Glucophage',
    genericName: 'Metformin HCl',
    category: 'Diabetes',
    manufacturer: 'Merck (Pvt) Ltd',
    dosageForm: 'Tablet',
    strength: '500mg',
    uses: ['Type 2 diabetes mellitus', 'Insulin resistance', 'PCOS (Polycystic Ovary Syndrome)'],
    sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste', 'Abdominal discomfort', 'Vitamin B12 deficiency (long-term)'],
    warnings: ['Monitor kidney function', 'Stop before surgery', 'Avoid excessive alcohol', 'Risk of lactic acidosis'],
    contraindications: ['Renal impairment', 'Metabolic acidosis', 'Severe heart failure', 'Liver disease'],
    interactions: ['Iodinated contrast agents', 'Alcohol', 'Cimetidine', 'Furosemide'],
    dosage: 'Initial: 500mg twice daily with meals. Maximum: 2550mg daily in divided doses',
    storage: 'Store below 25°C in original container. Protect from humidity.',
    price: 'LKR 85.00 (10 tablets)',
    availability: 'available',
    nmraRegistration: 'NMRA/MD/003/2023',
    locallyManufactured: false,
    activeIngredients: ['Metformin Hydrochloride 500mg'],
    therapeuticClass: 'Biguanide antidiabetic agent',
    pharmacology: 'Decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity.'
  },
  {
    id: 'NMRA004',
    name: 'Samahan',
    genericName: 'Ayurvedic Herbal Formula',
    category: 'Traditional Medicine',
    manufacturer: 'Link Natural Products (Pvt) Ltd',
    dosageForm: 'Powder Sachets',
    strength: '4g per sachet',
    uses: ['Common cold', 'Cough', 'Fever', 'Sore throat', 'Body aches due to cold'],
    sideEffects: ['Generally well tolerated', 'Mild gastric irritation in sensitive individuals', 'Allergic reactions (rare)'],
    warnings: ['Consult physician if pregnant or breastfeeding', 'Not recommended for children under 2 years', 'Diabetics should monitor blood sugar'],
    contraindications: ['Known allergy to any herbal ingredient', 'Severe liver or kidney disease'],
    interactions: ['May interact with diabetes medications', 'Avoid with blood thinners'],
    dosage: 'Adults: 1 sachet dissolved in hot water 2-3 times daily. Children 2-12 years: Half sachet twice daily',
    storage: 'Store in cool, dry place below 30°C. Protect from moisture.',
    price: 'LKR 180.00 (10 sachets)',
    availability: 'available',
    nmraRegistration: 'NMRA/TR/001/2023',
    locallyManufactured: true,
    activeIngredients: ['Coriander', 'Ginger', 'Black pepper', 'Long pepper', 'Adhatoda vasica', 'Other herbs'],
    therapeuticClass: 'Traditional Ayurvedic herbal medicine',
    pharmacology: 'Synergistic herbal action providing anti-inflammatory, expectorant, and immune-supporting effects through traditional Ayurvedic principles.'
  },
  {
    id: 'NMRA005',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    category: 'Pain Relief',
    manufacturer: 'State Pharmaceuticals Corporation',
    dosageForm: 'Tablet',
    strength: '300mg',
    uses: ['Pain relief', 'Fever reduction', 'Anti-inflammatory', 'Cardiovascular protection (low dose)', 'Headache'],
    sideEffects: ['Gastric irritation', 'Nausea', 'Tinnitus', 'Bleeding', 'Allergic reactions'],
    warnings: ['Take with food', 'Not for children under 16 (Reye\'s syndrome risk)', 'Bleeding risk', 'Gastric ulcer risk'],
    contraindications: ['Active peptic ulcer', 'Bleeding disorders', 'Severe heart failure', 'Children under 16 for viral infections'],
    interactions: ['Warfarin', 'Methotrexate', 'ACE inhibitors', 'Diabetes medications'],
    dosage: 'Pain/Fever: 300-900mg every 4 hours. Cardioprotection: 75-100mg daily. Maximum: 4g daily',
    storage: 'Store below 25°C in airtight container. Protect from moisture.',
    price: 'LKR 25.00 (10 tablets)',
    availability: 'available',
    nmraRegistration: 'NMRA/MD/005/2023',
    locallyManufactured: true,
    activeIngredients: ['Acetylsalicylic Acid 300mg'],
    therapeuticClass: 'NSAID (Non-steroidal anti-inflammatory drug)',
    pharmacology: 'Irreversibly inhibits cyclooxygenase enzymes, reducing prostaglandin synthesis, providing analgesic, antipyretic, and anti-inflammatory effects.'
  },
  {
    id: 'NMRA006',
    name: 'Piriton',
    genericName: 'Chlorpheniramine Maleate',
    category: 'Antihistamine',
    manufacturer: 'State Pharmaceuticals Corporation',
    dosageForm: 'Tablet',
    strength: '4mg',
    uses: ['Allergic rhinitis', 'Hay fever', 'Urticaria', 'Allergic conjunctivitis', 'Insect bites'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Blurred vision', 'Constipation', 'Urinary retention'],
    warnings: ['May cause drowsiness', 'Avoid alcohol', 'Caution when driving', 'Elderly patients at higher risk of side effects'],
    contraindications: ['Newborns', 'Narrow-angle glaucoma', 'Prostatic hypertrophy', 'Severe asthma'],
    interactions: ['Alcohol', 'Sedatives', 'MAO inhibitors', 'Tricyclic antidepressants'],
    dosage: 'Adults: 4mg every 4-6 hours. Maximum 24mg daily. Children 6-12 years: 2mg every 4-6 hours',
    storage: 'Store below 30°C in original container. Keep dry.',
    price: 'LKR 40.00 (10 tablets)',
    availability: 'available',
    nmraRegistration: 'NMRA/MD/006/2023',
    locallyManufactured: true,
    activeIngredients: ['Chlorpheniramine Maleate 4mg'],
    therapeuticClass: 'H1-receptor antagonist (First-generation antihistamine)',
    pharmacology: 'Competitively blocks histamine H1 receptors, preventing histamine-mediated allergic responses and providing sedative effects.'
  },
  {
    id: 'NMRA007',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Gastrointestinal',
    manufacturer: 'Hemas Pharmaceuticals',
    dosageForm: 'Capsule',
    strength: '20mg',
    uses: ['Peptic ulcer', 'GERD', 'Zollinger-Ellison syndrome', 'H. pylori eradication', 'Acid reflux'],
    sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Abdominal pain', 'Flatulence'],
    warnings: ['Long-term use may affect vitamin B12 absorption', 'Risk of bone fractures with prolonged use', 'May mask gastric cancer symptoms'],
    contraindications: ['Known hypersensitivity to proton pump inhibitors', 'Concurrent use with nelfinavir'],
    interactions: ['Warfarin', 'Phenytoin', 'Diazepam', 'Clarithromycin', 'Iron supplements'],
    dosage: 'GERD: 20mg daily. Peptic ulcer: 20-40mg daily. H. pylori: 20mg twice daily with antibiotics',
    storage: 'Store below 25°C. Protect from light and moisture. Do not refrigerate.',
    price: 'LKR 160.00 (14 capsules)',
    availability: 'available',
    nmraRegistration: 'NMRA/MD/007/2023',
    locallyManufactured: true,
    activeIngredients: ['Omeprazole 20mg'],
    therapeuticClass: 'Proton pump inhibitor',
    pharmacology: 'Irreversibly binds to gastric H+/K+-ATPase pump, suppressing gastric acid secretion by blocking the final step of acid production.'
  },
  {
    id: 'NMRA008',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiovascular',
    manufacturer: 'Cipla (Lanka) Ltd',
    dosageForm: 'Tablet',
    strength: '10mg',
    uses: ['High cholesterol', 'Cardiovascular disease prevention', 'Hyperlipidemia', 'Atherosclerosis prevention'],
    sideEffects: ['Muscle pain', 'Headache', 'Nausea', 'Diarrhea', 'Elevated liver enzymes'],
    warnings: ['Monitor liver function', 'Report muscle pain immediately', 'Avoid grapefruit juice', 'Pregnancy category X'],
    contraindications: ['Active liver disease', 'Pregnancy', 'Breastfeeding', 'Unexplained elevated liver enzymes'],
    interactions: ['Warfarin', 'Digoxin', 'Erythromycin', 'Grapefruit juice', 'Cyclosporine'],
    dosage: 'Initial: 10-20mg daily. Maintenance: 10-80mg daily. Take in evening with or without food',
    storage: 'Store at room temperature below 30°C. Protect from light and moisture.',
    price: 'LKR 95.00 (10 tablets)',
    availability: 'available',
    nmraRegistration: 'NMRA/MD/008/2023',
    locallyManufactured: false,
    activeIngredients: ['Atorvastatin Calcium equivalent to Atorvastatin 10mg'],
    therapeuticClass: 'HMG-CoA reductase inhibitor (Statin)',
    pharmacology: 'Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis, reducing LDL cholesterol and cardiovascular risk.'
  }
];

// Enhanced search function for NMRA database
export const searchNmraDrugs = (query: string, limit: number = 10): Medicine[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  const results = nmraDrugDatabase.filter(drug => {
    return (
      drug.name.toLowerCase().includes(searchTerm) ||
      drug.genericName.toLowerCase().includes(searchTerm) ||
      drug.manufacturer.toLowerCase().includes(searchTerm) ||
      drug.category.toLowerCase().includes(searchTerm) ||
      drug.activeIngredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      ) ||
      drug.uses.some(use => use.toLowerCase().includes(searchTerm))
    );
  });

  // Sort by relevance (exact matches first, then partial matches)
  return results
    .sort((a, b) => {
      const aExact = a.name.toLowerCase().startsWith(searchTerm) ? 1 : 0;
      const bExact = b.name.toLowerCase().startsWith(searchTerm) ? 1 : 0;
      return bExact - aExact;
    })
    .slice(0, limit);
};

// Get drug suggestions based on first 3 characters
export const getDrugSuggestions = (query: string): string[] => {
  if (!query || query.length < 3) return [];
  
  const suggestions = searchNmraDrugs(query, 20);
  return suggestions.map(drug => drug.name);
};

export const medicineCategories = [
  'All Categories',
  'Pain Relief',
  'Antibiotic',
  'Diabetes',
  'Traditional Medicine',
  'Antihistamine',
  'Gastrointestinal',
  'Cardiovascular'
];