import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Article.scss';

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
    
function Article() {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/articles/${slug}/`, {
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
            <section className="article-error">
                <p>Chyba: {error}</p>
                <Link to="/blog" className="cta-button">Zpět na blog</Link>
            </section>
        );
    }

    if (!article) {
        return <section className="article-loading">Článek nenalezen</section>;
    }

    return (
        <section className="article-container">
            <Link to="/blog" className="article-back-link">
                ← Zpět na blog
            </Link>
            
            <article className="blog-article">
                {article.image_url && (
                    <div className="article-image-container">
                        <img 
                            src={buildCloudinaryVariant(article.image_url, 960)}
                            srcSet={buildResponsiveImageSources(article.image_url)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 920px"
                            alt={article.title}
                            className="article-image"
                            loading="eager"
                            decoding="async"
                        />
                    </div>
                )}
                
                <div className="article-header">
                    <h1>{article.title}</h1>
                    <div className="article-meta">
                        <small>{new Date(article.created_at).toLocaleDateString('cs-CZ')}</small>
                    </div>
                </div>

                {article.content && (
                    <div className="article-section">
                        <div 
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>
                )}
            </article>
        </section>
    );
}

export default Article;
