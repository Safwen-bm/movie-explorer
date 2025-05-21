import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Movies({ watchlist, setWatchlist }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.error('Genre error:', error));

    const url = debouncedSearch
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(debouncedSearch)}&page=${page}`
      : selectedGenre
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${page}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`;
    axios
      .get(url)
      .then((response) => {
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
        setLoading(false);
      })
      .catch((error) => {
        setError('Échec du chargement');
        setLoading(false);
      });
  }, [debouncedSearch, selectedGenre, page]);

  const handleAddToWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.find((item) => item.id === movie.id);
      if (exists) return prev;
      return [...prev, { id: movie.id, title: movie.title, poster_path: movie.poster_path }];
    });
    alert(`${movie.title} ajouté !`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header watchlistCount={watchlist.length} />
      <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-heading text-center mb-12 text-gray-800">
            🎬 Explorer les Films
          </h1>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Rechercher des films..."
                className="w-full p-3 pr-10 border rounded-full shadow-sm font-body text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <select
              className="p-3 border rounded-full bg-white text-gray-800 w-full sm:w-64 font-body shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">Tous les genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          {loading && (
            <div className="text-center fade-in">
              <svg className="animate-spin h-8 w-8 mx-auto text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
              </svg>
            </div>
          )}
          {error && <p className="text-center text-red-500 font-body fade-in">{error}</p>}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card bg-white rounded-lg shadow-lg overflow-hidden fade-in"
                  >
                    <img
                      className="w-full h-64 object-cover"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-heading truncate">{movie.title}</h3>
                      <p className="text-sm text-gray-600 font-body">
                        Note: {movie.vote_average.toFixed(1)}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleAddToWatchlist(movie)}
                          className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm font-body hover:bg-yellow-600 transition duration-200"
                        >
                          <i className="fas fa-plus mr-2"></i> Liste
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
              <div className="flex justify-center gap-4 mt-12 fade-in">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-6 py-2 bg-gray-500 text-white rounded-full font-body disabled:bg-gray-300 hover:bg-gray-600 transition duration-200"
                >
                  Précédent
                </button>
                <span className="py-2 font-body text-gray-800">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-6 py-2 bg-gray-500 text-white rounded-full font-body disabled:bg-gray-300 hover:bg-gray-600 transition duration-200"
                >
                  Suivant
                </button>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Movies;