import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/blog/posts/${id}/`, {
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
            
            <article>
                <h1>{article.title}</h1>
                <small>
                    {new Date(article.created_at).toLocaleDateString('cs-CZ')}
                    {article.author && ` • Autor: ${article.author}`}
                </small>
                
                <div className="article-content">
                    {article.content}
                </div>
            </article>
        </section>
    );
}

export default Article;
