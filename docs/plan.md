Foundation & Architecture — Analogue Photography Portfolio Template
Prompt to AI (Planning Phase)

I want to create a reusable portfolio template for analogue photography with a cinematic, dark visual style and warm accent gradients inspired by light leaks.
The project must follow the course brief: semantic HTML, responsive and intrinsic layouts, fluid typography with clamp(), CSS architecture by layers, accessibility fundamentals, metadata, GitHub Pages deployment, and a custom 404 page.

Planning Summary

Information Architecture
Plan a one-page layout with clear semantic sections (Home, Work, About, Contact) to support scroll-based storytelling and a focused narrative flow.

Semantic & Accessibility Strategy
Define the HTML structure using semantic landmarks and a clear heading hierarchy from the start, including skip-to-content navigation and keyboard-friendly interactions.

CSS Architecture
Organize styles into layered files (base, layout, components) with a central barrel file to ensure scalability and reusability of the template.

Design System & Tokens
Establish a design system using CSS custom properties:

Fluid typography with clamp()

Dark base colors with warm accent gradients

Consistent spacing and radius tokens

Responsive & Intrinsic Layouts
Use mobile-first design with CSS Grid (auto-fit, minmax) and flexible containers to achieve intrinsic responsiveness without relying heavily on breakpoints.

Navigation & Interaction Planning
Plan a responsive navigation system using progressive enhancement and ARIA attributes, keeping interactions minimal in the foundation phase.

Professional Completeness
Include a custom 404 page and early deployment planning to ensure production-ready standards from the first sprint.

Plan1 · MDCopyDevelopment Plan: Alex Reyes Photography Portfolio
Final Project - Advanced Web Design with Stylesheets
Date: January 2026
Student Project: Professional Photographer Portfolio
Grade Level: Second Grade (Bootstrap + GSAP) with advanced custom implementations
Inspiration Reference: https://nika.agency/

Phase 1: Planning & Architecture
Project Overview
This portfolio for photographer Alex Reyes will feature an innovative infinite panning world as the hero section, showcasing 23+ photographs in an immersive browsing experience. The project combines cutting-edge web techniques with professional photography presentation.
Design Philosophy
Aesthetic Direction: Dark, cinematic, photography-focused

Tone: Sophisticated, immersive, gallery-quality presentation
Primary Theme: Dark mode with high contrast imagery
Typography: Bold, editorial style with character
Key Differentiator: Infinite panning world with floating photography cards
Memorable Element: The seamless transition between infinite world exploration and traditional scrolling sections

Technical Architecture
Stack Selection (Aligned with Course Requirements)

HTML5: Semantic structure
Bootstrap 5: For responsive grid in content sections (via CDN)
GSAP 3: For complex animations and smooth transitions
Vanilla JavaScript (ES6+): Custom infinite pan logic, state management
CSS3: Custom properties, glassmorphism, advanced animations

Key Technical Challenges & Solutions

Infinite Panning World

Solution: Transform-based positioning with boundary wrapping
Mouse/touch drag implementation
Performance optimization with transform3d for GPU acceleration
23+ image cards positioned in virtual 2D space


Dual Navigation States

Solution: State machine managing "infinite mode" vs "scroll mode"
Smooth transitions between modes using GSAP
Body overflow management


Glassmorphism UI Elements

Solution: backdrop-filter with fallbacks
CSS custom properties for consistent blur/opacity
Dark theme optimized transparency


Complex Navigation Menu

Solution: Slide-down animation with GSAP
Navigation items: Work, About, Contact
Click to transition from infinite world to section scroll


Image Detail View

Solution: Modal-like overlay with smooth GSAP transitions
Gallery view with additional photos
Descriptive text for each photo shoot


1. Header Component (Fixed)
Elements:

"ALEX REYES" button (left) - glassmorphism, returns to home
"MENU" button (center-left) - glassmorphism, toggles navigation
Status badges (center):

"PROFESSIONAL PHOTOGRAPHER" (non-interactive, glass effect)
"DESIGNER" (non-interactive, glass effect)


Theme toggle button (right) - light/dark mode switch

Technical:

position: fixed; top: 20px; left: 20px; right: 20px; z-index: 1000;
Flexbox layout for responsive alignment
Glassmorphism: backdrop-filter: blur(10px), rgba backgrounds
GSAP for smooth button state transitions

2. Infinite World (Hero/Home State)
Features:

2D canvas-like area extending 3000x3000px (virtual space)
23+ image cards positioned at various x,y coordinates
Mouse drag to pan (cursor: grab/grabbing)
Touch support for mobile
Boundary wrapping for infinite feel
Each image card:

Hover scale animation (GSAP)
Click opens detail view
Glassmorphism frame effect



Technical Implementation:
javascript// Pseudo-code structure
class InfiniteWorld {
  constructor() {
    this.viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
    this.worldSize = { width: 3000, height: 3000 };
    this.images = [...]; // 23 image objects with x, y, src, title
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
  }
  
  handleMouseDown() { /* start drag */ }
  handleMouseMove() { /* update viewport position */ }
  handleMouseUp() { /* end drag */ }
  wrapBoundaries() { /* infinite wrapping logic */ }
  updateImagePositions() { /* transform3d updates */ }
  animateImageHover(imageEl) { /* GSAP scale animation */ }
}
Animation Strategy:

Entrance animation: Images fade + float in with stagger
Hover: Scale 1.1, subtle rotation, shadow increase
Exit to detail: Selected image zooms to center, others fade out

3. Navigation Menu (Dropdown)
Structure:
html<nav class="main-menu" data-state="closed">
  <ul>
    <li><a href="#work">WORK</a></li>
    <li><a href="#about">ABOUT</a></li>
    <li><a href="#contact">CONTACT</a></li>
  </ul>
