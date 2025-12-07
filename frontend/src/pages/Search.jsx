import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DetailsModal from '../components/DetailsModal';
import TrailerPlayer from '../components/TrailerPlayer';
import { useAuth } from '../context/AuthContext';
import { searchMulti, getImageUrl, getDetails, getTrailer } from '../services/tmdb';

const Search = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setQuery(searchQuery);
    try {
      const data = await searchMulti(searchQuery);
      setResults(data.filter(item => item.media_type === 'movie' || item.media_type === 'tv'));
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header onSearch={handleSearch} />
      
      <div className="pt-24 px-4 md:px-12 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-white text-2xl">Searching...</div>
          </div>
        ) : results.length > 0 ? (
          <>
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-8">
              Search results for "{query}"
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map((item) => (
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
                  <p className="text-gray-400 text-xs">
                    {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Search for movies and TV shows</p>
          </div>
        )}
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

export default Search;
