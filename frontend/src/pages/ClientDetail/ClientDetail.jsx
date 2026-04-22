import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../utils/AuthContext';
import getValidToken from '../../utils/TokenValidation';
import './ClientDetail.scss';

function ClientDetail () {
    const { username } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClient();
    }, [username]);

    const fetchClient = async () => {
        const token = await getValidToken();
        if (!token) {
            setError('Neplatný token. Prosím přihlaste se znovu.');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/${username}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch client');
            }
            
            const data = await response.json();
            console.log('Fetched client data:', data);
            setClient(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setClient(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="client-detail loading-state"><h1>Načítání...</h1></div>;
    if (error) return <div className="client-detail error-state"><h1>Chyba: {error}</h1></div>;
    if (!client) return <div className="client-detail empty-state"><h1>Klient nenalezen</h1></div>;

    const getInitials = (firstName, lastName) => {
        return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() || '?';
    };

    return (
        <div className="client-detail">
            <div className="client-detail-card">
                <div className="client-header">
                    <div className="client-avatar">{getInitials(client.first_name, client.last_name)}</div>
                    <h1>{client.first_name} {client.last_name}</h1>
                    <div className="username">@{client.username}</div>
                </div>

                <div className="client-info">
                    {/* Contact Information */}
                    <div className="info-section">
                        <div className="section-title">Kontaktní údaje</div>
                        <div className="info-row">
                            <label>E-mail:</label>
                            <span>{client.email}</span>
                        </div>
                        <div className="info-row">
                            <label>Telefon:</label>
                            <span>{client.phone}</span>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="info-section">
                        <div className="section-title">Osobní údaje</div>
                        <div className="info-row">
                            <label>Věk:</label>
                            <span>{client.age}</span>
                        </div>
                        <div className="info-row">
                            <label>Username:</label>
                            <span>{client.username}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDetail;