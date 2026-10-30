const mainMenu = document.getElementById("menu-main");
const fortressesMenu = document.getElementById("menu-fortresses");
const menuDescription = document.querySelector(".menu-description");
const MAIN_DESCRIPTION = menuDescription.textContent;

function showFortresses(visible) {
    mainMenu.classList.toggle("d-none", visible);
    fortressesMenu.classList.toggle("d-none", !visible);
    menuDescription.textContent = visible ? "Escolha o tipo de fortaleza para gerar:" : MAIN_DESCRIPTION;
}

document.getElementById("fortresses-open").addEventListener("click", event => {
    event.preventDefault();
    showFortresses(true);
});
document.getElementById("fortresses-back").addEventListener("click", () => showFortresses(false));