</nav>
Behavior:

Closed state: transform: translateY(-100%); opacity: 0;
Open state: GSAP timeline animation

Menu slides down
Items stagger in from left
Background blur increases


Click on item:

Transition from infinite world to scroll mode
GSAP smooth scroll to section
Body overflow changes to auto
Infinite world container set to display: none;



4. Image Detail View (Modal)
Structure:
html<div class="image-detail-overlay" data-visible="false">
  <div class="detail-container">
    <button class="close-detail">×</button>
    <div class="detail-content">
      <div class="main-image">
        <img src="..." alt="...">
      </div>
      <div class="detail-info">
        <h2>Photo Shoot Title</h2>
        <p>Description of the session...</p>
      </div>
      <div class="detail-gallery">
        <!-- Additional photos from this shoot -->
      </div>
    </div>
  </div>
</div>
Animation:

Open:

Selected image GSAP morphs to center
Overlay fades in
Content slides up


Close:

Reverse animation back to infinite world



5. Sections (Scroll Mode)
Work Section:

Bootstrap grid of project cards
Filter by category (optional)
Each card links to detail view

About Section:

Bio text
Skills grid
Professional experience timeline
Profile image with hover effect

Contact Section:

Contact form (can use Formspree)
Social media links
Email, phone (if applicable)

Footer:

Copyright
Quick links
GitHub repository link
Back-to-top button

Animation Timeline
Page Load Sequence
javascriptconst entranceTimeline = gsap.timeline();
entranceTimeline
  .from('.header-buttons', { y: -50, opacity: 0, duration: 0.8, ease: 'power3.out' })
  .from('.image-card', { 
    scale: 0.5, 
    opacity: 0, 
    duration: 0.6, 
    stagger: 0.05, 
    ease: 'back.out(1.7)' 
  }, '-=0.4');
Mode Transitions

Infinite → Scroll Mode:

Infinite world fades out + scales down
Target section fades in
Navigation menu closes
Duration: 0.8s


Scroll → Infinite Mode (click "ALEX REYES"):

Sections fade out
Infinite world scales + fades in
Images re-animate entrance
Duration: 0.8s



Responsive Strategy
Breakpoints:

Mobile: < 768px

Header buttons stack vertically
Infinite world: touch drag only
Simplified animations (reduced stagger)
Image cards larger for easier tapping


Tablet: 768px - 1024px

Header in single row, smaller buttons
Moderate image card sizes


Desktop: > 1024px

Full experience
All animations enabled
Mouse hover effects prominent



Mobile Considerations:

Touch event handlers for panning
Reduced particle effects (if any added)
Prefers-reduced-motion support
Optimized image loading

Accessibility Plan
Basic Requirements (per course rubric):

WCAG AA color contrast (4.5:1 minimum)
Alt text on all images
Keyboard navigation:

Tab through header buttons
Enter to activate
Escape to close menu/detail view


prefers-reduced-motion disables complex animations
Focus indicators on all interactive elements
Semantic HTML structure

Enhanced (bonus):

ARIA labels for icon buttons
Skip-to-content link
Screen reader announcements for state changes

Performance Optimization

Images:

Use ImageKit or similar CDN
Lazy loading for off-screen images
WebP format with fallbacks
Responsive images (srcset)


Animations:

Use transform and opacity only (GPU accelerated)
will-change property on animated elements
Debounce pan calculations


CSS:

Critical CSS inline
Minify in production (if using build tools)


JavaScript:

Defer non-critical scripts
Event listener optimization (passive scroll)



Theme Implementation (Light/Dark Mode)
CSS Custom Properties:
css:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --accent: #ff6b35;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: 10px;
}

[data-theme="light"] {
  --bg-primary: #f5f5f5;
  --bg-secondary: #ffffff;
  --text-primary: #0a0a0a;
  --text-secondary: #666666;
  --accent: #ff6b35;
  --glass-bg: rgba(0, 0, 0, 0.03);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-blur: 10px;
}
Toggle Mechanism:

localStorage to persist preference
Smooth color transition (0.3s)
Icon switches (sun/moon)

Glassmorphism Implementation
Base Mixin (as CSS class):
css.glass-morph {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 12px;
}

.glass-morph-strong {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
Browser Fallbacks:
css@supports not (backdrop-filter: blur(10px)) {
  .glass-morph {
    background: rgba(26, 26, 26, 0.9);
  }
}
Typography System
Font Choices (avoiding generic AI aesthetics):

Display/Headers: "Playfair Display" or "Cormorant Garamond" (elegant serif)
Body: "DM Sans" or "Manrope" (clean, readable sans-serif)
Accent: "Space Mono" (for labels like "PHOTOGRAPHER")

Fluid Typography:
css:root {
  --text-base: clamp(1rem, 2.5vw, 1.125rem);
  --text-lg: clamp(1.25rem, 3vw, 1.5rem);
  --text-xl: clamp(1.5rem, 4vw, 2rem);
  --text-2xl: clamp(2rem, 5vw, 3rem);
  --text-3xl: clamp(3rem, 7vw, 5rem);
}
Development Sprints (Aligned with Course Structure)

Success Criteria
Technical:

 All checklist items pass
 60fps animations on desktop
 < 3s load time
 Responsive across all breakpoints
 Accessible keyboard navigation

Design:

 Unique, memorable aesthetic
 Professional photography presentation
 Cohesive visual language
 Smooth, delightful interactions

Course Requirements:

 Repository properly structured
 Live on GitHub Pages
 Git tag v1.0.0 + Release
 Complete documentation
 Bootstrap + GSAP usage demonstrated
 Responsive design principles
 HTML semantics
 Accessibility basics

