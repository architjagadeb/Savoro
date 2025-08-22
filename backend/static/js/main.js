// Mobile navigation toggle
(function () {
  const hamburgerButton = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');
  if (hamburgerButton && nav) {
    hamburgerButton.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      hamburgerButton.setAttribute('aria-expanded', String(isOpen));
    });
  }
})();

// Simple testimonial slider
(function () {
  const slidesContainer = document.querySelector('.slides');
  const prev = document.querySelector('.slider-btn.prev');
  const next = document.querySelector('.slider-btn.next');

  if (!slidesContainer || !prev || !next) return;

  let index = 0;
  const total = slidesContainer.children.length;

  function update() {
    const width = slidesContainer.children[0].getBoundingClientRect().width + 18;
    slidesContainer.scrollTo({ left: index * width, behavior: 'smooth' });
  }

  prev.addEventListener('click', function () {
    index = (index - 1 + total) % total;
    update();
  });

  next.addEventListener('click', function () {
    index = (index + 1) % total;
    update();
  });
})();

// Newsletter form (demo only)
(function () {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('email');
  const message = document.getElementById('newsletter-message');
  if (!form || !input || !message) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = String(input.value || '').trim();
    const isValid = /.+@.+\..+/.test(email);
    if (!isValid) {
      message.textContent = 'Please enter a valid email address.';
      message.style.color = '#b45309';
      return;
    }
    message.textContent = 'Thanks for subscribing!';
    message.style.color = '#2a9d8f';
    input.value = '';
  });
})();

