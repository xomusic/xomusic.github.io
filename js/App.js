/**
 * Main Application for XoMusic
 * Handles UI interactions, audio playback, and navigation
 */

import {
  getAllSongs,
  getDiscoverSongs,
  getFeaturedAlbums,
  getArtists,
  getAlbumById,
  getArtistById,
  getSongsByAlbum,
  getSongsByArtist,
  searchMusic,
  refreshDiscoverSongs,
  getLimitedAlbums,
  getDefaultCoverArt,
  getDefaultProfilePic,
} from "./data.js";

import { initializeApp as initFirebase } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  browserLocalPersistence,
  setPersistence,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCev28yOKcJfzPdtFDMcoyxRAVeCKfbvU4",
  authDomain: "xomusicapp.firebaseapp.com",
  projectId: "xomusicapp",
  storageBucket: "xomusicapp.firebasestorage.app",
  messagingSenderId: "912280091259",
  appId: "1:912280091259:web:ec3dd5532815585c4580de",
  measurementId: "G-NCXN2RWXDE",
};

// Initialize Firebase
const firebaseApp = initFirebase(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

setPersistence(auth, browserLocalPersistence) // Enable local persistence
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });
const googleProvider = new GoogleAuthProvider();

// DOM Elements
// Loading screen
const loadingScreen = document.getElementById("loadingScreen");

// Share modal elements
const shareModal = document.getElementById("shareModal");
const closeShareModal = document.getElementById("closeShareModal");
const shareImage = document.getElementById("shareImage");
const shareTitle = document.getElementById("shareTitle");
const shareSubtitle = document.getElementById("shareSubtitle");
const shareMessage = document.getElementById("shareMessage");
const shareAction = document.getElementById("shareAction");
const copyShareLink = document.getElementById("copyShareLink");
const shareAlbum = document.getElementById("shareAlbum");
const shareArtist = document.getElementById("shareArtist");

// Auth screens
const loginScreen = document.getElementById("loginScreen");
const signupScreen = document.getElementById("signupScreen");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const googleSignIn = document.getElementById("googleSignIn");

// Main app elements
const appContainer = document.getElementById("app");
const homeScreen = document.getElementById("homeScreen");
const albumScreen = document.getElementById("albumScreen");
const artistScreen = document.getElementById("artistScreen");
const searchScreen = document.getElementById("searchScreen");
const playlistScreen = document.getElementById("playlistScreen");
const settingsScreen = document.getElementById("settingsScreen");
const profileScreen = document.getElementById("profileScreen");
const playerScreen = document.getElementById("playerScreen");
const miniPlayer = document.getElementById("miniPlayer");

// Navigation buttons
const homeBtn = document.getElementById("homeBtn");
const searchBtn = document.getElementById("searchBtn");
const playlistBtn = document.getElementById("playlistBtn");
const settingsBtn = document.getElementById("settingsBtn");
const backFromAlbum = document.getElementById("backFromAlbum");
const backFromArtist = document.getElementById("backFromArtist");
const backFromSearch = document.getElementById("backFromSearch");
const backFromPlaylist = document.getElementById("backFromPlaylist");
const backFromSettings = document.getElementById("backFromSettings");
const backFromProfile = document.getElementById("backFromProfile");
const backFromPlayer = document.getElementById("backFromPlayer");

// Home screen elements
const userProfilePic = document.getElementById("userProfilePic");
const userName = document.getElementById("userName");
const userHandle = document.getElementById("userHandle");
const userProfileArea = document.getElementById("userProfileArea");
const featuredAlbums = document.getElementById("featuredAlbums");
const popularArtists = document.getElementById("popularArtists");
const discoverSongs = document.getElementById("discoverSongs");

// Audio player elements
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover").querySelector("img");
const miniPlay = document.getElementById("miniPlay");
const miniNext = document.getElementById("miniNext");
const miniPrev = document.getElementById("miniPrev");
const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");
const miniCover = document.getElementById("miniCover");
const audioVisualizer = document.getElementById("audioVisualizer");
const miniPlayerInfo = document.getElementById("miniPlayerInfo");

// Timer elements
const timerBtn = document.getElementById("timerBtn");
const sleepTimer = document.getElementById("sleepTimer");
const timerOptions = document.querySelectorAll(".timer-option");
const cancelTimer = document.getElementById("cancelTimer");
const closeTimerModal = document.getElementById("closeTimerModal");

// Search elements
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const noResults = document.getElementById("noResults");

// Playlist elements
const allPlaylists = document.getElementById("allPlaylists");
const loadMorePlaylists = document.getElementById("loadMorePlaylists");

// Settings elements
const themeToggle = document.getElementById("themeToggle");
const logoutBtn = document.getElementById("logoutBtn");
const logoutBtnProfile = document.getElementById("logoutBtnProfile");

// Profile elements
const profilePic = document.getElementById("profilePic");
const profileName = document.getElementById("profileName");
const profileHandle = document.getElementById("profileHandle");
const userBio = document.getElementById("userBio");
const editBioBtn = document.getElementById("editBioBtn");
const editBioArea = document.getElementById("editBioArea");
const bioInput = document.getElementById("bioInput");
const saveBioBtn = document.getElementById("saveBioBtn");

// Favorites elements
const favSongsTab = document.getElementById("favSongsTab");
const favAlbumsTab = document.getElementById("favAlbumsTab");
const favArtistsTab = document.getElementById("favArtistsTab");
const favSongsSection = document.getElementById("favSongsSection");
const favAlbumsSection = document.getElementById("favAlbumsSection");
const favArtistsSection = document.getElementById("favArtistsSection");
const favSongsList = document.getElementById("favSongsList");
const favAlbumsList = document.getElementById("favAlbumsList");
const favArtistsList = document.getElementById("favArtistsList");
const favSongsCount = document.getElementById("favSongsCount");
const favAlbumsCount = document.getElementById("favAlbumsCount");
const favArtistsCount = document.getElementById("favArtistsCount");

// Application state
const appState = {
  currentSong: null,
  currentPlaylist: [],
  currentPlaylistIndex: 0,
  currentScreen: "home",
  screenHistory: ["home"], // Track screen navigation history
  currentUser: null,
  isPlaying: false,
  isShuffle: false,
  isRepeatOne: false,
  sleepTimerId: null,
  playlistOffset: 0,
  playlistLimit: 12,
  favorites: {
    songs: [],
    albums: [],
    artists: []
  },
  updateUserProfile: function (user) {
    this.currentUser = user;

    if (user) {
      // Update user info in UI
      userName.textContent = user.displayName || "User";
      userHandle.textContent = user.email
        ? `@${user.email.split("@")[0]}`
        : "@user";
      userProfilePic.src = user.photoURL || getDefaultProfilePic();

      // Update profile screen
      profilePic.src = user.photoURL || getDefaultProfilePic();
      profileName.textContent = user.displayName || "User";
      profileHandle.textContent = user.email
        ? `@${user.email.split("@")[0]}`
        : "@user";
        
      // Load favorites from localStorage
      this.loadFavorites();
    }
  },
  loadFavorites: function() {
    // Only load if we have a user
    if (!this.currentUser) return;
    
    const userId = this.currentUser.uid;
    
    // Get user's Firestore document reference
    const userDoc = doc(db, "users", userId);
    
    // Get user document from Firestore
    getDoc(userDoc)
      .then((docSnap) => {
        if (docSnap.exists()) {
          // Get favorites from Firestore document
          const userData = docSnap.data();
          
          // Update favorites in app state
          if (userData.favoriteSongs) {
            this.favorites.songs = userData.favoriteSongs;
          }
          
          if (userData.favoriteAlbums) {
            this.favorites.albums = userData.favoriteAlbums;
          }
          
          if (userData.favoriteArtists) {
            this.favorites.artists = userData.favoriteArtists;
          }
          
          // Update UI counters
          this.updateFavoriteCounts();
        } else {
          console.log("No favorites found, creating new document");
          // Create document for new user
          setDoc(userDoc, {
            favoriteSongs: [],
            favoriteAlbums: [],
            favoriteArtists: [],
            createdAt: new Date()
          });
        }
      })
      .catch((error) => {
        console.error("Error loading favorites from Firestore:", error);
        
        // Fallback to localStorage if Firestore fails
        const savedFavSongs = localStorage.getItem(`fav_songs_${userId}`);
        const savedFavAlbums = localStorage.getItem(`fav_albums_${userId}`);
        const savedFavArtists = localStorage.getItem(`fav_artists_${userId}`);
        
        if (savedFavSongs) {
          this.favorites.songs = JSON.parse(savedFavSongs);
        }
        
        if (savedFavAlbums) {
          this.favorites.albums = JSON.parse(savedFavAlbums);
        }
        
        if (savedFavArtists) {
          this.favorites.artists = JSON.parse(savedFavArtists);
        }
        
        // Update UI counters
        this.updateFavoriteCounts();
      });
  },
  saveFavorites: function() {
    // Only save if we have a user
    if (!this.currentUser) return;
    
    const userId = this.currentUser.uid;
    
    // Get user's Firestore document reference
    const userDoc = doc(db, "users", userId);
    
    // Save favorites to Firestore
    updateDoc(userDoc, {
      favoriteSongs: this.favorites.songs,
      favoriteAlbums: this.favorites.albums,
      favoriteArtists: this.favorites.artists,
      updatedAt: new Date()
    })
    .then(() => {
      console.log("Favorites saved to Firestore");
    })
    .catch((error) => {
      console.error("Error saving favorites to Firestore:", error);
      
      // Fallback to localStorage if Firestore fails
      localStorage.setItem(`fav_songs_${userId}`, JSON.stringify(this.favorites.songs));
      localStorage.setItem(`fav_albums_${userId}`, JSON.stringify(this.favorites.albums));
      localStorage.setItem(`fav_artists_${userId}`, JSON.stringify(this.favorites.artists));
    });
    
    // Update UI counters immediately (don't wait for Firestore)
    this.updateFavoriteCounts();
  },
  updateFavoriteCounts: function() {
    // Update count badges in profile
    favSongsCount.textContent = this.favorites.songs.length;
    favAlbumsCount.textContent = this.favorites.albums.length;
    favArtistsCount.textContent = this.favorites.artists.length;
  },
  toggleFavoriteSong: function(song) {
    // Check if song is already in favorites
    const index = this.favorites.songs.findIndex(s => s.url === song.url);
    
    // Only proceed if we have a user
    if (!this.currentUser) return false;
    
    const userId = this.currentUser.uid;
    const userDoc = doc(db, "users", userId);
    
    if (index === -1) {
      // Add to favorites
      this.favorites.songs.push(song);
      
      // Add to Firestore - alternative approach using arrayUnion
      updateDoc(userDoc, {
        favoriteSongs: arrayUnion(song)
      }).catch(error => {
        console.error("Error adding song to Firestore favorites:", error);
      });
    } else {
      // Get the song to remove
      const songToRemove = this.favorites.songs[index];
      
      // Remove from favorites array
      this.favorites.songs.splice(index, 1);
      
      // Remove from Firestore - alternative approach using arrayRemove
      updateDoc(userDoc, {
        favoriteSongs: arrayRemove(songToRemove)
      }).catch(error => {
        console.error("Error removing song from Firestore favorites:", error);
      });
    }
    
    // Save changes (this will update the entire favorites object as a backup)
    this.saveFavorites();
    
    // Return new favorite status
    return index === -1;
  },
  toggleFavoriteAlbum: function(album) {
    // Check if album is already in favorites
    const index = this.favorites.albums.findIndex(a => a.id === album.id);
    
    // Only proceed if we have a user
    if (!this.currentUser) return false;
    
    const userId = this.currentUser.uid;
    const userDoc = doc(db, "users", userId);
    
    if (index === -1) {
      // Add to favorites
      this.favorites.albums.push(album);
      
      // Add to Firestore
      updateDoc(userDoc, {
        favoriteAlbums: arrayUnion(album)
      }).catch(error => {
        console.error("Error adding album to Firestore favorites:", error);
      });
    } else {
      // Get the album to remove
      const albumToRemove = this.favorites.albums[index];
      
      // Remove from favorites
      this.favorites.albums.splice(index, 1);
      
      // Remove from Firestore
      updateDoc(userDoc, {
        favoriteAlbums: arrayRemove(albumToRemove)
      }).catch(error => {
        console.error("Error removing album from Firestore favorites:", error);
      });
    }
    
    // Save changes
    this.saveFavorites();
    
    // Return new favorite status
    return index === -1;
  },
  toggleFavoriteArtist: function(artist) {
    // Check if artist is already in favorites
    const index = this.favorites.artists.findIndex(a => a.id === artist.id);
    
    // Only proceed if we have a user
    if (!this.currentUser) return false;
    
    const userId = this.currentUser.uid;
    const userDoc = doc(db, "users", userId);
    
    if (index === -1) {
      // Add to favorites
      this.favorites.artists.push(artist);
      
      // Add to Firestore
      updateDoc(userDoc, {
        favoriteArtists: arrayUnion(artist)
      }).catch(error => {
        console.error("Error adding artist to Firestore favorites:", error);
      });
    } else {
      // Get the artist to remove
      const artistToRemove = this.favorites.artists[index];
      
      // Remove from favorites
      this.favorites.artists.splice(index, 1);
      
      // Remove from Firestore
      updateDoc(userDoc, {
        favoriteArtists: arrayRemove(artistToRemove)
      }).catch(error => {
        console.error("Error removing artist from Firestore favorites:", error);
      });
    }
    
    // Save changes
    this.saveFavorites();
    
    // Return new favorite status
    return index === -1;
  },
  isSongFavorite: function(songUrl) {
    return this.favorites.songs.some(song => song.url === songUrl);
  },
  isAlbumFavorite: function(albumId) {
    return this.favorites.albums.some(album => album.id === albumId);
  },
  isArtistFavorite: function(artistId) {
    return this.favorites.artists.some(artist => artist.id === artistId);
  }
};

