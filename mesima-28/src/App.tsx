import Header from "./components/header";
import Footer from "./components/footer";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./pages/404";
import People from "./pages/persons/people";
import Groups from "./pages/groups/groups";
import { GroupProvider } from "./pages/groups/groupContext";
import { PersonsProvider } from "./pages/persons/personContext";

function App(): JSX.Element {
  return (
    <GroupProvider>
      <PersonsProvider>
        <Router>
          <Header />

          <Routes>
            <Route path="/" element={<Groups />} />
            <Route path="/people" element={<People />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </Router>
      </PersonsProvider>
    </GroupProvider>
  );
}

export default App;
