document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Status
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Formulário Intercept & Webhook n8n
  const form = document.getElementById('booking-form');
  const feedbackDiv = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  // TODO: Substituir pela URL real do n8n / Make
  const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/aline-leads'; 

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Validação de Trava de Orçamento
      const aceitouBudget = data.aceitou_budget === 'true';
      data.status = aceitouBudget ? 'triagem' : 'descartado';
      data.timestamp = new Date().toISOString();
      data.origem = 'landing_page';

      // Feedback na UI
      submitBtn.innerText = 'Enviando Protocolo...';
      submitBtn.style.pointerEvents = 'none';

      if (!aceitouBudget) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.style.borderLeftColor = 'var(--color-text)'; // White-ish for reject
        feedbackDiv.innerHTML = 'Agradecemos o contato e a sinceridade.<br><br>No momento, nossa estrutura técnica não permite absorver eventos abaixo desse ticket sem comprometer o rigor do padrão Le Cordon Bleu. Desejamos imenso sucesso na realização do seu evento.';
        // Continuamos o fetch para registrar o lead descartado no banco silenciosamente.
      } else {
        feedbackDiv.style.display = 'block';
        feedbackDiv.style.borderLeftColor = 'var(--color-primary)';
        feedbackDiv.innerHTML = 'Excelente. Seu evento atende aos critérios do nosso portfólio. A Chef Aline avaliará sua ficha técnica e entrará em contato em breve.';
      }

      // Fetch para o backend (n8n -> Supabase)
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        // Reset form apenas se foi aprovado para não limpar a mensagem de descarte imediatamente
        if(aceitouBudget) {
          form.reset();
        }
      } catch (error) {
        console.error('Erro ao enviar dados para a automação:', error);
        // Mesmo falhando o fetch silenciosamente, a experiência do usuário se mantém intacta na LP
      } finally {
        submitBtn.innerText = 'Solicitar Proposta';
        submitBtn.style.pointerEvents = 'auto';
      }
    });
  }
});