// Authentication Functions
function setupAuthListeners() {
  // Login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      loginError.textContent = "Email and password are required";
      loginError.classList.remove("hidden");
      return;
    }

    try {
      loginError.classList.add("hidden");
      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Signing in...";
      submitBtn.disabled = true;

      await signInWithEmailAndPassword(auth, email, password);

      // Reset button (though this won't be seen as we'll redirect)
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      console.error("Login error:", error);

      // Reset button
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.textContent = "Sign In";
      submitBtn.disabled = false;

      // Show friendly error message
      let errorMessage = "Failed to sign in. Please check your credentials.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Too many failed login attempts. Please try again later.";
      }

      loginError.textContent = errorMessage;
      loginError.classList.remove("hidden");
    }
  });

  // Signup form submission
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!username || !email || !password) {
      signupError.textContent = "All fields are required";
      signupError.classList.remove("hidden");
      return;
    }

    if (password.length < 6) {
      signupError.textContent = "Password must be at least 6 characters";
      signupError.classList.remove("hidden");
      return;
    }

    try {
      signupError.classList.add("hidden");
      // Show loading state
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Creating account...";
      submitBtn.disabled = true;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with username
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      // Reset button (though this won't be seen as we'll redirect)
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      console.error("Signup error:", error);

      // Reset button
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      submitBtn.textContent = "Sign Up";
      submitBtn.disabled = false;

      // Show friendly error message
      let errorMessage = "Failed to create account.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }

      signupError.textContent = errorMessage;
      signupError.classList.remove("hidden");
    }
  });

  // Google Sign In
  googleSignIn.addEventListener("click", async () => {
    try {
      googleSignIn.disabled = true;
      googleSignIn.innerHTML =
        '<i class="bx bx-loader-alt animate-spin text-xl"></i> Connecting...';

      await signInWithPopup(auth, googleProvider);

      // Reset button (though this won't be seen as we'll redirect)
      googleSignIn.disabled = false;
      googleSignIn.innerHTML =
        '<i class="bx bxl-google text-xl"></i> Sign In with Google';
    } catch (error) {
      console.error("Google sign in error:", error);

      // Reset button
      googleSignIn.disabled = false;
      googleSignIn.innerHTML =
        '<i class="bx bxl-google text-xl"></i> Sign In with Google';

      let errorMessage = "Failed to sign in with Google";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled";
      }

      loginError.textContent = errorMessage;
      loginError.classList.remove("hidden");
    }
  });

  // Authentication state change listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      loginScreen.classList.add("hidden");
      signupScreen.classList.add("hidden");
      appContainer.classList.remove("hidden");

      // Update user profile in app state
      appState.updateUserProfile(user);
      
      // Check if the user document exists in Firestore
      const userDoc = doc(db, "users", user.uid);
      getDoc(userDoc).then((docSnap) => {
        if (!docSnap.exists()) {
          // Attempt to migrate any existing localStorage favorites
          const migratedData = migrateLocalStorageToFirestore(user.uid);
          
          // Create a new document for the user if none exists
          setDoc(userDoc, {
            displayName: user.displayName || "User",
            email: user.email,
            photoURL: user.photoURL || getDefaultProfilePic(),
            favoriteSongs: migratedData.songs || [],
            favoriteAlbums: migratedData.albums || [],
            favoriteArtists: migratedData.artists || [],
            createdAt: new Date()
          }).then(() => {
            console.log("New user document created in Firestore with migrated data");
          }).catch(error => {
            console.error("Error creating user document:", error);
          });
        }
      }).catch(error => {
        console.error("Error checking user document:", error);
      });

      // Initialize app
      initApp();
      
      // Hide loading screen with fade out animation
      loadingScreen.classList.add("opacity-0");
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
      }, 500);
    } else {
      // User is signed out
      appContainer.classList.add("hidden");
      loginScreen.classList.remove("hidden");
      loginScreen.classList.add("flex");
      signupScreen.classList.add("hidden");

      // Reset forms and clear any error messages
      loginForm.reset();
      signupForm.reset();
      loginError.classList.add("hidden");
      signupError.classList.add("hidden");

      // Stop audio playback if running
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.src = "";
      }

      // Clear any cached user data
      appState.currentPlaylist = [];
      appState.currentSongIndex = 0;
      appState.isPlaying = false;
      
      // Clear favorites
      appState.favorites = {
        songs: [],
        albums: [],
        artists: []
      };
      
      // Hide loading screen with fade out animation
      loadingScreen.classList.add("opacity-0");
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
      }, 500);
    }
  });

  // Toggle between login and signup
  showSignup.addEventListener("click", () => {
    loginScreen.classList.add("hidden");
    signupScreen.classList.remove("hidden");
    signupScreen.classList.add("flex");
  });

  showLogin.addEventListener("click", () => {
    signupScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    loginScreen.classList.add("flex");
  });

  // Logout
  logoutBtn.addEventListener("click", () => signOut(auth));
  logoutBtnProfile.addEventListener("click", () => signOut(auth));
}

// UI Initialization Functions
async function initApp() {
  try {
    // Check Firestore connectivity
    try {
      // Attempt to access Firestore with a simple query
      const testCollection = collection(db, "app_status");
      await getDoc(doc(testCollection, "status")).catch(() => {
        console.log("Firestore status document doesn't exist, but connection works");
      });
      console.log("Firestore connection successful");
    } catch (firestoreError) {
      console.error("Firestore connection error:", firestoreError);
      showToast("Warning: Cloud sync might be unavailable", 5000);
    }
    
    // Setup navigation and UI while data is loading
    setupNavigationListeners();
    setupAudioPlayer();
    setupUIInteractions();

    // Load home screen data in parallel
    const loadingPromises = [
      loadFeaturedAlbums(),
      loadPopularArtists(),
      loadDiscoverSongs(),
    ];

    // Wait for all data to load
    await Promise.all(loadingPromises);

    // Remove loading skeletons if needed
    document.querySelectorAll(".skeleton-loader").forEach((skeleton) => {
      skeleton.remove();
    });

    console.log("App initialized successfully");
  } catch (error) {
    console.error("Error initializing app:", error);

    // Create a more professional network error banner
    const errorBanner = document.createElement("div");
    errorBanner.className =
      "fixed top-0 left-0 right-0 bg-red-600 text-white p-4 flex items-center justify-center z-50 shadow-lg";
    errorBanner.innerHTML = `
      <div class="flex items-center max-w-screen-lg w-full">
        <i class='bx bx-wifi-off text-2xl mr-3'></i>
        <div class="flex-grow">
          <h3 class="font-bold text-lg">Connection Lost</h3>
          <p>We're having trouble connecting to our servers. Please check your network connection and try again.</p>
        </div>
        <button class="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 ml-4 transition-all">Retry</button>
      </div>
    `;

    document.body.appendChild(errorBanner);

    // Add retry functionality
    errorBanner.querySelector("button").addEventListener("click", () => {
      errorBanner.remove();
      window.location.reload();
    });
  }
}

