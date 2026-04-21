import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import './Header.scss';

function Header() {
    const { user } = useContext(AuthContext);
    const displayName = user?.username;

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo-section">
                    <Link to="/" className="logo-link">
                        <h1 className="logo">BarBalance</h1>
                        <p className="tagline">Výživa • Fitness • Wellness</p>
                    </Link>
                </div>
                <nav className="nav">
                    <Link to="/">Domů</Link>
                    <Link to="/about">O nás</Link>
                    <Link to="/services">Služby</Link>
                    <Link to="/recipes">Recepty</Link>
                    <Link to="/approach">Náš přístup</Link>
                    <Link to="/contact">Kontakt</Link>
                </nav>

                <div className="user-section">
                    {user ? (
                        <>
                            <span className="user-name">@{displayName}</span>
                            <Link to="/logout" className="logout-link">Odhlásit se</Link>
                        </>
                    ) : (
                        <Link to="/login" className="login-link">Přihlásit se</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
