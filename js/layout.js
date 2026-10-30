async function loadLayoutComponent(containerId, path) {
    const container = document.getElementById(containerId);

    if (!container) {
        throw new Error(`Layout container #${containerId} was not found.`);
    }

    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Could not load ${path}: ${response.status} ${response.statusText}`);
    }

    container.innerHTML = await response.text();
}

Promise.all([
    loadLayoutComponent("site-header", "components/header/header.html"),
    loadLayoutComponent("site-footer", "components/footer/footer.html")
]).catch(error => {
    console.error("Failed to load shared G-City layout.", error);
});