// Home Screen Data Loading
async function loadFeaturedAlbums() {
  try {
    const albums = await getFeaturedAlbums();
    const latestAlbums = albums.slice(0, 6); // Show 6 albums

    featuredAlbums.innerHTML = "";

    latestAlbums.forEach((album) => {
      const albumCover = album.profilePic || getDefaultCoverArt();

      const albumEl = document.createElement("div");
      albumEl.className = "album-card transition-all duration-300";
      albumEl.dataset.albumId = album.id;
      albumEl.innerHTML = `
        <div class="aspect-square overflow-hidden">
          <img src="${albumCover}" alt="${album.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-sm truncate">${album.name}</h3>
          <p class="text-gray-400 text-xs truncate">${album.creator}</p>
        </div>
      `;

      albumEl.addEventListener("click", () => {
        openAlbumScreen(album.id);
      });

      featuredAlbums.appendChild(albumEl);
    });
  } catch (error) {
    console.error("Error loading featured albums:", error);
    featuredAlbums.innerHTML =
      '<div class="py-6 text-center"><i class="bx bx-error-circle text-red-500 text-3xl mb-2"></i><p class="text-red-500">Failed to load albums</p></div>';
  }
}

async function loadPopularArtists() {
  try {
    const artists = await getArtists();

    popularArtists.innerHTML = "";

    artists.forEach((artist) => {
      const artistPic = artist.profilePic || getDefaultProfilePic();
      const isVerified = artist.verified === "yes";

      const artistEl = document.createElement("div");
      artistEl.className =
        "artist-card min-w-[100px] flex flex-col items-center";
      artistEl.dataset.artistId = artist.id;

      artistEl.innerHTML = `
        <div class="relative mb-2">
          <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 hover:border-primary transition-all duration-300 shadow-md">
            <img src="${artistPic}" alt="${
        artist.name
      }" class="w-full h-full object-cover">
          </div>
          ${
            isVerified
              ? `
            <div class="absolute bottom-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs border-2 border-dark shadow-md">
              <i class='bx bxs-check-circle'></i>
            </div>
          `
              : ""
          }
        </div>
        <p class="text-center text-sm font-medium w-20 truncate">${
          artist.name
        }</p>
      `;

      artistEl.addEventListener("click", () => {
        openArtistScreen(artist.id);
      });

      popularArtists.appendChild(artistEl);
    });

    // Setup horizontal scroll touch event
    setupHorizontalScroll(popularArtists);
  } catch (error) {
    console.error("Error loading popular artists:", error);
    popularArtists.innerHTML =
      '<div class="py-6 text-center"><i class="bx bx-error-circle text-red-500 text-3xl mb-2"></i><p class="text-red-500">Failed to load artists</p></div>';
  }
}

async function loadDiscoverSongs() {
  try {
    const songs = await refreshDiscoverSongs();

    discoverSongs.innerHTML = "";

    songs.forEach((song, index) => {
      const songCover = song.coverArt || getDefaultCoverArt();

      const songEl = document.createElement("div");
      songEl.className =
        "song-card bg-dark-lighter hover:bg-secondary rounded-lg p-3 flex items-center shadow-md transition-all duration-300";
      songEl.dataset.songIndex = index;
      songEl.dataset.source = "discover";

      songEl.innerHTML = `
        <div class="w-14 h-14 rounded-md overflow-hidden mr-3 shadow-md flex-shrink-0">
          <img src="${songCover}" alt="${song.title}" class="w-full h-full object-cover">
        </div>
        <div class="flex-grow overflow-hidden">
          <h3 class="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">${song.title}</h3>
          <p class="text-gray-400 text-xs whitespace-nowrap overflow-hidden text-ellipsis">${song.artist}</p>
        </div>
        <div class="ml-3 flex items-center">
          <div class="audio-visualizer hidden mr-2" data-song-index="${index}">
            <span class="bg-primary"></span>
            <span class="bg-primary"></span>
            <span class="bg-primary"></span>
            <span class="bg-primary"></span>
            <span class="bg-primary"></span>
          </div>
          <i class='bx bx-play-circle text-xl text-gray-400'></i>
        </div>
      `;

      songEl.addEventListener("click", () => {
        playDiscoverSong(index);
      });

      discoverSongs.appendChild(songEl);
    });
  } catch (error) {
    console.error("Error loading discover songs:", error);
    discoverSongs.innerHTML =
      '<div class="py-6 text-center"><i class="bx bx-error-circle text-red-500 text-3xl mb-2"></i><p class="text-red-500">Failed to load songs</p></div>';
  }
}

// Navigation Functions
function setupNavigationListeners() {
  // Bottom nav buttons
  homeBtn.addEventListener("click", () => {
    showScreen("home");
  });

  searchBtn.addEventListener("click", () => {
    showScreen("search");
    searchInput.focus();
  });

  playlistBtn.addEventListener("click", () => {
    showScreen("playlist");
    loadPlaylists();
  });

  settingsBtn.addEventListener("click", () => {
    showScreen("settings");
  });

  // Profile button in header
  /*
  if (document.getElementById("profileButton")) {
    document.getElementById("profileButton").addEventListener("click", () => {
      showScreen("profile");
    });
  }
  */

  // User profile area in header
  userProfileArea.addEventListener("click", () => {
    showScreen("profile");
  });

  // Settings to profile navigation
  if (document.getElementById("showProfileBtn")) {
    document.getElementById("showProfileBtn").addEventListener("click", () => {
      showScreen("profile");
    });
  }

  // Back buttons with screen history navigation
  function navigateBack() {
    // Remove current screen from history
    if (appState.screenHistory.length > 0) {
      appState.screenHistory.pop(); // Remove current screen
    }
    
    // Get previous screen or default to home
    const previousScreen = appState.screenHistory.length > 0 ? 
      appState.screenHistory[appState.screenHistory.length - 1] : "home";
    
    // Navigate to previous screen with isBackNavigation flag
    showScreen(previousScreen, true);
  }
  
  backFromAlbum.addEventListener("click", navigateBack);
  backFromArtist.addEventListener("click", navigateBack);
  backFromSearch.addEventListener("click", navigateBack);
  backFromPlaylist.addEventListener("click", navigateBack);
  backFromSettings.addEventListener("click", navigateBack);
  backFromProfile.addEventListener("click", navigateBack);

  // Mini player
  miniPlayerInfo.addEventListener("click", () => {
    // Set initial opacity to 0
    playerScreen.style.opacity = '0';
    
    // Show the player screen
    playerScreen.classList.remove("hidden");
    playerScreen.style.zIndex = '40'; // Ensure proper z-index
    
    // Trigger reflow to ensure transition works
    void playerScreen.offsetWidth;
    
    // Fade in the player screen
    playerScreen.style.opacity = '1';
  });

  // Back from player code
  backFromPlayer.addEventListener("click", () => {
    // First fade out the player
    playerScreen.style.opacity = '0';
    
    // After transition, hide the player
    setTimeout(() => {
      playerScreen.classList.add("hidden");
      playerScreen.style.zIndex = '-10'; // Push it below when hidden
      // Reset opacity for next time
      setTimeout(() => {
        playerScreen.style.opacity = '1';
      }, 50);
    }, 300); // Match the transition duration in CSS
  });
}

function showScreen(screenName, isBackNavigation = false) {
  // Get all screens except player screen (which is handled separately)
  const allScreens = [
    homeScreen, 
    albumScreen, 
    artistScreen, 
    searchScreen, 
    playlistScreen, 
    settingsScreen, 
    profileScreen
  ];

  // First, mark all screens for hiding
  allScreens.forEach(screen => {
    if (!screen.classList.contains("hidden")) {
      screen.style.opacity = "0";
    }
  });

  // Short delay to allow fade out before hiding
  setTimeout(() => {
    // Hide all screens properly
    allScreens.forEach(screen => {
      screen.classList.add("hidden");
      screen.style.zIndex = "-10"; // Ensure hidden screens are truly hidden
    });

    // Reset nav button colors
    homeBtn.classList.remove("text-primary");
    homeBtn.classList.add("text-gray-400");
    searchBtn.classList.remove("text-primary");
    searchBtn.classList.add("text-gray-400");
    playlistBtn.classList.remove("text-primary");
    playlistBtn.classList.add("text-gray-400");
    settingsBtn.classList.remove("text-primary");
    settingsBtn.classList.add("text-gray-400");

    // Update icons to outline version
    homeBtn.querySelector("i").className = "bx bx-home-alt text-2xl";
    searchBtn.querySelector("i").className = "bx bx-search text-2xl";
    playlistBtn.querySelector("i").className = "bx bxs-playlist text-2xl";
    settingsBtn.querySelector("i").className = "bx bx-cog text-2xl";

    // Variable to track the screen that will be visible
    let screenToShow = homeScreen; // Default to home screen

    // Show selected screen and highlight nav button
    switch (screenName) {
      case "home":
        screenToShow = homeScreen;
        homeBtn.classList.remove("text-gray-400");
        homeBtn.classList.add("text-primary");
        homeBtn.querySelector("i").className = "bx bxs-home text-2xl";
        break;
      case "album":
        screenToShow = albumScreen;
        break;
      case "artist":
        screenToShow = artistScreen;
        break;
      case "search":
        screenToShow = searchScreen;
        searchBtn.classList.remove("text-gray-400");
        searchBtn.classList.add("text-primary");
        searchBtn.querySelector("i").className = "bx bxs-search text-2xl";
        break;
      case "playlist":
        screenToShow = playlistScreen;
        playlistBtn.classList.remove("text-gray-400");
        playlistBtn.classList.add("text-primary");
        playlistBtn.querySelector("i").className = "bx bxs-playlist text-2xl";
        break;
      case "settings":
        screenToShow = settingsScreen;
        settingsBtn.classList.remove("text-gray-400");
        settingsBtn.classList.add("text-primary");
        settingsBtn.querySelector("i").className = "bx bxs-cog text-2xl";
        break;
      case "profile":
        screenToShow = profileScreen;
        break;
      default:
        screenToShow = homeScreen;
        homeBtn.classList.remove("text-gray-400");
        homeBtn.classList.add("text-primary");
        homeBtn.querySelector("i").className = "bx bxs-home text-2xl";
    }

    // Prepare the screen for showing but keep it hidden until we set opacity
    screenToShow.classList.remove("hidden");
    screenToShow.style.zIndex = "0"; // Bring the visible screen forward
    screenToShow.style.opacity = "0"; // Start with opacity 0

    // Small delay to allow the browser to process the display change before fading in
    setTimeout(() => {
      screenToShow.style.opacity = "1"; // Fade in the screen
    }, 10);
    
    // Update screen history
    if (!isBackNavigation && appState.currentScreen !== screenName) {
      // Only add to history if we're not navigating back and it's a different screen
      appState.screenHistory.push(screenName);
      // Limit history size to prevent memory issues
      if (appState.screenHistory.length > 20) {
        appState.screenHistory.shift();
      }
    }
    
    appState.currentScreen = screenName;

    // Scroll to top
    window.scrollTo(0, 0);
  }, 100); // Small delay for fade out effect
}

