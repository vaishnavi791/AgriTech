// src/scripts/generateDistricts.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.resolve(__dirname, '../../../backend/data/apy/uttar_pradesh_apy_2019_2023.csv');
const outPath = path.resolve(__dirname, '../data/districts.json');

function generate() {
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(',');
  const districtIdx = header.indexOf('district_name');
  if (districtIdx === -1) throw new Error('district_name column not found');
  const districts = new Set();
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const name = cols[districtIdx];
    if (name) districts.add(name.trim());
  }
  const arr = Array.from(districts).sort();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(arr, null, 2));
  console.log(`Generated ${arr.length} districts to ${outPath}`);
}

generate();
