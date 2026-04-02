import { Link } from 'react-router-dom';
import './Home.scss';

function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-image hero-image-left">
                    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=600&fit=crop" alt="Fitness" />
                </div>
                <div className="hero-content">
                    <h1>Fitness bez extrémů. Výživa bez stresu.</h1>
                    <p>Odborné poradenství v oblasti výživy a personalizované fitness tréninky pro trvalý wellness</p>
                    <Link to="/contact" className="cta-button">Naplánujte si konzultaci</Link>
                </div>
                <div className="hero-image hero-image-right">
                    <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=600&fit=crop" alt="Zdravá výživa" />
                </div>
            </section>
        </div>
    );
}

export default Home;
