import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';
import getValidToken from '../../utils/TokenValidation';
import Loader from '../../components/Loader/Loader';
import './BlogManagement.scss';

function BlogManagement() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
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
            fetchArticles();
        }
    }, [user]);

    const fetchArticles = async () => {
        setLoading(true);

        const token = await getValidToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/admin/articles/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load articles.');
            }

            const data = await response.json();
            setArticles(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load articles.');
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
                ? `${import.meta.env.VITE_API_URL}/api/blog/admin/articles/${editingId}/update/`
                : `${import.meta.env.VITE_API_URL}/api/blog/admin/articles/create/`;

            const form = new FormData();
            form.append('title', formData.title);
            form.append('content', formData.content);
            if (formData.imageFile) {
                form.append('image_upload', formData.imageFile);
            }

            const response = await fetch(url, {
                method: editingId ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: form,
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to save article');
            }

            setFormData({
                title: '',
                content: '',
                imageFile: null,
            });
            setEditingId(null);
            setShowForm(false);
            await fetchArticles();
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to save article');
        }
    };

    const handleEdit = (article) => {
        setFormData({
            title: article.title,
            content: article.content,
            imageFile: null,
        });
        setEditingId(article.id);
        setShowForm(true);
    };

    const handleDelete = async (articleId) => {
        if (!window.confirm('Delete this article?')) return;

        const token = await getValidToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/admin/articles/${articleId}/delete/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete article');
            }

            await fetchArticles();
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
                                    setFormData({ title: '', content: '', imageFile: null });
                                    setEditingId(null);
                                    setShowForm(false);
                                } else {
                                    setFormData({ title: '', content: '', imageFile: null });
                                    setEditingId(null);
                                    setShowForm(true);
                                }
                            }}
                        >
                            {showForm ? 'Cancel' : 'Add New Article'}
                        </button>
                    </div>

                    {error && <div className="alert error">{error}</div>}

                    {showForm && (
                        <div className="form-container">
                            <h2>{editingId ? 'Edit Article' : 'Add New Article'}</h2>

                            <form className="article-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Article Title"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="content">Content</label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        placeholder="Article content"
                                        rows={10}
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
                                        {editingId ? 'Update Article' : 'Create Article'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setFormData({ title: '', content: '', imageFile: null });
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

                    <div className="articles-section">
                        <h2>All Articles ({articles.length})</h2>

                        {loading ? (
                            <Loader />
                        ) : articles.length === 0 ? (
                            <p className="no-articles">No articles yet.</p>
                        ) : (
                            <div className="article-list">
                                {articles.map((article) => (
                                    <article key={article.id} className="article-item">
                                        <div className="article-info">
                                            <h3>{article.title}</h3>
                                            <p className="article-date">
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="article-actions">
                                            <button 
                                                className="btn btn-small btn-edit"
                                                onClick={() => handleEdit(article)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-small btn-delete"
                                                onClick={() => handleDelete(article.id)}
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
