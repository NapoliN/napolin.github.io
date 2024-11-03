import React, { useState, useEffect } from 'react';
import artworkList from '../assets/artwork/list.json';

const getArtworks = async (filenames: string[]) => {
    // すべてのファイルを動的にインポートして配列として返す
    const imagePromises = filenames.map(filename => import(`../assets/artwork/${filename.split('.')[0]}.${filename.split('.')[1]}`));
    const images = await Promise.all(imagePromises);
    return images.map(image => image.default || image).reverse(); // デフォルトエクスポートを抽出
};

const getFileInfo = (filename: string) => {
    const createdAt = filename.split('_')[0];
    const title = filename.split('_')[1];
    return {createdAt, title};
}

/**
 * 画像を切り取る関数
 * 良い感じに切り取って200x200の画像を返す
 * @param imageSrc importする画像
 * @returns 切り取った画像のデータURL
 */
const cropImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const imgSize = img.width > img.height ? img.height : img.width;
            const xshift = img.width > img.height ? (img.width - img.height) / 2 : 0;
            const yshift = img.height > img.width ? (img.height - img.width) / 2 : 0;
            const canvasSize = 200;
            const canvas = document.createElement('canvas');
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(img, xshift, yshift, imgSize, imgSize, 0, 0, canvasSize, canvasSize);
                const croppedImageData = canvas.toDataURL();
                resolve(croppedImageData);
            } else {
                reject(new Error('Canvas context not available'));
            }
        };

        img.onerror = (error) => reject(error);
        img.src = imageSrc;
    });
};

const Artworks = () => {
    const [artworkSrcs, setArtworkSrcs] = useState([]);
    useEffect(() => {
        const loadArtworks = async () => {
            const filenames = artworkList;
            const images = await getArtworks(filenames);
            return images;
        };
        loadArtworks().then((images) => {
            return Promise.all(images.map((image, _) => { 
                return cropImage(image).then((croppedImage) => ({
                    title: getFileInfo(image).title,
                    createdAt: getFileInfo(image).createdAt,
                    image: croppedImage
                }));
            }));
        }).then((croppedImages) => {
            setArtworkSrcs(croppedImages);
        });
    }, []);

    return (
        <div>
            <h1>Artworks</h1>
            {artworkSrcs.length > 0 ? (
                artworkSrcs.map((src) => (

                    <img key={src.createdAt} src={src.image} alt={`Artwork ${src.title}`} />
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Artworks;