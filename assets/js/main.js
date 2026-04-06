/* ============================================================
   MAIN.JS — Navbar, FAQ Accordion, Form Logic, Phone Mask
   ============================================================ */

'use strict';

(function () {

  /* ══════════════════════════════════
     A. NAVBAR — IntersectionObserver
     ══════════════════════════════════ */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hero   = document.querySelector('.hero');
    if (!navbar || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(hero);
  }

  /* ══════════════════════════════════
     FAQ — Accordion (GSAP height tween)
     ══════════════════════════════════ */
  function initFAQ() {
    const items = document.querySelectorAll('.faq__item');

    items.forEach((item) => {
      const question = item.querySelector('.faq__question');
      const answer   = item.querySelector('.faq__answer');
      const inner    = item.querySelector('.faq__answer-inner');
      if (!question || !answer || !inner) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all open items
        items.forEach((other) => {
          if (other === item) return;
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq__answer');
          if (otherAnswer) {
            if (typeof gsap !== 'undefined') {
              gsap.to(otherAnswer, { height: 0, duration: 0.4, ease: 'power2.inOut' });
            } else {
              otherAnswer.style.height = '0';
            }
          }
        });

        // Toggle clicked item
        if (isOpen) {
          item.classList.remove('open');
          if (typeof gsap !== 'undefined') {
            gsap.to(answer, { height: 0, duration: 0.4, ease: 'power2.inOut' });
          } else {
            answer.style.height = '0';
          }
        } else {
          item.classList.add('open');
          const targetH = inner.offsetHeight;
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(answer,
              { height: 0 },
              { height: targetH, duration: 0.45, ease: 'power3.out' }
            );
          } else {
            answer.style.height = targetH + 'px';
          }
        }
      });

      // Set ARIA attributes
      question.setAttribute('aria-expanded', 'false');
      answer.setAttribute('aria-hidden', 'true');

      item.addEventListener('classchange', () => {
        const open = item.classList.contains('open');
        question.setAttribute('aria-expanded', String(open));
        answer.setAttribute('aria-hidden', String(!open));
      });
    });
  }

  /* ══════════════════════════════════
     PHONE MASK — (XX) XXXXX-XXXX
     ══════════════════════════════════ */
  function applyPhoneMask(input) {
    if (!input) return;

    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        v = `(${v}`;
      }
      input.value = v;
    });
  }

  /* ══════════════════════════════════
     FORM — Budget Gate + n8n Webhook
     ══════════════════════════════════ */
  function initForm() {
    const form    = document.querySelector('#qualification-form');
    if (!form) return;

    const phoneInput  = form.querySelector('input[name="telefone"]');
    applyPhoneMask(phoneInput);

    const submitBtn   = form.querySelector('.form__submit-btn');
    const msgSuccess  = form.querySelector('.form__message--success');
    const msgDiscard  = form.querySelector('.form__message--discard');
    const msgError    = form.querySelector('.form__message--error');

    // TODO: replace with actual n8n webhook URL
    const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/aline-leads';

    function hideMessages() {
      [msgSuccess, msgDiscard, msgError].forEach(el => {
        if (el) el.style.display = 'none';
      });
    }

    function showMessage(el) {
      if (!el) return;
      el.style.display = 'block';
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.classList.toggle('btn--loading', loading);
      submitBtn.disabled = loading;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideMessages();

      // Validate required fields
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('field-error');
          field.addEventListener('input', () => field.classList.remove('field-error'), { once: true });
        }
      });

      // Check budget radio
      const budgetVal = form.querySelector('input[name="aceitou_budget"]:checked');
      if (!budgetVal) {
        valid = false;
        const gate = form.querySelector('.budget-gate');
        if (gate) {
          gate.style.border = '1px solid rgba(239,68,68,0.5)';
          setTimeout(() => gate.style.border = '', 2000);
        }
      }

      if (!valid) return;

      // Build payload
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      data.aceitou_budget = data.aceitou_budget === 'sim';
      data.status         = data.aceitou_budget ? 'triagem' : 'descartado';
      data.origem         = 'landing_page';
      data.timestamp      = new Date().toISOString();

      setLoading(true);

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        setLoading(false);

        if (data.status === 'descartado') {
          // Polite discard — still sent to webhook for analytics
          showMessage(msgDiscard);
          form.querySelectorAll('input, select').forEach(f => f.disabled = true);
          submitBtn.style.display = 'none';
        } else if (res.ok) {
          showMessage(msgSuccess);
          form.querySelectorAll('input, select').forEach(f => f.disabled = true);
          submitBtn.style.display = 'none';
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        setLoading(false);

        // If discard, show discard message even if webhook fails
        if (data.status === 'descartado') {
          showMessage(msgDiscard);
          form.querySelectorAll('input, select').forEach(f => f.disabled = true);
          submitBtn.style.display = 'none';
        } else {
          showMessage(msgError);
        }
      }
    });
  }

  /* ══════════════════════════════════
     SMOOTH SCROLL for anchor links
     ══════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ══════════════════════════════════
     INIT
     ══════════════════════════════════ */
  function init() {
    initNavbar();
    initFAQ();
    initForm();
    initSmoothScroll();

    // Init interactive components (components.js)
    if (window.AlineComponents) {
      window.AlineComponents.initAllComponents();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
