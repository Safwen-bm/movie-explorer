import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../App';

function Header({ watchlistCount }) {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-secondary text-white py-4 sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-heading tracking-wider">Movie Explorer</h1>
        <div className="flex gap-8 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-body text-lg hover:text-primary transition-colors duration-200 ${
                isActive ? 'text-primary' : ''
              }`
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) =>
              `font-body text-lg hover:text-primary transition-colors duration-200 ${
                isActive ? 'text-primary' : ''
              }`
            }
          >
            Films
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `font-body text-lg hover:text-primary transition-colors duration-200 ${
                isActive ? 'text-primary' : ''
              }`
            }
          >
            Liste ({watchlistCount})
          </NavLink>
          <button
            onClick={toggleTheme}
            className="text-lg focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <i className="fas fa-moon text-primary"></i>
            ) : (
              <i className="fas fa-sun text-primary"></i>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;