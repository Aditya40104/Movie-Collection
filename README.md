# Indian Movie Collection Tracker 🎬

A modern, real-time box office tracking website for Indian movies with comparison features, daily collection data, and beautiful visualizations.

## Features ✨

- 🏆 **Rankings**: Indian movies ranked by worldwide collection
- 📊 **Daily Tracking**: See day-by-day collection trends
- 🔍 **Search**: Find movies by name or language
- ⚖️ **Compare**: Compare 2+ movies side-by-side with charts
- 🌐 **Multi-language**: Display data in Hindi/English
- 📈 **Visualizations**: Line and bar charts for collections
- 📱 **Responsive**: Works on all devices
- 🎨 **Modern UI**: Beautiful gradient design

## Tech Stack 🛠️

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Routing**: React Router v6
- **Icons**: Lucide React
- **API**: TMDb API (for movie info)

## Getting Started 🚀

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd "c:\Users\shivn\OneDrive\Desktop\Movie Collection"
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Add your TMDb API key in `src/services/api.js`:
```javascript
const TMDB_API_KEY = 'YOUR_API_KEY_HERE'
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Project Structure 📁

```
Movie Collection/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.jsx
│   │   ├── MovieCard.jsx
│   │   └── SearchBar.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── MovieDetail.jsx
│   │   └── Compare.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── data/             # Sample data
│   │   └── moviesData.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Deployment 🌐

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to Netlify

## Monetization 💰

### Google AdSense Setup

1. Apply for Google AdSense account
2. Add your site to AdSense
3. Get approval (usually takes 1-2 weeks)
4. Add ad code to your components:

```jsx
// Example ad placement in Home.jsx
<div className="my-8">
  <ins className="adsbygoogle"
       style={{display:'block'}}
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot="XXXXXXXXXX"
       data-ad-format="auto"></ins>
</div>
```

5. Load AdSense script in `index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

## Data Sources 📡

### Current (Sample Data)
- Using static data in `src/data/moviesData.js`

### Future Integration Options
1. **TMDb API**: Movie metadata and posters (free)
2. **Manual Updates**: Google Sheets or admin panel
3. **Web Scraping**: Automate data from Box Office India, Bollywood Hungama
4. **Premium APIs**: If budget allows

## Roadmap 🗺️

- [ ] User authentication
- [ ] Favorites and watchlist
- [ ] Push notifications for new collections
- [ ] Admin panel for data updates
- [ ] Social sharing
- [ ] Mobile app (React Native)
- [ ] Regional language support

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Support 💬

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for Bollywood movie fans
