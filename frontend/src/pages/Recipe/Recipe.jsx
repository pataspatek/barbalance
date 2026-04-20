import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Recipe.scss';

function buildCloudinaryVariant(url, width) {
    if (!url || !url.includes('/upload/')) {
        return url;
    }
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit,dpr_auto/`);
}

function buildResponsiveImageSources(url) {
    const widths = [480, 720, 960, 1280, 1600];
    return widths.map((width) => `${buildCloudinaryVariant(url, width)} ${width}w`).join(', ');
}
    
function Recipe() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [slug]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/posts/${slug}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Článek nenalezen');
            }
            const data = await response.json();
            setArticle(data);
            console.log('Fetched article:', data);
        } catch (err) {
            console.error('Error fetching article:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <section className="article-loading">Načítání článku...</section>;
    }

    if (error) {
        return (
            <section className="recipe-error">
                <p>Chyba: {error}</p>
                <Link to="/recipes" className="cta-button">Zpět na recepty</Link>
            </section>
        );
    }

    if (!article) {
        return <section className="recipe-loading">Článek nenalezen</section>;
    }

    return (
        <section className="recipe-container">
            <Link to="/recipes" className="recipe-back-link">
                ← Zpět na recepty
            </Link>
            
            <article className="recipe-article">
                {article.image_url && (
                    <div className="recipe-image-container">
                        <img 
                            src={buildCloudinaryVariant(article.image_url, 960)}
                            srcSet={buildResponsiveImageSources(article.image_url)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 920px"
                            alt={article.title}
                            className="recipe-image"
                            loading="eager"
                            decoding="async"
                        />
                    </div>
                )}
                
                <div className="recipe-header">
                    <h1>{article.title}</h1>
                    <div className="recipe-meta">
                        <small>{new Date(article.created_at).toLocaleDateString('cs-CZ')}</small>
                        {article.author && <small>Autor: {article.author}</small>}
                    </div>
                </div>

                {article.description && (
                    <div className="recipe-description">
                        <div 
                            dangerouslySetInnerHTML={{ __html: article.description }}
                        />
                    </div>
                )}

                {article.ingredients && (
                    <div className="recipe-section">
                        <h2>Suroviny</h2>
                        <ul className="recipe-ingredients">
                            {article.ingredients.split('\n').filter(ingredient => ingredient.trim()).map((ingredient, index) => (
                                <li key={index}>{ingredient.trim()}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {article.content && (
                    <div className="recipe-section">
                        <h2>Postup</h2>
                        <ol className="recipe-instructions">
                            {article.content.split('\n').filter(step => step.trim()).map((step, index) => (
                                <li key={index}>{step.trim()}</li>
                            ))}
                        </ol>
                    </div>
                )}
            </article>
        </section>
    );
}

export default Recipe;
