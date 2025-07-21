export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  dosageForm: string;
  strength: string;
  uses: string[];
  sideEffects: string[];
  warnings: string[];
  contraindications: string[];
  interactions: string[];
  dosage: string;
  storage: string;
  price: string;
  availability: 'available' | 'limited' | 'out_of_stock';
  nmraRegistration: string;
  locallyManufactured: boolean;
  activeIngredients: string[];
  therapeuticClass: string;
  pharmacology: string;
}

export const sriLankanMedicines: Medicine[] = [
  {
    id: 'SL001',
    name: 'Panadol Extra',
    genericName: 'Paracetamol + Caffeine',
    category: 'Pain Relief',
    manufacturer: 'State Pharmaceuticals Corporation',
    dosageForm: 'Tablet',
    strength: '500mg + 65mg',
    uses: ['Headache', 'Fever', 'Body aches', 'Dental pain', 'Migraine'],
    sideEffects: ['Rare allergic reactions', 'Stomach upset with overdose', 'Nausea', 'Restlessness from caffeine'],
    warnings: ['Do not exceed 8 tablets daily', 'Avoid with alcohol', 'Not for children under 12', 'Caution in liver disease'],
    contraindications: ['Severe liver disease', 'Known hypersensitivity to paracetamol or caffeine'],
    interactions: ['Warfarin', 'Phenytoin', 'Carbamazepine', 'Other caffeine-containing products'],
    dosage: 'Adults: 1-2 tablets every 4-6 hours as needed. Maximum 8 tablets in 24 hours',
    storage: 'Store below 25°C in a dry place. Protect from light.',
    price: 'LKR 45.00 (10 tablets)',
    availability: 'available',
    nmraRegistration: 'MD 12345',
    locallyManufactured: true,
    activeIngredients: ['Paracetamol 500mg', 'Caffeine 65mg'],
    therapeuticClass: 'Non-opioid analgesic with CNS stimulant',
    pharmacology: 'Paracetamol acts centrally and peripherally to block pain impulses. Caffeine enhances analgesic effect and provides mild stimulation.'
  },
  {
    id: 'SL002',
    name: 'Samahan',
    genericName: 'Ayurvedic Herbal Mix',
    category: 'Traditional Medicine',
    manufacturer: 'Link Natural Products',
    dosageForm: 'Powder Sachets',
    strength: '4g per sachet',
    uses: ['Cold and flu', 'Cough', 'Fever', 'Sore throat'],
    sideEffects: ['Generally well tolerated', 'Possible allergic reactions in sensitive individuals'],
    warnings: ['Consult doctor if pregnant', 'Not recommended for children under 2 years'],
    contraindications: ['Known allergy to herbal ingredients'],
    interactions: ['May interact with diabetes medications'],
    dosage: 'Adults: 1 sachet dissolved in hot water 2-3 times daily',
    storage: 'Store in cool, dry place below 30°C',
    price: 'LKR 150.00 (10 sachets)',
    availability: 'available',
    nmraRegistration: 'TR 67890',
    locallyManufactured: true,
    activeIngredients: ['Coriander', 'Ginger', 'Black pepper', 'Long pepper'],
    therapeuticClass: 'Traditional Ayurvedic medicine',
    pharmacology: 'Synergistic herbal action providing anti-inflammatory and immune-supporting effects'
  },
  {
    id: 'SL003',
    name: 'Amoxil',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    manufacturer: 'Glaxo Wellcome Ceylon Ltd',
    dosageForm: 'Capsule',
    strength: '250mg',
    uses: ['Bacterial infections', 'Respiratory tract infections', 'Urinary tract infections'],
    sideEffects: ['Nausea', 'Diarrhea', 'Skin rash', 'Allergic reactions'],
    warnings: ['Complete full course', 'Take with food', 'Inform doctor of penicillin allergy'],
    contraindications: ['Known penicillin allergy', 'Severe renal impairment'],
    interactions: ['Warfarin', 'Oral contraceptives', 'Allopurinol'],
    dosage: 'Adults: 250-500mg every 8 hours. Children: 20-40mg/kg daily',
    storage: 'Store below 25°C in a dry place',
    price: 'LKR 12.00 per capsule',
    availability: 'available',
    nmraRegistration: 'MD 23456',
    locallyManufactured: false,
    activeIngredients: ['Amoxicillin (as trihydrate) 250mg'],
    therapeuticClass: 'Beta-lactam antibiotic',
    pharmacology: 'Bactericidal antibiotic that inhibits bacterial cell wall synthesis'
  },
  {
    id: 'SL004',
    name: 'Glucophage',
    genericName: 'Metformin HCl',
    category: 'Diabetes',
    manufacturer: 'Merck (Pvt) Ltd',
    dosageForm: 'Tablet',
    strength: '500mg',
    uses: ['Type 2 diabetes', 'Insulin resistance', 'PCOS'],
    sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste', 'Vitamin B12 deficiency'],
    warnings: ['Take with meals', 'Monitor kidney function', 'Stop before surgery'],
    contraindications: ['Renal impairment', 'Metabolic acidosis', 'Severe heart failure'],
    interactions: ['Iodinated contrast', 'Alcohol', 'Cimetidine'],
    dosage: 'Initial: 500mg twice daily. Maximum: 2550mg daily',
    storage: 'Store below 25°C in original container',
    price: 'LKR 8.50 per tablet',
    availability: 'available',
    nmraRegistration: 'MD 34567',
    locallyManufactured: false,
    activeIngredients: ['Metformin Hydrochloride 500mg'],
    therapeuticClass: 'Biguanide antidiabetic',
    pharmacology: 'Decreases hepatic glucose production and improves insulin sensitivity'
  },
  {
    id: 'SL005',
    name: 'Amlodipine SPC',
    genericName: 'Amlodipine Besylate',
    category: 'Cardiovascular',
    manufacturer: 'State Pharmaceuticals Corporation',
    dosageForm: 'Tablet',
    strength: '5mg',
    uses: ['High blood pressure', 'Angina', 'Coronary artery disease'],
    sideEffects: ['Ankle swelling', 'Dizziness', 'Flushing', 'Fatigue'],
    warnings: ['Do not stop suddenly', 'Monitor blood pressure', 'Caution in liver disease'],
    contraindications: ['Severe aortic stenosis', 'Cardiogenic shock'],
    interactions: ['Simvastatin', 'Cyclosporine', 'Grapefruit juice'],
    dosage: 'Initial: 2.5-5mg daily. Maximum: 10mg daily',
    storage: 'Store below 30°C. Protect from light',
    price: 'LKR 3.75 per tablet',
    availability: 'available',
    nmraRegistration: 'MD 45678',
    locallyManufactured: true,
    activeIngredients: ['Amlodipine Besylate equivalent to Amlodipine 5mg'],
    therapeuticClass: 'Calcium channel blocker',
    pharmacology: 'Blocks calcium influx in smooth muscle, causing vasodilation'
  },
  {
    id: 'SL006',
    name: 'Cetirizine Lanka',
    genericName: 'Cetirizine HCl',
    category: 'Antihistamine',
    manufacturer: 'Hemas Pharmaceuticals',
    dosageForm: 'Tablet',
    strength: '10mg',
    uses: ['Allergic rhinitis', 'Urticaria', 'Allergic conjunctivitis'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Headache'],
    warnings: ['May cause drowsiness', 'Avoid alcohol', 'Caution when driving'],
    contraindications: ['Severe kidney disease', 'End-stage renal disease'],
    interactions: ['Alcohol', 'CNS depressants', 'Theophylline'],
    dosage: 'Adults: 10mg once daily. Children 6-12 years: 5mg once daily',
    storage: 'Store below 25°C in dry place',
    price: 'LKR 4.25 per tablet',
    availability: 'available',
    nmraRegistration: 'MD 56789',
    locallyManufactured: true,
    activeIngredients: ['Cetirizine Hydrochloride 10mg'],
    therapeuticClass: 'Second-generation antihistamine',
    pharmacology: 'Selective H1-receptor antagonist with minimal CNS penetration'
  },
  {
    id: 'SL007',
    name: 'Losartan SPMC',
    genericName: 'Losartan Potassium',
    category: 'Cardiovascular',
    manufacturer: 'State Pharmaceuticals Manufacturing Corporation',
    dosageForm: 'Tablet',
    strength: '50mg',
    uses: ['Hypertension', 'Heart failure', 'Diabetic nephropathy'],
    sideEffects: ['Dizziness', 'Upper respiratory infection', 'Back pain'],
    warnings: ['Monitor potassium levels', 'Avoid in pregnancy', 'Caution in kidney disease'],
    price: 'LKR 6.50 per tablet',
    availability: 'available',
    nmraRegistration: 'MD 67890',
    locallyManufactured: true
  },
  {
    id: 'SL008',
    name: 'Pantoprazole SPC',
    genericName: 'Pantoprazole Sodium',
    category: 'Gastrointestinal',
    manufacturer: 'State Pharmaceuticals Corporation',
    dosageForm: 'Tablet',
    strength: '40mg',
    uses: ['GERD', 'Peptic ulcer', 'Acid reflux', 'Zollinger-Ellison syndrome'],
    sideEffects: ['Headache', 'Diarrhea', 'Nausea', 'Abdominal pain'],
    warnings: ['Take before meals', 'Long-term use may affect bone health', 'Monitor magnesium levels'],
    price: 'LKR 11.75 per tablet',
    availability: 'available',
    nmraRegistration: 'MD 78901',
    locallyManufactured: true
  },
  {
    id: 'SL009',
    name: 'Atorvastatin Hemas',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiovascular',
    manufacturer: 'Hemas Pharmaceuticals',
    dosageForm: 'Tablet',
    strength: '20mg',
    uses: ['High cholesterol', 'Cardiovascular disease prevention', 'Familial hypercholesterolemia'],
    sideEffects: ['Muscle pain', 'Liver enzyme elevation', 'Digestive problems'],
    warnings: ['Monitor liver function', 'Report muscle pain', 'Avoid grapefruit juice'],
    price: 'LKR 15.50 per tablet',
    availability: 'available',
    nmraRegistration: 'MD 89012',
    locallyManufactured: true
  },
  {
    id: 'SL010',
    name: 'Aspirin Cardio SPC',
    genericName: 'Acetylsalicylic Acid',
    category: 'Cardiovascular',
    manufacturer: 'State Pharmaceuticals Corporation',
    dosageForm: 'Enteric Coated Tablet',
    strength: '75mg',
    uses: ['Cardiovascular protection', 'Stroke prevention', 'Heart attack prevention'],
    sideEffects: ['Stomach irritation', 'Bleeding risk', 'Tinnitus'],
    warnings: ['Take with food', 'Not for children under 16', 'Monitor for bleeding'],
    price: 'LKR 2.25 per tablet',
    availability: 'available',
    nmraRegistration: 'MD 90123',
    locallyManufactured: true
  },
  {
    id: 'SL011',
    name: 'Insulin Humulin',
    genericName: 'Human Insulin',
    category: 'Diabetes',
    manufacturer: 'Eli Lilly Lanka',
    dosageForm: 'Injection',
    strength: '100 IU/ml',
    uses: ['Type 1 diabetes', 'Type 2 diabetes', 'Diabetic ketoacidosis'],
    sideEffects: ['Hypoglycemia', 'Injection site reactions', 'Weight gain'],
    warnings: ['Monitor blood glucose', 'Rotate injection sites', 'Store in refrigerator'],
    price: 'LKR 850.00 per vial',
    availability: 'available',
    nmraRegistration: 'MD 01234',
    locallyManufactured: false
  },
  {
    id: 'SL012',
    name: 'Prednisolone SPC',
    genericName: 'Prednisolone',
    category: 'Corticosteroid',
    manufacturer: 'State Pharmaceuticals Corporation',
    dosageForm: 'Tablet',
    strength: '5mg',
    uses: ['Asthma', 'Allergic reactions', 'Autoimmune diseases', 'Inflammatory conditions'],
    sideEffects: ['Weight gain', 'Mood changes', 'Increased infection risk', 'Bone thinning'],
    warnings: ['Do not stop suddenly', 'Take with food', 'Avoid live vaccines'],
    price: 'LKR 1.85 per tablet',
    availability: 'available',
    nmraRegistration: 'MD 12340',
    locallyManufactured: true
  }
];

export const medicineCategories = [
  'Pain Relief',
  'Traditional Medicine', 
  'Antibiotic',
  'Diabetes',
  'Cardiovascular',
  'Antihistamine',
  'Gastrointestinal',
  'Corticosteroid'
];

export const manufacturers = [
  'State Pharmaceuticals Corporation',
  'State Pharmaceuticals Manufacturing Corporation',
  'Hemas Pharmaceuticals',
  'Link Natural Products',
  'Glaxo Wellcome Ceylon Ltd',
  'Merck (Pvt) Ltd',
  'Eli Lilly Lanka'
];

export function searchMedicines(query: string): Medicine[] {
  if (!query || query.length < 3) return [];
  
  const searchTerm = query.toLowerCase().trim();

  return sriLankanMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm) ||
    medicine.genericName.toLowerCase().includes(searchTerm) ||
    medicine.category.toLowerCase().includes(searchTerm) ||
    medicine.manufacturer.toLowerCase().includes(searchTerm) ||
    medicine.uses.some(use => use.toLowerCase().includes(searchTerm)) ||
    medicine.activeIngredients?.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
  );
}

// Get medicine suggestions for dropdown
export function getMedicineSuggestions(query: string): string[] {
  if (!query || query.length < 3) return [];
  
  const results = searchMedicines(query).slice(0, 10);
  return results.map(med => med.name);
}