import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap"
import photos from "../assets/photos.json"

const getFileInfo = (filename: string) => {
    const createdAt = filename.split('_')[2];
    const title = filename.split('_')[2];
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
    const [photoSrcs, setPhotoSrcs] = useState<{ foldername: string, files: { title: string, createdAt: string, src: string, trimmed: string }[] }[]>([]);
    useEffect(() => {
        const loadPhotos = async () => {
            for (let i=0; i<photos.length; i++) {
                const folder = photos[photos.length - i - 1];
                const foldername = folder.name;
                await Promise.all(
                    folder.files.map(async (filename) => {
                        const src = `/photos/${foldername}/${filename}`;
                        const croppedImage = await cropImage(src);
                        const fileInfo = getFileInfo(src);
                        
                        const newFile = {
                            title: fileInfo.title,
                            createdAt: fileInfo.createdAt,
                            src: src,
                            trimmed: croppedImage
                        };
    
                        // Set the new state with the loaded image data
                        setPhotoSrcs((prev) => {
                            // Find if the folder already exists
                            const updatedFolders = prev.map(f => 
                                f.foldername === foldername 
                                    ? { ...f, files: f.files.some(file => file.createdAt === newFile.createdAt) ? f.files : [...f.files, newFile] } 
                                    : f
                            );
    
                            // If the folder doesn't exist, add a new entry
                            if (!updatedFolders.some(f => f.foldername === foldername)) {
                                updatedFolders.push({ foldername, files: [newFile] });
                            }
    
                            return updatedFolders;
                        });
                    })
                );
            }
        };
        loadPhotos();
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
            {photoSrcs.length > 0 ? (
                photoSrcs.map((srcs) => (
                    <div>
                        <h2>{srcs.foldername}</h2>
                        {
                        srcs.files.map(src => (
                            <img key={src.createdAt} src={src.trimmed} alt={`Photo ${src.title}`} onClick={() => handleMouseEnter(src.src)} className='hover-shadow' />
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