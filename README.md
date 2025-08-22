# **Savoro**

### **Project Overview**

Savoro is an AI-powered meal planner for developers. It provides quick, brain-boosting recipes with a clean, modern interface and playful animations using HTML, CSS, JavaScript, and GSAP.

---

### **Tech Stack**

- **Frontend:** HTML + CSS + JavaScript + GSAP animations
- **Backend:** Flask
- **Database:** SQLite (beginner-friendly, scalable)
- **AI:** Mock data (JSON) now → OpenAI/Hugging Face API later

---

### **Project Structure**

```
savoro/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── database.db
│   └── requirements.txt
├── frontend/
|		├── index.html            ← Home page
|		├── meal-planner.html     ← Meal Planner page
|		├── recipes.html          ← Recipes page
|		├── favorites.html        ← Favorites page
|		├── about.html            ← About page
|		├── pricing.html          ← Pricing page
|		├── css/
|		│   |── styles.css        ← Shared CSS for all pages
|   |   └── theme.css
|		├── js/
|		│   ├── main.js           ← Shared JS (e.g., navbar, common interactivity)
|		│   └── gsap-animations.js ← Page-specific GSAP animations
|   |   └── barba-init.js 
|		└── data/
|		    └── meals.json
├── README.md
└── .gitignore

```

---

### **Frontend Components**

- **Header:** Logo + navigation + search
- **HeroSection:** Animated illustration + tagline
- **MealPlanner:** User inputs → meal suggestions (fetched via JS from mock JSON / backend API)
- **RecipeCard:** Meal details + add to favorites (localStorage → DB later)
- **Favorites:** Shows saved meals
- **Footer:** Links & contact

**Animations (GSAP)**

- Hero fade/slide-in
- Hover effects on cards
- Smooth filter transitions
- Scroll-triggered effects for sections

---

### **Backend (Flask)**

- **Routes:**
    - `GET /api/meals` → fetch all meals
    - `GET /api/meals/<id>` → fetch single meal
    - `POST /api/favorites` → save a favorite
    - `GET /api/favorites` → get saved favorites
- **Database (SQLite)**
    - Table `meals`: id, name, ingredients, time, tags
    - Table `favorites`: id, meal_id, user_id (optional)

---

### **AI Integration**

- **Phase 1:** Mock meals JSON
- **Phase 2:** Replace JSON with AI API responses
- **Potential APIs:** OpenAI GPT-3.5, Hugging Face free models

---

### **Development Roadmap**

**Phase 1:** Frontend Prototype

- Build static HTML structure for all components
- Style using CSS (Flexbox/Grid, responsive layouts, cards, buttons)
- Add **GSAP animations**: hero, cards, filters, scroll effects
- Use mock JSON (`meals.json`) for meal data
- Test locally in browser

**Phase 2:** Backend Integration

- Flask API + SQLite
- Fetch data via **vanilla JS fetch()**
- Implement adding/removing favorites (localStorage → DB later)
- Test full frontend ↔ backend integration

**Phase 3:** AI-Powered Suggestions

- Replace mock JSON with AI API (OpenAI/Hugging Face)
- Update meal suggestions dynamically using JS fetch
- Maintain smooth GSAP animations with dynamic content

**Phase 4:** Polishing & Deployment

- Fully responsive using CSS media queries
- Optimize GSAP animations for performance
- Deploy frontend → Vercel / Netlify (HTML/CSS/JS deploys easily)
- Deploy backend → Render / Heroku
