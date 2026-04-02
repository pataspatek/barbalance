import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Article.scss';

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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/posts/${slug}/`, {
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
            console.log(data)
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
            
            <article className="recipe-article">
                {article.image_url && (
                    <div className="recipe-image-container">
                        <img 
                            src={article.image_url}
                            alt={article.title}
                            className="recipe-image"
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
                        <div 
                            className="recipe-ingredients"
                            dangerouslySetInnerHTML={{ __html: article.ingredients }}
                        />
                    </div>
                )}

                {article.content && (
                    <div className="recipe-section">
                        <div 
                            className="recipe-instructions"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>
                )}
            </article>
        </section>
    );
}

export default Article;
