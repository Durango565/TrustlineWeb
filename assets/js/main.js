const siteNav = document.querySelector("[data-site-nav]");
const navToggle = document.querySelector(".nav-toggle");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("is-open");
  });
}

/* ------------------------------------------------------------------
   Contact form: asynchronous submission
   ------------------------------------------------------------------
   Progressive enhancement: the form's native action/method remain
   intact, so submissions still work if JavaScript fails to load.

   Worker behavior (see worker.js):
   - On success it responds with a 303 redirect. With redirect:"manual",
     a cross-origin fetch surfaces that as an "opaqueredirect" response,
     which we treat as success.
   - On failure it responds directly with 4xx/5xx (CORS-enabled), which
     we surface as a clean inline error without leaving the page.
------------------------------------------------------------------- */
/* ------------------------------------------------------------------
   Scroll Reveal Engine
   ------------------------------------------------------------------
   No HTML changes required: candidate elements are tagged with the
   .reveal class here at runtime, so without JavaScript (or in older
   browsers without IntersectionObserver) nothing is ever hidden.
   Grid children receive a small stagger via --reveal-delay. Once an
   element's entrance completes, the classes are stripped so the
   hover transitions in styles.css take over cleanly.
------------------------------------------------------------------- */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const STAGGER_MS = 90;
  const STAGGER_CAP_MS = 450;

  // Staggered groups: each direct child of these grids reveals in sequence
  const groupSelector = [
    ".card-grid",
    ".bento-grid",
    ".pricing-grid",
    ".tier-grid",
    ".timeline-grid",
    ".faq-grid",
    ".stats-grid",
    ".trust-strip",
  ].join(", ");

  document.querySelectorAll(groupSelector).forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.classList.add("reveal");
      child.style.setProperty(
        "--reveal-delay",
        Math.min(index * STAGGER_MS, STAGGER_CAP_MS) + "ms"
      );
    });
  });

  // Standalone blocks: reveal as single units
  const soloSelector = [
    ".hero-copy",
    ".hero-card",
    ".section-heading",
    ".split-section > div",
    ".quote-panel",
    ".diagram",
    ".form-card",
    ".sidebar-card",
    ".next-step-content",
    ".cta-band > div",
    ".sovereign-shift-visual",
  ].join(", ");

  document.querySelectorAll(soloSelector).forEach((el) => {
    el.classList.add("reveal");
  });

  const cleanup = (el) => {
    el.classList.remove("reveal", "is-visible");
    el.style.removeProperty("--reveal-delay");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        requestAnimationFrame(() => el.classList.add("is-visible"));

        // Hand transitions back to hover styles once the entrance ends
        const done = (e) => {
          if (e.target !== el || e.propertyName !== "opacity") return;
          el.removeEventListener("transitionend", done);
          cleanup(el);
        };
        el.addEventListener("transitionend", done);
        // Safety net in case transitionend never fires (e.g. tab hidden)
        setTimeout(() => cleanup(el), 2200);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const statusBox = document.getElementById("form-status");
  const submitBtn = document.getElementById("contact-submit");
  const defaultBtnText = submitBtn ? submitBtn.textContent : "";

  const showStatus = (type, message) => {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = "form-status " + type;
  };

  const hideStatus = () => {
    if (!statusBox) return;
    statusBox.textContent = "";
    statusBox.className = "form-status hidden";
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Client-side validation (uses the existing required/type attributes)
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    hideStatus();

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.classList.add("is-loading");
      submitBtn.textContent = "Sending\u2026";
    }

    try {
      const payload = new FormData(contactForm);
      // Optional fields: keep the inquiry email readable instead of blank
      if (!payload.get("tier")) payload.set("tier", "Not specified");
      if (!payload.get("timeline")) payload.set("timeline", "Not specified");
      if (!payload.get("phone")) payload.set("phone", "");

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: payload,
        redirect: "manual",
      });

      const succeeded =
        response.type === "opaqueredirect" || // worker's 303 success redirect
        response.ok;                           // direct 2xx, just in case

      if (!succeeded) {
        throw new Error("Submission failed with status " + response.status);
      }

      // Success state: replace the form with a confirmation panel
      const card = document.getElementById("form-card");
      if (card) {
        card.innerHTML = [
          '<div class="form-success" role="status">',
          "<h2>Inquiry received.</h2>",
          '<div class="accent-line"></div>',
          "<p>Your message is on its way to Trustline. Expect a direct reply at the email you provided to confirm whether a fit call or a full assessment is the right next step.</p>",
          '<p class="muted-note">No mailing lists. No follow-up sequences. One reply from one operator.</p>',
          "</div>",
        ].join("");
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (err) {
      // Error state: keep the form and the user's input intact
      showStatus(
        "error",
        "Something went wrong sending your inquiry. Please try again in a moment, or email contact@trustlinetechnologies.com directly."
      );

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        submitBtn.classList.remove("is-loading");
        submitBtn.textContent = defaultBtnText;
      }
    }
  });
}
