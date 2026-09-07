
document.addEventListener("DOMContentLoaded", () => {

  
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");
  const sidebar = document.getElementById("sidebar");
  const burgerBtn = document.getElementById("burgerBtn");

  function goToPage(pageId) {
    pages.forEach(p => p.classList.toggle("active", p.id === "page-" + pageId));
    navLinks.forEach(l => l.classList.toggle("active", l.dataset.page === pageId));
    sidebar.classList.remove("open");
    if (pageId === "historique") renderHistory();
  }

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      goToPage(link.dataset.page);
    });
  });

  document.querySelectorAll("[data-page].see-all").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      goToPage(link.dataset.page);
    });
  });

  burgerBtn.addEventListener("click", () => sidebar.classList.toggle("open"));

 
  const HISTORY_KEY = "aiworkspace_history";

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveToHistory(service, input, output) {
    const history = getHistory();
    history.unshift({
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      service,
      input,
      output,
      date: new Date().toLocaleString("fr-FR")
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  function deleteHistoryItem(id) {
    const history = getHistory().filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
  }

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }

  function truncate(text, max = 60) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "…" : text;
  }

  function renderHistory(filter = "") {
    const body = document.getElementById("historyBody");
    const emptyState = document.getElementById("historyEmpty");
    if (!body) return;

    let history = getHistory();

    if (filter.trim() !== "") {
      const q = filter.toLowerCase();
      history = history.filter(item =>
        item.service.toLowerCase().includes(q) ||
        item.input.toLowerCase().includes(q) ||
        item.output.toLowerCase().includes(q)
      );
    }

    body.innerHTML = "";

    if (history.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    history.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.service}</td>
        <td>${truncate(item.input)}</td>
        <td>${truncate(item.output)}</td>
        <td>${item.date}</td>
        <td><button class="btn-icon" data-id="${item.id}">Supprimer</button></td>
      `;
      body.appendChild(tr);
    });

    body.querySelectorAll(".btn-icon").forEach(btn => {
      btn.addEventListener("click", () => deleteHistoryItem(btn.dataset.id));
    });
  }

  const historySearch = document.getElementById("historySearch");
  if (historySearch) {
    historySearch.addEventListener("input", () => renderHistory(historySearch.value));
  }

  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      if (confirm("Vider tout l'historique ? Cette action est irréversible.")) {
        clearHistory();
      }
    });
  }

  
  const resumeBtn = document.getElementById("resumeBtn");
  const resumeInput = document.getElementById("resumeInput");
  const resumeResultBox = document.getElementById("resumeResultBox");
  const resumeResultContent = document.getElementById("resumeResultContent");

  function simulateResume(text) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "Veuillez saisir un texte à résumer.";
    const firstPart = words.slice(0, Math.min(20, Math.ceil(words.length / 3))).join(" ");
    return `Résumé automatique (${words.length} mots analysés) : ${firstPart}${words.length > 20 ? "…" : ""}\n\nCe résumé est une simulation générée localement à des fins de démonstration.`;
  }

  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      const text = resumeInput.value;
      if (!text.trim()) { resumeInput.focus(); return; }
      const output = simulateResume(text);
      resumeResultContent.textContent = output;
      resumeResultBox.hidden = false;
      saveToHistory("Résumé de texte", text, output);
    });
  }

  
  const classifBtn = document.getElementById("classifBtn");
  const classifInput = document.getElementById("classifInput");
  const classifResultBox = document.getElementById("classifResultBox");
  const classifResultContent = document.getElementById("classifResultContent");

  const positiveWords = ["bien", "super", "excellent", "content", "heureux", "génial", "aime", "top", "parfait", "bon"];
  const negativeWords = ["mauvais", "nul", "déteste", "triste", "problème", "horrible", "pire", "déçu", "faux", "erreur"];

  function simulateClassification(text) {
    if (!text.trim()) return "Veuillez saisir un texte à classifier.";
    const lower = text.toLowerCase();
    let score = 0;
    positiveWords.forEach(w => { if (lower.includes(w)) score++; });
    negativeWords.forEach(w => { if (lower.includes(w)) score--; });

    let label = "Neutre";
    let confidence = 60 + Math.floor(Math.random() * 15);
    if (score > 0) { label = "Positif"; confidence = 75 + Math.floor(Math.random() * 20); }
    if (score < 0) { label = "Négatif"; confidence = 75 + Math.floor(Math.random() * 20); }

    return `Catégorie détectée : ${label}\nNiveau de confiance : ${confidence}%\n\n(Classification simulée à des fins de démonstration.)`;
  }

  if (classifBtn) {
    classifBtn.addEventListener("click", () => {
      const text = classifInput.value;
      if (!text.trim()) { classifInput.focus(); return; }
      const output = simulateClassification(text);
      classifResultContent.textContent = output;
      classifResultBox.hidden = false;
      saveToHistory("Classification", text, output);
    });
  }

  
  const traduireBtn = document.getElementById("traduireBtn");
  const traductionInput = document.getElementById("traductionInput");
  const langueSelect = document.getElementById("langueSelect");
  const traductionResultBox = document.getElementById("traductionResultBox");
  const traductionResultContent = document.getElementById("traductionResultContent");

  const langueLabels = {
    en: "Anglais",
    es: "Espagnol",
    de: "Allemand",
    ar: "Arabe",
    wo: "Wolof"
  };

  function simulateTraduction(text, langueCode) {
    if (!text.trim()) return "Veuillez saisir un texte à traduire.";
    const langue = langueLabels[langueCode] || langueCode;
    return `[Traduction simulée en ${langue}]\n${text}\n\n(Ceci est une traduction fictive à des fins de démonstration, aucune API n'a été appelée.)`;
  }

  if (traduireBtn) {
    traduireBtn.addEventListener("click", () => {
      const text = traductionInput.value;
      if (!text.trim()) { traductionInput.focus(); return; }
      const langueCode = langueSelect.value;
      const output = simulateTraduction(text, langueCode);
      traductionResultContent.textContent = output;
      traductionResultBox.hidden = false;
      saveToHistory("Traduction", `${text} (→ ${langueLabels[langueCode]})`, output);
    });
  }

  
  const chatSendBtn = document.getElementById("chatSendBtn");
  const chatInput = document.getElementById("chatInput");
  const chatResultBox = document.getElementById("chatResultBox");
  const chatResultContent = document.getElementById("chatResultContent");
  const chatThread = document.getElementById("chatThread");

  const chatReplies = [
    "C'est une excellente question. Voici quelques pistes de réflexion à ce sujet.",
    "D'après les informations disponibles, voici une réponse possible à votre demande.",
    "Je peux vous aider avec cela. Pouvez-vous préciser un peu plus votre besoin ?",
    "Voici une synthèse simulée en réponse à votre message.",
    "Merci pour votre message, voici une réponse générée à titre de démonstration."
  ];

  function simulateChatReply(message) {
    const base = chatReplies[Math.floor(Math.random() * chatReplies.length)];
    return `${base}\n\n(Réponse simulée à votre message : "${truncate(message, 80)}")`;
  }

  function addChatBubble(text, sender) {
    const emptyMsg = chatThread.querySelector(".empty-state");
    if (emptyMsg) emptyMsg.remove();
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + sender;
    bubble.textContent = text;
    chatThread.appendChild(bubble);
    chatThread.scrollTop = chatThread.scrollHeight;
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener("click", () => {
      const message = chatInput.value;
      if (!message.trim()) { chatInput.focus(); return; }
      const output = simulateChatReply(message);

      addChatBubble(message, "user");
      addChatBubble(output, "bot");

      chatResultContent.textContent = output;
      chatResultBox.hidden = false;

      saveToHistory("Chat", message, output);
      chatInput.value = "";
      chatInput.focus();
    });

    chatInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        chatSendBtn.click();
      }
    });
  }


  const predireBtn = document.getElementById("predireBtn");
  const ageInput = document.getElementById("ageInput");
  const revenuInput = document.getElementById("revenuInput");
  const villeInput = document.getElementById("villeInput");
  const predictionResultBox = document.getElementById("predictionResultBox");
  const predictionResultContent = document.getElementById("predictionResultContent");

  function simulatePrediction(age, revenu, ville) {
    if (!age || !revenu || !ville.trim()) {
      return "Veuillez renseigner l'âge, le revenu et la ville.";
    }
    const score = (Number(revenu) / 1000) + (Number(age) < 40 ? 5 : 2);
    let profil = "Profil standard";
    if (score > 12) profil = "Profil premium";
    else if (score < 5) profil = "Profil économique";

    const probabilite = Math.min(97, Math.max(40, Math.round(score * 6)));

    return `Ville : ${ville}\nProfil estimé : ${profil}\nProbabilité de conversion : ${probabilite}%\n\n(Prédiction fictive générée à des fins de démonstration, aucun modèle réel n'a été utilisé.)`;
  }

  if (predireBtn) {
    predireBtn.addEventListener("click", () => {
      const age = ageInput.value;
      const revenu = revenuInput.value;
      const ville = villeInput.value;
      const output = simulatePrediction(age, revenu, ville);
      predictionResultContent.textContent = output;
      predictionResultBox.hidden = false;
      saveToHistory("Prédiction", `Âge: ${age}, Revenu: ${revenu}, Ville: ${ville}`, output);
    });
  }

  
  renderHistory();
});
