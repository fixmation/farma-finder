// Node.js script to parse the full NMRA drug database
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the NMRA file
const filePath = path.join(__dirname, '../attached_assets/List of Registered Drugs By brand-generic.xls 01.07.2025_1753110432242.txt');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Parse the tab-separated data
const lines = fileContent.split('\n').filter(line => line.trim());
const headers = lines[0].split('\t');

console.log('Headers found:', headers);
console.log('Total lines:', lines.length);

// Parse first 50 drugs as sample
const sampleDrugs = [];
for (let i = 1; i <= Math.min(50, lines.length - 1); i++) {
  const columns = lines[i].split('\t');
  if (columns.length >= 8) {
    sampleDrugs.push({
      genericName: columns[0]?.trim() || '',
      brandName: columns[1]?.trim() || '',
      dosageCode: columns[2]?.trim() || '',
      packType: columns[3]?.trim() || '',
      packSize: columns[4]?.trim() || '',
      manufacturer: columns[5]?.trim() || '',
      country: columns[6]?.trim() || '',
      agent: columns[7]?.trim() || '',
      registrationDate: columns[8]?.trim() || '',
      regNo: columns[10]?.trim() || '',
      schedule: columns[12]?.trim() || ''
    });
  }
}

console.log('Sample parsed drugs:', JSON.stringify(sampleDrugs.slice(0, 5), null, 2));