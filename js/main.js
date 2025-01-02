// Define the content for each page
// Sample page data for dynamic content
const pages = {
    journal: `
        <div class="journal-page">
            <h1>Journal</h1>
            <p>Welcome to your journal page.</p>
        </div>
    `,
    bible: `
        <div class="bible-page">
            <h1>Bible</h1>
            <p>Explore Bible verses here.</p>
        </div>
    `,
    community: `
        <div class="community-page">
            <h1>Community</h1>
            <p>Connect with your community.</p>
        </div>
    `,
    profile: `
        <div class="profile-page">
            <h1>Profile</h1>
            <p>Manage your profile details.</p>
        </div>
    `
};

// Function to dynamically load pages into the content container
function loadPage(page) {
    const contentContainer = document.getElementById('content-container');

    if (!contentContainer) {
        console.error("Content container not found.");
        return;
    }

    // Dynamically insert the corresponding page content
    contentContainer.innerHTML = pages[page] || `<h2>Page Not Found</h2>`;
}

// You can call this function based on nav clicks from nav.js
document.addEventListener('DOMContentLoaded', () => {
    loadPage('journal'); // Default page loaded on first visit
});