// Album and Artist Screen Functions
async function openAlbumScreen(albumId) {
  try {
    const album = await getAlbumById(albumId);
    if (!album) throw new Error("Album not found");

    // Check if this album is favorited
    const isFavorite = appState.isAlbumFavorite(albumId);

    // Update album details
    document.getElementById("albumName").textContent = album.name;
    document.getElementById("albumCreator").textContent = album.creator;
    document.getElementById("albumDescription").textContent =
      album.description || "";
    document.getElementById("albumCover").querySelector("img").src =
      album.profilePic || getDefaultCoverArt();
    
    // Update the header title with the album name
    document.querySelector("#albumScreen header h2").textContent = album.name;
    
    // Add/update favorite button in header
    const headerRight = document.querySelector("#albumScreen header .ml-auto");
    headerRight.innerHTML = `
      <div class="flex items-center">
        <button
          id="favoriteAlbum"
          class="text-xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors duration-300 ${isFavorite ? 'text-primary' : 'text-gray-400'} mr-1"
        >
          <i class="bx ${isFavorite ? 'bxs-heart' : 'bx-heart'}"></i>
        </button>
        <button
          id="shareAlbum"
          class="text-xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors duration-300"
        >
          <i class="bx bx-share-alt"></i>
        </button>
      </div>
    `;
    
    // Set up favorite album button click handler
    document.getElementById("favoriteAlbum").addEventListener("click", () => {
      const newFavoriteStatus = appState.toggleFavoriteAlbum(album);
      const favoriteBtn = document.getElementById("favoriteAlbum");
      
      if (newFavoriteStatus) {
        favoriteBtn.classList.add('text-primary');
        favoriteBtn.classList.remove('text-gray-400');
        favoriteBtn.querySelector('i').className = 'bx bxs-heart';
        showToast(`Added "${album.name}" to favorites`);
      } else {
        favoriteBtn.classList.remove('text-primary');
        favoriteBtn.classList.add('text-gray-400');
        favoriteBtn.querySelector('i').className = 'bx bx-heart';
        showToast(`Removed "${album.name}" from favorites`);
      }
    });
    
    // Set up share album button click handler
    document.getElementById("shareAlbum").addEventListener("click", () => {
      // Set default share message with emojis
      shareMessage.value = `🎵 Enjoying "${album.name}" by ${album.creator} on XoMusic! 🎧 Discover premium music streaming experience. #XoMusic #MusicLovers`;
      
      // Update share modal content
      shareImage.src = album.profilePic || getDefaultCoverArt();
      shareTitle.textContent = album.name;
      shareSubtitle.textContent = album.creator;

      // Store current share item
      window.currentShareItem = {
        type: 'album',
        name: album.name,
        creator: album.creator,
        image: album.profilePic || getDefaultCoverArt()
      };
      
      // Show the modal
      shareModal.classList.remove("hidden");
    });

    // Set up social links
    const socialContainer = document.getElementById("albumSocial");
    socialContainer.innerHTML = "";

    if (album.socials) {
      if (album.socials.spotify && album.socials.spotify.trim() !== "") {
        const spotifyLink = document.createElement("a");
        spotifyLink.href = album.socials.spotify;
        spotifyLink.target = "_blank";
        spotifyLink.innerHTML = '<i class="bx bxl-spotify text-2xl"></i>';
        socialContainer.appendChild(spotifyLink);
      }

      if (album.socials.applemusic && album.socials.applemusic.trim() !== "") {
        const appleMusicLink = document.createElement("a");
        appleMusicLink.href = album.socials.applemusic;
        appleMusicLink.target = "_blank";
        appleMusicLink.innerHTML = '<i class="bx bxl-apple text-2xl"></i>';
        socialContainer.appendChild(appleMusicLink);
      }

      if (album.socials.ytmusic && album.socials.ytmusic.trim() !== "") {
        const ytMusicLink = document.createElement("a");
        ytMusicLink.href = album.socials.ytmusic;
        ytMusicLink.target = "_blank";
        ytMusicLink.innerHTML = '<i class="bx bxl-youtube text-2xl"></i>';
        socialContainer.appendChild(ytMusicLink);
      }
    }

    // Load album songs
    const songs = await getSongsByAlbum(album.name);
    const albumSongsContainer = document.getElementById("albumSongs");
    albumSongsContainer.innerHTML = "";

    if (songs.length === 0) {
      albumSongsContainer.innerHTML =
        '<p class="text-center text-gray-400 py-4">No songs found in this album</p>';
    } else {
      songs.forEach((song, index) => {
        const songEl = createSongElement(song, index, "album", album.name);
        albumSongsContainer.appendChild(songEl);
      });
    }

    showScreen("album");
  } catch (error) {
    console.error("Error opening album:", error);
    alert("Failed to load album details");
  }
}

async function openArtistScreen(artistId) {
  try {
    const artist = await getArtistById(artistId);
    if (!artist) throw new Error("Artist not found");
    
    // Check if this artist is favorited
    const isFavorite = appState.isArtistFavorite(artistId);

    // Update artist details
    document.getElementById("artistName").textContent = artist.name;
    document.getElementById("artistDescription").textContent =
      artist.description || "";
    document.getElementById("artistProfilePic").querySelector("img").src =
      artist.profilePic || getDefaultProfilePic();
      
    // Update the header title with the artist name
    document.querySelector("#artistScreen header h2").textContent = artist.name;
    
    // Add/update favorite button in header
    const headerRight = document.querySelector("#artistScreen header .ml-auto");
    headerRight.innerHTML = `
      <div class="flex items-center">
        <button
          id="favoriteArtist"
          class="text-xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors duration-300 ${isFavorite ? 'text-primary' : 'text-gray-400'} mr-1"
        >
          <i class="bx ${isFavorite ? 'bxs-heart' : 'bx-heart'}"></i>
        </button>
        <button
          id="shareArtist"
          class="text-xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors duration-300"
        >
          <i class="bx bx-share-alt"></i>
        </button>
      </div>
    `;
    
    // Set up favorite artist button click handler
    document.getElementById("favoriteArtist").addEventListener("click", () => {
      const newFavoriteStatus = appState.toggleFavoriteArtist(artist);
      const favoriteBtn = document.getElementById("favoriteArtist");
      
      if (newFavoriteStatus) {
        favoriteBtn.classList.add('text-primary');
        favoriteBtn.classList.remove('text-gray-400');
        favoriteBtn.querySelector('i').className = 'bx bxs-heart';
        showToast(`Added "${artist.name}" to favorites`);
      } else {
        favoriteBtn.classList.remove('text-primary');
        favoriteBtn.classList.add('text-gray-400');
        favoriteBtn.querySelector('i').className = 'bx bx-heart';
        showToast(`Removed "${artist.name}" from favorites`);
      }
    });
    
    // Set up share artist button click handler
    document.getElementById("shareArtist").addEventListener("click", () => {
      // Set default share message with emojis
      shareMessage.value = `🔥 Discovered ${artist.name} on XoMusic! 🎵 Incredible talent that deserves your attention. Download XoMusic for premium music streaming. #XoMusic #MusicDiscovery`;
      
      // Update share modal content
      shareImage.src = artist.profilePic || getDefaultProfilePic();
      shareTitle.textContent = artist.name;
      shareSubtitle.textContent = "Artist";

      // Store current share item
      window.currentShareItem = {
        type: 'artist',
        name: artist.name,
        description: artist.description || "",
        image: artist.profilePic || getDefaultProfilePic()
      };
      
      // Show the modal
      shareModal.classList.remove("hidden");
    });

    // Show verified badge if artist is verified
    const verifiedBadge = document.getElementById("verifiedBadge");
    if (artist.verified === "yes") {
      verifiedBadge.classList.remove("hidden");
    } else {
      verifiedBadge.classList.add("hidden");
    }

    // Set up social links
    const socialContainer = document.getElementById("artistSocial");
    socialContainer.innerHTML = "";

    if (artist.socials) {
      if (artist.socials.spotify && artist.socials.spotify.trim() !== "") {
        const spotifyLink = document.createElement("a");
        spotifyLink.href = artist.socials.spotify;
        spotifyLink.target = "_blank";
        spotifyLink.innerHTML = '<i class="bx bxl-spotify text-2xl"></i>';
        socialContainer.appendChild(spotifyLink);
      }

      if (artist.socials.instagram && artist.socials.instagram.trim() !== "") {
        const instagramLink = document.createElement("a");
        instagramLink.href = artist.socials.instagram;
        instagramLink.target = "_blank";
        instagramLink.innerHTML = '<i class="bx bxl-instagram text-2xl"></i>';
        socialContainer.appendChild(instagramLink);
      }

      if (artist.socials.facebook && artist.socials.facebook.trim() !== "") {
        const facebookLink = document.createElement("a");
        facebookLink.href = artist.socials.facebook;
        facebookLink.target = "_blank";
        facebookLink.innerHTML = '<i class="bx bxl-facebook text-2xl"></i>';
        socialContainer.appendChild(facebookLink);
      }

      if (artist.socials.youtube && artist.socials.youtube.trim() !== "") {
        const youtubeLink = document.createElement("a");
        youtubeLink.href = artist.socials.youtube;
        youtubeLink.target = "_blank";
        youtubeLink.innerHTML = '<i class="bx bxl-youtube text-2xl"></i>';
        socialContainer.appendChild(youtubeLink);
      }
    }

    // Load artist songs
    const songs = await getSongsByArtist(artist.name);
    const artistSongsContainer = document.getElementById("artistSongs");
    artistSongsContainer.innerHTML = "";

    if (songs.length === 0) {
      artistSongsContainer.innerHTML =
        '<p class="text-center text-gray-400 py-4">No songs found for this artist</p>';
    } else {
      songs.forEach((song, index) => {
        const songEl = createSongElement(song, index, "artist", artist.name);
        artistSongsContainer.appendChild(songEl);
      });
    }

    showScreen("artist");
  } catch (error) {
    console.error("Error opening artist:", error);
    alert("Failed to load artist details");
  }
}

