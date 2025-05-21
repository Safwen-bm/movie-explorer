import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function MovieSlider({ watchlist, setWatchlist }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.error('Genre error:', error));

    const url = selectedGenre
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`
      : `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
    axios
      .get(url)
      .then((response) => {
        setMovies(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        setError('Échec du chargement');
        setLoading(false);
      });
  }, [selectedGenre]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  const handleAddToWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.find((item) => item.id === movie.id);
      if (exists) return prev;
      return [...prev, { id: movie.id, title: movie.title, poster_path: movie.poster_path }];
    });
    alert(`${movie.title} ajouté !`);
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  return (
    <div className="mx-4">
      {loading && (
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
          </svg>
        </div>
      )}
      {error && <p className="text-center text-red-500 font-body">{error}</p>}
      {!loading && !error && (
        <>
          <select
            className="p-2 mb-6 border rounded bg-white text-gray-800 w-full sm:w-64 font-body focus:ring-2 focus:ring-primary"
            onChange={(e) => setSelectedGenre(e.target.value)}
            value={selectedGenre}
          >
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <Slider {...settings}>
            {chunkArray(movies, 4).map((movieGroup, idx) => (
              <div key={idx}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-2">
                  {movieGroup.map((movie) => (
                    <div
                      key={movie.id}
                      className="movie-card bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <img
                        className="w-full h-72 object-cover"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                      />
                      <div className="p-4">
                        <h6 className="text-lg font-heading truncate">{movie.title}</h6>
                        <p className="text-sm text-gray-600 font-body">
                          Note: {movie.vote_average.toFixed(1)}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleAddToWatchlist(movie)}
                            className="flex items-center bg-primary text-white px-3 py-1 rounded hover:bg-yellow-600 font-body text-sm transition-colors duration-200"
                          >
                            <span className="fas fa-plus mr-2"></span> Liste
                          </button>
                          <NavLink
                            to={`/movie/${movie.id}`}
                            className="flex items-center bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 font-body text-sm transition-colors duration-200"
                          >
                            <span className="fas fa-eye mr-2"></span> Détails
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </>
      )}
    </div>
  );
}

export default MovieSlider;