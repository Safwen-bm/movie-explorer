import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieSlider from '../components/MovieSlider';

function MovieDetails({ watchlist, setWatchlist }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((response) => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Échec du chargement');
        setLoading(false);
      });

    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`)
      .then((response) => {
        const trailer = response.data.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailer(trailer ? `https://www.youtube.com/embed/${trailer.key}` : null);
      })
      .catch((error) => console.error('Trailer error:', error));

    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`)
      .then((response) => {
        setRelatedMovies(response.data.results);
      })
      .catch((error) => console.error('Related movies error:', error));
  }, [id]);

  const handleAddToWatchlist = () => {
    if (movie) {
      setWatchlist((prev) => {
        const exists = prev.find((item) => item.id === movie.id);
        if (exists) return prev;
        return [...prev, { id: movie.id, title: movie.title, poster_path: movie.poster_path }];
      });
      alert(`${movie.title} ajouté !`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header watchlistCount={watchlist.length} />
      {movie && (
        <section
          className="relative bg-cover bg-center h-[50vh] flex items-center justify-center shadow-md hero-bg"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="container mx-auto px-6 text-center text-white fade-in">
            <h1 className="text-4xl md:text-5xl font-heading mb-4 drop-shadow-md">{movie.title}</h1>
          </div>
        </section>
      )}
      <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="container mx-auto px-6">
          {loading && (
            <div className="text-center fade-in">
              <svg className="animate-spin h-8 w-8 mx-auto text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
              </svg>
            </div>
          )}
          {error && <p className="text-center text-red-500 font-body fade-in">{error}</p>}
          {movie && !loading && !error && (
            <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg p-6 fade-in">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full md:w-1/3 h-96 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-heading mb-4">{movie.title}</h2>
                <p className="text-gray-600 mb-4 font-body leading-relaxed">{movie.overview}</p>
                <p className="text-sm text-gray-600 mb-2 font-body">
                  Note: {movie.vote_average.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 mb-2 font-body">Sortie: {movie.release_date}</p>
                <p className="text-sm text-gray-600 mb-4 font-body">
                  Genres: {movie.genres.map((g) => g.name).join(', ')}
                </p>
                <button
                  onClick={handleAddToWatchlist}
                  className="flex items-center bg-primary text-white px-6 py-2 rounded-full font-body text-base hover:bg-yellow-600 transition duration-200 shadow-md"
                >
                  <i className="fas fa-plus mr-2"></i> Ajouter à la liste
                </button>
                {trailer && (
                  <div className="mt-6">
                    <h3 className="text-xl font-heading mb-4">Bande-annonce</h3>
                    <iframe
                      className="w-full h-64 md:h-96 rounded-lg shadow-lg"
                      src={trailer}
                      title="Trailer"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {relatedMovies.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl md:text-4xl font-heading text-center mb-12 text-gray-800">
                🎬 Films Similaires
              </h2>
              <MovieSlider watchlist={watchlist} setWatchlist={setWatchlist} movies={relatedMovies} />
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default MovieDetails;