// Playlist Screen
async function loadPlaylists() {
  try {
    appState.playlistOffset = 0;
    const albums = await getLimitedAlbums(
      appState.playlistLimit,
      appState.playlistOffset
    );

    allPlaylists.innerHTML = "";

    // Shuffle albums for a random experience
    const shuffledAlbums = shuffleArray(albums);

    shuffledAlbums.forEach((album) => {
      const albumCover = album.profilePic || getDefaultCoverArt();

      const albumEl = document.createElement("div");
      albumEl.className = "album-card transition-all duration-300";
      albumEl.dataset.albumId = album.id;
      albumEl.innerHTML = `
        <div class="aspect-square overflow-hidden">
          <img src="${albumCover}" alt="${album.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-sm truncate">${album.name}</h3>
          <p class="text-gray-400 text-xs truncate">${album.creator}</p>
        </div>
      `;

      albumEl.addEventListener("click", () => {
        openAlbumScreen(album.id);
      });

      allPlaylists.appendChild(albumEl);
    });
  } catch (error) {
    console.error("Error loading playlists:", error);
    allPlaylists.innerHTML =
      '<p class="text-red-500">Failed to load playlists</p>';
  }
}

// Load more playlists
loadMorePlaylists.addEventListener("click", async () => {
  try {
    appState.playlistOffset += appState.playlistLimit;
    const albums = await getLimitedAlbums(
      appState.playlistLimit,
      appState.playlistOffset
    );

    if (albums.length === 0) {
      loadMorePlaylists.textContent = "No more playlists";
      loadMorePlaylists.disabled = true;
      setTimeout(() => {
        loadMorePlaylists.textContent = "Load More";
        loadMorePlaylists.disabled = false;
      }, 2000);
      return;
    }

    // Shuffle albums for a random experience
    const shuffledAlbums = shuffleArray(albums);

    shuffledAlbums.forEach((album) => {
      const albumCover = album.profilePic || getDefaultCoverArt();

      const albumEl = document.createElement("div");
      albumEl.className = "album-card transition-all duration-300";
      albumEl.dataset.albumId = album.id;
      albumEl.innerHTML = `
        <div class="aspect-square overflow-hidden">
          <img src="${albumCover}" alt="${album.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-sm truncate">${album.name}</h3>
          <p class="text-gray-400 text-xs truncate">${album.creator}</p>
        </div>
      `;

      albumEl.addEventListener("click", () => {
        openAlbumScreen(album.id);
      });

      allPlaylists.appendChild(albumEl);
    });
  } catch (error) {
    console.error("Error loading more playlists:", error);
  }
});

// Additional helper functions
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Audio Player Functions
function setupAudioPlayer() {
  // Play/Pause buttons
  playPauseBtn.addEventListener("click", togglePlay);
  miniPlay.addEventListener("click", togglePlay);

  // Next/Prev buttons
  nextBtn.addEventListener("click", playNextSong);
  prevBtn.addEventListener("click", playPrevSong);
  miniNext.addEventListener("click", playNextSong);
  miniPrev.addEventListener("click", playPrevSong);

  // Shuffle button
  shuffleBtn.addEventListener("click", toggleShuffle);

  // Repeat button
  repeatBtn.addEventListener("click", toggleRepeat);

  // Progress bar
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("loadedmetadata", updateTotalTime);
  audioPlayer.addEventListener("ended", handleSongEnd);
  audioPlayer.addEventListener("play", handlePlay);
  audioPlayer.addEventListener("pause", handlePause);

  // Setup interactive progress bar
  setupProgressBar();

  // Mini player close button
  // miniClose button has been removed

  // Sleep timer
  timerBtn.addEventListener("click", () => {
    sleepTimer.classList.remove("hidden");
  });

  closeTimerModal.addEventListener("click", () => {
    sleepTimer.classList.add("hidden");
  });

  cancelTimer.addEventListener("click", () => {
    clearSleepTimer();
    sleepTimer.classList.add("hidden");
  });

  timerOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const minutes = parseInt(option.dataset.time);
      setSleepTimer(minutes);
      sleepTimer.classList.add("hidden");

      // Visual feedback
      timerBtn.classList.add("text-primary");
    });
  });
}

function togglePlay() {
  if (appState.currentPlaylist.length === 0) return;

  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function toggleShuffle() {
  appState.isShuffle = !appState.isShuffle;

  if (appState.isShuffle) {
    shuffleBtn.classList.add("text-primary");
    shuffleBtn.classList.remove("text-gray-400");
  } else {
    shuffleBtn.classList.remove("text-primary");
    shuffleBtn.classList.add("text-gray-400");
  }
}

function toggleRepeat() {
  appState.isRepeatOne = !appState.isRepeatOne;

  if (appState.isRepeatOne) {
    repeatBtn.classList.add("text-primary");
    repeatBtn.classList.remove("text-gray-400");
    repeatBtn.querySelector("i").className = "bx bx-repeat-1";
  } else {
    repeatBtn.classList.remove("text-primary");
    repeatBtn.classList.add("text-gray-400");
    repeatBtn.querySelector("i").className = "bx bx-repeat";
  }
}

function updateProgress() {
  const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentTime.textContent = formatTime(audioPlayer.currentTime);
}

function updateTotalTime() {
  totalTime.textContent = formatTime(audioPlayer.duration);
}

function handleSongEnd() {
  if (appState.isRepeatOne) {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
  } else {
    playNextSong();
  }
}

function handlePlay() {
  appState.isPlaying = true;
  playPauseBtn.querySelector("i").className = "bx bx-pause";
  miniPlay.querySelector("i").className = "bx bx-pause";

  // Show mini player with animation
  if (miniPlayer.classList.contains("hidden")) {
    miniPlayer.style.transform = "translateY(20px)";
    miniPlayer.style.opacity = "0";
    miniPlayer.classList.remove("hidden");
    
    // Force reflow
    void miniPlayer.offsetWidth;
    
    // Trigger animation
    miniPlayer.style.transform = "translateY(0)";
    miniPlayer.style.opacity = "1";
  }

  // Start visualizer animations
  audioVisualizer.classList.remove("hidden");
  audioVisualizer.classList.add("active");

  // Reset all song cards to non-playing state
  document.querySelectorAll(".song-card").forEach((card) => {
    card.classList.remove("playing");
  });

  // Find currently playing source
  let currentSource = "unknown";
  if (appState.currentSource) {
    currentSource = appState.currentSource;
  } else {
    // Try to determine the source based on the playlist
    const discoverSongsArray = document.getElementById("discoverSongs");
    if (
      discoverSongsArray &&
      appState.currentPlaylist &&
      discoverSongsArray.children.length > 0 &&
      appState.currentPlaylist.length === discoverSongsArray.children.length
    ) {
      currentSource = "discover";
    }
  }

  // Find the currently playing song card and mark it
  const currentSongCard = document.querySelector(
    `.song-card[data-source="${currentSource}"][data-song-index="${appState.currentSongIndex}"]`
  );

  if (currentSongCard) {
    currentSongCard.classList.add("playing");
    // Change play icon to pause icon
    const playIcon = currentSongCard.querySelector('.bx-play-circle');
    if (playIcon) {
      playIcon.className = 'bx bx-pause-circle text-xl text-gray-400';
    }
  }

  // Find and show song visualizer in the list
  const visualizers = document.querySelectorAll(".audio-visualizer");
  visualizers.forEach((v) => {
    v.classList.add("hidden");
    v.classList.remove("active");
  });

  const currentVisualizer = document.querySelector(
    `.song-card[data-source="${currentSource}"][data-song-index="${appState.currentSongIndex}"] .audio-visualizer`
  );
  
  if (currentVisualizer) {
    currentVisualizer.classList.remove("hidden");
    currentVisualizer.classList.add("active");
    console.log("Visualizer activated:", currentVisualizer);
  }

  // Spin player cover
  playerCover.parentElement.classList.add("rotate-cover");

  // Set media session metadata
  if ("mediaSession" in navigator) {
    const song = appState.currentPlaylist[appState.currentSongIndex];
    if (song) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album || "",
        artwork: [
          {
            src: song.coverArt || getDefaultCoverArt(),
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", togglePlay);
      navigator.mediaSession.setActionHandler("pause", togglePlay);
      navigator.mediaSession.setActionHandler("previoustrack", playPrevSong);
      navigator.mediaSession.setActionHandler("nexttrack", playNextSong);
    }
  }
}

function handlePause() {
  playPauseBtn.querySelector("i").className = "bx bx-play";
  miniPlay.querySelector("i").className = "bx bx-play";

  // Hide visualizer animations
  audioVisualizer.classList.add("hidden");

  // Find and hide song visualizer in the list
  const songVisualizers = document.querySelectorAll(".song-card .audio-visualizer");
  songVisualizers.forEach((v) => {
    v.classList.add("hidden");
    v.classList.remove("active");
  });
  
  // Reset play button icons in all song cards
  document.querySelectorAll(".song-card .bx-pause-circle").forEach((icon) => {
    icon.className = 'bx bx-play-circle text-xl text-gray-400';
  });

  // Stop spinning player cover
  playerCover.parentElement.classList.remove("rotate-cover");
}

function playNextSong() {
  if (appState.currentPlaylist.length === 0) return;

  if (appState.isShuffle) {
    // Play random song
    const randomIndex = Math.floor(
      Math.random() * appState.currentPlaylist.length
    );
    appState.currentSongIndex = randomIndex;
  } else {
    // Play next song in order
    appState.currentSongIndex =
      (appState.currentSongIndex + 1) % appState.currentPlaylist.length;
  }

  loadAndPlaySong();
}

function playPrevSong() {
  if (appState.currentPlaylist.length === 0) return;

  if (audioPlayer.currentTime > 3) {
    // If current time is more than 3 seconds, restart the song
    audioPlayer.currentTime = 0;
  } else {
    if (appState.isShuffle) {
      // Play random song
      const randomIndex = Math.floor(
        Math.random() * appState.currentPlaylist.length
      );
      appState.currentSongIndex = randomIndex;
    } else {
      // Play previous song
      appState.currentSongIndex =
        (appState.currentSongIndex - 1 + appState.currentPlaylist.length) %
        appState.currentPlaylist.length;
    }
  }

  loadAndPlaySong();
}

async function loadAndPlaySong() {
  const song = appState.currentPlaylist[appState.currentSongIndex];

  if (!song) return;

  // Show loading indicator
  playPauseBtn.querySelector("i").className = "bx bx-loader-alt animate-spin";
  miniPlay.querySelector("i").className = "bx bx-loader-alt animate-spin";

  // Update player UI
  playerTitle.textContent = song.title || "Unknown Title";
  playerArtist.textContent = song.artist || "Unknown Artist";
  playerCover.src = song.coverArt || getDefaultCoverArt();

  // Update mini player UI
  miniTitle.textContent = song.title || "Unknown Title";
  miniArtist.textContent = song.artist || "Unknown Artist";
  miniCover.src = song.coverArt || getDefaultCoverArt();

  // Make sure mini player is visible
  miniPlayer.classList.remove("hidden");

  // Load and play song
  audioPlayer.src = song.url;

  try {
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          appState.isPlaying = true;
        })
        .catch((error) => {
          console.error("Error playing song:", error);
          playPauseBtn.querySelector("i").className = "bx bx-play";
          miniPlay.querySelector("i").className = "bx bx-play";
          appState.isPlaying = false;
        });
    }
  } catch (error) {
    console.error("Error playing song:", error);
    playPauseBtn.querySelector("i").className = "bx bx-play";
    miniPlay.querySelector("i").className = "bx bx-play";
    appState.isPlaying = false;
  }
}