// Meal planner logic
(function () {
  const form = document.getElementById('preferences-form');
  const resultsRoot = document.getElementById('results');
  const modal = document.getElementById('recipe-modal');
  if (!form || !resultsRoot || !modal) return;

  /** Favorites handling */
  const FAVORITES_KEY = 'savoro_favorites';
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; }
  }
  function setFavorites(list) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(list)); }
  function isFavorite(id) { return getFavorites().includes(id); }
  function toggleFavorite(id) {
    const list = getFavorites();
    const idx = list.indexOf(id);
    if (idx >= 0) { list.splice(idx, 1); } else { list.push(id); }
    setFavorites(list);
  }

  /** Demo data generator (would be AI/API in production) */
  function generateMeals(preferences) {
    const base = [
      {
        id: 'avocado-toast',
        title: 'Avocado Code-Toast',
        time: 10,
        tags: ['Quick', 'Brain Food'],
        ingredients: ['Sourdough', 'Avocado', 'Lemon', 'Chili flakes', 'Olive oil'],
        steps: ['Toast bread', 'Mash avocado', 'Assemble', 'Season and serve']
      },
      {
        id: 'pasta-primavera',
        title: 'Pasta Primavera Dev-Style',
        time: 30,
        tags: ['Comfort', 'Balanced'],
        ingredients: ['Pasta', 'Zucchini', 'Tomatoes', 'Parmesan', 'Basil'],
        steps: ['Cook pasta', 'Sauté veggies', 'Combine', 'Top with cheese']
      },
      {
        id: 'chicken-bowl',
        title: 'High-Protein Chicken Bowl',
        time: 30,
        tags: ['High Protein', 'Meal Prep'],
        ingredients: ['Chicken', 'Brown rice', 'Broccoli', 'Soy sauce', 'Sesame'],
        steps: ['Grill chicken', 'Steam broccoli', 'Assemble bowl']
      },
      {
        id: 'tofu-stirfry',
        title: 'Low-Carb Tofu Stir-Fry',
        time: 20,
        tags: ['Low Carb', 'Quick'],
        ingredients: ['Tofu', 'Bell peppers', 'Zucchini', 'Tamari', 'Garlic'],
        steps: ['Sear tofu', 'Stir-fry veggies', 'Add sauce', 'Serve']
      },
      {
        id: 'keto-eggs',
        title: 'Keto Eggs & Greens',
        time: 10,
        tags: ['Keto', 'Quick'],
        ingredients: ['Eggs', 'Spinach', 'Butter', 'Salt', 'Pepper'],
        steps: ['Wilt spinach', 'Scramble eggs', 'Combine and plate']
      },
      {
        id: 'vegan-buddha',
        title: 'Vegan Buddha Bowl',
        time: 30,
        tags: ['Vegan', 'Balanced'],
        ingredients: ['Quinoa', 'Chickpeas', 'Sweet potato', 'Tahini', 'Greens'],
        steps: ['Roast sweet potato', 'Cook quinoa', 'Assemble bowl']
      }
    ];

    let list = base.slice();
    if (preferences.diet && preferences.diet !== 'any') {
      if (preferences.diet === 'Vegetarian') list = list.filter(m => !m.id.includes('chicken'));
      if (preferences.diet === 'Vegan') list = list.filter(m => m.tags.includes('Vegan'));
      if (preferences.diet === 'Keto') list = list.filter(m => m.tags.includes('Keto'));
    }
    if (preferences.time && preferences.time !== 'any') {
      const t = Number(preferences.time);
      list = list.filter(m => m.time <= t);
    }
    if (preferences.filters && preferences.filters.length) {
      list = list.filter(m => preferences.filters.every(f => m.tags.includes(f)) || preferences.filters.some(f => m.tags.includes(f)));
    }
    return list;
  }

  function createCard(meal) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('data-id', meal.id);
    card.innerHTML = `
      <div class="recipe-media">🍽️</div>
      <div class="recipe-body">
        <h3 class="recipe-title">${meal.title}</h3>
        <div class="meta"><span>⏱ ${meal.time} min</span></div>
        <p class="ingredients-preview">${meal.ingredients.slice(0, 4).join(', ')}...</p>
        <div class="badges">${meal.tags.map(t => `<span class="badge">${t}</span>`).join('')}</div>
        <div class="card-actions">
          <button type="button" class="fav-btn">${isFavorite(meal.id) ? '★ Favorited' : '☆ Add to Favorites'}</button>
        </div>
      </div>`;

    const favoriteButton = card.querySelector('.fav-btn');
    favoriteButton.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleFavorite(meal.id);
      const active = isFavorite(meal.id);
      favoriteButton.classList.toggle('active', active);
      favoriteButton.textContent = active ? '★ Favorited' : '☆ Add to Favorites';
    });

    card.addEventListener('click', function () { openModal(meal); });
    return card;
  }

  function openModal(meal) {
    const title = modal.querySelector('#modal-title');
    const meta = modal.querySelector('.modal-meta');
    const ingredients = modal.querySelector('.modal-ingredients');
    const steps = modal.querySelector('.modal-steps');
    title.textContent = meal.title;
    meta.textContent = `⏱ ${meal.time} min · ${meal.tags.join(' · ')}`;
    ingredients.innerHTML = meal.ingredients.map(i => `<li>${i}</li>`).join('');
    steps.innerHTML = meal.steps.map(s => `<li>${s}</li>`).join('');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (window.gsap) {
      gsap.fromTo('.modal-content', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
    }
  }

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    if (window.gsap) {
      gsap.to('.modal-content', { y: 10, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }});
    } else {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  modal.addEventListener('click', function (e) {
    const target = e.target;
    if (target.hasAttribute('data-close')) closeModal();
  });
  const closeBtn = modal.querySelector('[data-close]') || modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const preferences = {
      diet: formData.get('diet'),
      cuisine: formData.get('cuisine'),
      time: formData.get('time'),
      filters: formData.getAll('filter')
    };
    const meals = generateMeals(preferences);
    resultsRoot.innerHTML = '';
    meals.forEach(m => resultsRoot.appendChild(createCard(m)));

    if (window.gsap) {
      gsap.from('.recipe-card', { opacity: 0, scale: 0.98, duration: 0.4, stagger: 0.06, ease: 'power2.out' });
    }
  });

  // Animate form fields on load
  if (window.gsap) {
    gsap.from('.form-card .input-group', { opacity: 0, y: 12, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
  }
})();

