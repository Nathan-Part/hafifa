import Header from './components/header';
import Footer from './components/footer';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './pages/404';
import People from './pages/people';
import Groups from './pages/groups';
import { GroupProvider } from './pages/groups/groupContext';

function App(): JSX.Element {
  return (
    <GroupProvider>
      <Router>  
        
        <Header />
        
        <Routes>
          <Route path="/" element={<People />} />
          <Route path="/people" element={<People />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Footer />

      </Router>
    </GroupProvider>
  );
}

export default App;
