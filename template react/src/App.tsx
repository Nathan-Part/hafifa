import Header from './components/header';
import Footer from './components/footer';

import Home from './pages/home';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './pages/404';

function App(): JSX.Element {
  return (
    <Router>  
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Footer />
    </Router>
  );
}

export default App;
