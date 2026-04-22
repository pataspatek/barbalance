import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import './Header.scss';

function Header() {
    const { user } = useContext(AuthContext);
    const displayName = user?.username;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="logo-section">
                        <Link to="/" className="logo-link" onClick={closeMenu}>
                            <h1 className="logo">BarBalance</h1>
                            <p className="tagline">Výživa • Fitness • Wellness</p>
                        </Link>
                    </div>

                    <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
                        <div className="nav-links">
                            <Link to="/" onClick={closeMenu} className="nav-link">Domů</Link>
                            <Link to="/about" onClick={closeMenu} className="nav-link">O nás</Link>
                            <Link to="/services" onClick={closeMenu} className="nav-link">Služby</Link>
                            <Link to="/recipes" onClick={closeMenu} className="nav-link">Recepty</Link>
                        </div>
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
                    </nav>

                    <button 
                        className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            {isMenuOpen && (
                <div className="backdrop active" onClick={closeMenu} aria-hidden="true"></div>
            )}
        </>
    );
}

export default Header;
