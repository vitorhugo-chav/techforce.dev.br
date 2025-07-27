// Função para atualizar o ano no footer automaticamente
function updateFooterYear() {
  const currentYear = new Date().getFullYear();
  const yearSpan = document.getElementById("current-year");

  if (yearSpan) {
    yearSpan.textContent = currentYear;
  }
}

// Função para inicializar todas as funcionalidades principais
function initMain() {
  // Atualizar ano no footer
  updateFooterYear();

  // Smooth scroll para links de navegação
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Adicionar classe active ao link de navegação baseado na seção visível
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 200) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // Atualizar navegação ativa no scroll
  window.addEventListener("scroll", updateActiveNavLink);

  // Chamar uma vez para definir o estado inicial
  updateActiveNavLink();
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", initMain);
