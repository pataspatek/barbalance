import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Recipes.scss';

function Recipes() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const stripHtml = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const truncateText = (text, length = 150) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/posts/`, {
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
        <section className="recipes">
            <h1>Recepty</h1>
            <p>Čtěte naše nejnovější recepty o zdraví, výžívě a fitness</p>
            
            {articles.length === 0 ? (
                <p className="recipes-empty">Zatím žádné recepty</p>
            ) : (
                <div className="recipes-grid">
                    {articles.map((article) => (
                        <Link 
                            to={`/recipes/${article.slug}`} 
                            key={article.slug}
                            className="recipes-card-link"
                        >
                            <div className="recipes-card">
                                {article.image && (
                                    <div className="recipes-card-image">
                                        <img src={article.image_url} alt={article.title} />
                                    </div>
                                )}
                                <div className="recipes-card-content">
                                    <h3>{article.title}</h3>
                                    <p>
                                        {truncateText(stripHtml(article.description))}
                                    </p>
                                    <small>
                                        {new Date(article.created_at).toLocaleDateString('cs-CZ')}
                                    </small>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Recipes;
