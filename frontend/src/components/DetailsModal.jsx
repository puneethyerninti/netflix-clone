import React, { useState, useEffect } from 'react';
import { X, Play, Plus, Check, ThumbsUp } from 'lucide-react';
import { getDetails, getImageUrl, getTrailer } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';

const DetailsModal = ({ item, onClose, onPlayTrailer }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const inWatchlist = isInWatchlist(item.id);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getDetails(mediaType, item.id);
      setDetails(data);
      setLoading(false);
    };
    fetchDetails();
  }, [item.id, mediaType]);

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({ ...item, media_type: mediaType });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!details) return null;

  const trailer = getTrailer(details.videos);
  const cast = details.credits?.cast?.slice(0, 6) || [];
  const similar = details.similar?.results?.slice(0, 6) || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-[#181818] rounded-lg max-w-4xl w-full overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-[#181818] rounded-full p-2 hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Hero Section */}
          <div className="relative">
            <img
              src={getImageUrl(details.backdrop_path, 'w1280')}
              alt={details.title || details.name}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1280x720/1a1a1a/666666?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
            
            {/* Title and Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                {details.title || details.name}
              </h2>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onPlayTrailer(item)}
                  className="flex items-center space-x-2 bg-white text-black px-8 py-2 rounded font-semibold hover:bg-white/80 transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play</span>
                </button>
                
                <button
                  onClick={handleWatchlist}
                  className="bg-gray-800/80 border-2 border-gray-600 rounded-full p-2 hover:border-white transition-colors"
                  title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
                >
                  {inWatchlist ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-white" />
                  )}
                </button>
                
                <button className="bg-gray-800/80 border-2 border-gray-600 rounded-full p-2 hover:border-white transition-colors">
                  <ThumbsUp className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-8 space-y-6">
            {/* Info Row */}
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-green-500 font-semibold">
                {Math.round(details.vote_average * 10)}% Match
              </span>
              <span className="text-gray-300">
                {details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0]}
              </span>
              {details.runtime && (
                <span className="text-gray-300">{details.runtime} min</span>
              )}
              {details.number_of_seasons && (
                <span className="text-gray-300">{details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}</span>
              )}
            </div>

            {/* Overview */}
            <p className="text-white text-base leading-relaxed">
              {details.overview}
            </p>

            {/* Genres */}
            {details.genres && details.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h3 className="text-white text-lg font-semibold mb-3">Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cast.map((person) => (
                    <div key={person.id} className="flex items-center space-x-3">
                      <img
                        src={
                          person.profile_path
                            ? getImageUrl(person.profile_path, 'w185')
                            : 'https://via.placeholder.com/185x278/1a1a1a/666666?text=No+Image'
                        }
                        alt={person.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{person.name}</p>
                        <p className="text-gray-400 text-xs">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar */}
            {similar.length > 0 && (
              <div>
                <h3 className="text-white text-lg font-semibold mb-3">More Like This</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {similar.map((item) => (
                    <div key={item.id} className="cursor-pointer group">
                      <img
                        src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')}
                        alt={item.title || item.name}
                        className="w-full h-32 object-cover rounded group-hover:ring-2 ring-white transition-all"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/500x281/1a1a1a/666666?text=No+Image';
                        }}
                      />
                      <p className="text-white text-sm mt-2 truncate">
                        {item.title || item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
