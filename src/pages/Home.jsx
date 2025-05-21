import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieSlider from '../components/MovieSlider';

function Home({ watchlist, setWatchlist }) {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [nowPlaying, setNowPlaying] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
      .then((response) => {
        setFeaturedMovie(response.data.results[0]);
      })
      .catch((error) => console.error('Featured movie error:', error));

    axios
      .get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
      .then((response) => {
        setNowPlaying(response.data.results.slice(0, 8));
      })
      .catch((error) => console.error('Now playing error:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header watchlistCount={watchlist.length} />
      {/* Hero Section */}
      {featuredMovie && (
        <section
          className="relative bg-cover bg-center h-[70vh] flex items-center justify-center shadow-md hero-bg fade-in"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          <div className="container mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-heading mb-4 drop-shadow-md">
              {featuredMovie.title}
            </h1>
            <p className="text-md md:text-lg max-w-2xl mx-auto mb-6 opacity-90 leading-relaxed font-body">
              {featuredMovie.overview.substring(0, 150)}...
            </p>
            <NavLink
              to={`/movie/${featuredMovie.id}`}
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full text-base font-body font-semibold shadow-md hover:bg-yellow-600 transition duration-200"
            >
              <i className="fas fa-eye mr-2"></i> Voir Détails
            </NavLink>
          </div>
        </section>
      )}
      {/* Now Playing Section */}
      <section className="py-16 bg-gradient-to-b from-gray-200 to-gray-300">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-12 text-gray-800">
            🎥 À l'affiche
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {nowPlaying.map((movie) => (
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
                    <NavLink
                      to={`/movie/${movie.id}`}
                      className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm font-body hover:bg-yellow-600 transition duration-200"
                    >
                      <i className="fas fa-eye mr-2"></i> Détails
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Trending Movies */}
      <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-12 text-gray-800">
            🎬 Films Tendances
          </h2>
          <MovieSlider watchlist={watchlist} setWatchlist={setWatchlist} />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;