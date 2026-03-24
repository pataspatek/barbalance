import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Blog() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/posts/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const data = await response.json();
            setArticles(data);
        } catch (err) {
            console.error('Error fetching articles:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <section className="blog article-loading">Načítání článků...</section>;
    }

    if (error) {
        return <section className="blog article-error"><p>Chyba: {error}</p></section>;
    }

    return (
        <section className="blog">
            <h1>Blog</h1>
            <p>Čtěte naše nejnovější články o zdraví, výžívě a fitness</p>
            
            {articles.length === 0 ? (
                <p className="blog-empty">Zatím žádné články</p>
            ) : (
                <div className="blog-grid">
                    {articles.map((article) => (
                        <Link 
                            to={`/blog/${article.slug}`} 
                            key={article.slug}
                            className="blog-card-link"
                        >
                            <div className="blog-card">
                                <h3>{article.title}</h3>
                                <p>
                                    {article.description}
                                </p>
                                <small>
                                    {new Date(article.created_at).toLocaleDateString('cs-CZ')}
                                </small>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Blog;
