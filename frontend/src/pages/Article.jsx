import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
                {article.image && (
                    <div className="recipe-image-container">
                        <img 
                            src={`${import.meta.env.VITE_API_URL}${article.image}`}
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
                        <p>{article.description}</p>
                    </div>
                )}

                {article.ingredients && (
                    <div className="recipe-section">
                        <h2>Ingredience</h2>
                        <ul className="ingredients-list">
                            {article.ingredients.split('\n').map((ingredient, index) => (
                                ingredient.trim() && (
                                    <li key={index}>{ingredient.trim()}</li>
                                )
                            ))}
                        </ul>
                    </div>
                )}

                {article.content && (
                    <div className="recipe-section">
                        <h2>Postup</h2>
                        <div className="recipe-instructions">
                            {article.content.split('\n').map((step, index) => (
                                step.trim() && (
                                    <p key={index}>{step.trim()}</p>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </section>
    );
}

export default Article;
