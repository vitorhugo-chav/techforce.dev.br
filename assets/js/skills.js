// Carregamento e exibição das habilidades
class SkillsManager {
  constructor() {
    this.skills = {};
    this.init();
  }

  async init() {
    try {
      await this.loadSkills();
      this.renderSkills();
    } catch (error) {
      console.error("Erro ao carregar habilidades:", error);
      this.showError();
    }
  }

  async loadSkills() {
    const response = await fetch("assets/data/skills.json");
    if (!response.ok) {
      throw new Error("Falha ao carregar habilidades");
    }
    const data = await response.json();
    this.skills = data.skills;
  }

  renderSkills() {
    const skillsGrid = document.getElementById("skills-grid");

    if (!skillsGrid) return;

    const categories = {
      frontend: "Frontend",
      backend: "Backend",
      database: "Banco de Dados",
      tools: "Ferramentas",
    };

    skillsGrid.innerHTML = Object.entries(categories)
      .map(([key, title]) => {
        const skills = this.skills[key] || [];
        if (skills.length === 0) return ""; // Não renderizar categorias vazias

        return this.createSkillCategory(key, title, skills);
      })
      .join("");
  }

  createSkillCategory(key, title, skills) {
    const skillsList = skills
      .map((skill) => this.createSkillItem(skill))
      .join("");

    return `
      <div class="skill-category" data-category="${key}">
        <h3>${title}</h3>
        <ul>
          ${skillsList}
        </ul>
      </div>
    `;
  }

  createSkillItem(skill) {
    const levelClass = this.getLevelClass(skill.level);

    return `
      <li class="skill-item ${levelClass}">
        <span class="skill-icon">${skill.icon}</span>
        <span class="skill-name">${skill.name}</span>
        <span class="skill-level">${skill.level}</span>
      </li>
    `;
  }

  getLevelClass(level) {
    const levelMap = {
      Avançado: "level-advanced",
      Intermediário: "level-intermediate",
      Básico: "level-basic",
    };
    return levelMap[level] || "level-basic";
  }

  showError() {
    const skillsGrid = document.getElementById("skills-grid");
    if (skillsGrid) {
      skillsGrid.innerHTML = `
        <div class="error-message">
          <p>Não foi possível carregar as habilidades no momento.</p>
          <p>Tente novamente mais tarde.</p>
        </div>
      `;
    }
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new SkillsManager();
});
