import { useState, useEffect } from 'react';
import './Gallery.scss';

function Gallery() {
    const [media, setMedia] = useState([]);
    const [selected, setSelected] = useState(null);
    const [currentChildIndex, setCurrentChildIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Add your fetch logic here
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url},permalink&access_token=${accessToken}`;
        console.log(accessToken)
        try {
            const response = await fetch(url);
            const data = await response.json();
            setMedia(data.data || []);
            console.log(data.data)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item) => {
        setSelected(item);
        setCurrentChildIndex(0);
    };

    const closeModal = () => {
        setSelected(null);
        setCurrentChildIndex(0);
    };

    const goToPreviousChild = () => {
        if (selected.children && selected.children.data) {
            setCurrentChildIndex((prev) =>
                prev === 0 ? selected.children.data.length - 1 : prev - 1
            );
        }
    };

    const goToNextChild = () => {
        if (selected.children && selected.children.data) {
            setCurrentChildIndex((prev) =>
                prev === selected.children.data.length - 1 ? 0 : prev + 1
            );
        }
    };

    const getDisplayImage = () => {
        if (selected.children && selected.children.data && selected.children.data.length > 0) {
            return selected.children.data[currentChildIndex].media_url;
        }
        return selected.media_url;
    };

    const isCarousel = selected && selected.children && selected.children.data && selected.children.data.length > 0;


    if (loading) {
        return <div className="gallery-container"><p className="loading">Loading gallery...</p></div>;
    }

    if (error) {
        return <div className="gallery-container"><p className="error">Error: {error}</p></div>;
    }

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h1>Gallery</h1>
                <p>Our Instagram feed</p>
            </div>

            {media.length > 0 ? (
                <div className="gallery-grid">
                    {media.map((item) => (
                        <div key={item.id} className="gallery-item">
                            <img src={item.media_url} alt={item.caption || 'Gallery image'} />
                            {item.children && item.children.data && item.children.data.length > 0 && (
                                <div className="carousel-badge">🎠 {item.children.data.length}</div>
                            )}
                            <div className="gallery-overlay">
                                {item.caption && <p>{item.caption}</p>}
                                <button onClick={() => openModal(item)} >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-images">No images yet</p>
            )}
            {selected && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        
                        {isCarousel && (
                            <button className="carousel-nav prev" onClick={goToPreviousChild}>
                                &#10094;
                            </button>
                        )}

                        <img src={getDisplayImage()} alt={selected.caption || 'Gallery image'} />

                        {isCarousel && (
                            <button className="carousel-nav next" onClick={goToNextChild}>
                                &#10095;
                            </button>
                        )}

                        {selected.caption && <p>{selected.caption}</p>}

                        {isCarousel && (
                            <div className="carousel-indicators">
                                {selected.children.data.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`indicator ${index === currentChildIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentChildIndex(index)}
                                    ></span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Gallery;
