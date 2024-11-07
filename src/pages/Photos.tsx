import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap"
import photos from "../assets/photos.json"

const getFileInfo = (filename: string) => {
    const createdAt = filename.split('_')[0];
    const title = filename.split('_')[1];
    return { createdAt, title };
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

const Photos = () => {
    const [artworkSrcs, setArtworkSrcs] = useState<{ foldername: string, files: { title: string, createdAt: string, src: string, trimmed: string }[] }[]>([]);
    useEffect(() => {
        const loadPhotos = async () => {
            return Promise.all(photos.map(async folder => {
                const foldername = folder.name
                const croppeds = await Promise.all(folder.files.map(filename => {
                    const src = `/photos/${foldername}/${filename}`
                    return cropImage(src).then((croppedImage) => ({
                        title: getFileInfo(src).title,
                        createdAt: getFileInfo(src).createdAt,
                        src: src,
                        trimmed: croppedImage
                    }))
                }))
                return {
                    foldername: foldername,
                    files: croppeds
                }
            }))
        }

        loadPhotos().then(
            (croppedImages) => {
                setArtworkSrcs(croppedImages);
            }
        );
    }, []);

    const [show, setShow] = useState(false);
    const [showImg, setShowImg] = useState("");

    const handleMouseEnter = (img: string) => {
        console.log(img);
        setShowImg(img);
        setShow(true);
    }
    const handleMouseLeave = () => {
        setShow(false);
        setShowImg("");
    }

    return (
        <div>
            <h1>Photos</h1>
            <div>クリックで拡大</div>
            {artworkSrcs.length > 0 ? (
                artworkSrcs.map((srcs) => (
                    <div>
                        <h2>{srcs.foldername}</h2>
                        {
                        srcs.files.map(src => (
                            <img key={src.createdAt} src={src.trimmed} alt={`Artwork ${src.title}`} onClick={() => handleMouseEnter(src.src)} className='hover-shadow' />
                        ))
                    }</div>
                ))
            ) : (
                <p>Loading...</p>
            )}
            <Modal show={show} centered onHide={handleMouseLeave}>
                <Modal.Body>
                    <img src={showImg} alt="Artwork" style={{ width: '100%', pointerEvents: 'none' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Photos;