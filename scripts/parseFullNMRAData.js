// Parse the complete NMRA drug database from the official file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the complete NMRA file
const filePath = path.join(__dirname, '../attached_assets/List of Registered Drugs By brand-generic.xls 01.07.2025_1753112258185.txt');

try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim());
  
  console.log(`Total lines in file: ${lines.length}`);
  
  // Skip header line and process all drug entries
  const drugEntries = lines.slice(1).map((line, index) => {
    const columns = line.split('\t');
    
    if (columns.length >= 13) {
      const genericName = columns[0]?.trim() || '';
      const brandName = columns[1]?.trim() || '';
      const dosageCode = columns[2]?.trim() || '';
      const packType = columns[3]?.trim() || '';
      const packSize = columns[4]?.trim() || '';
      const manufacturer = columns[5]?.trim() || '';
      const country = columns[6]?.trim() || '';
      const agent = columns[7]?.trim() || '';
      const registrationDate = columns[8]?.trim() || '';
      const regNo = columns[10]?.trim() || '';
      const schedule = columns[12]?.trim() || '';
      
      // Determine category from generic name
      let category = 'General Medicine';
      const genericLower = genericName.toLowerCase();
      
      if (genericLower.includes('paracetamol') || genericLower.includes('acetaminophen') || 
          genericLower.includes('aspirin') || genericLower.includes('ibuprofen') || 
          genericLower.includes('diclofenac') || genericLower.includes('aceclofenac')) {
        category = 'Pain Relief';
      } else if (genericLower.includes('antibiotic') || genericLower.includes('amoxicillin') || 
                 genericLower.includes('azithromycin') || genericLower.includes('cephalexin')) {
        category = 'Antibiotic';
      } else if (genericLower.includes('metformin') || genericLower.includes('insulin') || 
                 genericLower.includes('diabetes')) {
        category = 'Diabetes';
      } else if (genericLower.includes('amlodipine') || genericLower.includes('atenolol') || 
                 genericLower.includes('nebivolol') || genericLower.includes('hypertension')) {
        category = 'Cardiovascular';
      } else if (genericLower.includes('herbal') || genericLower.includes('ayurvedic') || 
                 brandName.toLowerCase().includes('samahan')) {
        category = 'Traditional Medicine';
      }
      
      // Create proper Medicine object
      return {
        id: `NMRA_${String(index + 1).padStart(4, '0')}`,
        name: brandName || genericName.substring(0, 50),
        genericName: genericName,
        brandName: brandName,
        category: category,
        manufacturer: manufacturer,
        dosageForm: dosageCode,
        strength: packSize,
        packType: packType,
        country: country,
        agent: agent,
        registrationDate: registrationDate,
        registrationNumber: regNo,
        schedule: schedule,
        uses: ['As prescribed by physician'],
        sideEffects: ['Consult healthcare provider'],
        warnings: ['Follow prescribed dosage'],
        contraindications: ['Known hypersensitivity'],
        interactions: ['Consult pharmacist'],
        dosage: 'As directed by physician',
        storage: 'Store as per manufacturer instructions',
        price: 'Contact pharmacy for pricing',
        availability: 'available',
        nmraRegistration: regNo,
        locallyManufactured: country === 'SRI LANKA',
        activeIngredients: [genericName],
        therapeuticClass: category,
        pharmacology: `${genericName} - Registered under NMRA ${regNo}`
      };
    }
    return null;
  }).filter(Boolean);
  
  console.log(`Parsed ${drugEntries.length} valid drug entries`);
  
  // Create the TypeScript file with all drugs
  const outputContent = `// Complete NMRA Drug Database - ${drugEntries.length} registered medications
// Generated from official NMRA file on ${new Date().toISOString()}

import { Medicine } from './sriLankanMedicines';

export const completeNMRADatabase: Medicine[] = ${JSON.stringify(drugEntries, null, 2)};

// Search function for the complete NMRA database
export const searchCompleteNMRADatabase = (query: string, limit: number = 20): Medicine[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  const results = completeNMRADatabase.filter(drug => {
    return (
      drug.name.toLowerCase().includes(searchTerm) ||
      drug.genericName.toLowerCase().includes(searchTerm) ||
      (drug.brandName && drug.brandName.toLowerCase().includes(searchTerm)) ||
      drug.manufacturer.toLowerCase().includes(searchTerm) ||
      drug.category.toLowerCase().includes(searchTerm) ||
      drug.activeIngredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      )
    );
  });

  // Sort by relevance (exact matches first)
  return results
    .sort((a, b) => {
      const aExactName = a.name.toLowerCase() === searchTerm ? 2 : 0;
      const bExactName = b.name.toLowerCase() === searchTerm ? 2 : 0;
      const aExactGeneric = a.genericName.toLowerCase().includes(searchTerm) ? 1 : 0;
      const bExactGeneric = b.genericName.toLowerCase().includes(searchTerm) ? 1 : 0;
      
      return (bExactName + bExactGeneric) - (aExactName + aExactGeneric);
    })
    .slice(0, limit);
};

// Get drug suggestions for autocomplete
export const getNMRADrugSuggestions = (query: string): string[] => {
  if (!query || query.length < 3) return [];
  
  const searchTerm = query.toLowerCase().trim();
  const suggestions = new Set<string>();
  
  completeNMRADatabase.forEach(drug => {
    if (drug.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(drug.name);
    }
    if (drug.genericName.toLowerCase().includes(searchTerm)) {
      suggestions.add(drug.genericName);
    }
    if (drug.brandName && drug.brandName.toLowerCase().includes(searchTerm)) {
      suggestions.add(drug.brandName);
    }
  });
  
  return Array.from(suggestions).slice(0, 10);
};

export default completeNMRADatabase;
`;

  // Write the complete database
  const outputPath = path.join(__dirname, '../client/src/data/completeNMRADatabase.ts');
  fs.writeFileSync(outputPath, outputContent);
  
  console.log(`✅ Complete NMRA database written to: ${outputPath}`);
  console.log(`✅ Total medications: ${drugEntries.length}`);
  
  // Sample of parsed data
  console.log('\nSample entries:');
  drugEntries.slice(0, 5).forEach((drug, i) => {
    console.log(`${i + 1}. ${drug.name} (${drug.genericName}) - ${drug.manufacturer}`);
  });
  
} catch (error) {
  console.error('Error parsing NMRA file:', error);
}