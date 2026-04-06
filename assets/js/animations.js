document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Hero Reveal
  gsap.from('.hero-line', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
  });

  gsap.from('.hero-subtitle, .hero-cta', {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0.8
  });

  // 2. Manifesto Text Reveal
  const manifestoText = document.querySelector('.manifesto-word-wrap');
  if (manifestoText) {
    // Wrap words in spans for stagger effect
    const words = manifestoText.innerText.split(' ');
    manifestoText.innerHTML = '';
    words.forEach(word => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      span.style.display = 'inline-block';
      manifestoText.appendChild(span);
    });

    ScrollTrigger.create({
      trigger: '.manifesto',
      start: 'top 60%',
      onEnter: () => {
        gsap.from('.manifesto-word-wrap span', {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          ease: "power3.out",
          duration: 0.8
        });
      }
    });
  }

  // 3. Protocol Stack Effect (Cards de Review)
  const cards = gsap.utils.toArray('.protocol-card');
  cards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 15vh",
      endTrigger: '.protocol-wrapper',
      end: "bottom bottom",
      pin: false,
      onUpdate: (self) => {
        // Se houver um card acima dele rolando, faz o scale/blur
        if (index < cards.length - 1) {
          const nextCard = cards[index + 1];
          const distance = nextCard.getBoundingClientRect().top - card.getBoundingClientRect().top;
          
          if (distance < window.innerHeight) {
            const progress = 1 - (distance / window.innerHeight);
            gsap.set(card, {
              scale: 1 - (progress * 0.05),
              opacity: 1 - (progress * 0.5),
              filter: `blur(${progress * 10}px)`
            });
          }
        }
      }
    });
  });
});