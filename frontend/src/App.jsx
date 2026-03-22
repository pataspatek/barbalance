import { useEffect } from 'react';
import './App.css';

function App() {

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/blog/posts/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log('Posts:', data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="header-container">
                    <div className="logo-section">
                        <h1 className="logo">BarBalance</h1>
                        <p className="tagline">Výživa • Fitness • Wellness</p>
                    </div>
                    <nav className="nav">
                        <a href="#about">O nás</a>
                        <a href="#services">Služby</a>
                        <a href="#approach">Náš přístup</a>
                        <a href="#contact">Kontakt</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-image hero-image-left">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop" alt="Fitness" />
                </div>
                <div className="hero-content">
                    <h1>Fitness bez extrémů. Výživa bez stresu.</h1>
                    <p>Odborné poradenství v oblasti výživy a personalizované fitness tréninky pro trvalý wellness</p>
                    <button className="cta-button">Naplánujte si konzultaci</button>
                </div>
                <div className="hero-image hero-image-right">
                    <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=600&fit=crop" alt="Zdravá výživa" />
                </div>
            </section>

            {/* About Section */}
            <section className="about" id="about">
                <div className="about-content">
                    <h2>Proč si vybrat BarBalance?</h2>
                    <p className="about-text">
                        Věříme, že skutečné zdraví pochází z rovnováhy—rovnováha výživy, pohybu a vědomí. 
                        Náš holistický přístup se zaměřuje na udržitelné změny životního stylu, které trvají.
                    </p>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">✓</div>
                            <h3>Vědecky podložené</h3>
                            <p>Vědecky podpořené strategie pro skutečné výsledky</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">✓</div>
                            <h3>Personalizované</h3>
                            <p>Přizpůsobeno vašim jedinečným potřebám a životnímu stylu</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">✓</div>
                            <h3>Udržitelné</h3>
                            <p>Budování zvyků, které zůstanou dlouhodobě</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services" id="services">
                <div className="services-container">
                    <h2>Naše služby</h2>
                    <p className="services-intro">Komplexní zdravotnická řešení přizpůsobená vašim cílům</p>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">🥗</div>
                            <h3>Poradenství v oblasti výživy</h3>
                            <p>Personalizované plány jídel, poradenství v oblasti výživy a stravovací strategie k optimalizaci vašeho zdraví a energetické hladiny.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">💪</div>
                            <h3>Fitness tréninky</h3>
                            <p>Vlastní tréninková programy navržené pro vaše cíle, ať už jde o hubnutí, budování síly nebo celkový wellness.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">📊</div>
                            <h3>Sledování pokroku</h3>
                            <p>Pravidelné posouzení a poznatky řízené daty, které vás motivují a udržují na trati s vašimi cíli.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Approach Section */}
            <section className="approach" id="approach">
                <div className="approach-content">
                    <h2>Náš holistický přístup</h2>
                    <div className="approach-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Posouzení</h3>
                            <p>Pochopte své zdravotnické cíle, životní styl a preference</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Strategie</h3>
                            <p>Vytvořte personalizovaný plán kombinující výživu a fitness</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Implementace</h3>
                            <p>Začněte svou cestu s odborným vedením a podporou</p>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>Úspěch</h3>
                            <p>Dosáhněte trvalých výsledků a transformujte svůj životní styl</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact" id="contact">
                <div className="contact-content">
                    <h2>Jste připraveni začít svou transformaci?</h2>
                    <p>Kontaktujte nás pro bezplatnou konzultaci a zjistěte, jak vám můžeme pomoci dosáhnout vašich zdravotnických cílů.</p>
                    <button className="cta-button">Kontaktujte nás dnes</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2026 BarBalance. Všechna práva vyhrazena.</p>
                    <p>Posílení zdravých voleb, jedním člověkem najednou.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;