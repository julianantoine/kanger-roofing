/* Kanger Roofing — site interactions + chatbot (vanilla JS, no dependencies) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- mobile nav ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  function closeNav() { header.classList.remove('nav-open'); if (toggle) toggle.setAttribute('aria-expanded', 'false'); }
  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelector('.primary-nav').addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.site-header')) closeNav(); });
  }

  /* ---------- estimate form ---------- */
  var estForm = document.getElementById('est-form');
  if (estForm) {
    estForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!estForm.checkValidity()) { estForm.reportValidity(); return; }
      var status = estForm.querySelector('.form-status');
      var btn = estForm.querySelector('button[type="submit"]');
      status.hidden = false;
      btn.disabled = true;
      estForm.reset();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.section, .hero-card, .testi-card, .final-cta');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in-view'); });
  }

  /* ================= CHATBOT ================= */
  var bubble = document.getElementById('chat-bubble');
  var panel = document.getElementById('chat-panel');
  var body = document.getElementById('chat-body');
  var quick = document.getElementById('chat-quick');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-text');
  var closeBtn = document.getElementById('chat-close');
  if (!bubble) return;

  var PHONE = '(513) 555-0188';
  var QUICK_REPLIES = [
    { label: '💲 Get an estimate', text: 'estimate' },
    { label: '🚨 Emergency repair?', text: 'emergency' },
    { label: '🗺️ What areas do you serve?', text: 'areas' },
    { label: '🌪️ Storm damage help', text: 'storm' },
    { label: '👤 Talk to a human', text: 'human' },
  ];

  function msgHTML(role, text) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.innerHTML = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function botSay(text, after) {
    var typing = msgHTML('bot typing', '…');
    setTimeout(function () {
      typing.remove();
      msgHTML('bot', text);
      if (after) after();
    }, 550);
  }

  function renderQuick() {
    quick.innerHTML = '';
    QUICK_REPLIES.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = q.label;
      b.onclick = function () { userSay(q.text); };
      quick.appendChild(b);
    });
  }

  function botReply(raw) {
    var t = ' ' + String(raw).toLowerCase() + ' ';
    var link = function (text, href) { return '<a href="' + href + '">' + text + '</a>'; };

    if (/(estimate|quote|cost|price|how much|ballpark)/.test(t))
      return "Great news — estimates are always <strong>free</strong>.\n\nJust tell us what's going on and we'll come out for an inspection (usually within 48 hours). You get a written, itemized quote in 24–48 hours — no pressure, no obligation.\n\n" + link('Schedule my free estimate →', 'estimate.html') + "\n\nOr call us now: " + link(PHONE, 'tel:+15135550188');

    if (/(emergency|leak|leaking|water|urgent|asap|right now)/.test(t))
      return "If you have <strong>active leaking</strong>, don't wait:\n\n" + link('📞 Call ' + PHONE + ' now', 'tel:+15135550188') + " — our emergency line is answered 24/7.\n\nWe can tarp a roof the same day to stop the damage, then sort out the repair or insurance claim after.";

    if (/(storm|hail|wind|damage|insurance|claim|adjuster)/.test(t))
      return "Storm damage is our specialty. Here's the deal:\n\n• Free damage inspection anywhere in Greater Cincinnati\n• Photo documentation you can submit yourself\n• We meet your insurance adjuster on the roof — with you\n• You pay your deductible, nothing more\n\n" + link('Get a free storm inspection →', 'estimate.html');

    if (/(area|where|serve|location|near|zips|zip)/.test(t))
      return "We cover all of <strong>Greater Cincinnati</strong>:\n\nCincinnati · Mason · West Chester · Loveland · Milford · Anderson · Blue Ash · Montgomery · Madeira · Hyde Park · Oakley · Colerain · Fairfield · Hamilton · Middletown\n\nNot on the list? " + link('Ask us here', 'estimate.html') + " — we probably cover you too.";

    if (/(service|repair|replace|gutter|inspect|commercial|metal|shingle|new roof)/.test(t))
      return "Here's what we do:\n\n🛠️ Roof repair — leaks, shingles, flashing\n🏠 Roof replacement — shingles, metal, full tear-off\n🌪️ Storm & hail damage + insurance claims\n📋 Inspections — pre-purchase, post-storm, annual\n🚿 Gutters & downspouts\n🏢 Commercial roofing\n\n" + link('See all services →', 'services.html');

    if (/(hour|open|time|when|schedule|appointment|book)/.test(t))
      return "We're open <strong>Monday–Saturday, 7 AM – 6 PM</strong>, and the emergency line is answered 24/7.\n\n" + link('Pick a time for your free estimate →', 'estimate.html');

    if (/(warranty|guarantee|workmanship|years)/.test(t))
      return "Every job comes with a <strong>5-year workmanship warranty</strong> in writing, plus manufacturer warranties up to 50 years on materials. It's signed and on file before we start.";

    if (/(human|person|agent|rep|someone|speak|talk|call)/.test(t))
      return "Happy to connect you with a real human — the owner, actually.\n\n" + link('📞 Call ' + PHONE, 'tel:+15135550188') + " (Mon–Sat, 7–6) or " + link('schedule a call here', 'estimate.html') + " and Mark will call you back within one business day.";

    if (/(hi|hello|hey|howdy|good (morning|afternoon|evening))/.test(t))
      return "Hey there! 👋 Thanks for reaching out to Kanger Roofing.\n\nWhat can I help you with? Try one of the quick options below, or just ask me anything about your roof.";

    if (/(thank|thanks|great|awesome|perfect)/.test(t))
      return "You're welcome! Anything else about your roof we can help with? 🏠";

    return "I'm not 100% sure on that one — but a human will be. 😊\n\nYou can " + link('schedule a free estimate', 'estimate.html') + " (we call back within one business day) or call " + link(PHONE, 'tel:+15135550188') + " directly.";
  }

  function userSay(text) {
    input.value = '';
    msgHTML('user', String(text).replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }));
    botSay(botReply(text), renderQuick);
  }

  bubble.addEventListener('click', function () {
    panel.hidden = !panel.hidden;
    if (!panel.hidden && body.children.length === 0) {
      renderQuick();
      botSay('Hi! 👋 I\'m the Kanger Roofing assistant.\n\nAsk me about estimates, storm damage, service areas, or just tap an option below.', renderQuick);
    }
  });
  closeBtn.addEventListener('click', function () { panel.hidden = true; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (v) userSay(v);
  });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
})();