// Recipes page filtering and modal
(function () {
  const form = document.getElementById('recipes-filters');
  const grid = document.getElementById('recipe-grid');
  const modal = document.getElementById('recipes-modal');
  const loadMore = document.getElementById('load-more');
  if (!form || !grid || !modal) return;

  const FAVORITES_KEY = 'savoro_favorites';
  function getFavorites() { try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; } }
  function setFavorites(list) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(list)); }
  function isFavorite(id) { return getFavorites().includes(id); }
  function toggleFavorite(id) { const list = getFavorites(); const i = list.indexOf(id); if (i>=0) list.splice(i,1); else list.push(id); setFavorites(list); }

  // Demo dataset
  const ALL_RECIPES = [
    { id: 'avocado-toast', title: 'Avocado Code-Toast', desc: 'Creamy, quick, brain-fueling toast.', time: 10, tags: ['Quick','Brain Food'], cuisine: 'American', diet: 'Vegetarian', ingredients: ['Sourdough','Avocado','Lemon','Chili','Olive oil'], steps:['Toast bread','Mash avocado','Assemble','Season'] },
    { id: 'vegan-buddha', title: 'Vegan Buddha Bowl', desc: 'Balanced plant-based bowl.', time: 30, tags: ['Vegan','Balanced'], cuisine: 'American', diet: 'Vegan', ingredients:['Quinoa','Chickpeas','Sweet potato','Tahini','Greens'], steps:['Roast sweet potato','Cook quinoa','Assemble'] },
    { id: 'pasta-primavera', title: 'Pasta Primavera Dev-Style', desc: 'Veggie-packed pasta between commits.', time: 30, tags: ['Comfort'], cuisine: 'Italian', diet: 'Vegetarian', ingredients:['Pasta','Zucchini','Tomatoes','Parmesan','Basil'], steps:['Cook pasta','Sauté veggies','Combine'] },
    { id: 'tofu-stirfry', title: 'Low-Carb Tofu Stir-Fry', desc: 'Light and quick stir-fry.', time: 20, tags: ['Low Carb','Quick'], cuisine: 'Chinese', diet: 'Vegan', ingredients:['Tofu','Bell peppers','Zucchini','Tamari','Garlic'], steps:['Sear tofu','Stir-fry veggies','Sauce','Serve'] },
    { id: 'keto-eggs', title: 'Keto Eggs & Greens', desc: 'Keto-friendly scramble.', time: 10, tags: ['Keto','Quick'], cuisine: 'American', diet: 'Keto', ingredients:['Eggs','Spinach','Butter','Salt','Pepper'], steps:['Wilt spinach','Scramble eggs','Combine'] },
    { id: 'chicken-bowl', title: 'High-Protein Chicken Bowl', desc: 'Protein to power builds.', time: 30, tags: ['High Protein','Meal Prep'], cuisine: 'American', diet: 'Non-Vegetarian', ingredients:['Chicken','Brown rice','Broccoli','Soy sauce','Sesame'], steps:['Grill chicken','Steam broccoli','Assemble'] },
    { id: 'paneer-tikka', title: 'Paneer Tikka Bites', desc: 'Smoky Indian favorite.', time: 30, tags:['High Protein'], cuisine: 'Indian', diet: 'Vegetarian', ingredients:['Paneer','Yogurt','Spices'], steps:['Marinate','Grill','Serve'] },
    { id: 'margherita', title: 'Margherita Mini Pizza', desc: 'Classic and comforting.', time: 20, tags:['Comfort'], cuisine: 'Italian', diet: 'Vegetarian', ingredients:['Dough','Tomato','Mozzarella','Basil'], steps:['Shape','Top','Bake'] },
    { id: 'fried-rice', title: 'Veg Fried Rice', desc: 'Quick wok favorite.', time: 15, tags:['Quick'], cuisine: 'Chinese', diet: 'Vegetarian', ingredients:['Rice','Carrot','Peas','Soy'], steps:['Stir-fry','Season','Serve'] }
  ];

  let page = 1;
  const PAGE_SIZE = 6;
  let current = ALL_RECIPES.slice();
  let lastQuery = {};

  function applyFilters(query) {
    let list = ALL_RECIPES.slice();
    if (query.cuisine && query.cuisine !== 'any') list = list.filter(r => r.cuisine === query.cuisine);
    if (query.diet && query.diet !== 'any') list = list.filter(r => r.diet === query.diet);
    if (query.time && query.time !== 'any') list = list.filter(r => r.time <= Number(query.time));
    if (query.tags && query.tags.length) list = list.filter(r => query.tags.some(t => r.tags.includes(t)));
    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(s) || (r.desc||'').toLowerCase().includes(s));
    }
    return list;
  }

  function cardTemplate(r) {
    const fav = isFavorite(r.id);
    return `
      <article class="recipe-card" data-id="${r.id}">
        <div class="recipe-media">🍲</div>
        <div class="recipe-body">
          <h3 class="recipe-title">${r.title}</h3>
          <p class="ingredients-preview">${r.desc}</p>
          <div class="meta"><span>⏱ ${r.time} min</span></div>
          <div class="badges">${r.tags.map(t => `<span class=\"badge\">${t}</span>`).join('')}</div>
          <div class="card-actions" style="gap:8px">
            <button type="button" class="btn btn-ghost view-btn">View Details</button>
            <button type="button" class="fav-btn ${fav ? 'active' : ''}">${fav ? '★ Favorited' : '☆ Add to Favorites'}</button>
          </div>
        </div>
      </article>`;
  }

  function render(reset = false) {
    const slice = current.slice(0, page * PAGE_SIZE);
    if (reset) grid.innerHTML = '';
    grid.innerHTML = slice.map(cardTemplate).join('');
    if (window.gsap) { gsap.from('.recipe-card', { opacity:0, y:12, duration:0.4, stagger:0.06, ease:'power2.out' }); }
    if (slice.length < current.length) {
      loadMore.style.display = '';
    } else if (loadMore) {
      loadMore.style.display = 'none';
    }
    attachCardHandlers();
  }

  function attachCardHandlers() {
    grid.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const card = e.target.closest('.recipe-card');
        const id = card.getAttribute('data-id');
        const recipe = ALL_RECIPES.find(r => r.id === id);
        openModal(recipe);
      });
    });
    grid.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const card = e.target.closest('.recipe-card');
        const id = card.getAttribute('data-id');
        toggleFavorite(id);
        const active = isFavorite(id);
        btn.classList.toggle('active', active);
        btn.textContent = active ? '★ Favorited' : '☆ Add to Favorites';
      });
    });
  }

  function openModal(recipe) {
    if (!recipe) return;
    modal.querySelector('#recipes-modal-title').textContent = recipe.title;
    modal.querySelector('.modal-meta').textContent = `⏱ ${recipe.time} min · ${recipe.tags.join(' · ')}`;
    modal.querySelector('.modal-ingredients').innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
    modal.querySelector('.modal-steps').innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join('');
    const favBtn = document.getElementById('recipes-fav-btn');
    const fav = isFavorite(recipe.id);
    favBtn.textContent = fav ? 'Remove Favorite' : 'Add to Favorites';
    favBtn.onclick = function () { toggleFavorite(recipe.id); const now = isFavorite(recipe.id); favBtn.textContent = now ? 'Remove Favorite' : 'Add to Favorites'; };
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (window.gsap) { gsap.fromTo('.modal-content', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }); }
  }

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    if (window.gsap) {
      gsap.to('.modal-content', { y: 10, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } });
    } else {
      modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    }
  }
  modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeModal(); });
  const closeBtn = modal.querySelector('[data-close]') || modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const query = {
      cuisine: data.get('cuisine'),
      diet: data.get('diet'),
      time: data.get('time'),
      tags: data.getAll('tag'),
      search: String(data.get('search') || '').trim()
    };
    lastQuery = query;
    current = applyFilters(query);
    page = 1;
    render(true);
  });

  if (loadMore) {
    loadMore.addEventListener('click', function () {
      page += 1; render();
    });
  }

  // Initial render
  current = applyFilters({});
  render(true);

  // Animate filter bar
  if (window.gsap) { gsap.from('.filters-bar .filter-group', { opacity: 0, y: 12, duration: 0.5, stagger: 0.08, ease: 'power2.out' }); }
})();

// Favorites page rendering
(function () {
  const grid = document.getElementById('favorites-grid');
  const empty = document.getElementById('favorites-empty');
  const sortSelect = document.getElementById('fav-sort');
  const modal = document.getElementById('favorites-modal');
  if (!grid || !empty || !modal) return;

  const FAVORITES_KEY = 'savoro_favorites';
  function getFavorites() { try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; } }
  function setFavorites(list) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(list)); }

  // Use same demo dataset as recipes for consistency
  const DATA = (function(){
    return [
      { id: 'avocado-toast', title: 'Avocado Code-Toast', desc: 'Creamy, quick, brain-fueling toast.', time: 10, tags: ['Quick','Brain Food'], ingredients:['Sourdough','Avocado','Lemon','Chili','Olive oil'], steps:['Toast bread','Mash avocado','Assemble','Season'] },
      { id: 'vegan-buddha', title: 'Vegan Buddha Bowl', desc: 'Balanced plant-based bowl.', time: 30, tags: ['Vegan','Balanced'], ingredients:['Quinoa','Chickpeas','Sweet potato','Tahini','Greens'], steps:['Roast sweet potato','Cook quinoa','Assemble'] },
      { id: 'pasta-primavera', title: 'Pasta Primavera Dev-Style', desc: 'Veggie-packed pasta between commits.', time: 30, tags: ['Comfort'], ingredients:['Pasta','Zucchini','Tomatoes','Parmesan','Basil'], steps:['Cook pasta','Sauté veggies','Combine'] },
      { id: 'tofu-stirfry', title: 'Low-Carb Tofu Stir-Fry', desc: 'Light and quick stir-fry.', time: 20, tags: ['Low Carb','Quick'], ingredients:['Tofu','Bell peppers','Zucchini','Tamari','Garlic'], steps:['Sear tofu','Stir-fry veggies','Sauce','Serve'] },
      { id: 'keto-eggs', title: 'Keto Eggs & Greens', desc: 'Keto-friendly scramble.', time: 10, tags: ['Keto','Quick'], ingredients:['Eggs','Spinach','Butter','Salt','Pepper'], steps:['Wilt spinach','Scramble eggs','Combine'] },
      { id: 'chicken-bowl', title: 'High-Protein Chicken Bowl', desc: 'Protein to power builds.', time: 30, tags: ['High Protein','Meal Prep'], ingredients:['Chicken','Brown rice','Broccoli','Soy sauce','Sesame'], steps:['Grill chicken','Steam broccoli','Assemble'] }
    ];
  })();

  function getById(id) { return DATA.find(d => d.id === id); }

  function cardTemplate(r) {
    return `
      <article class="recipe-card" data-id="${r.id}">
        <div class="recipe-media">💛</div>
        <div class="recipe-body">
          <h3 class="recipe-title">${r.title}</h3>
          <p class="ingredients-preview">${r.desc}</p>
          <div class="meta"><span>⏱ ${r.time} min</span></div>
          <div class="badges">${r.tags.map(t => `<span class=\"badge\">${t}</span>`).join('')}</div>
          <div class="card-actions" style="gap:8px">
            <button type="button" class="btn btn-ghost view-btn">View Recipe</button>
            <button type="button" class="fav-btn remove-btn">Remove from Favorites</button>
          </div>
        </div>
      </article>`;
  }

  function openModal(recipe) {
    if (!recipe) return;
    modal.querySelector('#favorites-modal-title').textContent = recipe.title;
    modal.querySelector('.modal-meta').textContent = `⏱ ${recipe.time} min · ${recipe.tags.join(' · ')}`;
    modal.querySelector('.modal-ingredients').innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
    modal.querySelector('.modal-steps').innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join('');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    if (window.gsap) { gsap.fromTo('.modal-content', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }); }
  }
  function closeModal() {
    if (!modal.classList.contains('open')) return;
    if (window.gsap) { gsap.to('.modal-content', { y: 10, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } }); }
    else { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
  }
  modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeModal(); });
  const closeBtn = modal.querySelector('[data-close]') || modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  function render() {
    const ids = getFavorites();
    const items = ids.map(getById).filter(Boolean);
    if (items.length === 0) {
      empty.hidden = false;
      grid.innerHTML = '';
      if (window.gsap) { gsap.from('.empty-state .empty-illustration', { y: -6, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut' }); }
      return;
    }
    empty.hidden = true;
    grid.innerHTML = items.map(cardTemplate).join('');
    if (window.gsap) { gsap.from('.recipe-card', { opacity: 0, y: 12, duration: 0.4, stagger: 0.06, ease: 'power2.out' }); }
    attachHandlers();
  }

  function attachHandlers() {
    grid.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const card = e.target.closest('.recipe-card');
        const id = card.getAttribute('data-id');
        openModal(getById(id));
      });
    });
    grid.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const card = e.target.closest('.recipe-card');
        const id = card.getAttribute('data-id');
        const current = getFavorites().filter(f => f !== id);
        setFavorites(current);
        if (window.gsap) {
          gsap.to(card, { opacity: 0, y: 10, duration: 0.2, onComplete: render });
        } else {
          render();
        }
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      const ids = getFavorites();
      let items = ids.map(getById).filter(Boolean);
      switch (sortSelect.value) {
        case 'time-asc': items.sort((a,b)=>a.time-b.time); break;
        case 'time-desc': items.sort((a,b)=>b.time-a.time); break;
        case 'title-asc': items.sort((a,b)=>a.title.localeCompare(b.title)); break;
        case 'title-desc': items.sort((a,b)=>b.title.localeCompare(a.title)); break;
      }
      // re-render with sorted order
      const idsSorted = items.map(i => i.id);
      setFavorites(idsSorted);
      render();
    });
  }

  render();
})();

// Pricing FAQ accordion and animations
(function () {
  const faq = document.querySelector('.faq-list');
  const pricingGrid = document.querySelector('.pricing-grid');
  if (!faq && !pricingGrid) return;

  if (faq) {
    faq.querySelectorAll('.faq-item').forEach(function (item) {
      const btn = item.querySelector('.faq-question');
      const ans = item.querySelector('.faq-answer');
      if (!btn || !ans) return;
      btn.addEventListener('click', function () {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        ans.hidden = isOpen;
        if (window.gsap) {
          if (!isOpen) {
            gsap.fromTo(ans, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.25, ease: 'power2.out' });
          } else {
            gsap.to(ans, { height: 0, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => { ans.hidden = true; ans.style.height = ''; } });
          }
        }
      });
    });
  }
})();

// Pricing cards: floating + tilt + hover effects
(function () {
  const pricingCards = document.querySelectorAll('.pricing .price-card');
  if (!pricingCards || !pricingCards.length) return;

  const maxTiltDeg = 10; // Slightly less tilt for pricing cards
  const floatAmplitude = 3; // Smaller amplitude for pricing cards
  const floatDurationMs = 2800;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  pricingCards.forEach(function (card, idx) {
    let rafId = 0;
    let hovering = false;
    let startTs = 0;

    // Subtle floating animation loop
    function floatStep(ts) {
      if (!startTs) startTs = ts;
      const t = (ts - startTs) / floatDurationMs + idx * 0.2;
      const y = Math.sin(t * Math.PI * 2) * floatAmplitude;
      if (!hovering) {
        card.style.transform = `translateY(${y}px)`;
      }
      rafId = requestAnimationFrame(floatStep);
    }
    rafId = requestAnimationFrame(floatStep);

    card.addEventListener('mousemove', function (e) {
      hovering = true;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = clamp(-dy * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
      const rotY = clamp(dx * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      card.classList.add('hovered');
    });

    card.addEventListener('mouseenter', function () {
      hovering = true;
      card.style.transition = 'transform 160ms ease';
      card.classList.add('hovered');
    });

    function resetCard() {
      hovering = false;
      card.style.transition = 'transform 220ms ease';
      card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
      card.classList.remove('hovered');
    }

    card.addEventListener('mouseleave', resetCard);
    card.addEventListener('blur', resetCard, true);
  });
})();

// Feature cards: floating + tilt + hover reveal (Why Savoro?)
(function () {
  const cards = document.querySelectorAll('.features .feature-card');
  if (!cards || !cards.length) return;

  const maxTiltDeg = 12; // clamp tilt
  const floatAmplitude = 4; // px
  const floatDurationMs = 2600;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  cards.forEach(function (card, idx) {
    let rafId = 0;
    let hovering = false;
    let startTs = 0;

    // Subtle floating animation loop
    function floatStep(ts) {
      if (!startTs) startTs = ts;
      const t = (ts - startTs) / floatDurationMs + idx * 0.15;
      const y = Math.sin(t * Math.PI * 2) * floatAmplitude;
      if (!hovering) {
        card.style.transform = `translateY(${y}px)`;
      }
      rafId = requestAnimationFrame(floatStep);
    }
    rafId = requestAnimationFrame(floatStep);

    card.addEventListener('mousemove', function (e) {
      hovering = true;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = clamp(-dy * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
      const rotY = clamp(dx * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      card.classList.add('hovered');
    });

    card.addEventListener('mouseenter', function () {
      hovering = true;
      card.style.transition = 'transform 160ms ease';
      card.classList.add('hovered');
    });

    function resetCard() {
      hovering = false;
      card.style.transition = 'transform 220ms ease';
      card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
      card.classList.remove('hovered');
    }

    card.addEventListener('mouseleave', resetCard);
    card.addEventListener('blur', resetCard, true);
  });
})();

// How It Works cards: entrance, hover reveal, floating + tilt
(function () {
  const cards = document.querySelectorAll('.how-it-works .step-card');
  if (!cards || !cards.length) return;

  const maxTiltDeg = 10;
  const floatAmplitude = 3;
  const floatDurationMs = 2800;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  cards.forEach(function (card, idx) {
    let hovering = false;
    let startTs = 0;
    let rafId = 0;

    function floatLoop(ts) {
      if (!startTs) startTs = ts;
      const t = (ts - startTs) / floatDurationMs + idx * 0.2;
      const y = Math.sin(t * Math.PI * 2) * floatAmplitude;
      if (!hovering) {
        card.style.transform = `translateY(${y}px)`;
      }
      rafId = requestAnimationFrame(floatLoop);
    }
    rafId = requestAnimationFrame(floatLoop);

    card.addEventListener('mousemove', function (e) {
      hovering = true;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = clamp(-dy * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
      const rotY = clamp(dx * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06)`;
      card.classList.add('hovered');
    });

    card.addEventListener('mouseenter', function () {
      hovering = true;
      document.querySelectorAll('.how-it-works .step-card.hovered').forEach(function (c) { if (c !== card) c.classList.remove('hovered'); });
      card.style.transition = 'transform 160ms ease';
      card.classList.add('hovered');
    });

    function resetCard() {
      hovering = false;
      card.style.transition = 'transform 220ms ease';
      card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
      card.classList.remove('hovered');
    }

    card.addEventListener('mouseleave', resetCard);
    card.addEventListener('blur', resetCard, true);
  });
})();

