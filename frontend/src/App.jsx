import './App.css';

function App() {
    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="header-container">
                    <h1 className="logo">Barbara</h1>
                    <nav className="nav">
                        <a href="#about">About</a>
                        <a href="#services">Services</a>
                        <a href="#contact">Contact</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Transform Your Health</h1>
                    <p>Personal Training • Nutrition Guidance • Healthy Lifestyle Coaching</p>
                    <button className="cta-button">Start Your Journey</button>
                </div>
            </section>

            {/* Services Section */}
            <section className="services">
                <h2>My Services</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">💪</div>
                        <h3>Personal Training</h3>
                        <p>Customized workout programs tailored to your fitness goals and experience level.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🥗</div>
                        <h3>Nutrition Guidance</h3>
                        <p>Expert dietary advice to fuel your body and support your fitness journey.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🌟</div>
                        <h3>Lifestyle Coaching</h3>
                        <p>Holistic guidance to achieve sustainable health and wellness goals.</p>
                    </div>
                </div>
            </section>

            {/* Social Links */}
            <section className="socials">
                <h2>Connect With Barbara</h2>
                <div className="social-links">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <span className="social-icon">📷</span>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <span className="social-icon">f</span>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <span className="social-icon">𝕏</span>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <span className="social-icon">in</span>
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2026 Barbara's Health & Wellness. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;