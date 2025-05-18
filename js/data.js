/**
 * Data handling module for XoMusic
 * Responsible for fetching and managing application data
 */

// API endpoints
const API_ENDPOINTS = {
  ALL_SONGS:
    "https://raw.githubusercontent.com/urlinq/xomusic/refs/heads/main/allsongs.json",
  DISCOVER_SONGS:
    "https://raw.githubusercontent.com/urlinq/xomusic/refs/heads/main/discover-songs.json",
  FEATURED_ALBUMS:
    "https://raw.githubusercontent.com/urlinq/xomusic/refs/heads/main/featured-albums.json",
  ARTISTS:
    "https://raw.githubusercontent.com/urlinq/xomusic/refs/heads/main/artists.json",
};

// Cache for fetched data
let cachedData = {
  allSongs: null,
  discoverSongs: null,
  featuredAlbums: null,
  artists: null,
};

// Network error handler
function handleNetworkError(error, operation) {
  console.error(`Network error during ${operation}:`, error);

  // Create error notification element
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white rounded-lg shadow-lg z-50 flex items-center p-3 px-4 animate-fade-in";

  // Different messages based on error type
  let errorMessage = "Connection lost. Please check your internet connection.";
  if (error.message && error.message.includes("timeout")) {
    errorMessage = "Request timed out. Server might be busy.";
  } else if (error.status === 403) {
    errorMessage =
      "Access denied. You don't have permission to access this resource.";
  } else if (error.status === 404) {
    errorMessage = "Resource not found. Please try again later.";
  } else if (error.status >= 500) {
    errorMessage = "Server error. Our team has been notified.";
  }

  notification.innerHTML = `
    <i class='bx bx-wifi-off text-xl mr-2'></i>
    <p>${errorMessage}</p>
  `;

  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.classList.add("animate-fade-out");
    setTimeout(() => notification.remove(), 500);
  }, 5000);

  return null;
}

/**
 * Monitor network connection and show/hide network error popup
 */
let networkErrorPopup = null;

