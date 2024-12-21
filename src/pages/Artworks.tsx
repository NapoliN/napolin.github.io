import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import artworkList from '../assets/artwork/list.json';
import './Artworks.css';

const getArtworks = async (filename: string): Promise<string> => {
    // ファイルを動的にインポート
    const image = await import(`../assets/artwork/${filename.split('.')[0]}.${filename.split('.')[1]}`);
    return image.default || image; // デフォルトエクスポートを抽出
};

const getFileInfo = (filename: string) => {
    const createdAtRaw = filename.split('_')[0].slice(-8);
    // yyyymmddがfmt yyyy/mm/ddに変換
    const createdAt = createdAtRaw.slice(0, 4) + '/' + createdAtRaw.slice(4, 6) + '/' + createdAtRaw.slice(6, 8);
    const title = filename.split('_')[1].slice(0, -4);
    return { createdAt, title };
};

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArtworks = async () => {

            const rev = artworkList.toReversed()
            for (const filename of rev) {
                try {
                    const src = await getArtworks(filename);
                    const croppedImage = await cropImage(src);
                    const fileInfo = getFileInfo(filename);
                    // 逐次的に状態を更新
                    setArtworkSrcs((prev) =>  prev.some((artwork) => artwork.title === fileInfo.title) ? prev : [
                        ...prev,
                        {
                            title: fileInfo.title,
                            createdAt: fileInfo.createdAt,
                            src,
                            trimmed: croppedImage,
                        },
                    ]);
                } catch (error) {
                    console.error(`Error loading image ${filename}:`, error);
                }
            }
            setLoading(false); // 全画像読み込み完了時にフラグを更新
        };

        loadArtworks();
    }, []);

    const [show, setShow] = useState(false);
    const [artInfo, setArtInfo] = useState<ArtworkInfo | null>(null);

    const handleMouseEnter = (artInfo: ArtworkInfo) => {
        setArtInfo(artInfo);
        setShow(true);
    };

    const handleMouseLeave = () => {
        setShow(false);
        setArtInfo(null);
    };

    return (
        <div>
            <h1>Artworks</h1>
            <div>クリックで拡大</div>
            {loading && artworkSrcs.length === 0 && <p>Loading...</p>}
            <div className="artwork-grid">
                {artworkSrcs.map((src, index) => (
                    <img
                        key={index}
                        src={src.trimmed}
                        alt={`Artwork ${src.title}`}
                        onClick={() => handleMouseEnter(src)}
                        className="hover-shadow"
                    />
                ))}
            </div>
            <Modal show={show} centered onHide={handleMouseLeave}>
                <Modal.Body>
                    {artInfo && <img src={artInfo.src} alt="Artwork" style={{ width: '100%', pointerEvents: 'none' }} />}
                </Modal.Body>
                <Modal.Footer>
                    {artInfo && (
                        <>
                            <p>{artInfo.title}</p>
                            <p>{artInfo.createdAt}</p>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Artworks;