import Header from '../components/Header';
import Footer from '../components/Footer';
import { NavLink } from 'react-router-dom';

function Watchlist({ watchlist, setWatchlist }) {
  const handleRemoveFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
    alert('Film retiré !');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header watchlistCount={watchlist.length} />
      <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-heading text-center mb-12 text-gray-800">
            📋 Liste de Suivi
          </h1>
          {watchlist.length === 0 ? (
            <div className="text-center fade-in">
              <svg
                className="mx-auto h-48 w-48 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl font-body text-gray-600 mt-4">
                Votre liste est vide. Ajoutez des films !
              </p>
              <NavLink
                to="/movies"
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full text-base font-body mt-6 hover:bg-yellow-600 transition duration-200"
              >
                <i className="fas fa-film mr-2"></i> Explorer les Films
              </NavLink>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {watchlist.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-card bg-white rounded-lg shadow-lg overflow-hidden fade-in"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-heading truncate">{movie.title}</h3>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleRemoveFromWatchlist(movie.id)}
                        className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-sm font-body hover:bg-red-600 transition duration-200"
                      >
                        <i className="fas fa-trash mr-2"></i> Retirer
                      </button>
                      <NavLink
                        to={`/movie/${movie.id}`}
                        className="flex items-center bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-body hover:bg-gray-600 transition duration-200"
                      >
                        <i className="fas fa-eye mr-2"></i> Détails
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Watchlist;