// Testimonials marquee: two-row infinite opposite scrolling with hover pause
(function () {
  let marqueeInitialized = false;
  let fallbackMode = false;
  
  // Wait for DOM to be ready and GSAP to be loaded
  function initMarquee() {
    // Prevent multiple initializations
    if (marqueeInitialized) return;
    
    // Check if GSAP is available
    if (!window.gsap) {
      console.log('GSAP not available, switching to CSS fallback');
      enableCSSFallback();
      return;
    }

    const rows = document.querySelectorAll('.testimonials .marquee-row');
    if (!rows || !rows.length) {
      console.log('No marquee rows found');
      return;
    }

    console.log('Found', rows.length, 'marquee rows');

    rows.forEach(function (row, idx) {
      const track = row.querySelector('.marquee-track');
      if (!track) {
        console.log('No track found for row', idx);
        return;
      }

      const speed = Number(row.getAttribute('data-speed') || (idx % 2 === 0 ? 35 : 28));
      const dir = row.classList.contains('top') ? -1 : 1;
      
      console.log('Row', idx, 'direction:', dir, 'speed:', speed);

      // Duplicate children to allow seamless loop
      const children = Array.from(track.children);
      children.forEach(function (child) { 
        track.appendChild(child.cloneNode(true)); 
      });

      // GSAP tween for infinite marquee
      const totalWidth = children.reduce((sum, el) => sum + el.getBoundingClientRect().width + 14, 0);
      const dist = totalWidth; // move by one set width
      
      console.log('Row', idx, 'total width:', totalWidth, 'distance:', dist);
      
      // Create a more robust animation that won't stop
      const tween = gsap.to(track, {
        x: dir * -dist,
        ease: 'none',
        duration: speed,
        repeat: -1,
        modifiers: {
          x: gsap.utils.wrap(0, dir * -dist) // Use gsap.utils.wrap for consistent looping
        },
        onUpdate: function() {
          // Force the animation to continue if it somehow stops
          if (this.progress() >= 0.99) {
            this.restart();
          }
        }
      });

      // Store the tween on the row for debugging
      row._marqueeTween = tween;

      // Hover pause on individual cards
      track.querySelectorAll('.tcard').forEach(function (card) {
        card.addEventListener('mouseenter', function () { 
          console.log('Pausing animation for row', idx);
          tween.pause(); 
        });
        card.addEventListener('mouseleave', function () { 
          console.log('Resuming animation for row', idx);
          tween.resume(); 
        });
      });

      // Add a restart mechanism in case the animation stops
      setInterval(() => {
        if (tween && !tween.isActive()) {
          console.log('Restarting stopped animation for row', idx);
          tween.restart();
        }
      }, 5000);

      console.log('GSAP animation started for row', idx);
    });

    marqueeInitialized = true;
    console.log('Marquee initialization complete');
  }

  // CSS fallback function
  function enableCSSFallback() {
    if (fallbackMode) return;
    
    console.log('Enabling CSS fallback animations');
    const rows = document.querySelectorAll('.testimonials .marquee-row');
    
    rows.forEach(function (row, idx) {
      const track = row.querySelector('.marquee-track');
      if (!track) return;
      
      // Duplicate children for seamless loop
      const children = Array.from(track.children);
      children.forEach(function (child) { 
        track.appendChild(child.cloneNode(true)); 
      });
      
      // Add CSS fallback class
      row.classList.add('marquee-css-fallback');
      
      // Add hover pause functionality using CSS
      track.querySelectorAll('.tcard').forEach(function (card) {
        card.addEventListener('mouseenter', function () {
          track.style.animationPlayState = 'paused';
        });
        card.addEventListener('mouseleave', function () {
          track.style.animationPlayState = 'running';
        });
      });
    });
    
    fallbackMode = true;
    marqueeInitialized = true;
  }

  // Try to initialize immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarquee);
  } else {
    initMarquee();
  }

  // Also try after a short delay to ensure GSAP is loaded
  setTimeout(initMarquee, 200);
  
  // Additional safety check after a longer delay
  setTimeout(initMarquee, 1000);
  
  // Listen for GSAP load events
  document.addEventListener('gsap:loaded', initMarquee);
  
  // Final fallback - if nothing works after 3 seconds, use CSS
  setTimeout(() => {
    if (!marqueeInitialized) {
      console.log('Final fallback: switching to CSS animations');
      enableCSSFallback();
    }
  }, 3000);
})();

