import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';

const MovieRow = ({ title, items, onItemClick }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rowRef = useRef(null);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const ref = rowRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, [items]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="px-4 md:px-12 mb-8 group">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>
        )}

        {/* Movies Container */}
        <div
          ref={rowRef}
          className="flex space-x-2 overflow-x-scroll scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className="flex-none w-48 md:w-64 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-20"
            >
              <img
                src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')}
                alt={item.title || item.name}
                className="w-full h-28 md:h-36 object-cover rounded"
                loading="lazy"
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

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