function stopPlayback() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  appState.isPlaying = false;
  
  // Animate mini player hiding
  miniPlayer.style.transform = "translateY(20px)";
  miniPlayer.style.opacity = "0";
  
  setTimeout(() => {
    miniPlayer.classList.add("hidden");
    // Reset transform for next time
    miniPlayer.style.transform = "translateY(0)";
  }, 300);

  // Hide visualizer animations
  audioVisualizer.classList.add("hidden");

  // Find and hide song visualizer in the list
  const visualizers = document.querySelectorAll(".audio-visualizer");
  visualizers.forEach((v) => v.classList.add("hidden"));
}

function setSleepTimer(minutes) {
  // Clear any existing timer
  clearSleepTimer();

  // Set new timer
  const ms = minutes * 60 * 1000;
  appState.sleepTimerId = setTimeout(() => {
    stopPlayback();
    timerBtn.classList.remove("text-primary");
  }, ms);
}

function clearSleepTimer() {
  if (appState.sleepTimerId) {
    clearTimeout(appState.sleepTimerId);
    appState.sleepTimerId = null;
  }
  timerBtn.classList.remove("text-primary");
}

// Play songs from different sources
async function playDiscoverSong(index) {
  try {
    const songs = await getDiscoverSongs();
    appState.currentPlaylist = songs;
    appState.currentSongIndex = index;
    appState.currentSource = "discover";
    loadAndPlaySong();
  } catch (error) {
    console.error("Error playing discover song:", error);
  }
}

async function playAlbumSong(index, albumName) {
  try {
    const songs = await getSongsByAlbum(albumName);
    appState.currentPlaylist = songs;
    appState.currentSongIndex = index;
    appState.currentSource = "album";
    loadAndPlaySong();
  } catch (error) {
    console.error("Error playing album song:", error);
  }
}

async function playArtistSong(index, artistName) {
  try {
    const songs = await getSongsByArtist(artistName);
    appState.currentPlaylist = songs;
    appState.currentSongIndex = index;
    appState.currentSource = "artist";
    loadAndPlaySong();
  } catch (error) {
    console.error("Error playing artist song:", error);
  }
}

let searchResultsArray = [];

async function playSearchSong(index) {
  try {
    appState.currentPlaylist = searchResultsArray;
    appState.currentSongIndex = index;
    appState.currentSource = "search";
    loadAndPlaySong();
  } catch (error) {
    console.error("Error playing search song:", error);
  }
}

// Search Functions
function setupSearchFunctionality() {
  searchInput.addEventListener("input", debounce(performSearch, 300));
}

async function performSearch() {
  const query = searchInput.value.trim();

  if (query.length === 0) {
    searchResults.innerHTML = "";
    noResults.classList.add("hidden");
    return;
  }

  const results = await searchMusic(query);
  searchResultsArray = results.songs;

  const searchResultsEl = document.getElementById("searchResults");
  searchResultsEl.innerHTML = "";

  if (
    results.songs.length === 0 &&
    results.albums.length === 0 &&
    results.artists.length === 0
  ) {
    searchResultsEl.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");

  // Add artists
  if (results.artists.length > 0) {
    const artistsSection = document.createElement("div");
    artistsSection.className = "mb-6";
    artistsSection.innerHTML = `<h3 class="text-lg font-semibold mb-2">Artists</h3>`;

    const artistsList = document.createElement("div");
    artistsList.className = "flex overflow-x-auto space-x-4 pb-2";

    results.artists.forEach((artist) => {
      const isFavorite = appState.isArtistFavorite(artist.id);
      const artistEl = document.createElement("div");
      artistEl.className = "flex flex-col items-center min-w-[80px]";
      artistEl.innerHTML = `
        <div class="w-16 h-16 rounded-full overflow-hidden mb-1">
          <img src="${artist.profilePic || getDefaultProfilePic()}" alt="${
        artist.name
      }" class="w-full h-full object-cover">
        </div>
        <p class="text-sm text-center truncate w-20">${artist.name}</p>
      `;

      artistEl.addEventListener("click", () => {
        openArtistScreen(artist.id);
      });

      artistsList.appendChild(artistEl);
    });

    artistsSection.appendChild(artistsList);
    searchResultsEl.appendChild(artistsSection);
  }

  // Add albums
  if (results.albums.length > 0) {
    const albumsSection = document.createElement("div");
    albumsSection.className = "mb-6";
    albumsSection.innerHTML = `<h3 class="text-lg font-semibold mb-2">Albums</h3>`;

    const albumsList = document.createElement("div");
    albumsList.className = "grid grid-cols-2 gap-3 search-albums-grid";

    results.albums.forEach((album) => {
      const albumEl = document.createElement("div");
      albumEl.className = "album-card transition-all duration-300";
      albumEl.innerHTML = `
        <div class="aspect-square overflow-hidden">
          <img src="${album.profilePic || getDefaultCoverArt()}" alt="${
        album.name
      }" class="w-full h-full object-cover">
        </div>
        <div class="p-3">
          <h4 class="font-semibold text-sm truncate">${album.name}</h4>
          <p class="text-gray-400 text-xs truncate">${album.creator}</p>
        </div>
      `;

      albumEl.addEventListener("click", () => {
        openAlbumScreen(album.id);
      });

      albumsList.appendChild(albumEl);
    });

    albumsSection.appendChild(albumsList);
    searchResultsEl.appendChild(albumsSection);
  }

  // Add songs
  if (results.songs.length > 0) {
    const songsSection = document.createElement("div");
    songsSection.className = "mb-6";
    songsSection.innerHTML = `<h3 class="text-lg font-semibold mb-2">Songs</h3>`;

    const songsList = document.createElement("div");
    songsList.className = "space-y-2";

    results.songs.forEach((song, index) => {
      const songEl = createSongElement(song, index, "search");
      songsList.appendChild(songEl);
    });

    songsSection.appendChild(songsList);
    searchResultsEl.appendChild(songsSection);
  }
}

// Settings Functions
function setupSettingsFunctionality() {
  // Theme toggle
  themeToggle.addEventListener("change", toggleTheme);

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.body.classList.add("bg-light", "text-light-text");
    themeToggle.checked = true;
    updateThemeToggleUI(true);
  } else {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
    document.body.classList.add("bg-dark", "text-white");
    themeToggle.checked = false;
    updateThemeToggleUI(false);
  }
}

function toggleTheme() {
  const isLight = themeToggle.checked;

  if (isLight) {
    // Switch to light theme
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark", "bg-dark", "text-white");
    document.body.classList.add("bg-light", "text-light-text");
    localStorage.setItem("theme", "light");
  } else {
    // Switch to dark theme
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark", "bg-dark", "text-white");
    document.body.classList.remove("bg-light", "text-light-text");
    localStorage.setItem("theme", "dark");
  }

  updateThemeToggleUI(isLight);
}

