import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap"
import artworkList from '../assets/artwork/list.json';
import './Artworks.css'

const getArtworks = async (filenames: string[]) : Promise<string[]> => {
    // すべてのファイルを動的にインポートして配列として返す
    const imagePromises = filenames.map(filename => import(`../assets/artwork/${filename.split('.')[0]}.${filename.split('.')[1]}`));
    const images = await Promise.all(imagePromises);
    return images.map(image => image.default || image).reverse(); // デフォルトエクスポートを抽出
};

const getFileInfo = (filename: string) => {
    const createdAtRaw = filename.split('_')[0].slice(-8);
    //yyyymmddがfmt yyyy/mm/ddに変換
    const createdAt = createdAtRaw.slice(0,4) + '/' + createdAtRaw.slice(4,6) + '/' + createdAtRaw.slice(6,8);
    const title = filename.split('_')[1].slice(0,-4);
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

interface ArtworkInfo {
    title: string;
    createdAt: string;
    src: string;
    trimmed: string;
}

const Artworks = () => {
    const [artworkSrcs, setArtworkSrcs] = useState<ArtworkInfo[]>([]);
    useEffect(() => {
        const loadArtworks = async () => {
            const filenames = artworkList;
            const images = await getArtworks(filenames);
            return images;
        };
        loadArtworks().then((images) => {
            return Promise.all(images.map(image=> { 
                return cropImage(image).then((croppedImage) => ({
                    title: getFileInfo(image).title,
                    createdAt: getFileInfo(image).createdAt,
                    src: image,
                    trimmed: croppedImage
                }));
            }));
        }).then((croppedImages) => {
            setArtworkSrcs(croppedImages);
        });
    }, []);

    const [show, setShow] = useState(false);
    const [artInfo, setArtInfo] = useState({
        title: "",
        createdAt: "",
        src: "",
        trimmed: ""
    });

    const handleMouseEnter = (artInfo: ArtworkInfo) => {
        setArtInfo(artInfo);
        setShow(true);
    }
    const handleMouseLeave = () => {
        setShow(false);
        //setShowImg("");
    }

    return (
        <div>
            <h1>Artworks</h1>
            <div>クリックで拡大</div>
            {artworkSrcs.length > 0 ? (
                artworkSrcs.map((src) => (

                    <img key={src.createdAt} src={src.trimmed} alt={`Artwork ${src.title}`} onClick={() => handleMouseEnter(src)} className='hover-shadow'/>
                ))
            ) : (
                <p>Loading...</p>
            )}
            <Modal show={show} centered onHide={handleMouseLeave}>
                <Modal.Body>
                    <img src={artInfo.src} alt="Artwork" style={{width: '100%', pointerEvents: 'none' }}/>
                </Modal.Body>
                <Modal.Footer>
                    <p>{artInfo.title}</p>
                    <p>{artInfo.createdAt}</p>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Artworks;