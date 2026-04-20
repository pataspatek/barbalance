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
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientManagement from './pages/ClientManagement/ClientManagement';
import BlogManagement from './pages/BlogManagement/BlogManagement';
import Recipes from './pages/Recipes/Recipes';
import Recipe from './pages/Recipe/Recipe';
import RecipesManagement from './pages/RecipesManagement/RecipesManagement';

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

                    {/* Blog routes */}
                    <Route path="blog">
                        <Route index element={<Blog />} />
                        <Route path=":slug" element={<Article />} />
                    </Route>

                    {/* Recipes routes */}
                    <Route path="recipes">
                        <Route index element={<Recipes />} />
                        <Route path=":slug" element={<Recipe />} />
                    </Route>

                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />

                    {/* Dashboard routes */}
                    <Route path="/dashboard/">
                        <Route index element={<Dashboard />} />
                        <Route path="clients" element={<ClientManagement />} />
                        <Route path="blog" element={<BlogManagement />} />
                        <Route path="recipes" element={<RecipesManagement />} />
                    </Route>
                </Routes>

                <Footer />
            </div>
            <Analytics />
        </Router>
    );
}

export default App;