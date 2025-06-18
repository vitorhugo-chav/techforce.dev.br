/**
 * Intercepta o envio do formulário de contato, envia os dados via AJAX para o FormSubmit,
 * exibe um popup de agradecimento e limpa o formulário sem redirecionar a página.
 *
 * Certifique-se de que o formulário tenha o id="contact-form"
 * e que exista um elemento com id="thankyou-popup" no HTML.
 */

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.remove("no-js");
  document.body.classList.add("page-fade-in");

  // Seleciona o formulário pelo ID
  const form = document.getElementById("contact-form");
  // Seleciona o popup de agradecimento pelo ID
  const popup = document.getElementById("thankyou-popup");

  if (form && popup) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault(); // Impede o envio padrão do formulário

      // Adiciona a hora local ao campo oculto
      document.getElementById("hora_local").value = new Date().toLocaleString();

      // Coleta os dados do formulário
      const data = new FormData(form);

      try {
        // Envia os dados para o FormSubmit via fetch (AJAX)
        await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        // Exibe o popup de agradecimento
        popup.style.display = "block";

        // Limpa os campos do formulário
        form.reset();

        // Esconde o popup após 3 segundos
        setTimeout(() => {
          popup.style.display = "none";
        }, 3000);
      } catch (error) {
        // Em caso de erro, você pode exibir uma mensagem alternativa
        popup.textContent = "Ocorreu um erro ao enviar. Tente novamente.";
        popup.style.display = "block";
        setTimeout(() => {
          popup.style.display = "none";
          popup.textContent = "Obrigado pelo contato! Em breve retornaremos.";
        }, 3000);
      }
    });
  }

  // Animação de transição de página
  // Seleciona todos os links internos do menu
  document.querySelectorAll('a.nav-link[href]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      // Só anima se for navegação para outra página .html
      if (href && href.endsWith(".html")) {
        e.preventDefault();
        document.body.classList.remove("page-fade-in");
        document.body.classList.add("page-fade-out");
        setTimeout(() => {
          window.location.href = href;
        }, 500); // tempo igual ao do CSS
      }
    });
  });

  // Destaca o link ativo na navbar
  document.querySelectorAll('.nav-link').forEach(link => {
    if (window.location.pathname.endsWith(link.getAttribute('href')) ||
        (link.getAttribute('href').startsWith('#') && window.location.hash === link.getAttribute('href'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// Fade-out ao clicar em links internos (exceto âncoras e links externos)
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', function (e) {
    const url = new URL(link.href, window.location.origin);
    // Só aplica fade-out para links internos e não âncoras
    if (
      url.origin === window.location.origin &&
      url.pathname !== window.location.pathname &&
      !link.hasAttribute('target') &&
      !link.href.startsWith('mailto:') &&
      !link.href.startsWith('tel:') &&
      !link.hash
    ) {
      e.preventDefault();
      document.body.classList.remove("page-fade-in");
      document.body.classList.add("page-fade-out");
      setTimeout(() => {
        window.location = link.href;
      }, 300);
    }
  });
});
