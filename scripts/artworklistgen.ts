import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '../src/assets/artwork');
const outputPath = path.join(__dirname, '../src/assets/artwork/list.json');

const filenames = fs.readdirSync(directoryPath)
    .filter(file => /\.(png|gif)$/.test(file)) // 画像ファイルのみ

fs.writeFileSync(outputPath, JSON.stringify(filenames, null, 2));
console.log('Filenames generated!');