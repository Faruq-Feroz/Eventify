import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Pages/Home';
import AddEvent from './Pages/AddEvent';
import ViewEvents from './Pages/ViewEvents';
import Help from './Pages/Help';
import Favorites from './Pages/Favorites';
import Calendar from './Pages/Calendar';
import Archive from './Pages/Archive';
import { ThemeProvider } from './Context/ThemeContext';
import './styles/index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="add-event" element={<AddEvent />} />
            <Route path="view-events" element={<ViewEvents />} />
            <Route path="help" element={<Help />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="archive" element={<Archive />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
