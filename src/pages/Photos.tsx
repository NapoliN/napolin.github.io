import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap"
import photos from "../assets/photos.json"

const getFileInfo = (filename: string) => {
    const createdAt = filename.split('_')[2];
    const title = filename.split('_')[2];
    return { createdAt, title };
}

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
                        //const croppedImage = await cropImage(src);
                        const fileInfo = getFileInfo(src);
                        
                        const newFile = {
                            title: fileInfo.title,
                            createdAt: fileInfo.createdAt,
                            src: src+"_resized.JPG",
                            trimmed: src+"_thumbnail.JPG"
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
    const [isHorizontal, setIsHorizontal] = useState(false);

    const handleMouseEnter = (imgSrc: string) => {
        const img = new Image();
        img.src = imgSrc;
  
        img.onload = () => {
          setIsHorizontal(img.width > img.height);
        };
        setShowImg(imgSrc);
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
            <Modal show={show} centered onHide={handleMouseLeave} size={isHorizontal ? 'lg' : undefined}>
                <Modal.Body>
                    <img src={showImg} alt="Artwork" style={{ width: '100%', pointerEvents: 'none' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Photos;