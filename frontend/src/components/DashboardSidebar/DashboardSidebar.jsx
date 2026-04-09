import { useLocation, useNavigate } from 'react-router-dom';
import './DashboardSidebar.scss';

function DashboardSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Clients', path: '/dashboard/clients' },
        { label: 'Blog', path: '/dashboard/blog' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
                <div className="sidebar-heading">
                    <p className="sidebar-kicker">Admin Space</p>
                    <h2>Dashboard</h2>
                </div>
                <ul>
                    {menuItems.map(item => (
                        <li key={item.path}>
                            <button
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default DashboardSidebar;
