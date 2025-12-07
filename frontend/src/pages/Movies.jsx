import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MovieRow from '../components/MovieRow';
import DetailsModal from '../components/DetailsModal';
import TrailerPlayer from '../components/TrailerPlayer';
import { useAuth } from '../context/AuthContext';
import { getPopular, getTopRated, getByGenre, getDetails, getTrailer } from '../services/tmdb';

const Movies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const [popular, topRated, action, comedy, horror, romance, scifi] = await Promise.all([
          getPopular('movie'),
          getTopRated('movie'),
          getByGenre(28, 'movie'), // Action
          getByGenre(35, 'movie'), // Comedy
          getByGenre(27, 'movie'), // Horror
          getByGenre(10749, 'movie'), // Romance
          getByGenre(878, 'movie')  // Sci-Fi
        ]);

        setRows([
          { title: 'Popular Movies', items: popular },
          { title: 'Top Rated Movies', items: topRated },
          { title: 'Action Movies', items: action },
          { title: 'Comedy Movies', items: comedy },
          { title: 'Horror Movies', items: horror },
          { title: 'Romantic Movies', items: romance },
          { title: 'Sci-Fi Movies', items: scifi }
        ]);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [user, navigate]);

  const handlePlayTrailer = async (item) => {
    const details = await getDetails('movie', item.id);
    if (details && details.videos) {
      const trailer = getTrailer(details.videos);
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        alert('No trailer available for this movie');
      }
    }
  };

  const handleMoreInfo = (item) => {
    setSelectedItem(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />
      
      <div className="pt-24 pb-16 space-y-8">
        <div className="px-4 md:px-12">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Movies</h1>
          <p className="text-gray-400">Explore our collection of movies</p>
        </div>

        {rows.map((row, index) => (
          <MovieRow
            key={index}
            title={row.title}
            items={row.items}
            onItemClick={handleMoreInfo}
          />
        ))}
      </div>

      {selectedItem && (
        <DetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onPlayTrailer={handlePlayTrailer}
        />
      )}

      {trailerKey && (
        <TrailerPlayer videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
      )}
    </div>
  );
};

export default Movies;
