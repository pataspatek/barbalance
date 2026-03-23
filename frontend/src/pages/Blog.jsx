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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/blog/posts/`, {
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
        return <section className="blog" style={{ padding: '40px 20px', textAlign: 'center' }}>Načítání článků...</section>;
    }

    if (error) {
        return <section className="blog" style={{ padding: '40px 20px', textAlign: 'center', color: 'red' }}>Chyba: {error}</section>;
    }

    return (
        <section className="blog" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Blog</h1>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>Čtěte naše nejnovější články o zdraví, výžívě a fitness</p>
            
            {articles.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999' }}>Zatím žádné články</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {articles.map((article) => (
                        <Link 
                            to={`/blog/${article.id}`} 
                            key={article.id}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            >
                                <h3 style={{ marginBottom: '10px' }}>{article.title}</h3>
                                <p style={{ color: '#666', marginBottom: '15px', flexGrow: 1 }}>
                                    {article.content?.substring(0, 100)}...
                                </p>
                                <small style={{ color: '#999' }}>
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
