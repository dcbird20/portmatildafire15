const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const navScrim = document.getElementById("navScrim");
const backToTop = document.getElementById("backToTop");
const stickyDonate = document.getElementById("stickyDonate");
const fundraisingSection = document.getElementById("fundraising");
const timelinePanel = document.getElementById("timelinePanel");
const eventsPanel = document.getElementById("eventsPanel");
const facebookFallback = document.getElementById("facebookFallback");
const feedTabs = Array.from(document.querySelectorAll(".feed-tab"));
const revealTargets = Array.from(document.querySelectorAll(".reveal"));
const trackedCtas = Array.from(document.querySelectorAll("[data-track]"));
const volunteerForm = document.getElementById("volunteerForm");
const sectionLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const trackedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const firstNavLink = sectionLinks[0] || null;

function closeMenu(restoreFocus = false) {
  navToggle.classList.remove("is-open");
  siteNav.classList.remove("is-open");
  navScrim.classList.remove("is-visible");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";

  if (restoreFocus) {
    navToggle.focus();
  }
}

function openMenu() {
  navToggle.classList.add("is-open");
  siteNav.classList.add("is-open");
  navScrim.classList.add("is-visible");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";

  if (firstNavLink) {
    firstNavLink.focus();
  }
}

function toggleMenu() {
  if (siteNav.classList.contains("is-open")) {
    closeMenu();
    return;
  }

  openMenu();
}

function setActiveLink() {
  const scrollY = window.scrollY + 160;

  trackedSections.forEach((section) => {
    const isActive = scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight;
    const matchingLink = sectionLinks.find((link) => link.getAttribute("href") === `#${section.id}`);

    if (matchingLink) {
      matchingLink.classList.toggle("is-active", isActive);
    }
  });
}

function toggleUtilityButtons() {
  const pastHero = window.scrollY > 360;
  backToTop.classList.toggle("is-visible", pastHero);

  if (!fundraisingSection) {
    stickyDonate.classList.toggle("is-visible", pastHero);
    return;
  }

  const fundraisingTop = fundraisingSection.getBoundingClientRect().top;
  const fundraisingBottom = fundraisingSection.getBoundingClientRect().bottom;
  const fundraisingInView = fundraisingTop < window.innerHeight * 0.75 && fundraisingBottom > 0;

  stickyDonate.classList.toggle("is-visible", pastHero && !fundraisingInView);
}

function showFeedPanel(target) {
  const isTimeline = target === "timeline";

  timelinePanel.classList.toggle("is-hidden", !isTimeline);
  eventsPanel.classList.toggle("is-hidden", isTimeline);

  feedTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.target === target);
  });

  if (window.FB && typeof window.FB.XFBML.parse === "function") {
    window.FB.XFBML.parse();
  }
}

function maybeShowFacebookFallback() {
  const sdkConfigured = Array.from(document.scripts).some((script) => script.src.includes("appId=YOUR_APP_ID"));

  if (sdkConfigured) {
    timelinePanel.classList.add("is-hidden");
    eventsPanel.classList.add("is-hidden");
    facebookFallback.classList.remove("is-hidden");
    document.getElementById("feedTabs")?.classList.add("is-hidden");
    return;
  }

  window.setTimeout(() => {
    const pluginRendered = document.querySelector(".fb_iframe_widget, .fb-page span iframe");

    if (!pluginRendered) {
      timelinePanel.classList.add("is-hidden");
      eventsPanel.classList.add("is-hidden");
      facebookFallback.classList.remove("is-hidden");
    }
  }, 6000);
}

function trackCta(name) {
  if (!name) {
    return;
  }

  const payload = {
    event: "cta_click",
    cta_name: name,
    page_path: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  // Track in GA4 when available.
  if (typeof window.gtag === "function") {
    window.gtag("event", "cta_click", {
      cta_name: name,
      page_path: window.location.pathname,
    });
  }

  // Track in Plausible when available.
  if (typeof window.plausible === "function") {
    window.plausible("CTA Click", { props: { cta_name: name } });
  }

  // Keep a local fallback counter that can be inspected from devtools.
  try {
    const key = "pmfc15_cta_clicks";
    const existing = JSON.parse(localStorage.getItem(key) || "{}");
    existing[name] = (existing[name] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // Ignore storage errors in private browsing modes.
  }

  console.info("[CTA]", payload);
}

function handleVolunteerFormSubmit(event) {
  event.preventDefault();

  if (!volunteerForm) {
    return;
  }

  const formData = new FormData(volunteerForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!name || !email || !role) {
    volunteerForm.reportValidity();
    return;
  }

  const subject = encodeURIComponent("Volunteer Interest - Port Matilda Fire Co. #15");
  const body = encodeURIComponent(
    `Volunteer Interest Submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nRole Interest: ${role}\n\nAvailability / Notes:\n${notes || "Not provided"}`,
  );

  trackCta("volunteer_form_submit");
  window.location.href = `mailto:secretary@portmatildafire15.com?cc=president@portmatildafire15.com&subject=${subject}&body=${body}`;
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px",
  },
);

revealTargets.forEach((target) => revealObserver.observe(target));

navToggle?.addEventListener("click", toggleMenu);
navScrim?.addEventListener("click", closeMenu);
sectionLinks.forEach((link) => link.addEventListener("click", closeMenu));

navToggle?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
    closeMenu(true);
  }
});

feedTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showFeedPanel(tab.dataset.target);
  });
});

trackedCtas.forEach((element) => {
  element.addEventListener("click", () => {
    trackCta(element.getAttribute("data-track"));
  });
});

volunteerForm?.addEventListener("submit", handleVolunteerFormSubmit);

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  setActiveLink();
  toggleUtilityButtons();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMenu();
  }
});

window.addEventListener("load", () => {
  setActiveLink();
  toggleUtilityButtons();
  maybeShowFacebookFallback();
});