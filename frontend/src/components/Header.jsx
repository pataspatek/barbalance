import { Link } from 'react-router-dom';

function Header() {
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
                    <Link to="/blog">Blog</Link>
                    <Link to="/approach">Náš přístup</Link>
                    <Link to="/contact">Kontakt</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
