console.log('Dashboard Test');

const nav = document.querySelector('nav'), 
navOpenBtn = document.querySelector('.nav-open-btn'),
navCloseBtn = document.querySelector('.nav-close-btn');

navOpenBtn.onclick = e => !nav.classList.contains('force-nav-open') && nav.classList.add('force-nav-open');

navCloseBtn.onclick = e => nav.classList.contains('force-nav-open') && nav.classList.remove('force-nav-open');
