function loadHeader({ showBackButton, pageTitle }) {
    const headerHTML = `
        <div class="header">
            <div class="header__left">
                ${showBackButton ? `<button id="backButton" class="btn btn-link"><i class="fa-solid fa-angle-left"></i></button>` : ''}
                <div class="header__page-title">${pageTitle}</div>
            </div>
            <div class="header__right">
                <button href="#" class="btn btn-ghost">MM</button>
            </div>
        </div>
    `;

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;

        // Back button click handler
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                loadPageContent('journal'); // Navigate back to the "Journal" page
            });
        }
    }
}

