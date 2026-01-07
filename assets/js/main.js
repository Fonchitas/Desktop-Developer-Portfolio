/* =========================
   MAIN.JS — Canvas Home + Scroll Sections
   (Mantiene tu look/hover/intro; solo añade pan 4 direcciones)
   ========================= */

const body = document.body;

const canvasMain = document.querySelector("#canvas-main");
const scrollMain = document.querySelector("#scroll-main");

const stage = document.querySelector("#stage");
const photos = Array.from(document.querySelectorAll("[data-photo]"));

const menuBtn = document.querySelector("#menuBtn");
const dropdown = document.querySelector("#nav-menu");
const backToCanvas = document.querySelector("#backToCanvas");
const goHome = document.querySelector("#goHome");

const dropdownLinks = Array.from(
	document.querySelectorAll(".dropdown__link[data-target]")
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;

window.addEventListener("dragstart", (e) => e.preventDefault());

// -------------------------
// Menu open/close
// -------------------------
function setMenuOpen(open) {
	if (!menuBtn || !dropdown) return;
	menuBtn.setAttribute("aria-expanded", String(open));
	const labelEl = menuBtn.querySelector(".ui-btn__text");
	if (labelEl) labelEl.textContent = open ? "CLOSE" : "MENU";
	else menuBtn.textContent = open ? "CLOSE" : "MENU";
	dropdown.hidden = !open;
}

menuBtn?.addEventListener("click", () => {
	const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
	setMenuOpen(!isOpen);
});

// cerrar al click fuera
window.addEventListener("pointerdown", (e) => {
	if (!menuBtn || !dropdown) return;
	if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
		setMenuOpen(false);
	}
});

// -------------------------
// Mode switching
// -------------------------
function setMode(mode) {
	if (reduceMotion) mode = "scroll";

	if (mode === "canvas") {
		body.classList.add("mode-canvas");
		body.classList.remove("mode-scroll");
		canvasMain?.removeAttribute("hidden");
		scrollMain?.setAttribute("hidden", "");
		startCanvas();
	} else {
		body.classList.add("mode-scroll");
		body.classList.remove("mode-canvas");
		canvasMain?.setAttribute("hidden", "");
		scrollMain?.removeAttribute("hidden");
		stopCanvas();
	}
}

// click en marca -> volver a canvas (y reset)
goHome?.addEventListener("click", (e) => {
	e.preventDefault();
	setMenuOpen(false);
	setMode("canvas");

	state.x = 0; state.y = 0;
	state.tx = 0; state.ty = 0;

	runIntro();
});

// dropdown links -> ir a scroll section
dropdownLinks.forEach((a) => {
	a.addEventListener("click", (e) => {
		e.preventDefault();
		const targetId = a.getAttribute("data-target");
		if (!targetId) return;

		setMenuOpen(false);
		setMode("scroll");

		requestAnimationFrame(() => {
			document.getElementById(targetId)?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		});
	});
});

backToCanvas?.addEventListener("click", () => {
	setMenuOpen(false);
	setMode("canvas");
});

// -------------------------
// Intro animation (la tuya)
// -------------------------
let introRunning = false;

function runIntro() {
	if (reduceMotion) return;

	introRunning = true;
	stopCanvas();
	body.classList.add("is-entering");

	setTimeout(() => {
		body.classList.remove("is-entering");
		introRunning = false;
		startCanvas();
	}, 1700);
}

document.addEventListener("DOMContentLoaded", runIntro);

// -------------------------
// Canvas pan engine (XY)
// -------------------------
let rafId = null;

const state = {
	x: 0,
	y: 0,
	tx: 0,
	ty: 0,
	dragging: false,
	lastX: 0,
	lastY: 0,
};

function getBounds() {
	// ✅ bounds simétricos para stage centrado
	if (!stage) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const sw = stage.offsetWidth;
	const sh = stage.offsetHeight;

	const maxX = Math.max(0, (sw - vw) / 2);
	const minX = -maxX;

	const maxY = Math.max(0, (sh - vh) / 2);
	const minY = -maxY;

	return { minX, minY, maxX, maxY };
}

// Auto-focus SOLO cuando hay input humano (como lo tenías)
function updatePhotoFocus() {
	const hovered = document.querySelector(".photo:hover");
	if (hovered) return;

	const cx = window.innerWidth / 2;
	const cy = window.innerHeight / 2;
	const maxDist = Math.min(cx, cy) * 0.9;

	for (const el of photos) {
		const r = el.getBoundingClientRect();
		const ex = r.left + r.width / 2;
		const ey = r.top + r.height / 2;
		const dist = Math.hypot(ex - cx, ey - cy);
		const focus = clamp(1 - dist / maxDist, 0, 1);
		el.style.setProperty("--focus", focus.toFixed(3));
	}
}

function tick() {
	if (!stage || introRunning) return;

	state.x = lerp(state.x, state.tx, 0.12);
	state.y = lerp(state.y, state.ty, 0.12);

	// ✅ compone con translate(-50%,-50%) del CSS, sin tocar tu estética
	stage.style.transform =
		`translate3d(calc(-50% + ${state.x}px), calc(-50% + ${state.y}px), 0)`;

	rafId = requestAnimationFrame(tick);
}

function startCanvas() {
	if (rafId || reduceMotion) return;
	rafId = requestAnimationFrame(tick);
}

function stopCanvas() {
	if (!rafId) return;
	cancelAnimationFrame(rafId);
	rafId = null;
}

// INPUT = dispara focus
window.addEventListener("mousemove", () => {
	if (!body.classList.contains("mode-canvas")) return;
	updatePhotoFocus();
}, { passive: true });

// Drag pan
window.addEventListener("pointerdown", (e) => {
	if (!body.classList.contains("mode-canvas")) return;
	e.preventDefault();
	state.dragging = true;
	state.lastX = e.clientX;
	state.lastY = e.clientY;
});

window.addEventListener("pointerup", () => { state.dragging = false; });
window.addEventListener("pointercancel", () => { state.dragging = false; });

window.addEventListener("pointermove", (e) => {
	if (!state.dragging || introRunning) return;

	const dx = e.clientX - state.lastX;
	const dy = e.clientY - state.lastY;

	state.lastX = e.clientX;
	state.lastY = e.clientY;

	const b = getBounds();
	state.tx = clamp(state.tx + dx, b.minX, b.maxX);
	state.ty = clamp(state.ty + dy, b.minY, b.maxY);

	updatePhotoFocus();
}, { passive: true });

window.addEventListener("resize", () => {
	const b = getBounds();
	state.tx = clamp(state.tx, b.minX, b.maxX);
	state.ty = clamp(state.ty, b.minY, b.maxY);
});

// -------------------------
// Init
// -------------------------
setMenuOpen(false);
setMode(reduceMotion ? "scroll" : "canvas");
