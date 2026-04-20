import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Recipes.scss';

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecipes();
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

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/posts/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            const data = await response.json();
            setRecipes(data);
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <section className="recipes article-loading">Načítání receptů...</section>;
    }

    if (error) {
        return <section className="recipes article-error"><p>Chyba: {error}</p></section>;
    }

    return (
        <section className="recipes">
            <h1>Recepty</h1>
            <p>Čtěte naše nejnovější recepty o zdraví, výžívě a fitness</p>
            
            {recipes.length === 0 ? (
                <p className="recipes-empty">Zatím žádné recepty</p>
            ) : (
                <div className="recipes-grid">
                    {recipes.map((recipe) => (
                        <Link 
                            to={`/recipes/${recipe.slug}`} 
                            key={recipe.slug}
                            className="recipes-card-link"
                        >
                            <div className="recipes-card">
                                {recipe.image && (
                                    <div className="recipes-card-image">
                                        <img src={recipe.image_url} alt={recipe.title} />
                                    </div>
                                )}
                                <div className="recipes-card-content">
                                    <h3>{recipe.title}</h3>
                                    <p>
                                        {truncateText(stripHtml(recipe.description))}
                                    </p>
                                    <small>
                                        {new Date(recipe.created_at).toLocaleDateString('cs-CZ')}
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
