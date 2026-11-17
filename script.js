/* Sean Kyoung — Field Log
   Routing, status line, DNA helix, menu, tabs, filters. No dependencies. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));
  var nav = document.getElementById('site-nav');
  var menuToggle = document.querySelector('.menu-toggle');
  var statusEl = document.getElementById('status-text');

  /* ---------- fill the pages from content.js ---------- */

  (function fillContent() {
    var C = window.CONTENT || {};
    var TYPES = { research: 'Research', field: 'Field work', writing: 'Writing' };

    function get(path) {
      return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, C);
    }
    function make(tag, cls, text) {
      var node = document.createElement(tag);
      if (cls) node.className = cls;
      if (text != null) node.textContent = text;
      return node;
    }
    function list(value) {
      if (value == null) return [];
      if (!Array.isArray(value)) value = [value];
      return value.filter(function (x) { return x && String(x).trim(); });
    }
    function each(selector, fn) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
    }
    function todo(hint, where) {
      var box = make('div', 'todo');
      box.appendChild(make('p', null, hint));
      box.appendChild(make('p', 'todo-where', 'Edit in content.js → ' + where));
      return box;
    }
    function paragraphs(parent, items, hint, where) {
      items = list(items);
      if (!items.length) { parent.appendChild(todo(hint, where)); return; }
      items.forEach(function (text) { parent.appendChild(make('p', null, text)); });
    }
    function pad(n) { return ('00' + n).slice(-3); }

    each('[data-text]', function (el) { el.textContent = get(el.dataset.text) || ''; });

    each('[data-photo]', function (img) {
      var src = get(img.dataset.photo);
      if (src) img.src = src; else img.parentNode.hidden = true;
    });

    each('[data-paragraphs]', function (el) {
      paragraphs(el, get(el.dataset.paragraphs), el.dataset.hint, el.dataset.paragraphs);
    });

    each('[data-facts]', function (el) {
      list(get(el.dataset.facts)).forEach(function (pair) {
        var row = make('div');
        row.appendChild(make('dt', null, pair[0]));
        row.appendChild(pair[1] ? make('dd', null, pair[1]) : make('dd', 'todo-inline', 'Add in content.js'));
        el.appendChild(row);
      });
    });

    each('[data-download]', function (el) {
      var file = get(el.dataset.download);
      if (!file) return;
      el.querySelector('a').href = file;
      el.hidden = false;
    });

    each('[data-sections]', function (el) {
      list(get(el.dataset.sections)).forEach(function (section) {
        var row = make('section', 'row');
        var body = make('div', 'row-body');
        row.appendChild(make('h2', null, section.title));
        paragraphs(body, section.items, 'Add one line per entry.', el.dataset.sections + ' → ' + section.title);
        row.appendChild(body);
        el.appendChild(row);
      });
    });

    each('[data-blog]', function (el) {
      var posts = list(C.blog);
      if (!posts.length) {
        el.appendChild(todo('No posts yet. Each post has a title, a date, optional image, and paragraphs.', 'blog'));
        return;
      }
      posts.forEach(function (post, i) {
        var entry = make('details', 'entry');
        var summary = make('summary');
        summary.appendChild(make('span', 'e-id', 'LOG ' + pad(posts.length - i)));
        summary.appendChild(make('span', 'e-title', post.title || 'Untitled'));
        summary.appendChild(make('span', 'e-date', post.date || ''));
        var toggle = make('span', 'e-toggle'); toggle.setAttribute('aria-hidden', 'true');
        summary.appendChild(toggle);
        var body = make('div', 'e-body');
        if (post.image) { var img = make('img'); img.src = post.image; img.alt = ''; img.loading = 'lazy'; body.appendChild(img); }
        list(post.paragraphs).forEach(function (text) { body.appendChild(make('p', null, text)); });
        entry.appendChild(summary); entry.appendChild(body);
        el.appendChild(entry);
      });
      if (location.hash.indexOf('blog') !== -1 || posts.length === 1) el.firstChild.open = true;
    });

    each('[data-projects]', function (el) {
      var projects = list(C.projects);
      if (!projects.length) {
        el.parentNode.insertBefore(todo('No projects yet. Each project has a title, a type (research, field or writing), a short description, and an optional image and link.', 'projects'), el);
        el.hidden = true;
        return;
      }
      projects.forEach(function (project, i) {
        var card = make('li', 'card');
        card.dataset.tags = project.type || '';
        card.appendChild(make('p', 'c-id', 'SPEC ' + pad(i + 1) + ' · ' + (TYPES[project.type] || 'Project')));
        if (project.image) { var img = make('img'); img.src = project.image; img.alt = ''; img.loading = 'lazy'; card.appendChild(img); }
        card.appendChild(make('h2', null, project.title || 'Untitled'));
        if (project.text) card.appendChild(make('p', null, project.text));
        if (project.link) {
          var a = make('a', 'c-link', 'Open ↗'); a.href = project.link; a.target = '_blank'; a.rel = 'noopener';
          card.appendChild(a);
        }
        el.appendChild(card);
      });
    });
  })();

  /* ---------- status line: types itself out on every page change ---------- */

  var typeTimer = null;
  function typeStatus(text) {
    clearInterval(typeTimer);
    if (reduceMotion.matches) { statusEl.textContent = text; return; }
    var i = 0;
    statusEl.textContent = '';
    typeTimer = setInterval(function () {
      i += 1;
      statusEl.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(typeTimer);
    }, 38);
  }

  /* ---------- menu (small screens) ---------- */

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'CLOSE' : 'MENU';
  }
  menuToggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  /* ---------- routing: #/about, #/research, ... ---------- */

  function currentRoute() {
    var route = location.hash.replace(/^#\/?/, '');
    var known = views.some(function (v) { return v.dataset.route === route; });
    return known ? route : '';
  }

  var firstRender = true;
  function render() {
    var route = currentRoute();
    var active = null;

    views.forEach(function (v) {
      var on = v.dataset.route === route;
      v.classList.toggle('is-active', on);
      if (on) active = v;
    });
    navLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#/' + route) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    document.body.dataset.route = route;
    document.title = (route ? active.dataset.title + ' — ' : '') + 'Sean Kyoung — Field Log';
    typeStatus(active.dataset.status);
    setMenu(false);
    if (route === '') helix.build();
    helix.setRunning(route === '');

    if (!firstRender) {
      window.scrollTo(0, 0);
      var heading = active.querySelector('h1');
      if (heading) heading.focus({ preventScroll: true });
    }
    firstRender = false;
  }
  window.addEventListener('hashchange', render);

  /* ---------- DNA helix ---------- */

  var helix = (function () {
    var svg = document.getElementById('helix');
    var NS = 'http://www.w3.org/2000/svg';
    var PAIRS = [['A', 'T'], ['G', 'C'], ['A', 'T'], ['G', 'C'], ['T', 'A'], ['C', 'G'],
                 ['T', 'A'], ['C', 'G'], ['T', 'A'], ['G', 'C'], ['A', 'T'], ['G', 'C']];
    var w = 0, h = 0, period = 0, spacing = 0;
    var strandA, strandB, rungs = [];
    var phase = 0, last = 0, raf = 0, running = false;

    function el(name) {
      var node = document.createElementNS(NS, name);
      svg.appendChild(node);
      return node;
    }

    function build() {
      w = svg.clientWidth; h = svg.clientHeight;
      if (!w || !h) return;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      period = w * 2.7;          // one full twist
      spacing = period / 12;     // twelve base pairs per twist
      rungs = [];
      for (var y = spacing * 0.35, i = 0; y < h + spacing; y += spacing, i += 1) {
        var pair = PAIRS[i % PAIRS.length];
        var line = el('line');
        var a = el('text'); a.textContent = pair[0];
        var b = el('text'); b.textContent = pair[1];
        rungs.push({ y: y, line: line, a: a, b: b });
      }
      strandA = el('path');
      strandB = el('path');
      draw();
    }

    function draw() {
      if (!w) return;
      var cx = w / 2, amp = w / 2 - 1, reach = w / 2 + 10;
      var k = (2 * Math.PI) / period;
      var da = '', db = '';
      for (var y = -4; y <= h + 4; y += 6) {
        var dx = amp * Math.sin(k * y + phase);
        da += (da ? 'L' : 'M') + (cx + dx).toFixed(1) + ' ' + y;
        db += (db ? 'L' : 'M') + (cx - dx).toFixed(1) + ' ' + y;
      }
      strandA.setAttribute('d', da);
      strandB.setAttribute('d', db);

      rungs.forEach(function (r) {
        // base pairs are widest where the two strands cross, as in the design
        var half = Math.max(11, reach * Math.abs(Math.cos(k * r.y + phase)));
        r.a.setAttribute('x', cx - half); r.a.setAttribute('y', r.y);
        r.b.setAttribute('x', cx + half); r.b.setAttribute('y', r.y);
        if (half > 24) {
          r.line.setAttribute('x1', cx - half + 11); r.line.setAttribute('x2', cx + half - 11);
          r.line.setAttribute('y1', r.y); r.line.setAttribute('y2', r.y);
          r.line.style.display = '';
        } else {
          r.line.style.display = 'none';
        }
      });
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.min(64, now - (last || now));
      last = now;
      phase += dt * 0.00028;     // about one twist every 22 seconds
      draw();
      raf = requestAnimationFrame(frame);
    }

    function setRunning(on) {
      on = on && !reduceMotion.matches && !document.hidden;
      if (on === running) return;
      running = on;
      cancelAnimationFrame(raf);
      last = 0;
      if (on) {
        if (!w) build();
        raf = requestAnimationFrame(frame);
      }
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 120);
    });
    document.addEventListener('visibilitychange', function () {
      setRunning(document.body.dataset.route === '');
    });

    return { build: build, setRunning: setRunning };
  })();

  /* ---------- research: sense / signal / survive tabs ---------- */

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.stage-tabs [role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- projects: filter chips ---------- */

  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var empty = document.querySelector('.empty');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter;
      var shown = 0;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      cards.forEach(function (card) {
        var match = filter === 'all' || card.dataset.tags.split(' ').indexOf(filter) !== -1;
        card.hidden = !match;
        if (match) shown += 1;
      });
      empty.hidden = shown > 0;
    });
  });

  /* ---------- blog: only one entry open at a time ---------- */

  var entries = Array.prototype.slice.call(document.querySelectorAll('.entry'));
  entries.forEach(function (entry) {
    entry.addEventListener('toggle', function () {
      if (!entry.open) return;
      entries.forEach(function (other) { if (other !== entry) other.open = false; });
    });
  });

  /* ---------- start ---------- */

  render();
  helix.build();
})();
