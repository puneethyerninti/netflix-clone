import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MovieRow from '../components/MovieRow';
import DetailsModal from '../components/DetailsModal';
import TrailerPlayer from '../components/TrailerPlayer';
import { useAuth } from '../context/AuthContext';
import { getPopular, getTopRated, getByGenre, getDetails, getTrailer } from '../services/tmdb';

const TVShows = () => {
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

    const fetchTVShows = async () => {
      setLoading(true);
      try {
        const [popular, topRated, action, comedy, drama, crime, scifi] = await Promise.all([
          getPopular('tv'),
          getTopRated('tv'),
          getByGenre(10759, 'tv'), // Action & Adventure
          getByGenre(35, 'tv'),    // Comedy
          getByGenre(18, 'tv'),    // Drama
          getByGenre(80, 'tv'),    // Crime
          getByGenre(10765, 'tv')  // Sci-Fi & Fantasy
        ]);

        setRows([
          { title: 'Popular TV Shows', items: popular },
          { title: 'Top Rated TV Shows', items: topRated },
          { title: 'Action & Adventure', items: action },
          { title: 'Comedy Shows', items: comedy },
          { title: 'Drama Shows', items: drama },
          { title: 'Crime Shows', items: crime },
          { title: 'Sci-Fi & Fantasy', items: scifi }
        ]);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [user, navigate]);

  const handlePlayTrailer = async (item) => {
    const details = await getDetails('tv', item.id);
    if (details && details.videos) {
      const trailer = getTrailer(details.videos);
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        alert('No trailer available for this show');
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
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">TV Shows</h1>
          <p className="text-gray-400">Explore our collection of TV shows</p>
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

export default TVShows;
