import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/next"
import './styles/main.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Approach from './pages/Approach';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Gallery from './pages/Gallery';

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
        </Router>
    );
}

export default App;