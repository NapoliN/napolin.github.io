// notesのリストを自動生成するスクリプト
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '../src/notes/');
const outputPath = path.join(__dirname, '../src/assets/notes.json');

const filenames = fs.readdirSync(directoryPath)
    .filter(file => /\.(md)$/.test(file)) //mdファイルを抽出
    .map(fname => fname.slice(0,-3)) // 拡張子を取り除く .mdって指定してるから-3にしちゃうよ
fs.writeFileSync(outputPath, JSON.stringify(filenames, null, 2));
console.log('Filenames generated!');