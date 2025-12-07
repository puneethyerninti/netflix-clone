import axios from 'axios';

const API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];

let currentKeyIndex = 0;

const getApiKey = () => {
  return API_KEYS[currentKeyIndex];
};

const rotateApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  console.log('Rotated to next TMDB API key');
};

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      rotateApiKey();
    }
    return Promise.reject(error);
  }
);

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'original') => {
  if (!path) return '/placeholder-movie.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, {
      params: { api_key: getApiKey() }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

export const getPopular = async (mediaType = 'movie') => {
  try {
    const response = await tmdbApi.get(`/${mediaType}/popular`, {
      params: { api_key: getApiKey() }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular:', error);
    return [];
  }
};

export const getTopRated = async (mediaType = 'movie') => {
  try {
    const response = await tmdbApi.get(`/${mediaType}/top_rated`, {
      params: { api_key: getApiKey() }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top rated:', error);
    return [];
  }
};

export const getByGenre = async (genreId, mediaType = 'movie') => {
  try {
    const response = await tmdbApi.get(`/discover/${mediaType}`, {
      params: {
        api_key: getApiKey(),
        with_genres: genreId
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching by genre:', error);
    return [];
  }
};

export const getDetails = async (mediaType, id) => {
  try {
    const response = await tmdbApi.get(`/${mediaType}/${id}`, {
      params: {
        api_key: getApiKey(),
        append_to_response: 'videos,credits,similar'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
};

export const searchMulti = async (query) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        api_key: getApiKey(),
        query: query
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
};

export const getTrailer = (videos) => {
  if (!videos || !videos.results) return null;
  
  const trailer = videos.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer || videos.results.find((video) => video.site === 'YouTube');
};
