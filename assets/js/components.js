document.addEventListener('DOMContentLoaded', () => {
  // 1. Componente: Embaralhador (Weddings)
  const shuffleContainer = document.getElementById('shuffle-weddings');
  if (shuffleContainer) {
    let items = [...shuffleContainer.querySelectorAll('.shuffle-item')];
    
    const updatePositions = () => {
      items.forEach((el, i) => {
        el.style.transform = `translateY(${i * 15}px) scale(${1 - i * 0.05})`;
        el.style.zIndex = items.length - i;
        el.style.opacity = 1 - i * 0.2;
      });
    };
    updatePositions();

    setInterval(() => {
      items.unshift(items.pop());
      updatePositions();
    }, 3000);
  }

  // 2. Componente: Máquina de Escrever (Corporate)
  const twContainer = document.getElementById('typewriter-corporate');
  if (twContainer) {
    const messages = [
      "> INICIANDO PROTOCOLO CORPORATIVO",
      "> ESCALANDO PADRÃO LE CORDON BLEU...",
      "> SERVINDO 500 CONVIDADOS.",
      "> PRECISÃO: 100%."
    ];
    let msgIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < messages[msgIndex].length) {
        twContainer.textContent += messages[msgIndex][charIndex++];
        setTimeout(type, 50);
      } else {
        setTimeout(() => {
          twContainer.textContent = '';
          charIndex = 0;
          msgIndex = (msgIndex + 1) % messages.length;
          type();
        }, 2000);
      }
    }
    type();
  }

  // 3. Componente: Agendador Protocolo (Boteco)
  const schedContainer = document.querySelector('.scheduler-grid');
  if (schedContainer) {
    // Simula grid de pratos
    for(let i=0; i<6; i++) {
      let div = document.createElement('div');
      div.style.height = '30px';
      div.style.border = '1px solid rgba(226, 226, 226, 0.1)';
      div.style.marginBottom = '8px';
      schedContainer.appendChild(div);
    }
    
    // Animação cíclica simples simulando seleção
    const grids = schedContainer.children;
    let active = 0;
    setInterval(() => {
      grids[active].style.background = 'transparent';
      active = (active + 1) % grids.length;
      grids[active].style.background = 'rgba(242, 202, 80, 0.2)'; // Primary color tint
    }, 800);
  }
});