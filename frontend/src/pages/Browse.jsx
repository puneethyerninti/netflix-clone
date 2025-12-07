import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import DetailsModal from '../components/DetailsModal';
import TrailerPlayer from '../components/TrailerPlayer';
import { useAuth } from '../context/AuthContext';
import {
  getTrending,
  getPopular,
  getTopRated,
  getByGenre,
  getDetails,
  getTrailer
} from '../services/tmdb';

const Browse = () => {
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

    const fetchContent = async () => {
      setLoading(true);
      try {
        const [trending, popularMovies, popularTV, topRatedMovies, actionMovies, comedyMovies] =
          await Promise.all([
            getTrending('all', 'week'),
            getPopular('movie'),
            getPopular('tv'),
            getTopRated('movie'),
            getByGenre(28, 'movie'), // Action
            getByGenre(35, 'movie')  // Comedy
          ]);

        setRows([
          { title: 'Trending Now', items: trending },
          { title: 'Popular Movies', items: popularMovies },
          { title: 'Popular TV Shows', items: popularTV },
          { title: 'Top Rated Movies', items: topRatedMovies },
          { title: 'Action Movies', items: actionMovies },
          { title: 'Comedy Movies', items: comedyMovies }
        ]);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [user, navigate]);

  const handlePlayTrailer = async (item) => {
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    const details = await getDetails(mediaType, item.id);
    if (details && details.videos) {
      const trailer = getTrailer(details.videos);
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        alert('No trailer available for this title');
      }
    }
  };

  const handleMoreInfo = (item) => {
    setSelectedItem(item);
  };

  const handleSearch = (query) => {
    // Search functionality will be handled in Search page
    console.log('Search query:', query);
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
      <Header onSearch={handleSearch} />
      
      <HeroBanner onPlayTrailer={handlePlayTrailer} onMoreInfo={handleMoreInfo} />

      <div className="relative -mt-32 z-10 space-y-8 pb-16">
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

export default Browse;
