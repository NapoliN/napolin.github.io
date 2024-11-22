import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
    

const resizeImages = async () => {
    const resizeImage = async (inputFilePath: string, outputFilePath :string, width, height) => {
        // 画像リサイズ
        await sharp(inputFilePath)
            .resize({
                width: width,
                height: height,
                fit: 'fill'
            })
            .rotate()
            .toFile(outputFilePath);
        console.log(`Resized: ${width} ${height}`);
    }
    // ターゲットサイズ
    const maxLongSide = 1800;
    const maxShortSide = 1200;
    
    const inputDir = path.join(__dirname, '../public/photos');
    const folders = fs.readdirSync(inputDir);

    for (const folder of folders) {
        const folderPath = path.join(inputDir, folder);

        // 画像ファイルの処理
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const inputFilePath = path.join(folderPath, file);
            // _thumbnail.JPGはskip
            if (file.includes('thumbnail'))continue;
            //画像の圧縮
            const outputFileName = path.basename(inputFilePath, path.extname(inputFilePath)) + '_resized.JPG';
            const outputFilePath = path.join(folderPath, outputFileName);
            sharp(inputFilePath).metadata().then(async (metadata) => {
                if (metadata.width && metadata.height) {
                    const isVertical = metadata.orientation === 6 || metadata.orientation === 8;
                    const requireResized = isVertical ? metadata.height > maxLongSide : metadata.width > maxLongSide;
                    if (requireResized){
                        console.log(`width ${metadata.width} height ${metadata.height}`)
                        console.log("isvertical " + isVertical)
                        const width = isVertical ? maxShortSide : maxLongSide;
                        const height = isVertical ? maxLongSide : maxShortSide;
                        await resizeImage(inputFilePath,outputFilePath,width,height);
                        fs.rmSync(inputFilePath)
                    } 
                }
            })
            //サムネの生成
            const thumbnailFileName = path.basename(inputFilePath.replace("_resized.JPG", "_thumbnail.JPG"), path.extname(inputFilePath)) + ".JPG";
            const thumbnailFilePath = path.join(folderPath, thumbnailFileName);
            sharp(inputFilePath).resize({
                width: 200,
                height: 200,
                fit: 'cover'
            }).toFile(thumbnailFilePath);
        }
    }
};

const writePhotolist = () => {
    const directoryPath = path.join(__dirname, '../public/photos');
    const outputPath = path.join(__dirname, '../src/assets/photos.json');
    
    const filelist : {name:string, files:string[]}[] = []
    
    fs.readdirSync(directoryPath).forEach(folder => {
        if(folder === 'list.json') return;
        const folderPath = path.join(directoryPath, folder);
        const files = fs.readdirSync(folderPath).filter(file => /resized\.JPG$/.test(file));
        filelist.push({
            name: folder,
            files: files.map(file => file.replace("_resized.JPG",""))
        })
    })
    fs.writeFileSync(outputPath, JSON.stringify(filelist, null, 2));
}

resizeImages()
    .then(() => {
        console.log('Images resized');
        writePhotolist();
        console.log('Filenames generated!');
    })


