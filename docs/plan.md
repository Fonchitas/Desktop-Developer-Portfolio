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

# plan2.md — Infinite Canvas Navigation (Mouse-driven XY)

## Prompt to AI
Implement a mouse-driven “infinite canvas” navigation: the page behaves like a large 2D stage and the camera pans in both X/Y following pointer movement with inertia. Add drag-to-pan, bounds clamping, and prefers-reduced-motion fallback to standard vertical scroll.

## Plan
1. Replace vertical scroll layout with a fixed viewport and an oversized “stage” (e.g. 240vw x 240vh).
2. Place key sections (Home, Work, About, Contact) as panels positioned in the stage grid.
3. Implement camera state (x,y) + target (tx,ty) and animate with requestAnimationFrame and lerp for smooth inertia.
4. Add mousemove parallax: pointer position updates camera target slightly (ambient motion).
5. Add drag-to-pan: pointerdown/move updates camera target based on drag delta.
6. Clamp camera within stage bounds to prevent exposing empty space.
7. Accessibility: prefers-reduced-motion disables camera animation and re-enables normal scroll; ensure keyboard users can still reach panels.
