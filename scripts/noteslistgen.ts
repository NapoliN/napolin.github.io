// notesのリストを自動生成するスクリプト
// /src/notes/以下のmdファイルを再帰的に探索し、ファイル名のリストを/src/assets/notes.jsonに出力する

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '../src/notes/');
const outputPath = path.join(__dirname, '../src/assets/notes.json');

type FileType = 'file' | 'directory';
interface NoteFile {
    type: FileType; //ファイルの型
    name: string; //ディレクトリ名またはファイル名
    children?: NoteFile[]; //ディレクトリのとき、その中身
    meta?: NoteMeta;
}

interface NoteMeta {
    title: string,
    tags?: string[],
    date: string,
}

// 再帰的にディレクトリを
const walkSync = (dir: string): NoteFile[] => {
    const files = fs.readdirSync(dir);
    const noteFiles: NoteFile[] = [];
    for (const dirOrFile of files) {
        const fullPath = path.join(dir, dirOrFile);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            noteFiles.push({
                type: 'directory',
                name: dirOrFile,
                children: walkSync(fullPath)
            });
        } else if (stats.isFile() && /\.md$/.test(dirOrFile)) {
            // mdファイルの中身を読み込み、メタ情報を抽出
            const content = fs.readFileSync(fullPath, 'utf-8');
            const rawMatter = matter(content); // gray-matterでパース
            const meta: NoteMeta = {
                title: rawMatter.data.title || dirOrFile.replace(/\.md$/, ''),
                tags: rawMatter.data.tags || [],
                date: rawMatter.data.date || ''
            };
            if (Object.keys(rawMatter.data).length > 0) {
                noteFiles.push({
                    type: 'file',
                    name: dirOrFile,
                    meta: meta
                });
            }
        }
    }
    return noteFiles;
}

const filenames = walkSync(directoryPath);
fs.writeFileSync(outputPath, JSON.stringify(filenames, null, 2));
console.log('Filenames generated!');