function updateThemeToggleUI(isLight) {
  const toggleSpan = themeToggle.nextElementSibling.querySelector("span");

  if (isLight) {
    toggleSpan.classList.add("translate-x-7");
  } else {
    toggleSpan.classList.remove("translate-x-7");
  }
}

// Profile Functions
function setupProfileFunctionality() {
  // Edit bio
  editBioBtn.addEventListener("click", () => {
    bioInput.value = userBio.textContent;
    editBioArea.classList.remove("hidden");
  });

  saveBioBtn.addEventListener("click", () => {
    userBio.textContent = bioInput.value;
    editBioArea.classList.add("hidden");
    // Here you would typically save this to the user's profile in a database
    
    // Save to localStorage for now
    if (appState.currentUser) {
      localStorage.setItem(`bio_${appState.currentUser.uid}`, bioInput.value);
    }
  });
  
  // Setup favorites tabs
  favSongsTab.addEventListener("click", () => {
    setActiveTab(favSongsTab);
    showFavoritesSection(favSongsSection);
    loadFavoriteSongs();
  });
  
  favAlbumsTab.addEventListener("click", () => {
    setActiveTab(favAlbumsTab);
    showFavoritesSection(favAlbumsSection);
    loadFavoriteAlbums();
  });
  
  favArtistsTab.addEventListener("click", () => {
    setActiveTab(favArtistsTab);
    showFavoritesSection(favArtistsSection);
    loadFavoriteArtists();
  });
  
  // Load initial favorites tab when profile is opened
  if (appState.currentUser) {
    const savedBio = localStorage.getItem(`bio_${appState.currentUser.uid}`);
    if (savedBio) {
      userBio.textContent = savedBio;
    }
  }
}

function setActiveTab(activeTab) {
  // Remove active class from all tabs
  [favSongsTab, favAlbumsTab, favArtistsTab].forEach(tab => {
    tab.classList.remove('border-primary', 'text-white');
    tab.classList.add('border-transparent', 'text-gray-400');
  });
  
  // Add active class to selected tab
  activeTab.classList.remove('border-transparent', 'text-gray-400');
  activeTab.classList.add('border-primary', 'text-white');
}

function showFavoritesSection(activeSection) {
  // Hide all sections
  [favSongsSection, favAlbumsSection, favArtistsSection].forEach(section => {
    section.classList.add('hidden');
    section.classList.remove('active');
  });
  
  // Show selected section
  activeSection.classList.remove('hidden');
  activeSection.classList.add('active');
}

async function loadFavoriteSongs() {
  favSongsList.innerHTML = "";
  
  if (appState.favorites.songs.length === 0) {
    favSongsList.innerHTML = `
      <div class="text-center text-gray-500 text-sm py-4">
        <i class="bx bx-heart-circle text-4xl mb-2 opacity-30"></i>
        <p>No favorite songs yet</p>
        <p class="text-xs mt-1">Add songs to your favorites by clicking the heart icon</p>
      </div>
    `;
    return;
  }
  
  // Display favorite songs
  appState.favorites.songs.forEach((song, index) => {
    const songEl = createSongElement(song, index, "favorites");
    songEl.classList.add('animate-fade-in');
    favSongsList.appendChild(songEl);
  });
}

async function loadFavoriteAlbums() {
  favAlbumsList.innerHTML = "";
  
  if (appState.favorites.albums.length === 0) {
    favAlbumsList.innerHTML = `
      <div class="text-center text-gray-500 text-sm py-4 col-span-2">
        <i class="bx bx-album text-4xl mb-2 opacity-30"></i>
        <p>No favorite albums yet</p>
        <p class="text-xs mt-1">Add albums to your favorites by clicking the heart icon</p>
      </div>
    `;
    return;
  }
  
  // Display favorite albums
  appState.favorites.albums.forEach(album => {
    const albumCover = album.profilePic || getDefaultCoverArt();

    const albumEl = document.createElement("div");
    albumEl.className = "album-card transition-all duration-300 animate-fade-in";
    albumEl.dataset.albumId = album.id;
    albumEl.innerHTML = `
      <div class="relative aspect-square overflow-hidden">
        <img src="${albumCover}" alt="${album.name}" class="w-full h-full object-cover">
        <button class="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-primary shadow-lg transition-all duration-200 favorite-album-btn">
          <i class='bx bxs-heart text-xl'></i>
        </button>
      </div>
      <div class="p-3">
        <h3 class="font-semibold text-sm truncate">${album.name}</h3>
        <p class="text-gray-400 text-xs truncate">${album.creator}</p>
      </div>
    `;

    // Open album when clicked
    albumEl.addEventListener("click", (e) => {
      // Don't open if clicking on the favorite button
      if (e.target.closest('.favorite-album-btn')) return;
      openAlbumScreen(album.id);
    });
    
    // Favorite button click handler
    const favoriteBtn = albumEl.querySelector('.favorite-album-btn');
    favoriteBtn.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent opening album
      appState.toggleFavoriteAlbum(album);
      
      // Remove from UI
      albumEl.classList.add('animate-fade-out');
      setTimeout(() => {
        albumEl.remove();
        
        // If no favorites left, show empty state
        if (appState.favorites.albums.length === 0) {
          favAlbumsList.innerHTML = `
            <div class="text-center text-gray-500 text-sm py-4 col-span-2">
              <i class="bx bx-album text-4xl mb-2 opacity-30"></i>
              <p>No favorite albums yet</p>
              <p class="text-xs mt-1">Add albums to your favorites by clicking the heart icon</p>
            </div>
          `;
        }
      }, 300);
      
      // Show toast notification
      showToast(`Removed "${album.name}" from favorites`);
    });

    favAlbumsList.appendChild(albumEl);
  });
}

async function loadFavoriteArtists() {
  favArtistsList.innerHTML = "";
  
  if (appState.favorites.artists.length === 0) {
    favArtistsList.innerHTML = `
      <div class="text-center text-gray-500 text-sm py-4 w-full">
        <i class="bx bx-user-voice text-4xl mb-2 opacity-30"></i>
        <p>No favorite artists yet</p>
        <p class="text-xs mt-1">Add artists to your favorites by clicking the heart icon</p>
      </div>
    `;
    return;
  }
  
  // Display favorite artists
  appState.favorites.artists.forEach(artist => {
    const artistPic = artist.profilePic || getDefaultProfilePic();
    const isVerified = artist.verified === "yes";

    const artistEl = document.createElement("div");
    artistEl.className = "artist-card flex flex-col items-center animate-fade-in";
    artistEl.dataset.artistId = artist.id;

    artistEl.innerHTML = `
      <div class="relative mb-2">
        <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 hover:border-primary transition-all duration-300 shadow-md">
          <img src="${artistPic}" alt="${artist.name}" class="w-full h-full object-cover">
        </div>
        ${isVerified ? `
          <div class="absolute bottom-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs border-2 border-dark shadow-md">
            <i class='bx bxs-check-circle'></i>
          </div>
        ` : ""}
        <button class="absolute top-0 right-0 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-primary shadow-lg transition-all duration-200 favorite-artist-btn">
          <i class='bx bxs-heart text-lg'></i>
        </button>
      </div>
      <p class="text-center text-sm font-medium w-20 truncate">${artist.name}</p>
    `;

    // Open artist when clicked
    artistEl.addEventListener("click", (e) => {
      // Don't open if clicking on the favorite button
      if (e.target.closest('.favorite-artist-btn')) return;
      openArtistScreen(artist.id);
    });
    
    // Favorite button click handler
    const favoriteBtn = artistEl.querySelector('.favorite-artist-btn');
    favoriteBtn.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent opening artist
      appState.toggleFavoriteArtist(artist);
      
      // Remove from UI
      artistEl.classList.add('animate-fade-out');
      setTimeout(() => {
        artistEl.remove();
        
        // If no favorites left, show empty state
        if (appState.favorites.artists.length === 0) {
          favArtistsList.innerHTML = `
            <div class="text-center text-gray-500 text-sm py-4 w-full">
              <i class="bx bx-user-voice text-4xl mb-2 opacity-30"></i>
              <p>No favorite artists yet</p>
              <p class="text-xs mt-1">Add artists to your favorites by clicking the heart icon</p>
            </div>
          `;
        }
      }, 300);
      
      // Show toast notification
      showToast(`Removed "${artist.name}" from favorites`);
    });

    favArtistsList.appendChild(artistEl);
  });
}

async function playFavoriteSong(index) {
  try {
    appState.currentPlaylist = appState.favorites.songs;
    appState.currentSongIndex = index;
    appState.currentSource = "favorites";
    loadAndPlaySong();
  } catch (error) {
    console.error("Error playing favorite song:", error);
  }
}

// Share Functions
function setupShareFunctionality() {
  // Close share modal
  closeShareModal.addEventListener("click", () => {
    shareModal.classList.add("hidden");
  });

  // Copy share link
  copyShareLink.addEventListener("click", () => {
    const baseUrl = "https://play.google.com/store/apps/details?id=com.xo.music&pcampaignid=web_share";
    let shareUrl = baseUrl;
    
    if (window.currentShareItem) {
      // Keep the Google Play Store link as is
      shareUrl = baseUrl;
    }
    
    // Create temporary textarea to copy the URL
    const textArea = document.createElement("textarea");
    textArea.value = shareUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    
    // Show feedback
    const originalText = copyShareLink.querySelector("span").textContent;
    copyShareLink.querySelector("span").textContent = "Copied!";
    setTimeout(() => {
      copyShareLink.querySelector("span").textContent = originalText;
    }, 2000);
  });

  // Share action button
  shareAction.addEventListener("click", () => {
    if (!window.currentShareItem) return;
    
    const shareData = {
      title: window.currentShareItem.name,
      text: shareMessage.value,
      url: "https://play.google.com/store/apps/details?id=com.xo.music&pcampaignid=web_share"
    };
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => {
          shareModal.classList.add("hidden");
        })
        .catch(error => {
          console.log('Error sharing:', error);
        });
    } else {
      // Fallback - just copy the link
      copyShareLink.click();
      shareModal.classList.add("hidden");
    }
  });

  // Individual share options (Facebook, Twitter, WhatsApp)
  document.querySelectorAll('.share-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!window.currentShareItem) return;
      
      const platform = e.currentTarget.querySelector('span').textContent.toLowerCase();
      const shareText = encodeURIComponent(shareMessage.value);
      const appStoreUrl = encodeURIComponent("https://play.google.com/store/apps/details?id=com.xo.music&pcampaignid=web_share");
      let shareLink = '';
      
      switch(platform) {
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${appStoreUrl}`;
          break;
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${appStoreUrl}`;
          break;
        case 'whatsapp':
          shareLink = `https://api.whatsapp.com/send?text=${shareText} ${appStoreUrl}`;
          break;
        case 'copy link':
          // Already handled by dedicated function
          return;
        default:
          return;
      }
      
      // Open the share link in a new window
      window.open(shareLink, '_blank', 'width=600,height=400');
      shareModal.classList.add("hidden");
    });
  });
}

