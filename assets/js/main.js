const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector("#nav-menu");
const year = document.querySelector("#year");

if (year) year.textContent = String(new Date().getFullYear());

if (toggle && menu) {
	toggle.addEventListener("click", () => {
		const expanded = toggle.getAttribute("aria-expanded") === "true";
		toggle.setAttribute("aria-expanded", String(!expanded));
		menu.dataset.open = String(!expanded);
	});
}

// Close menu on link click (mobile)
menu?.addEventListener("click", (e) => {
	const target = e.target;
	if (target instanceof HTMLAnchorElement) {
		toggle?.setAttribute("aria-expanded", "false");
		menu.dataset.open = "false";
	}
});
