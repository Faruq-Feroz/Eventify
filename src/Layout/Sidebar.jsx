import { useTheme } from '../Context/ThemeContext'; // Import Theme Context
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faPlus, faList, faQuestionCircle, faStar, faCalendarAlt, faArchive
} from '@fortawesome/free-solid-svg-icons';

// Import logos
import lightLogo from '../assets/Logo.png';
import darkLogo from '../assets/Logo-dark-mode.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { darkMode } = useTheme(); // Get darkMode state from context
  
  // Determine logo based on theme
  const logoSrc = darkMode ? darkLogo : lightLogo;

  const navItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/add-event', icon: faPlus, label: 'Create Event' },
    { path: '/view-events', icon: faList, label: 'View Events' },
    { path: '/help', icon: faQuestionCircle, label: 'Help' },
    { path: '/favorites', icon: faStar, label: 'Favorites' },
    { path: '/calendar', icon: faCalendarAlt, label: 'Calendar View' },
    { path: '/archive', icon: faArchive, label: 'Archived' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <img src={logoSrc} alt="Event Manager Logo" />
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={location.pathname === item.path ? 'active' : ''} onClick={toggleSidebar}>
                <FontAwesomeIcon icon={item.icon} /> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
