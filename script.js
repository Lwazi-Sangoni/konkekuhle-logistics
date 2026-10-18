/* Konkekuhle Logistics — shared scripts */
(function () {
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Mobile menu */
  var burger = document.getElementById('burger'),
      menu   = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  /* Header shadow on scroll */
  var header = document.querySelector('header');
  if (header) {
    addEventListener('scroll', function () {
      header.classList.toggle('scrolled', scrollY > 10);
    });
  }

  /* Active nav link based on current file */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.menu a.link').forEach(function (l) {
    var href = (l.getAttribute('href') || '').toLowerCase();
    if (href === page) l.classList.add('active');
  });

  /* FAQ accordion */
  document.querySelectorAll('.q').forEach(function (q) {
    var btn = q.querySelector('button'),
        ans = q.querySelector('.a');
    if (!btn || !ans) return;
    btn.addEventListener('click', function () {
      var open = q.classList.contains('open');
      document.querySelectorAll('.q.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.a').style.maxHeight = null;
      });
      if (!open) {
        q.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* Animated counters */
  var nums = document.querySelectorAll('[data-count]');
  if (nums.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target,
            end = +el.dataset.count,
            n = 0,
            step = Math.max(1, Math.round(end / 60)),
            t = setInterval(function () {
              n += step;
              if (n >= end) { n = end; clearInterval(t); }
              el.textContent = n.toLocaleString() + (end === 98 ? '%' : '+');
            }, 25);
        io.unobserve(el);
      });
    }, { threshold: .5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
      }, { threshold: .12 });
      reveals.forEach(function (r) { ro.observe(r); });
    } else {
      reveals.forEach(function (r) { r.classList.add('in'); });
    }
  }

  /* Validators */
  function isPhone(v) { return (v || '').replace(/\D/g, '').length >= 9; }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ''); }
  function mark(input, ok) { input.closest('.field').classList.toggle('err', !ok); return ok; }

  function waOpen(text) {
    window.open('https://wa.me/27680502741?text=' + text, '_blank');
  }

  /* Quick quote form (home hero) */
  var quick = document.getElementById('quickForm');
  if (quick) {
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ['qFrom', 'qTo', 'qPhone'].forEach(function (id) {
        var el = document.getElementById(id);
        var valid = id === 'qPhone' ? isPhone(el.value) : el.value.trim().length > 1;
        el.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      waOpen('Hi Konkekuhle Logistics, I\'d like a quote.%0A%0AFrom: ' +
        encodeURIComponent(quick.from.value) + '%0ATo: ' + encodeURIComponent(quick.to.value) +
        '%0AService: ' + encodeURIComponent(quick.service.value) +
        '%0APhone: ' + encodeURIComponent(quick.phone.value));
      quick.reset();
    });
  }

  /* Full quote form */
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ok = mark(document.getElementById('name'),    document.getElementById('name').value.trim().length > 1) && ok;
      ok = mark(document.getElementById('phone'),   isPhone(document.getElementById('phone').value)) && ok;
      ok = mark(document.getElementById('email'),   isEmail(document.getElementById('email').value)) && ok;
      ok = mark(document.getElementById('from'),    document.getElementById('from').value.trim().length > 1) && ok;
      ok = mark(document.getElementById('to'),      document.getElementById('to').value.trim().length > 1) && ok;
      if (!ok) return;

      var body =
        'Name: ' + document.getElementById('name').value + '%0A' +
        'Phone: ' + document.getElementById('phone').value + '%0A' +
        'Email: ' + document.getElementById('email').value + '%0A' +
        'Collection: ' + document.getElementById('from').value + '%0A' +
        'Delivery: ' + document.getElementById('to').value + '%0A' +
        'Service: ' + document.getElementById('service').value + '%0A' +
        'Vehicle: ' + document.getElementById('vehicle').value + '%0A' +
        'Notes: ' + document.getElementById('msg').value;

      window.open('mailto:info@konkekuhlelogico.co.za?subject=' +
        encodeURIComponent('Quote Request — ' + document.getElementById('from').value + ' to ' + document.getElementById('to').value) +
        '&body=' + body, '_blank');

      var sent = document.getElementById('sentMsg');
      if (sent) {
        sent.classList.add('show');
        sent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () { sent.classList.remove('show'); }, 9000);
      }
      form.reset();
    });
  }
})();