// About page cards: floating + tilt + hover reveal (same as index.html feature cards)
(function () {
  const aboutCards = document.querySelectorAll('.about-mission .about-card, .about-steps .step-card, .about-team .team-card');
  if (!aboutCards || !aboutCards.length) return;

  const maxTiltDeg = 12; // clamp tilt
  const floatAmplitude = 4; // px
  const floatDurationMs = 2600;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  aboutCards.forEach(function (card, idx) {
    let rafId = 0;
    let hovering = false;
    let startTs = 0;

    // Subtle floating animation loop
    function floatStep(ts) {
      if (!startTs) startTs = ts;
      const t = (ts - startTs) / floatDurationMs + idx * 0.15;
      const y = Math.sin(t * Math.PI * 2) * floatAmplitude;
      if (!hovering) {
        card.style.transform = `translateY(${y}px)`;
      }
      rafId = requestAnimationFrame(floatStep);
    }
    rafId = requestAnimationFrame(floatStep);

    card.addEventListener('mousemove', function (e) {
      hovering = true;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = clamp(-dy * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
      const rotY = clamp(dx * maxTiltDeg, -maxTiltDeg, maxTiltDeg);
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      card.classList.add('hovered');
    });

    card.addEventListener('mouseenter', function () {
      hovering = true;
      card.style.transition = 'transform 160ms ease';
      card.classList.add('hovered');
    });

    function resetCard() {
      hovering = false;
      card.style.transition = 'transform 220ms ease';
      card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
      card.classList.remove('hovered');
    }

    card.addEventListener('mouseleave', resetCard);
    card.addEventListener('blur', resetCard, true);
  });
})();



