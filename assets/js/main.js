/**
 * ============================================
 * ALEX REYES PHOTOGRAPHY PORTFOLIO
 * Main JavaScript - Consolidated Module
 * VERSIÓN FINAL - Todos los cambios aplicados
 * ============================================
 */

(function() {
  'use strict';
  
  /* ==========================================
     THEME TOGGLE
     ========================================== */
  
  const ThemeToggle = (() => {
    const THEME_KEY = 'alex-reyes-theme';
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    function getSavedTheme() {
      return localStorage.getItem(THEME_KEY) || 'dark';
    }
    
    function saveTheme(theme) {
      localStorage.setItem(THEME_KEY, theme);
    }
    
    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#fafafa');
      }
      
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
      }
    }
    
    function toggleTheme() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      applyTheme(newTheme);
      saveTheme(newTheme);
      
      announceThemeChange(newTheme);
    }
    
    function announceThemeChange(theme) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Theme switched to ${theme} mode`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
    
    function init() {
      const savedTheme = getSavedTheme();
      applyTheme(savedTheme);
      
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
      }
      
      if (window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        prefersDark.addEventListener('change', (e) => {
          if (!localStorage.getItem(THEME_KEY)) {
            const theme = e.matches ? 'dark' : 'light';
            applyTheme(theme);
          }
        });
      }
    }
    
    return { init, toggle: toggleTheme, get: () => html.getAttribute('data-theme') };
  })();
  
  /* ==========================================
     NAVIGATION CONTROLLER
     ========================================== */
  
  const Navigation = (() => {
    const menuButton = document.getElementById('menuButton');
    const homeButton = document.getElementById('homeButton');
    const mainMenu = document.getElementById('mainMenu');
    const menuLinks = document.querySelectorAll('.menu-link');
    const infiniteWorld = document.getElementById('infiniteWorld');
    const mainContent = document.getElementById('main-content');
    
    let isMenuOpen = false;
    let currentMode = 'infinite';
    
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      isMenuOpen ? openMenu() : closeMenu();
    }
    
    function openMenu() {
      mainMenu.setAttribute('data-state', 'open');
      menuButton.setAttribute('aria-expanded', 'true');
      
      if (window.gsap) {
        gsap.to(mainMenu, {
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    }
    
    function closeMenu() {
      mainMenu.setAttribute('data-state', 'closed');
      menuButton.setAttribute('aria-expanded', 'false');
      isMenuOpen = false;
      
      if (window.gsap) {
        gsap.to(mainMenu, {
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }
    
    function transitionToScrollMode(targetSection) {
      if (currentMode === 'scroll') return;
      
      currentMode = 'scroll';
      closeMenu();
      
      if (window.gsap) {
        const tl = gsap.timeline({
          onComplete: () => {
            if (targetSection) {
              const section = document.querySelector(targetSection);
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }
        });
        
        tl.to(infiniteWorld, {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: 'power2.inOut'
        })
        .set(infiniteWorld, { attr: { 'data-state': 'hidden' } })
        .set(mainContent, { attr: { 'data-state': 'visible' } })
        .fromTo(mainContent, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );
      } else {
        infiniteWorld.setAttribute('data-state', 'hidden');
        mainContent.setAttribute('data-state', 'visible');
        
        if (targetSection) {
          setTimeout(() => {
            const section = document.querySelector(targetSection);
            if (section) {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }
      }
      
      document.body.style.overflow = 'auto';
    }
    
    function transitionToInfiniteMode() {
      if (currentMode === 'infinite') return;
      
      currentMode = 'infinite';
      closeMenu();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        if (window.gsap) {
          const tl = gsap.timeline();
          
          tl.to(mainContent, {
            opacity: 0,
            y: 50,
            duration: 0.4,
            ease: 'power2.in'
          })
          .set(mainContent, { attr: { 'data-state': 'hidden' } })
          .set(infiniteWorld, { attr: { 'data-state': 'active' } })
          .fromTo(infiniteWorld,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
          )
          .add(() => {
            if (window.InfiniteWorld && window.InfiniteWorld.replayEntranceAnimation) {
              window.InfiniteWorld.replayEntranceAnimation();
            }
          });
        } else {
          mainContent.setAttribute('data-state', 'hidden');
          infiniteWorld.setAttribute('data-state', 'active');
        }
        
        document.body.style.overflow = 'hidden';
      }, 300);
    }
    
    function handleMenuLinkClick(e) {
      e.preventDefault();
      const targetHref = e.currentTarget.getAttribute('href');
      transitionToScrollMode(targetHref);
    }
    
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
      
      if ((e.key === ' ' || e.key === 'Enter') && document.activeElement === menuButton) {
        e.preventDefault();
        toggleMenu();
      }
    }
    
    function init() {
      if (menuButton) menuButton.addEventListener('click', toggleMenu);
      if (homeButton) homeButton.addEventListener('click', transitionToInfiniteMode);
      
      menuLinks.forEach(link => {
        link.addEventListener('click', handleMenuLinkClick);
      });
      
      document.addEventListener('keydown', handleKeyDown);
      
      document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !mainMenu.contains(e.target) && 
            !menuButton.contains(e.target)) {
          closeMenu();
        }
      });
      
      document.body.style.overflow = 'hidden';
    }
    
    return {
      init,
      openMenu,
      closeMenu,
      toScrollMode: transitionToScrollMode,
      toInfiniteMode: transitionToInfiniteMode,
      getCurrentMode: () => currentMode
    };
  })();
  
  /* ==========================================
     INFINITE WORLD CONTROLLER
     ========================================== */
  
  const InfiniteWorld = (() => {
    const worldViewport = document.getElementById('worldViewport');
    const panInstructions = document.getElementById('panInstructions');
    
    const CONFIG = {
      worldWidth: 3000,
      worldHeight: 2400,
      dragSensitivity: 1,
      boundaryWrap: false, // Disabled for smoother panning
      animationDuration: 0.6,
      hoverScale: 1.1
    };
    
    let state = {
      viewportX: 0,
      viewportY: 0,
      isDragging: false,
      wasDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      lastX: 0,
      lastY: 0,
      hasInteracted: false
    };
    
    const imageData = [
      // FILA 1
      { id: 1,  x: 160,  y: 140,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Captura%20de%20pantalla%202026-01-07%20a%20las%2012.17.15.png", title: "35mm", subtitle: "Color" },
      { id: 2,  x: 610,  y: 140,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Jake%20Inez.jpeg", title: "Portra", subtitle: "35mm" },
      { id: 3,  x: 1060, y: 140,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Marija%20Mihailova%20Photographer.jpeg", title: "120", subtitle: "Color" },
      { id: 4,  x: 1510, y: 140,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Stories%20in%20the%20Streets%20of%20Barcelona_%20__%20Comment%20_%20PRESET%20_%20and%20I_ll%20dm%20you%20the%20link%20to%20my%20Lightroom%20Presets%20pack%20that%20I%20have%20edited%20all%20my%20photos%20with.jpeg", title: "Street", subtitle: "Barcelona" },
      { id: 5,  x: 1960, y: 140,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(41).jpeg", title: "C-41", subtitle: "Modern" },
      { id: 6,  x: 2410, y: 140,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(43).jpeg", title: "BW", subtitle: "Contrast" },
      // FILA 2
      { id: 7,  x: 160,  y: 560,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(42).jpeg", title: "Neon", subtitle: "ISO 800" },
      { id: 8,  x: 610,  y: 560,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/0f32eb16-a974-4f58-b2a3-1bb69b8b58f1.jpeg", title: "Soft", subtitle: "Light" },
      { id: 9,  x: 1060, y: 560,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(44).jpeg", title: "Daylight", subtitle: "Grain" },
      { id: 10, x: 1510, y: 560,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(38).jpeg", title: "Clean", subtitle: "Modern" },
      { id: 11, x: 1960, y: 560,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(39).jpeg", title: "Street", subtitle: "Grain" },
      { id: 12, x: 2410, y: 560,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(45).jpeg", title: "Warm", subtitle: "Tones" },
      // FILA 3 (zona central — más rellena)
      { id: 13, x: 360,  y: 980,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(40).jpeg", title: "Portrait", subtitle: "35mm" },
      { id: 14, x: 840,  y: 980,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(42).jpeg", title: "Night", subtitle: "Push" },
      { id: 15, x: 1320, y: 980,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Marija%20Mihailova%20Photographer.jpeg", title: "Editorial", subtitle: "Film" },
      { id: 16, x: 1800, y: 980,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Jake%20Inez.jpeg", title: "Frame", subtitle: "Extra" },
      { id: 17, x: 2280, y: 980,  src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Martin%20Parr.jpeg", title: "Classic", subtitle: "Look" },
      // FILA 4
      { id: 18, x: 160,  y: 1400, src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(46).jpeg", title: "Europe", subtitle: "Street" },
      { id: 19, x: 610,  y: 1400, src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(47).jpeg", title: "Analog", subtitle: "Color" },
      { id: 20, x: 1060, y: 1400, src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(48).jpeg", title: "Frames", subtitle: "Daily" },
      { id: 21, x: 1510, y: 1400, src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(49).jpeg", title: "Details", subtitle: "Mood" },
      // FILA 5 (abajo)
      { id: 22, x: 1960, y: 1820, src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/kit%20riva.jpeg", title: "Coastal", subtitle: "Italy" },
      { id: 23, x: 2410, y: 1820, src: "https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/love%20in%20Europe.jpeg", title: "Love", subtitle: "Europe" }
    ];
    
    function createImageCard(data) {
      const card = document.createElement('div');
      card.className = 'image-card';
      card.setAttribute('data-id', data.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View ${data.title} - ${data.subtitle}`);
      
      card.style.left = `${data.x}px`;
      card.style.top = `${data.y}px`;
      
      card.innerHTML = `
        <img src="${data.src}" alt="${data.title}" loading="lazy" draggable="false">
        <div class="image-card-frame"></div>
        <div class="image-card-info">
          <h3 class="image-card-title">${data.title}</h3>
          <p class="image-card-subtitle">${data.subtitle}</p>
        </div>
      `;
      
      // Click handler - only if we didn't drag
      card.addEventListener('click', (e) => {
        if (!state.wasDragging) {
          handleImageClick(data);
        }
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleImageClick(data);
        }
      });
      
      if (window.gsap) {
        card.addEventListener('mouseenter', () => {
          if (!state.isDragging) {
            gsap.to(card, {
              scale: CONFIG.hoverScale,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      }
      
      return card;
    }
    
    function renderImageCards() {
      imageData.forEach(data => {
        const card = createImageCard(data);
        worldViewport.appendChild(card);
      });
    }
    
    function updateViewport() {
      // Simplified - no boundary wrapping for smoother experience
      // Just apply the transform directly
      worldViewport.style.transform = `translate3d(${state.viewportX}px, ${state.viewportY}px, 0)`;
    }
    
    function handleDragStart(e) {
      state.isDragging = true;
      state.wasDragging = false;
      state.hasInteracted = true;
      
      const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
      const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
      
      state.dragStartX = clientX - state.viewportX;
      state.dragStartY = clientY - state.viewportY;
      state.lastX = clientX;
      state.lastY = clientY;
      
      worldViewport.classList.add('dragging');
      
      // Disable pointer events on cards during drag
      const cards = document.querySelectorAll('.image-card');
      cards.forEach(card => card.style.pointerEvents = 'none');
      
      if (panInstructions) {
        panInstructions.classList.add('hidden');
      }
    }
    
    function handleDragMove(e) {
      if (!state.isDragging) return;
      
      e.preventDefault();
      
      const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
      const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
      
      // Check if we actually moved
      const deltaX = Math.abs(clientX - state.lastX);
      const deltaY = Math.abs(clientY - state.lastY);
      
      if (deltaX > 2 || deltaY > 2) {
        state.wasDragging = true;
      }
      
      state.viewportX = (clientX - state.dragStartX) * CONFIG.dragSensitivity;
      state.viewportY = (clientY - state.dragStartY) * CONFIG.dragSensitivity;
      
      updateViewport();
    }
    
    function handleDragEnd() {
      if (!state.isDragging) return;
      
      state.isDragging = false;
      worldViewport.classList.remove('dragging');
      
      // Re-enable pointer events on cards
      const cards = document.querySelectorAll('.image-card');
      cards.forEach(card => card.style.pointerEvents = 'auto');
      
      // Reset wasDragging after a short delay to allow click event to check it
      setTimeout(() => {
        state.wasDragging = false;
      }, 100);
    }
    
    function handleImageClick(data) {
      if (window.ImageDetail) {
        window.ImageDetail.open(data);
      }
    }
    
    function playEntranceAnimation() {
      if (!window.gsap) return;
      
      const cards = document.querySelectorAll('.image-card');
      
      gsap.fromTo(cards, 
        {
          scale: 0.5,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: CONFIG.animationDuration,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          delay: 0.5
        }
      );
    }
    
    function replayEntranceAnimation() {
      if (!window.gsap) return;
      
      const cards = document.querySelectorAll('.image-card');
      
      gsap.fromTo(cards,
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: 'power2.out'
        }
      );
    }
    
    function centerViewport() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Center on the middle of the world
      state.viewportX = -(CONFIG.worldWidth / 2 - viewportWidth / 2);
      state.viewportY = -(CONFIG.worldHeight / 2 - viewportHeight / 2);
      
      updateViewport();
    }
    
    function handleResize() {
      updateViewport();
    }
    
    function init() {
      if (!worldViewport) {
        console.error('World viewport element not found');
        return;
      }
      
      const container = document.getElementById('infiniteWorld');
      
      renderImageCards();
      centerViewport();
      
      // Attach drag events to the container for full coverage
      if (container) {
        container.addEventListener('mousedown', handleDragStart);
      }
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      
      // Prevent default drag on images
      worldViewport.addEventListener('dragstart', (e) => e.preventDefault());
      
      // Touch events
      if (container) {
        container.addEventListener('touchstart', handleDragStart, { passive: false });
      }
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      
      // Window resize
      window.addEventListener('resize', handleResize);
      
      // Play entrance animation
      setTimeout(playEntranceAnimation, 100);
      
      console.log('✓ Infinite world initialized with', imageData.length, 'images');
    }
    
    return {
      init,
      centerViewport,
      replayEntranceAnimation,
      getImageData: () => imageData,
      getState: () => state
    };
  })();
  
  /* ==========================================
     IMAGE DETAIL CONTROLLER
     ========================================== */
  
  const ImageDetail = (() => {
    const overlay = document.getElementById('imageDetailOverlay');
    const detailContent = document.getElementById('detailContent');
    const closeButton = document.getElementById('closeDetail');
    
    let currentImageData = null;
    
    const projectDetails = {
      1: {
        title: '35mm Photography',
        subtitle: 'Color Film',
        description: 'Classic 35mm color photography capturing authentic moments with rich, natural tones. Each frame tells a story through careful composition and timing.',
        gallery: [
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Captura%20de%20pantalla%202026-01-07%20a%20las%2012.17.15.png',
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(41).jpeg',
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(38).jpeg'
        ]
      },
      2: {
        title: 'Portra Series',
        subtitle: '35mm Portrait Film',
        description: 'Shot on Kodak Portra, known for its incredible skin tones and subtle color palette. Perfect for portrait and documentary work.',
        gallery: [
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Jake%20Inez.jpeg',
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/0f32eb16-a974-4f58-b2a3-1bb69b8b58f1.jpeg',
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(40).jpeg'
        ]
      },
      3: {
        title: 'Medium Format',
        subtitle: '120 Color Film',
        description: 'The detail and depth of medium format photography. Larger negatives provide stunning clarity and dynamic range.',
        gallery: [
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/Marija%20Mihailova%20Photographer.jpeg',
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(44).jpeg',
          'https://ik.imagekit.io/k0qx6odcz/tr:w-900,q-80,f-auto/_%20(45).jpeg'
        ]
      }
    };
    
    function getProjectDetails(id) {
      return projectDetails[id] || {
        title: 'Photography Project',
        subtitle: 'Film Photography',
        description: 'A curated collection showcasing analog photography with attention to composition, lighting, and storytelling.',
        gallery: []
      };
    }
    
    function renderDetailContent(imageData) {
      const details = getProjectDetails(imageData.id);
      
      detailContent.innerHTML = `
        <div class="detail-grid">
          <div class="detail-main-image">
            <img src="${imageData.src}" alt="${details.title}" class="main-detail-img">
          </div>
          
          <div class="detail-info-section">
            <h2 id="detailTitle" class="detail-title">${details.title}</h2>
            <p class="detail-subtitle">${details.subtitle}</p>
            <p class="detail-description">${details.description}</p>
            
            <div class="detail-gallery">
              <h3 class="gallery-title">More from this shoot</h3>
              <div class="gallery-grid">
                ${details.gallery.map((imgSrc, index) => `
                  <div class="gallery-item">
                    <img src="${imgSrc}" alt="${details.title} - Image ${index + 1}" loading="lazy">
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
      
      const galleryItems = detailContent.querySelectorAll('.gallery-item img');
      galleryItems.forEach(img => {
        img.addEventListener('click', () => {
          const mainImg = detailContent.querySelector('.main-detail-img');
          if (mainImg) {
            if (window.gsap) {
              gsap.to(mainImg, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                  mainImg.src = img.src;
                  gsap.to(mainImg, { opacity: 1, duration: 0.3 });
                }
              });
            } else {
              mainImg.src = img.src;
            }
          }
        });
      });
    }
    
    function open(imageData) {
      currentImageData = imageData;
      
      renderDetailContent(imageData);
      
      overlay.setAttribute('data-visible', 'true');
      document.body.style.overflow = 'hidden';
      
      if (window.gsap) {
        gsap.fromTo(overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        
        gsap.fromTo(overlay.querySelector('.detail-container'),
          { scale: 0.9, y: 50, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.4)', delay: 0.1 }
        );
      }
      
      setTimeout(() => {
        if (closeButton) closeButton.focus();
      }, 400);
    }
    
    function close() {
      if (window.gsap) {
        const tl = gsap.timeline({
          onComplete: () => {
            overlay.setAttribute('data-visible', 'false');
            document.body.style.overflow = '';
            currentImageData = null;
          }
        });
        
        tl.to(overlay.querySelector('.detail-container'), {
          scale: 0.9,
          y: 50,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        })
        .to(overlay, {
          opacity: 0,
          duration: 0.2
        }, '-=0.1');
      } else {
        overlay.setAttribute('data-visible', 'false');
        document.body.style.overflow = '';
        currentImageData = null;
      }
    }
    
    function handleKeyDown(e) {
      if (overlay.getAttribute('data-visible') === 'true') {
        if (e.key === 'Escape') {
          close();
        }
      }
    }
    
    function handleOverlayClick(e) {
      if (e.target === overlay) {
        close();
      }
    }
    
    function init() {
      if (!overlay || !detailContent || !closeButton) {
        console.error('Image detail elements not found');
        return;
      }
      
      closeButton.addEventListener('click', close);
      overlay.addEventListener('click', handleOverlayClick);
      document.addEventListener('keydown', handleKeyDown);
      
      console.log('✓ Image detail controller initialized');
    }
    
    return {
      init,
      open,
      close,
      getCurrentImage: () => currentImageData
    };
  })();
  
  /* ==========================================
     WORK DETAIL CONTROLLER (for Selected Work section)
     ========================================== */
  
  const WorkDetail = (() => {
    const workProjects = {
      'editorial-fashion': {
        title: 'Editorial Fashion',
        subtitle: 'Spring 2025 Collection',
        description: 'A comprehensive editorial series showcasing the latest spring trends. Shot on location across New York City, this project combines street style with high fashion aesthetics. Working with emerging designers and established brands, we created a visual narrative that captures the energy and optimism of the season.',
        details: [
          'Client: Vogue Italia',
          'Location: New York City',
          'Duration: 3-day shoot',
          'Models: 8 talents',
          'Creative Direction: Alex Reyes'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=1600&fit=crop'
      },
      'portrait-series': {
        title: 'Portrait Series',
        subtitle: 'Character Studies 2024',
        description: 'An intimate exploration of human expression and personality. This ongoing series focuses on capturing authentic moments and genuine emotions. Each portrait session is a collaboration, creating a safe space for subjects to reveal their true selves.',
        details: [
          'Project Type: Personal Work',
          'Format: Medium Format Film',
          'Subjects: 25+ individuals',
          'Timeline: 6 months',
          'Exhibition: Shown at Gallery XYZ'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1500336624523-d727130c3328?w=800&h=1200&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=1600&fit=crop'
      },
      'concert-photography': {
        title: 'Live Music Documentation',
        subtitle: 'Concert Series 2024',
        description: 'Capturing the raw energy and emotion of live performances. From intimate club shows to major festival stages, this work documents musicians and audiences in the moment, preserving the ephemeral magic of live music.',
        details: [
          'Venues: 15+ locations',
          'Artists: 30+ performers',
          'Published: Rolling Stone, Pitchfork',
          'Format: Digital + Film',
          'Coverage: Full tour documentation'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1533561797500-4fdc94664338?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1551877027-9fd8f5c79c07?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=1200&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=1600&fit=crop'
      },
      'product-photography': {
        title: 'Commercial Product',
        subtitle: 'Studio Work',
        description: 'High-end product photography for leading brands. Combining technical precision with creative vision to create images that not only showcase products but tell their stories.',
        details: [
          'Clients: Nike, Apple, Patagonia',
          'Studio: Full lighting setup',
          'Post-production: Advanced retouching',
          'Deliverables: Print & Web',
          'Usage: Global campaigns'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=1600&fit=crop'
      },
      'documentary': {
        title: 'Documentary Series',
        subtitle: 'Real Stories',
        description: 'Long-form documentary photography projects that dive deep into communities and subcultures. This work requires time, trust, and a commitment to authentic storytelling.',
        details: [
          'Projects: 5 long-form series',
          'Published: National Geographic, TIME',
          'Awards: World Press Photo nominee',
          'Impact: Community exhibitions',
          'Duration: 2+ years ongoing'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1506794778225-853f2d18f76a?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1512412733873-7ff4e3bb7a3f?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1200&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1506794778225-853f2d18f76a?w=1200&h=1600&fit=crop'
      },
      'architecture': {
        title: 'Architecture & Interiors',
        subtitle: 'Built Environment Studies',
        description: 'Architectural photography that reveals the relationship between space, light, and human experience. From minimalist interiors to bold exteriors, capturing how we inhabit the built world.',
        details: [
          'Clients: Architectural Digest, Dwell',
          'Projects: 20+ buildings',
          'Locations: 8 cities',
          'Equipment: Tilt-shift lenses',
          'Style: Clean, geometric compositions'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=800&h=1200&fit=crop',
          'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=800&h=1200&fit=crop'
        ],
        mainImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=1600&fit=crop'
      }
    };
    
    function openWorkDetail(projectId) {
      const project = workProjects[projectId];
      if (!project) return;
      
      const overlay = document.getElementById('imageDetailOverlay');
      const detailContent = document.getElementById('detailContent');
      
      if (!overlay || !detailContent) return;
      
      detailContent.innerHTML = `
        <div class="detail-grid">
          <div class="detail-main-image">
            <img src="${project.mainImage}" alt="${project.title}" class="main-detail-img">
          </div>
          
          <div class="detail-info-section">
            <h2 class="detail-title">${project.title}</h2>
            <p class="detail-subtitle">${project.subtitle}</p>
            <p class="detail-description">${project.description}</p>
            
            <div class="project-details-list">
              <h3 class="gallery-title">Project Details</h3>
              <ul class="details-list">
                ${project.details.map(detail => `<li>${detail}</li>`).join('')}
              </ul>
            </div>
            
            <div class="detail-gallery">
              <h3 class="gallery-title">Gallery</h3>
              <div class="gallery-grid">
                ${project.gallery.map((imgSrc, index) => `
                  <div class="gallery-item">
                    <img src="${imgSrc}" alt="${project.title} - Image ${index + 1}" loading="lazy">
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Gallery image click handler
      const galleryItems = detailContent.querySelectorAll('.gallery-item img');
      galleryItems.forEach(img => {
        img.addEventListener('click', () => {
          const mainImg = detailContent.querySelector('.main-detail-img');
          if (mainImg && window.gsap) {
            gsap.to(mainImg, {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                mainImg.src = img.src;
                gsap.to(mainImg, { opacity: 1, duration: 0.3 });
              }
            });
          } else if (mainImg) {
            mainImg.src = img.src;
          }
        });
      });
      
      // Open overlay
      overlay.setAttribute('data-visible', 'true');
      document.body.style.overflow = 'hidden';
      
      if (window.gsap) {
        gsap.fromTo(overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        
        gsap.fromTo(overlay.querySelector('.detail-container'),
          { scale: 0.9, y: 50, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.4)', delay: 0.1 }
        );
      }
    }
    
    function init() {
      // Add click handlers to all project cards
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => {
        card.addEventListener('click', () => {
          const projectId = card.getAttribute('data-project-id');
          if (projectId) {
            openWorkDetail(projectId);
          }
        });
        
        // Make them keyboard accessible
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const projectId = card.getAttribute('data-project-id');
            if (projectId) {
              openWorkDetail(projectId);
            }
          }
        });
      });
      
      console.log('✓ Work detail controller initialized');
    }
    
    return {
      init,
      open: openWorkDetail
    };
  })();
  
  /* ==========================================
     MAIN APP INITIALIZATION
     ========================================== */
  
  function checkGSAP() {
    if (window.gsap) {
      console.log('✓ GSAP loaded');
      
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        console.log('✓ ScrollTrigger registered');
      }
    } else {
      console.warn('⚠ GSAP not loaded - animations may be degraded');
    }
  }
  
  function animateHeader() {
    if (!window.gsap) return;
    
    const headerButtons = document.querySelectorAll('.main-header .glass-button, .status-badges .badge-item');
    
    gsap.fromTo(headerButtons,
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }
  
  function setupScrollReveal() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    const revealElements = document.querySelectorAll('.content-section');
    
    revealElements.forEach(element => {
      gsap.fromTo(element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }
  
  function setupProjectCardAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    const projectCards = document.querySelectorAll('.project-card');
    
    gsap.fromTo(projectCards,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.work-section',
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );
  }
  
  function setupFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        console.log('Form data:', data);
        
        alert('Thank you for your message! (Note: This is a demo form)');
        contactForm.reset();
      });
    }
  }
  
  function setupAccessibility() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    window.a11yAnnounce = (message) => {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    };
  }
  
  function showWelcomeMessage() {
    console.log('%c🎨 Alex Reyes Portfolio', 'font-size: 24px; font-weight: bold; color: #ff6b35;');
    console.log('%cBuilt with:', 'font-size: 14px; color: #a0a0a0;');
    console.log('  • HTML5 & CSS3');
    console.log('  • Bootstrap 5.3');
    console.log('  • GSAP 3.12');
    console.log('  • Vanilla JavaScript (ES6+)');
    console.log('%c\nWeb Atelier - UDIT 2026', 'font-style: italic; color: #666;');
  }
  
  function init() {
    console.log('🚀 Initializing Alex Reyes Portfolio...');
    
    checkGSAP();
    
    ThemeToggle.init();
    Navigation.init();
    InfiniteWorld.init();
    ImageDetail.init();
    WorkDetail.init(); // ← NUEVO: Inicializar WorkDetail
    
    animateHeader();
    setupScrollReveal();
    setupProjectCardAnimations();
    setupFormHandling();
    setupAccessibility();
    
    showWelcomeMessage();
    
    console.log('✓ Portfolio initialized successfully');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose modules globally
  window.ThemeToggle = ThemeToggle;
  window.Navigation = Navigation;
  window.InfiniteWorld = InfiniteWorld;
  window.ImageDetail = ImageDetail;
  window.WorkDetail = WorkDetail; // ← NUEVO: Exponer WorkDetail globalmente
  
  window.portfolioApp = {
    version: '1.0.0',
    theme: ThemeToggle,
    navigation: Navigation,
    infiniteWorld: InfiniteWorld,
    imageDetail: ImageDetail,
    workDetail: WorkDetail // ← NUEVO: Añadir a portfolioApp
  };
  
})();