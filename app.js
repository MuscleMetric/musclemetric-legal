(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const savedTheme = localStorage.getItem('mm-theme');
  const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (preferredDark ? 'dark' : 'light');
  setTheme(initialTheme);

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('mm-theme', theme);
    themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeMeta?.setAttribute('content', theme === 'dark' ? '#0B1220' : '#F9FAFB');
  }

  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileMenu.hidden = open;
  });

  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const journeyScreens = [
    `<div class="journey-ui"><small>TODAY</small><h3>Upper Strength</h3><small>5 exercises · planned session</small><div class="journey-card"><div class="j-row"><div><strong>Ready when you are</strong><br><small>Your next workout is already organised.</small></div><span class="feature-icon blue">▶</span></div><div class="j-button">Start workout</div></div><div class="journey-card"><small>UP NEXT</small><div class="j-row" style="margin-top:9px"><strong>Bench Press</strong><small>4 × 6 · 80 kg</small></div><div class="j-row" style="margin-top:10px"><strong>Pull-up</strong><small>4 × 8</small></div></div></div>`,
    `<div class="journey-ui"><small>UPPER STRENGTH</small><h3>Bench Press</h3><small>Exercise 1 of 5</small><div class="journey-card"><div class="j-row"><strong>Planned target</strong><span class="status-pill neutral">4 sets</span></div><div class="timer-row"><div class="timer"><small>Reps</small><strong>6</strong></div><div class="timer"><small>Weight</small><strong>80 kg</strong></div></div><p style="color:#94A3B8;font-size:10px;margin:12px 0 0">Notes: controlled descent, full pause.</p></div></div>`,
    `<div class="journey-ui"><small>BENCH PRESS</small><h3>Record the work</h3><small>Set-by-set logging</small><div class="journey-card"><div class="j-set"><span>1</span><span class="j-field">80 kg</span><span class="j-field">6 reps</span><span class="j-check">✓</span></div><div class="j-set"><span>2</span><span class="j-field">80 kg</span><span class="j-field">6 reps</span><span class="j-check">✓</span></div><div class="j-set"><span>3</span><span class="j-field">80 kg</span><span class="j-field">—</span><span class="j-check" style="background:#0F172A;color:#64748B">○</span></div><div class="j-set"><span>4</span><span class="j-field">80 kg</span><span class="j-field">—</span><span class="j-check" style="background:#0F172A;color:#64748B">○</span></div></div></div>`,
    `<div class="journey-ui"><small>LIVE WORKOUT</small><h3>Stay in the session</h3><small>Timers stay visible without taking over.</small><div class="timer-row" style="margin-top:24px"><div class="timer"><small>Workout</small><strong>34:18</strong></div><div class="timer"><small>Rest</small><strong style="color:#60A5FA">01:12</strong></div></div><div class="journey-card"><div class="j-row"><strong>Bench Press</strong><span style="color:#22C55E;font-size:11px">2 / 4 sets</span></div><div class="mini-progress" style="margin-top:12px;background:#0F172A"><i style="width:50%"></i></div></div></div>`,
    `<div class="journey-ui"><small>WORKOUT COMPLETE</small><h3>Upper Strength</h3><small>Added to training history</small><div class="journey-card"><div class="j-row"><strong>Duration</strong><span>58:42</span></div><div class="j-row" style="margin-top:10px"><strong>Exercises</strong><span>5 completed</span></div><div class="j-row" style="margin-top:10px"><strong>Sets</strong><span>18 completed</span></div><div class="j-button" style="background:#16A34A">View workout summary</div></div></div>`,
    `<div class="journey-ui"><small>PROGRESS UPDATED</small><h3>The work changes the record.</h3><small>History, goals and volume stay connected.</small><div class="journey-card"><div class="j-row"><strong>Weekly sessions</strong><span style="color:#22C55E">4 / 4</span></div><div class="mini-progress" style="margin-top:10px;background:#0F172A"><i style="width:100%;background:#22C55E"></i></div></div><div class="journey-card"><div class="j-row"><strong>Goal progress</strong><span>72%</span></div><div class="mini-progress" style="margin-top:10px;background:#0F172A"><i style="width:72%;background:#F59E0B"></i></div></div></div>`
  ];

  const journeyScreen = document.getElementById('journey-screen');
  const journeySteps = document.querySelectorAll('.journey-step');
  function setJourney(index) {
    if (!journeyScreen) return;
    journeyScreen.innerHTML = journeyScreens[index];
    journeySteps.forEach((step, i) => {
      const active = i === index;
      step.classList.toggle('active', active);
      step.setAttribute('aria-selected', String(active));
    });
  }
  setJourney(0);
  journeySteps.forEach(step => step.addEventListener('click', () => setJourney(Number(step.dataset.step))));

  const modal = document.getElementById('methodology-modal');
  document.querySelectorAll('[data-open-methodology]').forEach(button => button.addEventListener('click', () => modal?.showModal()));
  document.querySelector('.modal-close')?.addEventListener('click', () => modal?.close());
  modal?.addEventListener('click', event => {
    const rect = modal.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) modal.close();
  });
})();
