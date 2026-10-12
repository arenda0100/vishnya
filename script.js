'use strict';

// ===== Ждём загрузки DOM =====
document.addEventListener('DOMContentLoaded', function () {

  // ===== 1. БУРГЕР-МЕНЮ =====
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Закрываем меню при клике на ссылку
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== 2. ХЕДЕР ПРИ СКРОЛЛЕ =====
  const header = document.getElementById('header');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll();

  // ===== 3. ПОЯВЛЕНИЕ СЕКЦИЙ (Intersection Observer) =====
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Фолбэк: если нет Observer — просто показываем всё
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ===== 4. СЧЁТЧИКИ ЦИФР =====
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Плавное замедление в конце
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  // ===== 5. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ =====
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });

  // ===== 6. ВАЛИДАЦИЯ ФОРМЫ =====
  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.querySelector('input[name="name"]').value.trim();
      const phone = form.querySelector('input[name="phone"]').value.trim();
      const date = form.
      querySelector('input[name="date"]').value;
      const guests = form.querySelector('input[name="guests"]').value;

      // Проверка имени
      if (name.length < 2) {
        alert('Пожалуйста, введите ваше имя.');
        return;
      }

      // Проверка телефона (минимум 7 цифр)
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        alert('Пожалуйста, введите корректный номер телефона.');
        return;
      }

      // Проверка даты
      if (!date) {
        alert('Пожалуйста, выберите дату.');
        return;
      }

      // Проверка количества гостей
      if (!guests || parseInt(guests, 10) < 1) {
        alert('Пожалуйста, укажите количество гостей.');
        return;
      }

      // Успех
      alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      form.reset();
    });

    // Маска для телефона (мягкая — оставляет цифры, +, скобки, пробелы, дефис)
    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^\d+\-()\s]/g, '');
      });
    }
  }

  // ===== 7. ПАРАЛЛАКС ДЕКОРА В HERO =====
  const heroDecor = document.querySelectorAll('.hero__decor');
  if (heroDecor.length) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const y = window.scrollY;
          // Двигаем только первые два круга — третий оставляем
          if (heroDecor[0]) heroDecor[0].style.transform = 'translateY(' + (y * 0.15) + 'px)';
          if (heroDecor[1]) heroDecor[1].style.transform = 'translateY(' + (y * -0.1) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ===== 8. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ =====
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav__link');

  if (sections.length && navLinksAll.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinksAll.forEach(function (link) {
            const isActive = link.getAttribute('href') === '#' + id;
            link.style.color = isActive ? 'var(--gold)' : '';
          });
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-80px 0px -50% 0px'
    });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // ===== 9. ЗАЩИТА ОТ ДВОЙНОГО КЛИКА НА ФОРМЕ =====
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (submitBtn) {
    form.addEventListener('submit', function () {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
      }, 1000);
    });
  }

  // ===== ЛОГ В КОНСОЛЬ =====
  console.log('%c🍒 Усадьба Вишня', 'font-size:20px; color:#d4a574; font-weight:bold;');
  console.log('%cСайт готов. Удачи!', 'font-size:12px; color:#a89685;');

});