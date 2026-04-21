import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import getValidToken from '../../utils/TokenValidation';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';
import './ClientManagement.scss';
import Loader from '../../components/Loader/Loader';

function ClientManagement() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        age: '',
        phone: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Check if user is superuser and redirect if not
    useEffect(() => {
        if (user !== undefined && !user?.is_superuser) {
            navigate('/');
        }
    }, [user, navigate]);

    // Fetch all clients
    useEffect(() => {
        if (user?.is_superuser) {
            fetchClients();
        }
    }, [user]);

    const fetchClients = async () => {
        setLoading(true);

        const token = await getValidToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch clients');
            }

            const data = await response.json();
            setClients(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
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
                ? `${import.meta.env.VITE_API_URL}/api/clients/${editingId}/update/`
                : `${import.meta.env.VITE_API_URL}/api/clients/create/`;
            
            const response = await fetch(url, {
                method: editingId ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to save client');
            }
            
            setFormData({ email: '', first_name: '', last_name: '', age: '', phone: '' });
            setEditingId(null);
            setShowForm(false);
            await fetchClients();
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (client) => {
        setFormData({
            email: client.email,
            first_name: client.first_name || '',
            last_name: client.last_name || '',
            age: client.age || '',
            phone: client.phone || '',
        });
        setEditingId(client.id);
        setShowForm(true);
    };

    const handleDelete = async (clientId) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return;

        const token = await getValidToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/${clientId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete client');
            }
            
            await fetchClients();
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ email: '', first_name: '', last_name: '', age: '', phone: '' });
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
                        <h1>Client Management</h1>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                if (showForm) {
                                    handleCancel();
                                } else {
                                    setFormData({ email: '', first_name: '', last_name: '', age: '', phone: '' });
                                    setEditingId(null);
                                    setShowForm(true);
                                }
                            }}
                        >
                            {showForm ? 'Cancel' : 'Add New Client'}
                        </button>
                    </div>

                    {error && <div className="alert error">{error}</div>}

                    {showForm && (
                        <div className="form-container">
                            <h2>{editingId ? 'Edit Client' : 'Add New Client'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email {editingId && '(read-only)'}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Client email"
                                        required
                                        readOnly={editingId ? true : false}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="first_name">First Name</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        placeholder="Client first name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        placeholder="Client last name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        placeholder="Client age"
                                        min="0"
                                        max="150"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Client phone number"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-success">
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="clients-table">
                        <h2>All Clients ({clients.length})</h2>
                        {loading ? (
                            <Loader />
                        ) : clients.length === 0 ? (
                            <p className="no-clients">No clients found.</p>
                        ) : (
                            <table>
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Age</th>
                                            <th>Phone</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map(client => (
                                            <tr key={client.id}>
                                                <td>{client.username}</td>
                                                <td>{client.email}</td>
                                                <td>{client.first_name || '-'}</td>
                                                <td>{client.last_name || '-'}</td>
                                                <td>{client.age || '-'}</td>
                                                <td>{client.phone || '-'}</td>
                                                <td>{new Date(client.created_at).toLocaleDateString()}</td>
                                                <td className="actions">
                                                    <button 
                                                        className="btn btn-small btn-edit"
                                                        onClick={() => handleEdit(client)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn btn-small btn-delete"
                                                        onClick={() => handleDelete(client.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
}

export default ClientManagement;
