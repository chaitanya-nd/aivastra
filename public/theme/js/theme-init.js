/* Ported from the WordPress theme's footer.php inline scripts. Runs after custom-scripts.js. */
document.addEventListener('DOMContentLoaded', function () {
  var tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      var target = this.classList.contains('one') ? 'catalogue-content' : this.classList.contains('two') ? 'tryon-content' : null;
      var el = target && document.getElementById(target);
      if (el) el.classList.add('active');
    });
  });
});

jQuery(function ($) {
  var common = { loop: true, nav: false, dots: false, autoplay: true, autoplaySpeed: 1000, smartSpeed: 1000, slideBy: 1 };
  var init = function (sel, opts) { if ($(sel).length && $.fn.owlCarousel) $(sel).owlCarousel($.extend({}, common, opts)); };
  init('.showcase-shpy-lst', { margin: 30, autoplayTimeout: 2000, responsive: { 0: { items: 2, margin: 0 }, 576: { items: 3, margin: 5 }, 768: { items: 4, margin: 10 }, 992: { items: 5, margin: 20 }, 1200: { items: 6, margin: 30 } } });
  init('.guide-category-grid.inr-stp-sec', { margin: 30, autoplayTimeout: 5000, responsive: { 0: { margin: 10, items: 1 }, 576: { margin: 15, items: 2 }, 768: { margin: 25, items: 3 }, 992: { margin: 35, items: 3 }, 1200: { margin: 48, items: 4 } } });
  init('.guide-category-grid.stpflex', { margin: 30, autoplayTimeout: 5000, responsive: { 0: { items: 2 }, 576: { margin: 10, items: 3 }, 768: { margin: 15, items: 4 }, 992: { margin: 20, items: 5 }, 1200: { margin: 25, items: 6 } } });
  init('.guide-category-grid.testi', { margin: 30, nav: true, autoplayTimeout: 5000, responsive: { 0: { items: 1, margin: 20 }, 576: { items: 1, margin: 20 }, 768: { items: 2, margin: 20 }, 992: { items: 3, margin: 20 }, 1200: { items: 3 } } });
  init('.hm-brand-sec-lst', { margin: 30, autoplayTimeout: 2000, smartSpeed: 800, items: 6, responsive: { 0: { items: 1 }, 360: { items: 2 }, 480: { items: 2 }, 481: { items: 3 }, 767: { items: 3 }, 768: { items: 4 }, 991: { items: 4 }, 992: { items: 6 } } });
});
