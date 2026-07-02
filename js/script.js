(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Smooth in-page navigation (fixed navbar offset via
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
     Navbar: blur/shadow on scroll
  --------------------------------------------------------- */
  var navbar = document.getElementById("navbar");
  function onScrollNav() {
    if (window.scrollY > 40) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

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
  var metricEls = document.querySelectorAll(".metric__value");
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
  if ("IntersectionObserver" in window && metricEls.length) {
    var metricObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            metricObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    metricEls.forEach(function (el) { metricObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     Before / After slider
  --------------------------------------------------------- */
  var baRange = document.getElementById("baRange");
  var baBefore = document.getElementById("baBefore");
  var baHandle = document.getElementById("baHandle");
  function updateSlider(value) {
    baBefore.style.clipPath = "inset(0 " + (100 - value) + "% 0 0)";
    baHandle.style.left = value + "%";
  }
  if (baRange) {
    updateSlider(baRange.value);
    baRange.addEventListener("input", function () { updateSlider(this.value); });
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
     Testimonials carousel
  --------------------------------------------------------- */
  var track = document.getElementById("testiTrack");
  var prevBtn = document.getElementById("testiPrev");
  var nextBtn = document.getElementById("testiNext");
  function scrollTestimonials(dir) {
    var card = track.querySelector(".testimonial-card");
    if (!card) return;
    var amount = card.getBoundingClientRect().width + 26;
    track.scrollBy({ left: dir * amount, behavior: reduceMotion ? "auto" : "smooth" });
  }
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", function () { scrollTestimonials(-1); });
    nextBtn.addEventListener("click", function () { scrollTestimonials(1); });
  }
})();
