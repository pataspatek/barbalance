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
        return <section style={{ padding: '40px 20px', textAlign: 'center' }}>Načítání článku...</section>;
    }

    if (error) {
        return (
            <section style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ color: 'red', marginBottom: '20px' }}>Chyba: {error}</p>
                <Link to="/blog" className="cta-button">Zpět na blog</Link>
            </section>
        );
    }

    if (!article) {
        return <section style={{ padding: '40px 20px', textAlign: 'center' }}>Článek nenalezen</section>;
    }

    return (
        <section style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/blog" style={{ color: '#007bff', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
                ← Zpět na blog
            </Link>
            
            <article>
                <h1 style={{ marginBottom: '10px' }}>{article.title}</h1>
                <small style={{ color: '#999' }}>
                    {new Date(article.created_at).toLocaleDateString('cs-CZ')}
                    {article.author && ` • Autor: ${article.author}`}
                </small>
                
                <div style={{ marginTop: '30px', lineHeight: '1.8', color: '#333' }}>
                    {article.content}
                </div>
            </article>
        </section>
    );
}

export default Article;
