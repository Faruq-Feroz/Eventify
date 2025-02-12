// src/layout/Header.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faBell, faUserCircle, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../Context/ThemeContext';

const Header = ({ toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="header">
      <div className="hamburger-menu" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search events..." />
        <button>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <div className="header-icons">
        <button className="notification-icon">
          <FontAwesomeIcon icon={faBell} />
        </button>
        <div className="user-profile">
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
        <button className="toggle-mode" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </div>
    </header>
  );
};

export default Header;