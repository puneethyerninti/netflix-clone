import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DetailsModal from '../components/DetailsModal';
import TrailerPlayer from '../components/TrailerPlayer';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, getDetails, getTrailer } from '../services/tmdb';

const MyList = () => {
  const { user, getWatchlist } = useAuth();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWatchlist();
  }, [user, navigate]);

  const loadWatchlist = () => {
    const list = getWatchlist();
    setWatchlist(list);
  };

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

  const handleItemRemoved = () => {
    // Reload watchlist after item is removed
    loadWatchlist();
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />
      
      <div className="pt-24 px-4 md:px-12 pb-16">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">My List</h1>
        
        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">Your list is empty</p>
            <p className="text-gray-500">Add titles to your list to watch them later</p>
            <button
              onClick={() => navigate('/browse')}
              className="mt-8 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-white/80 transition-all"
            >
              Browse Content
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {watchlist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMoreInfo(item)}
                className="cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <img
                  src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')}
                  alt={item.title || item.name}
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x281/1a1a1a/666666?text=No+Image';
                  }}
                />
                <h3 className="text-white text-sm mt-2 truncate">
                  {item.title || item.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <DetailsModal
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            handleItemRemoved();
          }}
          onPlayTrailer={handlePlayTrailer}
        />
      )}

      {trailerKey && (
        <TrailerPlayer videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
      )}
    </div>
  );
};

export default MyList;
