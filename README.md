# XoMusic

A modern, responsive music streaming Progressive Web Application (PWA) built with HTML, Tailwind CSS, and JavaScript. XoMusic provides a seamless music streaming experience across all devices with both online and offline capabilities.

![XoMusic Screenshot](img/og-image.jpg)

## Features

### Core Features
- **User Authentication**: Login and sign up with email/password or Google
- **Featured Albums**: Browse the latest albums with beautiful cover art
- **Popular Artists**: Discover trending artists with easy navigation
- **Discover Songs**: Listen to new songs that update on each visit
- **Search**: Find your favorite songs, albums, and artists instantly
- **Playlists**: Create, view, and manage curated playlists
- **Media Controls**: Full playback control including shuffle and repeat
- **Sleep Timer**: Set a timer to automatically stop playback

### Enhanced Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop experiences
- **Theme Toggle**: Switch between dark and light mode based on preference
- **PWA Support**: Install as a standalone app on any device
- **Offline Playback**: Listen to your favorite tracks without internet
- **Mini Player**: Continue browsing while controlling playback
- **Custom 404 Page**: User-friendly error handling
- **SEO Optimized**: Structured data and comprehensive meta tags
- **Share Functionality**: Share songs and playlists with friends

## Technologies Used

- **Frontend**:
  - HTML5
  - Tailwind CSS
  - JavaScript (ES6+)
  - Boxicons for UI elements

- **PWA Features**:
  - Service Workers
  - Web App Manifest
  - Cache API

- **APIs & Services**:
  - Firebase Authentication
  - Media Session API
  - Web Share API

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for initial load and streaming

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/xomusic.git
   cd xomusic
   ```

2. Open `index.html` in your browser or use a local server
   ```bash
   # Using Python's built-in server
   python -m http.server
   ```

3. For the best experience, install as a PWA
   - Click the install prompt when it appears
   - Or use your browser's "Install App" option

4. Sign up for an account or log in

5. Start exploring and playing music!

## Project Structure

```
XoMusic/
│
├── index.html          # Main application HTML
├── 404.html            # Custom error page
├── site.webmanifest    # PWA manifest file
├── css/
│   ├── style.css       # Base styles
│   └── responsive.css   # Responsive design styles
├── js/
│   ├── App.js          # Main application logic
│   ├── data.js         # Data handling and API calls
│   └── desktop.js      # Desktop-specific enhancements
├── img/                # Images and icons
└── README.md           # This file
```

## Data Sources

The application fetches data from the following endpoints:
- All Songs: https://raw.githubusercontent.com/urlinq/xomusic/refs/heads/main/allsongs.json
- Discover Songs: https://raw.githubusercontent.com/urlinq/xomusic/refs/heads/main/discover-songs.json
- Featured Albums: https://raw.githubusercontent.com/urlinq/xomusic/refs/heads/main/featured-albums.json
- Artists: https://raw.githubusercontent.com/urlinq/xomusic/refs/heads/main/artists.json

## Browser Compatibility

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Opera (latest 2 versions)
- Mobile browsers (iOS Safari, Android Chrome)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes only.

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [Boxicons](https://boxicons.com/)
- [Firebase](https://firebase.google.com/)
- [MDN Web Docs](https://developer.mozilla.org/)