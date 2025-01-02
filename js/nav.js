function loadNav() {
    const navHTML = `
        <div class="nav">
            <a href="#" class="btn nav-link" data-name="journal" data-title="Journal" data-back="false"><i class="fa fa-home"></i></a>
            <a href="#" class="btn nav-link" data-name="bible" data-title="Bible" data-back="false"><i class="fa fa-bible"></i></a>
            <a href="#" class="btn nav-link" data-name="community" data-title="Community" data-back="false"><i class="fa fa-users"></i></a>
            <a href="#" class="btn nav-link" data-name="profile" data-title="Profile" data-back="false"><i class="fa fa-user"></i></a>
            <div class="nav-indicator"></div>
        </div>
    `;

    const navContainer = document.getElementById('nav-container');
    if (navContainer) {
        navContainer.innerHTML = navHTML;
        setActiveNavLink(); // Set the active page on load
    }
}

function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const indicator = document.querySelector('.nav-indicator');

    // Default page to load on page load
    const defaultPage = 'journal';
    const defaultTitle = 'Journal';
    loadPageContent(defaultPage, defaultTitle, false);

    // Set the first nav link (Journal) as active by default
    const firstNavLink = navLinks[0];
    updateActiveLink(firstNavLink);

    // Add click event listeners to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link action

            const pageName = link.getAttribute('data-name');
            const pageTitle = link.getAttribute('data-title');
            const showBackButton = link.getAttribute('data-back') === 'true';

            loadPageContent(pageName, pageTitle, showBackButton); // Load content dynamically
            updateActiveLink(link); // Update active link and indicator position
        });
    });
}

let lastVisitedPage = 'journal'; // Track the last visited main page

function loadPageContent(pageName, showBackButton = false, customTitle = null) {
    const bodyContainer = document.getElementById('body-container');
    
    fetch(`./${pageName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(htmlContent => {
            bodyContainer.innerHTML = htmlContent;

            // Determine page title and showBackButton logic
            const isMainPage = ['journal', 'bible', 'community', 'profile'].includes(pageName);
            const pageTitle = customTitle || (isMainPage ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : pageName);

            // Show back button only for subpages
            loadHeader({ showBackButton: !isMainPage && showBackButton, pageTitle });

            // Update lastVisitedPage if it's a main page
            if (isMainPage) {
                lastVisitedPage = pageName;
                updateActiveLink(document.querySelector(`.nav-link[data-name="${pageName}"]`));
            }

            // Check if the page is 'journal_NewEntry' and add the emotions logic
            if (pageName === 'journal_NewEntry') {
                // Wait for DOM to be ready, then generate emotion checkboxes
                setTimeout(() => {
                    generateEmotionCheckboxes(); // Generate emotion checkboxes after page load
                }, 0);
            }
        })
        .catch(error => {
            console.error('Error loading page content:', error);
            bodyContainer.innerHTML = '<p>Sorry, we couldn\'t load the page.</p>';
            loadHeader({ showBackButton: false, pageTitle: "Error" });
        });
}

document.addEventListener('DOMContentLoaded', loadNav);


function loadHeader({ showBackButton = false, pageTitle = 'Journal' }) {
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
        
        // Add event listener for back button if it's present
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                loadPageContent(lastVisitedPage, false); // Load the last visited main page without a back button
            });
        }
    }
}


function updateActiveLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Only add 'active' to main nav links
    if (activeLink) {
        activeLink.classList.add('active');
        updateIndicatorPosition(activeLink);
    }
}

function updateIndicatorPosition(activeLink) {
    const indicator = document.querySelector('.nav-indicator');
    const activeLinkRect = activeLink.getBoundingClientRect();
    const navRect = activeLink.parentElement.getBoundingClientRect();
    
    // Calculate the center of the active link
    const leftPosition = activeLinkRect.left - navRect.left + activeLinkRect.width / 2 - (indicator.offsetWidth / 2);
    
    // Move the indicator to the calculated position
    indicator.style.left = `${leftPosition}px`;
}

// Updated event listener for sub-nav links
document.addEventListener('click', (e) => {
    const target = e.target.closest('.sub-nav-link');

    if (target) {
        e.preventDefault();
        const pageName = target.getAttribute('data-name');
        const customTitle = target.getAttribute('data-title');
        const showBackButton = target.getAttribute('data-back') === 'true';

        loadPageContent(pageName, showBackButton, customTitle);

        // Do not update the active link when navigating to subpages
        updateActiveLink(null);
    }
});


// Updated event listener for main nav links
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const defaultPage = 'journal';
    
    loadPageContent(defaultPage, false); // Load the default main page without back button
    updateActiveLink(navLinks[0]); // Set the first nav link as active

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.getAttribute('data-name');
            loadPageContent(pageName, false); // Load main pages without back button
            updateActiveLink(link); // Update the active link for main nav
        });
    });
}

// Function to initialize subpage links within a loaded page
function initializeSubpageLinks(mainPage) {
    const subpageLinks = document.querySelectorAll('.sub-nav-link');
    subpageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const subPageName = link.getAttribute('data-name');
            const subPageTitle = link.getAttribute('data-title');
            const showBackButton = link.getAttribute('data-back') === 'true';

            // Load subpage content with custom title and back button enabled
            loadPageContent(subPageName, subPageTitle, showBackButton);
        });
    });
}

// Load the nav when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadNav);
