import { useContext, useEffect, useMemo, useState } from 'react';
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
    const [loadingError, setLoadingError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingImageUrl, setEditingImageUrl] = useState('');
    const [isDeletingId, setIsDeletingId] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        ingredients: '',
        content: '',
        imageFile: null,
    });

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

    const ingredientCount = useMemo(() => {
        return form.ingredients
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean).length;
    }, [form.ingredients]);

    const extractIngredientsText = (html = '') => {
        const matches = html.match(/<li[^>]*>(.*?)<\/li>/gi);
        if (!matches) {
            return html.replace(/<[^>]+>/g, '').trim();
        }
        return matches
            .map((item) => item.replace(/<[^>]+>/g, '').trim())
            .filter(Boolean)
            .join('\n');
    };

    const htmlToText = (html = '') => html.replace(/<[^>]+>/g, '').trim();

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            ingredients: '',
            content: '',
            imageFile: null,
        });
        setEditingId(null);
        setEditingImageUrl('');
    };

    const withNewestFirst = (items) => {
        return [...items].sort((a, b) => {
            const left = Date.parse(a?.created_at || '') || 0;
            const right = Date.parse(b?.created_at || '') || 0;
            return right - left;
        });
    };

    const upsertRecipe = (recipe) => {
        setRecipes((prev) => {
            const index = prev.findIndex((item) => item.id === recipe.id);
            if (index === -1) {
                return withNewestFirst([recipe, ...prev]);
            }
            const next = [...prev];
            next[index] = recipe;
            return withNewestFirst(next);
        });
    };

    const fetchRecipes = async () => {
        setLoading(true);
        setLoadingError('');

        try {
            const token = await getValidToken();
            if (!token) {
                navigate('/login');
                return;
            }

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
            setRecipes(withNewestFirst(data));
        } catch (error) {
            setLoadingError(error.message || 'Failed to load recipes.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        if (field === 'imageFile' && value) {
            const maxSize = 10 * 1024 * 1024;
            const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp']);
            const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
            const extension = value.name?.slice(value.name.lastIndexOf('.')).toLowerCase();

            if (!allowedTypes.has(value.type) && !allowedExtensions.has(extension)) {
                setSubmitError('Only jpg, jpeg, png, and webp images are allowed.');
                return;
            }

            if (value.size > maxSize) {
                setSubmitError('Image must be 10MB or smaller.');
                return;
            }
        }

        setForm((prev) => ({ ...prev, [field]: value }));
        if (field === 'imageFile') {
            setSubmitError('');
        }
    };

    const extractApiError = (data) => {
        if (!data) {
            return 'Saving recipe failed.';
        }

        if (typeof data.detail === 'string' && data.detail) {
            return data.detail;
        }

        if (typeof data.error === 'string' && data.error) {
            return data.error;
        }

        if (typeof data.image === 'string' && data.image) {
            return data.image;
        }

        if (Array.isArray(data.image) && data.image.length > 0) {
            return data.image[0];
        }

        for (const value of Object.values(data)) {
            if (typeof value === 'string' && value) {
                return value;
            }
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
                return value[0];
            }
        }

        return 'Saving recipe failed.';
    };

    const startEdit = (recipe) => {
        setSubmitError('');
        setSubmitSuccess('');
        setEditingId(recipe.id);
        setEditingImageUrl(recipe.image_url || '');
        setForm({
            title: recipe.title || '',
            description: recipe.plain_description || htmlToText(recipe.description),
            ingredients: recipe.plain_ingredients || extractIngredientsText(recipe.ingredients),
            content: recipe.plain_content || htmlToText(recipe.content),
            imageFile: null,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        if (!form.title.trim()) {
            setSubmitError('Title is required.');
            return;
        }

        if (!form.description.trim()) {
            setSubmitError('Description is required.');
            return;
        }

        if (!form.ingredients.trim()) {
            setSubmitError('Ingredients are required.');
            return;
        }

        if (!editingId && !form.imageFile) {
            setSubmitError('Image upload is required.');
            return;
        }

        const payload = new FormData();
        payload.append('title', form.title.trim());
        payload.append('description_text', form.description.trim());
        payload.append('ingredients_text', form.ingredients.trim());

        if (form.content.trim()) {
            payload.append('content_text', form.content.trim());
        }

        if (form.imageFile) {
            payload.append('image_upload', form.imageFile);
        }

        setIsSubmitting(true);

        try {
            const token = await getValidToken();
            if (!token) {
                navigate('/login');
                return;
            }

            const isEdit = Boolean(editingId);
            const endpoint = isEdit
                ? `${import.meta.env.VITE_API_URL}/api/blog/admin/posts/${editingId}/`
                : `${import.meta.env.VITE_API_URL}/api/blog/admin/posts/`;

            const response = await fetch(endpoint, {
                method: isEdit ? 'PATCH' : 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload,
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(extractApiError(data));
            }

            setSubmitSuccess(isEdit ? 'Recipe updated.' : 'Recipe created.');
            upsertRecipe(data);
            resetForm();
        } catch (error) {
            setSubmitError(error.message || 'Saving recipe failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (recipeId) => {
        const confirmed = window.confirm('Delete this recipe?');
        if (!confirmed) {
            return;
        }

        setSubmitError('');
        setSubmitSuccess('');
        setIsDeletingId(recipeId);

        try {
            const token = await getValidToken();
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/admin/posts/${recipeId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Delete failed.');
            }

            if (editingId === recipeId) {
                resetForm();
            }

            setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
            setSubmitSuccess('Recipe deleted.');
        } catch (error) {
            setSubmitError(error.message || 'Delete failed.');
        } finally {
            setIsDeletingId(null);
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
                    </div>

                    {loadingError && <div className="alert error">{loadingError}</div>}
                    {submitError && <div className="alert error">{submitError}</div>}
                    {submitSuccess && <div className="alert success">{submitSuccess}</div>}

                    <div className="blog-grid-management">
                        <section className="recipe-form-card">
                            <h2>{editingId ? 'Edit Recipe' : 'Add New Recipe'}</h2>

                            <form className="recipe-form" onSubmit={handleSubmit}>
                                <label htmlFor="title">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={form.title}
                                    onChange={(event) => handleChange('title', event.target.value)}
                                    placeholder="High-Protein Breakfast Bowl"
                                    required
                                />

                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(event) => handleChange('description', event.target.value)}
                                    placeholder="Short intro about this recipe"
                                    rows={4}
                                    required
                                />

                                <label htmlFor="ingredients">Ingredients (one per line, include amount)</label>
                                <textarea
                                    id="ingredients"
                                    value={form.ingredients}
                                    onChange={(event) => handleChange('ingredients', event.target.value)}
                                    placeholder={'200 g oats\n250 ml milk\n1 tbsp honey'}
                                    rows={7}
                                    required
                                />
                                <small>{ingredientCount} ingredient lines</small>

                                <label htmlFor="content">Instructions (optional)</label>
                                <textarea
                                    id="content"
                                    value={form.content}
                                    onChange={(event) => handleChange('content', event.target.value)}
                                    placeholder="Step by step instructions"
                                    rows={5}
                                />

                                <div className="image-inputs">
                                    <div>
                                        <label htmlFor="imageUpload">Image Upload (jpg/png/webp, max 10MB)</label>
                                        <input
                                            id="imageUpload"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/pjpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                                            onChange={(event) => handleChange('imageFile', event.target.files?.[0] || null)}
                                        />
                                    </div>
                                </div>

                                {editingImageUrl && !form.imageFile && (
                                    <div className="current-image">
                                        <p>Current image</p>
                                        <img src={editingImageUrl} alt="Current recipe" />
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : editingId ? 'Update Recipe' : 'Create Recipe'}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            className="secondary"
                                            onClick={resetForm}
                                            disabled={isSubmitting}
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>

                        <section className="recipes-list-card">
                            <h2>Existing Recipes</h2>

                            {loading ? (
                                <p>Loading recipes...</p>
                            ) : recipes.length === 0 ? (
                                <p>No recipes yet.</p>
                            ) : (
                                <div className="recipe-list">
                                    {recipes.map((recipe) => (
                                        <article key={recipe.id} className="recipe-row">
                                            <div className="recipe-row-main">
                                                <h3>{recipe.title}</h3>
                                                <p>{recipe.plain_description || 'No description'}</p>
                                            </div>

                                            <div className="recipe-row-actions">
                                                <button type="button" className="secondary" onClick={() => startEdit(recipe)}>
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="danger"
                                                    onClick={() => handleDelete(recipe.id)}
                                                    disabled={isDeletingId === recipe.id}
                                                >
                                                    {isDeletingId === recipe.id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogManagement;
