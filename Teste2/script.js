
/* ==========================================
   1. SELEÇÃO DOS ELEMENTOS HTML
========================================== */

// Busca o botão de tema no HTML
const themeButton = document.getElementById("theme-button");

// Busca o vídeo de fundo
const backgroundVideo = document.querySelector(".background-video");

// Busca todas as seções do site
const sections = document.querySelectorAll(".section");

// Busca todos os links do menu
const navigationLinks = document.querySelectorAll(".nav-link");


/* ==========================================
   2. ALTERAÇÃO DE TEMA
========================================== */

// Verifica se o usuário já escolheu um tema anteriormente
const savedTheme = localStorage.getItem("theme");

// Se existir um tema salvo, aplica ele
if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
}


// Quando o usuário clicar no botão de tema
themeButton.addEventListener("click", () => {

    // Verifica qual tema está ativo
    const currentTheme = document.body.getAttribute("data-theme");

    // Se estiver no tema escuro, muda para claro
    // Caso contrário, muda para escuro
    const newTheme = currentTheme === "light" ? "dark" : "light";

    // Aplica o novo tema ao site
    document.body.setAttribute("data-theme", newTheme);

    // Salva a escolha do usuário no navegador
    localStorage.setItem("theme", newTheme);

});


/* ==========================================
   3. DESTAQUE DO MENU DURANTE O SCROLL
========================================== */

// Cria um observador para acompanhar as seções
const sectionObserver = new IntersectionObserver((entries) => {

    // Analisa cada seção que entrou ou saiu da tela
    entries.forEach((entry) => {

        // Verifica se a seção está visível
        if (entry.isIntersecting) {

            // Pega o ID da seção atual
            const currentSection = entry.target.id;

            // Percorre todos os links do menu
            navigationLinks.forEach((link) => {

                // Verifica se o link aponta para a seção atual
                const isActive = link.getAttribute("href") === `#${currentSection}`;

                // Adiciona ou remove a classe active
                link.classList.toggle("active", isActive);

            });

        }

    });

}, {

    // Define quanto da seção precisa estar visível
    // para que ela seja considerada ativa
    threshold: 0.5

});


// Faz o observador acompanhar cada seção
sections.forEach((section) => {
    sectionObserver.observe(section);
});


/* ==========================================
   4. CONTROLE DO VÍDEO DE FUNDO
========================================== */

// Verifica se a página está visível
document.addEventListener("visibilitychange", () => {

    // Se o usuário sair da aba, pausa o vídeo
    if (document.hidden) {
        backgroundVideo.pause();
    }

    // Se voltar para a aba, tenta reproduzir
    else {
        backgroundVideo.play().catch(() => {
            // Evita erros caso o navegador bloqueie a reprodução
        });
    }

});
