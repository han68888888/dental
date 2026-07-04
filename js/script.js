(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Smooth in-page navigation (fixed header offset via
     scroll-margin-top on each section)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------------------------------------------------------
     Header: blur/shadow on scroll
  --------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------------------------------------------------
     Mobile navigation
  --------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navClose = document.getElementById("navClose");
  var mobileNav = document.getElementById("mobileNav");

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  navToggle.addEventListener("click", openMobileNav);
  navClose.addEventListener("click", closeMobileNav);
  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) closeMobileNav();
  });

  /* ---------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var siblings = Array.prototype.filter.call(
            el.parentElement.children,
            function (c) { return c.classList.contains("reveal"); }
          );
          var index = siblings.indexOf(el);
          el.style.transitionDelay = reduceMotion ? "0ms" : Math.min(index * 90, 450) + "ms";
          el.classList.add("in-view");
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------------------------------------------------------
     Animated counters
  --------------------------------------------------------- */
  var statEls = document.querySelectorAll(".stat__value");
  function formatCount(value, decimals) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = formatCount(target, decimals) + suffix;
      return;
    }
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = formatCount(value, decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && statEls.length) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statEls.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     Before / After compare slider
  --------------------------------------------------------- */
  var compareRange = document.getElementById("compareRange");
  var compareBefore = document.getElementById("compareBefore");
  var compareHandle = document.getElementById("compareHandle");
  function updateSlider(value) {
    compareBefore.style.clipPath = "inset(0 " + (100 - value) + "% 0 0)";
    compareHandle.style.left = value + "%";
  }
  if (compareRange) {
    updateSlider(compareRange.value);
    compareRange.addEventListener("input", function () { updateSlider(this.value); });
  }

  /* ---------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------- */
  var faqButtons = document.querySelectorAll(".faq-item__q");
  faqButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      faqButtons.forEach(function (other) { other.setAttribute("aria-expanded", "false"); });
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  /* ---------------------------------------------------------
     Patient stories — single-story spotlight carousel
  --------------------------------------------------------- */
  var stories = Array.prototype.slice.call(document.querySelectorAll(".story"));
  var storyPhoto = document.getElementById("storyPhoto");
  var storyPrev = document.getElementById("storyPrev");
  var storyNext = document.getElementById("storyNext");
  var storyIndex = stories.findIndex(function (s) { return s.classList.contains("is-active"); });
  if (storyIndex < 0) storyIndex = 0;

  function showStory(index) {
    stories.forEach(function (s) { s.classList.remove("is-active"); });
    stories[index].classList.add("is-active");
    if (storyPhoto) storyPhoto.src = stories[index].getAttribute("data-photo");
  }
  if (stories.length && storyPrev && storyNext) {
    storyPrev.addEventListener("click", function () {
      storyIndex = (storyIndex - 1 + stories.length) % stories.length;
      showStory(storyIndex);
    });
    storyNext.addEventListener("click", function () {
      storyIndex = (storyIndex + 1) % stories.length;
      showStory(storyIndex);
    });
  }

  /* ---------------------------------------------------------
     Appointment form (static demo — no backend wired up)
  --------------------------------------------------------- */
  var apptForm = document.getElementById("appointmentForm");
  if (apptForm) {
    apptForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!apptForm.checkValidity()) {
        apptForm.reportValidity();
        return;
      }
      var firstName = document.getElementById("apptName").value.trim().split(" ")[0];
      document.getElementById("apptSuccess").textContent =
        "Thank you, " + firstName + "! We'll call you shortly to confirm your appointment.";
      apptForm.reset();
    });
  }
})();
