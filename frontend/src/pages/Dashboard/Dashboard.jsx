import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import getValidToken from '../../utils/TokenValidation';
import './Dashboard.scss';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        company: '',
        address: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Check if user is superuser
    if (!user?.is_superuser) {
        return (
            <div className="dashboard">
                <div className="alert error">
                    Permission denied. Only superusers can access this dashboard.
                </div>
            </div>
        );
    }

    // Fetch all clients
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        const token = await getValidToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch clients');
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await getValidToken();

        try {
            const url = editingId 
                ? `${import.meta.env.VITE_API_URL}/api/clients/${editingId}/update/`
                : `${import.meta.env.VITE_API_URL}/api/clients/create/`;
            
            const method = editingId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save client');
            
            setFormData({ email: '', phone: '', company: '', address: '' });
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
            phone: client.phone || '',
            company: client.company || '',
            address: client.address || '',
        });
        setEditingId(client.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return;

        const token = await getValidToken();
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/clients/${id}/delete/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to delete client');
            await fetchClients();
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ email: '', phone: '', company: '', address: '' });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Client Management Dashboard</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
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
                        <div className="form-group">
                            <label htmlFor="company">Company</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                placeholder="Company name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Client address"
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

            {loading ? (
                <div className="loading">Loading clients...</div>
            ) : (
                <div className="clients-table">
                    <h2>All Clients ({clients.length})</h2>
                    {clients.length === 0 ? (
                        <p className="no-clients">No clients found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Company</th>
                                    <th>Address</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => (
                                    <tr key={client.id}>
                                        <td>{client.username}</td>
                                        <td>{client.email}</td>
                                        <td>{client.phone || '-'}</td>
                                        <td>{client.company || '-'}</td>
                                        <td>{client.address || '-'}</td>
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
            )}
        </div>
    );
}

export default Dashboard;
