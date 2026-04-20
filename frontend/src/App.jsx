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
import Blog from './pages/Recipes/Recipes';
import Article from './pages/Recipe/Recipe';
import Gallery from './pages/Gallery/Gallery';
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientManagement from './pages/ClientManagement/ClientManagement';
import BlogManagement from './pages/BlogManagement/BlogManagement';
import RecipesManagement from './pages/RecipesManagement/RecipesManagement';
import Recipes from './pages/Recipes/Recipes';
import Recipe from './pages/Recipe/Recipe';

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
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipes/:slug" element={<Recipe />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/clients" element={<ClientManagement />} />
                    <Route path="/dashboard/blog" element={<BlogManagement />} />
                    <Route path="/dashboard/recipes" element={<RecipesManagement />} />
                </Routes>

                <Footer />
            </div>
            <Analytics />
        </Router>
    );
}

export default App;