function showNetworkErrorPopup() {
  // Only create popup if it doesn't exist
  if (!networkErrorPopup) {
    networkErrorPopup = document.createElement("div");
    networkErrorPopup.className = "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in";
    networkErrorPopup.id = "networkErrorPopup";
    
    networkErrorPopup.innerHTML = `
      <div class="bg-dark-lighter max-w-md w-[90%] rounded-xl shadow-2xl p-6 mx-4 transform transition-all">
        <div class="flex items-center justify-center mb-5">
          <div class="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
            <i class='bx bx-wifi-off text-4xl text-red-500'></i>
          </div>
        </div>
        <h3 class="text-xl font-bold text-center mb-2">Network Error</h3>
        <p class="text-gray-300 text-center mb-5">
          Your internet connection appears to be offline. Please check your connection and try again.
        </p>
        <div class="flex justify-center">
          <button id="retryConnectionBtn" class="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center">
            <i class='bx bx-refresh mr-2'></i>
            Retry Connection
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(networkErrorPopup);
    
    // Add retry button functionality
    document.getElementById('retryConnectionBtn').addEventListener('click', () => {
      window.location.reload();
    });
  } else {
    networkErrorPopup.classList.remove('hidden');
  }
}

function hideNetworkErrorPopup() {
  if (networkErrorPopup) {
    networkErrorPopup.classList.add('animate-fade-out');
    setTimeout(() => {
      networkErrorPopup.classList.add('hidden');
      networkErrorPopup.classList.remove('animate-fade-out');
    }, 500);
  }
}

// Setup network connection monitoring
window.addEventListener('load', () => {
  // Check connection status initially
  if (!navigator.onLine) {
    showNetworkErrorPopup();
  }
  
  // Monitor connection changes
  window.addEventListener('online', () => {
    hideNetworkErrorPopup();
  });
  
  window.addEventListener('offline', () => {
    showNetworkErrorPopup();
  });
});

/**
 * Fetch data from an API endpoint
 * @param {string} url - The API endpoint URL
 * @param {string} operation - The operation being performed
 * @returns {Promise<Array>} - The fetched data or null if an error occurred
 */
async function fetchData(url, operation) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw { status: response.status, message: response.statusText };
    }
    return await response.json();
  } catch (error) {
    return handleNetworkError(error, operation);
  }
}

/**
 * Fetch all songs from the API
 * @returns {Promise<Array>} - All songs
 */
export async function getAllSongs() {
  if (!cachedData.allSongs) {
    cachedData.allSongs =
      (await fetchData(API_ENDPOINTS.ALL_SONGS, "fetching songs")) || [];
  }
  return cachedData.allSongs;
}

/**
 * Get a random selection of songs for the discover section
 * @returns {Promise<Array>} - Discover songs
 */
export async function getDiscoverSongs() {
  if (!cachedData.discoverSongs) {
    const songs =
      (await fetchData(
        API_ENDPOINTS.DISCOVER_SONGS,
        "fetching discover songs"
      )) || [];
    // Randomize songs for each visit
    cachedData.discoverSongs = shuffleArray(songs).slice(0, 200);
  }
  return cachedData.discoverSongs;
}

/**
 * Get featured albums
 * @returns {Promise<Array>} - Featured albums
 */
export async function getFeaturedAlbums() {
  if (!cachedData.featuredAlbums) {
    const albums =
      (await fetchData(API_ENDPOINTS.FEATURED_ALBUMS, "fetching albums")) || [];
    // Sort by id in descending order to show newest first
    cachedData.featuredAlbums = albums.sort(
      (a, b) => parseInt(b.id) - parseInt(a.id)
    );
  }
  return cachedData.featuredAlbums;
}

/**
 * Get a specific number of albums
 * @param {number} limit - Number of albums to return
 * @param {number} offset - Starting index
 * @returns {Promise<Array>} - Limited albums
 */
export async function getLimitedAlbums(limit = 12, offset = 0) {
  const albums = await getFeaturedAlbums();
  return albums.slice(offset, offset + limit);
}

/**
 * Get all artists
 * @returns {Promise<Array>} - All artists
 */
export async function getArtists() {
  if (!cachedData.artists) {
    cachedData.artists =
      (await fetchData(API_ENDPOINTS.ARTISTS, "fetching artists")) || [];
  }
  return cachedData.artists;
}

/**
 * Get a specific album by ID
 * @param {string} id - Album ID
 * @returns {Promise<Object|null>} - Album data or null if not found
 */
export async function getAlbumById(id) {
  const albums = await getFeaturedAlbums();
  return albums.find((album) => album.id === id) || null;
}

/**
 * Get a specific artist by ID
 * @param {string} id - Artist ID
 * @returns {Promise<Object|null>} - Artist data or null if not found
 */
export async function getArtistById(id) {
  const artists = await getArtists();
  return artists.find((artist) => artist.id === id) || null;
}

/**
 * Get songs by album name
 * @param {string} albumName - Album name
 * @returns {Promise<Array>} - Songs in the album
 */
export async function getSongsByAlbum(albumName) {
  const allSongs = await getAllSongs();
  return allSongs.filter((song) => {
    if (!song.album) return false;
    const albumNames = song.album.split(", ");
    return albumNames.includes(albumName);
  });
}

/**
 * Get songs by artist name
 * @param {string} artistName - Artist name
 * @returns {Promise<Array>} - Songs by the artist
 */
export async function getSongsByArtist(artistName) {
  const allSongs = await getAllSongs();
  return allSongs.filter((song) => {
    if (!song.artist) return false;
    const artistNames = song.artist.split(", ");
    return artistNames.includes(artistName);
  });
}

/**
 * Search songs, albums, and artists
 * @param {string} query - Search query
 * @returns {Promise<Object>} - Search results
 */
export async function searchMusic(query) {
  if (!query.trim()) {
    return { songs: [], albums: [], artists: [] };
  }

  query = query.toLowerCase();

  const [allSongs, allAlbums, allArtists] = await Promise.all([
    getAllSongs(),
    getFeaturedAlbums(),
    getArtists(),
  ]);

  const songs = allSongs.filter(
    (song) =>
      song.title?.toLowerCase().includes(query) ||
      song.artist?.toLowerCase().includes(query) ||
      song.album?.toLowerCase().includes(query)
  );

  const albums = allAlbums.filter(
    (album) =>
      album.name?.toLowerCase().includes(query) ||
      album.creator?.toLowerCase().includes(query)
  );

  const artists = allArtists.filter((artist) =>
    artist.name?.toLowerCase().includes(query)
  );

  return { songs, albums, artists };
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Get default cover art URL
 * @returns {string} - URL for default cover art
 */
export function getDefaultCoverArt() {
  return "https://i.pinimg.com/736x/8b/75/d1/8b75d1a1e83953fc0fb814c2104e4823.jpg";
}

/**
 * Get default profile picture URL
 * @returns {string} - URL for default profile picture
 */
export function getDefaultProfilePic() {
  return "https://i.pinimg.com/736x/d3/1a/67/d31a6726c908a3e5e195d1e0b20ece4c.jpg";
}

/**
 * Refresh discover songs data
 * This generates a new random set of songs when user revisits
 */
export function refreshDiscoverSongs() {
  cachedData.discoverSongs = null;
  return getDiscoverSongs();
}
