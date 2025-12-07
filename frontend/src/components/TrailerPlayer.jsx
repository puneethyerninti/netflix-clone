import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const TrailerPlayer = ({ videoKey, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!videoKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/80 rounded-full p-3 hover:bg-black transition-colors"
      >
        <X className="w-8 h-8 text-white" />
      </button>

      {/* YouTube Player */}
      <div className="w-full h-full max-w-7xl max-h-screen p-4 md:p-8">
        <iframe
          className="w-full h-full rounded"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
          title="Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TrailerPlayer;
