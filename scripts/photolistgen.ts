import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '../public/photos');
const outputPath = path.join(__dirname, '../src/assets/photos.json');

const filelist : {name:string, files:string[]}[] = []

fs.readdirSync(directoryPath).forEach(folder => {
    if(folder === 'list.json') return;
    const folderPath = path.join(directoryPath, folder);
    const files = fs.readdirSync(folderPath).filter(file => /\.JPG$/.test(file));
    filelist.push({
        name: folder,
        files: files
    })
})

fs.writeFileSync(outputPath, JSON.stringify(filelist, null, 2));
console.log('Filenames generated!');