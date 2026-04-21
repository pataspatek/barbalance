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
        <header className="header">
            <div className="header-container">
                <div className="logo-section">
                    <Link to="/" className="logo-link">
                        <h1 className="logo">BarBalance</h1>
                        <p className="tagline">Výživa • Fitness • Wellness</p>
                    </Link>
                </div>
                <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={closeMenu}>Domů</Link>
                    <Link to="/about" onClick={closeMenu}>O nás</Link>
                    <Link to="/services" onClick={closeMenu}>Služby</Link>
                    <Link to="/recipes" onClick={closeMenu}>Recepty</Link>
                    
                    {isMenuOpen && (
                        <div className="user-section user-section-mobile">
                            {user ? (
                                <>
                                    <span className="user-name">@{displayName}</span>
                                    <Link to="/logout" className="logout-link">Odhlásit se</Link>
                                </>
                            ) : (
                                <Link to="/login" className="login-link">Přihlásit se</Link>
                            )}
                        </div>
                    )}
                </nav>

                <div className="user-section user-section-desktop">
                    {user ? (
                        <>
                            <span className="user-name">@{displayName}</span>
                            <Link to="/logout" className="logout-link">Odhlásit se</Link>
                        </>
                    ) : (
                        <Link to="/login" className="login-link">Přihlásit se</Link>
                    )}
                </div>

                <button 
                    className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <div className={`backdrop ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
        </header>
    );
}

export default Header;
