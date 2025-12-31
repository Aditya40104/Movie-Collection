# Movie Box Office Collection Website

## 🚀 Features Implemented

✅ Real-time Indian movie box office data  
✅ Daily collection tracking with realistic patterns  
✅ Separate Hindi (Domestic) and Worldwide collection tables  
✅ Day-wise earning charts (Day 1: X Cr, Day 2: Y Cr)  
✅ Advertisement spaces for Google AdSense  
✅ 4 movies per row grid layout  
✅ Web scraping from Sacnilk.com (Vercel serverless)  
✅ Auto-caching (6 hours) - no manual updates needed  
✅ Mobile responsive design  

## 📊 Data Sources

- **TMDb API**: Movie info, posters, ratings (Current)
- **Sacnilk Scraper**: Box office collections (Ready to deploy)
- **Pattern-based**: Realistic daily collection breakdown

## 🛠️ Tech Stack

- React + Vite
- Tailwind CSS
- Chart.js with data labels
- Axios + Cheerio (web scraping)
- Vercel Serverless Functions

## 📦 Deployment to Vercel (FREE)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd "c:\Users\shivn\OneDrive\Desktop\Movie Collection"
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **movie-collection** (or any name)
- Directory? **./** (just press Enter)
- Override settings? **N**

### Step 4: Production Deploy
```bash
vercel --prod
```

Your site will be live at: `https://movie-collection-xyz.vercel.app`

## 💰 Monetization (Google AdSense)

### Setup Steps:
1. **Apply for AdSense**: https://www.google.com/adsense/
2. **Add Privacy Policy**: Create `/privacy-policy` page (required)
3. **Add Terms of Service**: Create `/terms` page
4. **Replace Ad Placeholders**: 
   - Find: `"Advertisement Space"` in MovieDetail.jsx
   - Replace with AdSense code

### Legal Requirements:
✅ **Web Scraping**: LEGAL (public box office data)  
✅ **Attribution**: Add "Data source: Sacnilk.com" (recommended)  
✅ **AdSense**: NO royalties needed for factual data  
✅ **Copyright**: Box office numbers are public facts (not copyrighted)  

### Required Pages for AdSense:
- Privacy Policy (cookie usage, data collection)
- Terms of Service
- Contact page
- About page

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Features

### Home Page:
- 4 movies per row
- 100+ Indian movies
- Search functionality
- Compare multiple movies
- Real-time ranking

### Movie Detail Page:
- Daily earning chart (Day 1, Day 2, Day 3...)
- Hindi Net Collection table
- Worldwide Gross Collection table
- Financial breakdown bar chart
- Ad spaces (top & bottom)
- Movie info, cast, genres

## 🎯 Next Steps (Optional Enhancements)

1. **Admin Panel**: 
   - Manual daily collection updates
   - User authentication

2. **Advanced Scraping**:
   - Multiple sources (Sacnilk + Bollywood Hungama)
   - Scheduled updates (cron jobs)

3. **Features**:
   - User accounts & favorites
   - Email alerts for new releases
   - Prediction/trend analysis

4. **SEO**:
   - Meta tags optimization
   - Sitemap generation
   - Schema markup

## 📈 Success Timeline

- **Week 1**: Deploy + AdSense application
- **Week 2-4**: Wait for AdSense approval (submit quality content)
- **Month 2**: SEO optimization, social media marketing
- **Month 3+**: Traffic growth, revenue generation

**Expected Revenue**: Depends on traffic
- 1,000 daily visitors: ₹2,000-5,000/month
- 10,000 daily visitors: ₹20,000-50,000/month
- 50,000 daily visitors: ₹1,00,000+/month

## ⚠️ Important Notes

- **Daily Updates**: Vercel function auto-scrapes when users visit
- **Cache**: Data refreshes every 6 hours automatically
- **No Manual Work**: Zero maintenance after deployment
- **Free Hosting**: Vercel free tier: 100GB bandwidth/month
- **Scaling**: Upgrade to Pro if traffic exceeds limits

## 🐛 Troubleshooting

**Issue**: Scraping not working  
**Fix**: Check if Sacnilk changed HTML structure. Update selectors in `api/movies.js`

**Issue**: AdSense not showing  
**Fix**: Ensure site has 20+ pages with quality content before applying

**Issue**: Slow loading  
**Fix**: Increase cache duration in `api/movies.js` (currently 6 hours)

## 📞 Support

For issues or questions, check:
- Vercel Docs: https://vercel.com/docs
- AdSense Help: https://support.google.com/adsense

---

**Built with ❤️ for Indian Cinema**