// UI Setup
function setupUIInteractions() {
  // Set up search functionality
  setupSearchFunctionality();

  // Set up settings functionality
  setupSettingsFunctionality();

  // Set up profile functionality
  setupProfileFunctionality();
  
  // Set up share functionality
  setupShareFunctionality();
  
  // Set up favorites tab in profile
  setActiveTab(favSongsTab);
  showFavoritesSection(favSongsSection);
  loadFavoriteSongs();
}

// Toast notification function
function showToast(message, duration = 3000) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById("toast-notification");
  
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-dark-lighter border border-gray-700 px-4 py-2 rounded-full shadow-lg z-50 flex items-center opacity-0 transition-opacity duration-300";
    document.body.appendChild(toast);
  }
  
  // Clear any existing timeout
  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId);
  }
  
  // Update toast content
  toast.innerHTML = `
    <i class="bx bx-check-circle text-primary text-xl mr-2"></i>
    <span>${message}</span>
  `;
  
  // Show the toast
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");
  
  // Hide after duration
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, duration);
}

// Helper Functions
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function setupHorizontalScroll(element) {
  if (!element) return;

  // No JavaScript scrolling - we're using CSS for smooth scrolling
  // Just add active class on touch for styling

  element.addEventListener("mousedown", () => {
    element.classList.add("active");
  });

  element.addEventListener("mouseup", () => {
    element.classList.remove("active");
  });

  element.addEventListener("mouseleave", () => {
    element.classList.remove("active");
  });

  element.addEventListener("touchstart", () => {
    element.classList.add("active");
  });

  element.addEventListener("touchend", () => {
    element.classList.remove("active");
  });
}

function createSongElement(song, index, source, contextId) {
  const songCover = song.coverArt || getDefaultCoverArt();
  const isFavorite = appState.isSongFavorite(song.url);

  const songEl = document.createElement("div");
  songEl.className =
    "song-card bg-dark-lighter hover:bg-secondary rounded-lg p-3 flex items-center transition-all duration-200";
  songEl.dataset.songIndex = index;
  songEl.dataset.source = source;
  songEl.dataset.contextId = contextId || "";

  songEl.innerHTML = `
    <div class="w-12 h-12 rounded-md overflow-hidden mr-3 shadow-md flex-shrink-0">
      <img src="${songCover}" alt="${song.title}" class="w-full h-full object-cover">
    </div>
    <div class="flex-grow overflow-hidden mr-2">
      <h3 class="font-semibold text-sm truncate whitespace-nowrap overflow-hidden text-ellipsis">${song.title}</h3>
      <p class="text-gray-400 text-xs truncate whitespace-nowrap overflow-hidden text-ellipsis">${song.artist}</p>
    </div>
    <div class="flex items-center">
      <button class="favorite-btn w-8 h-8 flex items-center justify-center mr-1 text-xl transition-colors duration-200 ${isFavorite ? 'text-primary' : 'text-gray-400 hover:text-gray-300'}">
        <i class='bx ${isFavorite ? 'bxs-heart' : 'bx-heart'}'></i>
      </button>
      <div class="audio-visualizer hidden mr-2" data-song-index="${index}">
        <span class="bg-primary"></span>
        <span class="bg-primary"></span>
        <span class="bg-primary"></span>
        <span class="bg-primary"></span>
        <span class="bg-primary"></span>
      </div>
    </div>
  `;

  // Play button click handler
  songEl.addEventListener("click", (e) => {
    // Don't trigger play if clicking on the favorite button
    if (e.target.closest('.favorite-btn')) return;
    
    if (source === "discover") {
      playDiscoverSong(index);
    } else if (source === "album") {
      playAlbumSong(index, contextId);
    } else if (source === "artist") {
      playArtistSong(index, contextId);
    } else if (source === "search") {
      playSearchSong(index);
    } else if (source === "favorites") {
      playFavoriteSong(index);
    }
  });
  
  // Favorite button click handler
  const favoriteBtn = songEl.querySelector('.favorite-btn');
  favoriteBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent triggering song play
    const newFavoriteStatus = appState.toggleFavoriteSong(song);
    
    // Update UI
    const icon = favoriteBtn.querySelector('i');
    if (newFavoriteStatus) {
      favoriteBtn.classList.add('text-primary');
      favoriteBtn.classList.remove('text-gray-400', 'hover:text-gray-300');
      icon.classList.remove('bx-heart');
      icon.classList.add('bxs-heart');
      
      // Show toast notification
      showToast(`Added "${song.title}" to favorites`);
      
      // If we're in the favorites section, refresh the list
      if (appState.currentScreen === "profile" && favSongsSection.classList.contains('active')) {
        loadFavoriteSongs();
      }
    } else {
      favoriteBtn.classList.remove('text-primary');
      favoriteBtn.classList.add('text-gray-400', 'hover:text-gray-300');
      icon.classList.add('bx-heart');
      icon.classList.remove('bxs-heart');
      
      // Show toast notification
      showToast(`Removed "${song.title}" from favorites`);
      
      // If we're in the favorites section, refresh the list
      if (source === "favorites") {
        // Remove this item from the UI
        songEl.classList.add('animate-fade-out');
        setTimeout(() => {
          songEl.remove();
          
          // If no favorites left, show empty state
          if (appState.favorites.songs.length === 0) {
            favSongsList.innerHTML = `
              <div class="text-center text-gray-500 text-sm py-4">
                <i class="bx bx-heart-circle text-4xl mb-2 opacity-30"></i>
                <p>No favorite songs yet</p>
                <p class="text-xs mt-1">Add songs to your favorites by clicking the heart icon</p>
              </div>
            `;
          }
        }, 300);
      }
    }
  });

  return songEl;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

// Add interactive progress bar functionality
function setupProgressBar() {
  const progressContainer = document.querySelector(".h-1\\.5.bg-gray-700");
  if (!progressContainer) return;

  // Update progress on click
  progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (pos >= 0 && pos <= 1) {
      audioPlayer.currentTime = pos * audioPlayer.duration;
    }
  });

  // Update progress on drag (mouse events)
  let isDragging = false;

  progressContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    // Update on initial click
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (pos >= 0 && pos <= 1) {
      audioPlayer.currentTime = pos * audioPlayer.duration;
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (pos >= 0 && pos <= 1) {
      audioPlayer.currentTime = pos * audioPlayer.duration;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch events for mobile
  progressContainer.addEventListener("touchstart", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.touches[0].clientX - rect.left) / rect.width;
    if (pos >= 0 && pos <= 1) {
      audioPlayer.currentTime = pos * audioPlayer.duration;
    }
  });

  progressContainer.addEventListener("touchmove", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.touches[0].clientX - rect.left) / rect.width;
    if (pos >= 0 && pos <= 1) {
      audioPlayer.currentTime = pos * audioPlayer.duration;
    }
  });
}

// Initialize Authentication
setupAuthListeners();

// Add a maximum timeout for loading screen in case auth check takes too long
const maxLoadingTimeout = setTimeout(() => {
  if (!loadingScreen.classList.contains("hidden")) {
    loadingScreen.classList.add("opacity-0");
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      // If we hit timeout and no auth state is determined, show login screen
      if (appContainer.classList.contains("hidden") && loginScreen.classList.contains("hidden")) {
        loginScreen.classList.remove("hidden");
        loginScreen.classList.add("flex");
      }
    }, 500);
  }
}, 5000); // 5 second maximum wait time

// Expose functions for global access if needed
window.openAlbumScreen = openAlbumScreen;
window.openArtistScreen = openArtistScreen;
window.showScreen = showScreen;

// Function to migrate localStorage favorites to Firestore
function migrateLocalStorageToFirestore(userId) {
  console.log("Checking for localStorage data to migrate to Firestore");
  
  const migrationResult = {
    songs: [],
    albums: [],
    artists: []
  };
  
  // Check if we have any localStorage data
  const savedFavSongs = localStorage.getItem(`fav_songs_${userId}`);
  const savedFavAlbums = localStorage.getItem(`fav_albums_${userId}`);
  const savedFavArtists = localStorage.getItem(`fav_artists_${userId}`);
  
  // Parse and migrate localStorage data
  if (savedFavSongs) {
    try {
      migrationResult.songs = JSON.parse(savedFavSongs);
      console.log(`Migrated ${migrationResult.songs.length} favorite songs from localStorage`);
    } catch (e) {
      console.error("Error parsing favorite songs from localStorage:", e);
    }
  }
  
  if (savedFavAlbums) {
    try {
      migrationResult.albums = JSON.parse(savedFavAlbums);
      console.log(`Migrated ${migrationResult.albums.length} favorite albums from localStorage`);
    } catch (e) {
      console.error("Error parsing favorite albums from localStorage:", e);
    }
  }
  
  if (savedFavArtists) {
    try {
      migrationResult.artists = JSON.parse(savedFavArtists);
      console.log(`Migrated ${migrationResult.artists.length} favorite artists from localStorage`);
    } catch (e) {
      console.error("Error parsing favorite artists from localStorage:", e);
    }
  }
  
  return migrationResult;
}
