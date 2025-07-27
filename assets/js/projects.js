// Carregamento e exibição dos projetos
class ProjectsManager {
  constructor() {
    this.projects = [];
    this.currentFilter = "all";
    this.autoPlayInterval = null;
    this.init();
  }

  async init() {
    try {
      await this.loadProjects();
      this.renderProjects();
      this.setupFilters();
      this.setupCarousel();
      this.setupVisibilityChange();
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      this.showError();
    }
  }

  async loadProjects() {
    const response = await fetch("assets/data/projects.json");
    if (!response.ok) {
      throw new Error("Falha ao carregar projetos");
    }
    const data = await response.json();
    this.projects = data.projects;
  }

  renderProjects() {
    const gridContainer = document.getElementById("projects-grid");
    const carouselContainer = document.getElementById("projects-carousel");

    if (!gridContainer || !carouselContainer) return;

    const filteredProjects = this.getFilteredProjects();

    // Renderizar grid para desktop
    gridContainer.innerHTML = filteredProjects
      .map((project) => this.createProjectCard(project))
      .join("");

    // Renderizar carrossel para mobile
    carouselContainer.innerHTML = filteredProjects
      .map((project) => this.createCarouselSlide(project))
      .join("");
  }

  getFilteredProjects() {
    switch (this.currentFilter) {
      case "featured":
        return this.projects.filter((project) => project.featured);
      case "web":
        return this.projects.filter((project) =>
          project.technologies.some((tech) =>
            ["HTML5", "CSS3", "JavaScript", "React", "Vue", "Angular"].includes(
              tech
            )
          )
        );
      case "mobile":
        return this.projects.filter((project) =>
          project.technologies.some((tech) =>
            ["React Native", "Flutter", "Ionic"].includes(tech)
          )
        );
      default:
        return this.projects;
    }
  }

  createProjectCard(project) {
    const techTags = project.technologies
      .map((tech) => `<span class="tech-tag">${tech}</span>`)
      .join("");

    return `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy" />
          <div class="project-overlay">
            <div class="project-links">
              ${
                project.demoUrl !== "#"
                  ? `<a href="${project.demoUrl}" class="btn btn-small" target="_blank">Ver Demo</a>`
                  : ""
              }
              <a href="${
                project.githubUrl
              }" class="btn btn-small btn-outline" target="_blank">GitHub</a>
            </div>
          </div>
        </div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tech">
            ${techTags}
          </div>
        </div>
      </div>
    `;
  }

  createCarouselSlide(project) {
    const techTags = project.technologies
      .map((tech) => `<span class="tech-tag">${tech}</span>`)
      .join("");

    return `
      <div class="carousel-slide" data-project-id="${project.id}">
        <div class="slide-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy" />
        </div>
        <div class="slide-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="slide-tech">
            ${techTags}
          </div>
          <div class="slide-links">
            ${
              project.demoUrl !== "#"
                ? `<a href="${project.demoUrl}" class="btn btn-small" target="_blank">Ver Demo</a>`
                : ""
            }
            <a href="${
              project.githubUrl
            }" class="btn btn-small btn-outline" target="_blank">GitHub</a>
          </div>
        </div>
      </div>
    `;
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Remover classe active de todos os botões
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Adicionar classe active ao botão clicado
        e.target.classList.add("active");

        // Atualizar filtro e re-renderizar
        this.currentFilter = e.target.dataset.filter;
        this.renderProjects();
        this.setupCarousel();
      });
    });
  }

  setupCarousel() {
    const carousel = document.getElementById("projects-carousel");
    if (!carousel) return;

    const slides = carousel.querySelectorAll(".carousel-slide");
    if (slides.length === 0) return;

    // Ativar o primeiro slide por padrão
    slides[0].classList.add("active");

    // Se houver apenas um slide, não criar navegação
    if (slides.length <= 1) {
      const existingNav = carousel.querySelector(".carousel-nav");
      if (existingNav) existingNav.remove();
      return;
    }

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Limpar navegação antiga antes de criar uma nova
    const oldNav = carousel.querySelector(".carousel-nav");
    if (oldNav) oldNav.remove();

    // Criar navegação do carrossel
    const carouselNav = document.createElement("div");
    carouselNav.className = "carousel-nav";

    // Botões de navegação
    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-btn prev";
    prevBtn.innerHTML = "‹";
    prevBtn.addEventListener("click", () => this.changeSlide(-1));

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-btn next";
    nextBtn.innerHTML = "›";
    nextBtn.addEventListener("click", () => this.changeSlide(1));

    // Indicadores
    const indicators = document.createElement("div");
    indicators.className = "carousel-indicators";

    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement("button");
      indicator.className = "indicator";
      indicator.addEventListener("click", () => this.goToSlide(i));
      indicators.appendChild(indicator);
    }

    carouselNav.appendChild(prevBtn);
    carouselNav.appendChild(indicators);
    carouselNav.appendChild(nextBtn);
    carousel.appendChild(carouselNav);

    // Auto-play
    this.startAutoPlay();
  }

  changeSlide(direction) {
    const carousel = document.getElementById("projects-carousel");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const indicators = carousel.querySelectorAll(".indicator");
    const totalSlides = slides.length;

    let currentSlide = Array.from(slides).findIndex((slide) =>
      slide.classList.contains("active")
    );
    if (currentSlide === -1) currentSlide = 0;

    // Remover classe active de todos os slides e indicadores
    slides.forEach((slide) => slide.classList.remove("active"));
    indicators.forEach((indicator) => indicator.classList.remove("active"));

    // Calcular novo slide
    let newSlide = currentSlide + direction;
    if (newSlide >= totalSlides) newSlide = 0;
    if (newSlide < 0) newSlide = totalSlides - 1;

    // Adicionar classe active ao novo slide e indicador
    slides[newSlide].classList.add("active");
    indicators[newSlide].classList.add("active");
  }

  goToSlide(slideIndex) {
    const carousel = document.getElementById("projects-carousel");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const indicators = carousel.querySelectorAll(".indicator");

    // Remover classe active de todos os slides e indicadores
    slides.forEach((slide) => slide.classList.remove("active"));
    indicators.forEach((indicator) => indicator.classList.remove("active"));

    // Adicionar classe active ao slide e indicador selecionados
    slides[slideIndex].classList.add("active");
    indicators[slideIndex].classList.add("active");
  }

  startAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.autoPlayInterval = setInterval(() => {
      this.changeSlide(1);
    }, 5000); // Mudar slide a cada 5 segundos
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }

  setupVisibilityChange() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
    });
  }

  showError() {
    const gridContainer = document.getElementById("projects-grid");
    if (gridContainer) {
      gridContainer.innerHTML = `
        <div class="error-message">
          <p>Não foi possível carregar os projetos no momento.</p>
          <p>Tente novamente mais tarde.</p>
        </div>
      `;
    }
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new ProjectsManager();
});
