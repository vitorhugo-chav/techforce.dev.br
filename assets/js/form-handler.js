document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (!form || !statusEl) {
    console.warn("Formulário de contato ou elemento de status não encontrado.");
    return;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    statusEl.textContent = "Enviando...";
    statusEl.style.color = "var(--text-secondary)";

    try {
      const response = await fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        statusEl.textContent = "Mensagem enviada com sucesso!";
        statusEl.style.color = "var(--neon-purple)";
        form.reset();
      } else {
        const responseData = await response.json();
        if (Object.hasOwn(responseData, "errors")) {
          statusEl.textContent = responseData["errors"].map((error) => error["message"]).join(", ");
        } else {
          statusEl.textContent = "Ocorreu um erro ao enviar a mensagem.";
        }
        statusEl.style.color = "var(--neon-pink)";
      }
    } catch (error) {
      statusEl.textContent = "Ocorreu um erro. Verifique sua conexão.";
      statusEl.style.color = "var(--neon-pink)";
    }
  }

  form.addEventListener("submit", handleSubmit);
});