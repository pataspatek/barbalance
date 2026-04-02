import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './styles/main.scss';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Approach from './pages/Approach/Approach';
import Contact from './pages/Contact/Contact';
import Blog from './pages/Blog/Blog';
import Article from './pages/Article/Article';
import Gallery from './pages/Gallery/Gallery';

function App() {

    return (
        <Router>
            <div className="app">
                <Header />

                {/* Main Content */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/approach" element={<Approach />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<Article />} />
                </Routes>

                <Footer />
            </div>
            <Analytics />
        </Router>
    );
}

export default App;