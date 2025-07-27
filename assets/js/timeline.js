// Carregamento e exibição da timeline
class TimelineManager {
  constructor() {
    this.timeline = [];
    this.currentFilter = "all";
    this.init();
  }

  async init() {
    try {
      await this.loadTimeline();
      this.renderTimeline();
      this.setupFilters();
    } catch (error) {
      console.error("Erro ao carregar timeline:", error);
      this.showError();
    }
  }

  async loadTimeline() {
    const response = await fetch("assets/data/timeline.json");
    if (!response.ok) {
      throw new Error("Falha ao carregar timeline");
    }
    const data = await response.json();
    this.timeline = data.timeline;
  }

  renderTimeline() {
    const timelineContainer = document.getElementById("timeline");

    if (!timelineContainer) return;

    const filteredTimeline = this.getFilteredTimeline();

    // Renderizar timeline
    timelineContainer.innerHTML = filteredTimeline
      .map((item) => this.createTimelineItem(item))
      .join("");
  }

  getFilteredTimeline() {
    let filteredItems = [];

    switch (this.currentFilter) {
      case "featured":
        filteredItems = this.timeline.filter((item) => item.featured);
        break;
      case "education":
        filteredItems = this.timeline.filter(
          (item) => item.type === "education"
        );
        break;
      case "work":
        filteredItems = this.timeline.filter((item) => item.type === "work");
        break;
      case "certification":
        filteredItems = this.timeline.filter(
          (item) => item.type === "certification"
        );
        break;
      default:
        filteredItems = this.timeline;
    }

    // Ordenar por data mais recente primeiro
    return filteredItems.sort((a, b) => {
      const yearA = this.extractYear(a.year);
      const yearB = this.extractYear(b.year);
      return yearB - yearA; // Ordem decrescente (mais recente primeiro)
    });
  }

  extractYear(yearString) {
    // Extrair o ano inicial da string (ex: "2024 - Presente" -> 2024)
    const match = yearString.match(/(\d{4})/);
    return match ? parseInt(match[1]) : 0;
  }

  createTimelineItem(item) {
    const isPresent = item.year.includes("Presente");
    const yearClass = isPresent ? "year-present" : "year-past";

    return `
      <div class="timeline-item" data-timeline-id="${item.id}">
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-icon">${item.icon}</span>
            <span class="timeline-type">${this.getTypeLabel(item.type)}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span class="year ${yearClass}">${item.year}</span>
        </div>
      </div>
    `;
  }

  getTypeLabel(type) {
    const labels = {
      education: "Educação",
      work: "Trabalho",
      certification: "Certificação",
      project: "Projeto",
    };
    return labels[type] || type;
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll(".timeline-filter-btn");

    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Remover classe active de todos os botões
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Adicionar classe active ao botão clicado
        e.target.classList.add("active");

        // Atualizar filtro e re-renderizar
        this.currentFilter = e.target.dataset.filter;
        this.renderTimeline();
      });
    });
  }

  showError() {
    const timelineContainer = document.getElementById("timeline");
    if (timelineContainer) {
      timelineContainer.innerHTML = `
        <div class="error-message">
          <p>Não foi possível carregar a timeline no momento.</p>
          <p>Tente novamente mais tarde.</p>
        </div>
      `;
    }
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new TimelineManager();
});
