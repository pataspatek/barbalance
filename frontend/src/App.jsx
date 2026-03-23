import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Approach from './pages/Approach';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Article from './pages/Article';

function App() {

    return (
        <Router>
            <div className="app">
                {/* Header */}
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

                {/* Main Content */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/approach" element={<Approach />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<Article />} />
                </Routes>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-content">
                        <p>&copy; 2026 BarBalance. Všechna práva vyhrazena.</p>
                        <p>Posílení zdravých voleb, jedním člověkem najednou.</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;