import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';
import getValidToken from '../../utils/TokenValidation';
import './BlogManagement.scss';

function BlogManagement() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        content: '',
        imageFile: null,
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Check if user is superuser and redirect if not
    useEffect(() => {
        if (user !== undefined && !user?.is_superuser) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user?.is_superuser) {
            fetchRecipes();
        }
    }, [user]);

    const fetchRecipes = async () => {
        setLoading(true);

        const token = await getValidToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/admin/posts/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load recipes.');
            }

            const data = await response.json();
            setRecipes(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load recipes.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, type, files, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? files?.[0] || null : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = await getValidToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const url = editingId
                ? `${import.meta.env.VITE_API_URL}/api/blog/admin/posts/${editingId}/update/`
                : `${import.meta.env.VITE_API_URL}/api/blog/admin/posts/create/`;

            const form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('ingredients', formData.ingredients);
            form.append('content', formData.content);
            if (formData.imageFile) {
                form.append('image_upload', formData.imageFile); // match serializer field name
            }

            const response = await fetch(url, {
                method: editingId ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Do NOT set Content-Type, browser will set it
                },
                body: form,
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to save recipe');
            }

            setFormData({
                title: '',
                description: '',
                ingredients: '',
                content: '',
                imageFile: null,
            });
            setEditingId(null);
            setShowForm(false);
            await fetchRecipes();
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to save recipe');
        }
    };

    const handleEdit = (recipe) => {
        setFormData({
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            content: recipe.content,
            imageFile: null,
        });
        setEditingId(recipe.id);
        setShowForm(true);
    };

    const handleDelete = async (recipeId) => {
        if (!window.confirm('Delete this recipe?')) return;

        const token = await getValidToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/admin/posts/${recipeId}/delete/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete recipe');
            }

            await fetchRecipes();
            setError('');
        } catch (error) {
            setError(error.message);
        }
    };

    // Show nothing while checking permissions
    if (!user?.is_superuser) {
        return null;
    }

    return (
        <div className="dashboard-layout">
            <DashboardSidebar />
            <div className="dashboard-content">
                <div className="dashboard-inner">
                    <div className="dashboard-header">
                        <h1>Blog Management</h1>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                if (showForm) {
                                    setFormData({ title: '', description: '', ingredients: '', content: '', imageFile: null });
                                    setEditingId(null);
                                    setShowForm(false);
                                } else {
                                    setFormData({ title: '', description: '', ingredients: '', content: '', imageFile: null });
                                    setEditingId(null);
                                    setShowForm(true);
                                }
                            }}
                        >
                            {showForm ? 'Cancel' : 'Add New Recipe'}
                        </button>
                    </div>

                    {error && <div className="alert error">{error}</div>}

                    {showForm && (
                        <div className="form-container">
                            <h2>{editingId ? 'Edit Recipe' : 'Add New Recipe'}</h2>

                            <form className="recipe-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="High-Protein Breakfast Bowl"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Short intro about this recipe"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="ingredients">Ingredients</label>
                                    <textarea
                                        id="ingredients"
                                        name="ingredients"
                                        value={formData.ingredients}
                                        onChange={handleChange}
                                        placeholder="List your ingredients here, one per line"
                                        rows={7}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="content">Instructions</label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        placeholder="Step by step instructions"
                                        rows={5}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="imageUpload">Image Upload</label>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        name="imageFile"
                                        accept="image/jpeg,image/jpg,image/pjpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-success">
                                        {editingId ? 'Update Recipe' : 'Create Recipe'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setFormData({ title: '', description: '', ingredients: '', content: '', imageFile: null });
                                            setEditingId(null);
                                            setShowForm(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="recipes-section">
                        <h2>All Recipes ({recipes.length})</h2>

                        {loading ? (
                            <div className="loading">Loading recipes...</div>
                        ) : recipes.length === 0 ? (
                            <p className="no-recipes">No recipes yet.</p>
                        ) : (
                            <div className="recipe-list">
                                {recipes.map((recipe) => (
                                    <article key={recipe.id} className="recipe-item">
                                        <div className="recipe-info">
                                            <h3>{recipe.title}</h3>
                                            <p>{recipe.description || 'No description'}</p>
                                        </div>
                                        <div className="recipe-actions">
                                            <button 
                                                className="btn btn-small btn-edit"
                                                onClick={() => handleEdit(recipe)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-small btn-delete"
                                                onClick={() => handleDelete(recipe.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogManagement;
