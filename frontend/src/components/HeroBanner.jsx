import React, { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { getImageUrl, getTrending } from '../services/tmdb';

const HeroBanner = ({ onPlayTrailer, onMoreInfo }) => {
  const [featured, setFeatured] = useState(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const trending = await getTrending('movie', 'week');
      if (trending.length > 0) {
        setFeatured(trending[0]);
      }
    };
    fetchFeatured();
  }, []);

  if (!featured) return null;

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(featured.backdrop_path, 'original')}
          alt={featured.title || featured.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="px-4 md:px-12 max-w-2xl space-y-4 mb-32">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {featured.title || featured.name}
          </h1>

          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-500 font-semibold">
              {Math.round(featured.vote_average * 10)}% Match
            </span>
            <span className="text-gray-300">
              {featured.release_date?.split('-')[0] || featured.first_air_date?.split('-')[0]}
            </span>
            {featured.adult && (
              <span className="border border-gray-400 px-2 py-0.5 text-gray-300">18+</span>
            )}
          </div>

          <p className="text-white text-lg md:text-xl font-light leading-relaxed">
            {truncate(featured.overview, 200)}
          </p>

          {/* Buttons */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={() => onPlayTrailer(featured)}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-white/80 transition-all transform hover:scale-105"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Play</span>
            </button>
            <button
              onClick={() => onMoreInfo(featured)}
              className="flex items-center space-x-2 bg-gray-500/70 text-white px-8 py-3 rounded font-semibold hover:bg-gray-500/50 transition-all transform hover:scale-105"
            >
              <Info className="w-6 h-6" />
              <span>More Info</span>
            </button>
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={() => setMuted(!muted)}
          className="absolute bottom-32 right-4 md:right-12 border-2 border-white/60 rounded-full p-2 hover:bg-white/20 transition-colors"
        >
          {muted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
