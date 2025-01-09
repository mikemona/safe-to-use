function loadActionBar() {
    const actionsHTML = `
      <div class="action-bar">
        <div class="action-bar__actions">
          <div class="action-bar__actions-tools">
            <button
              class="btn btn-ghost"
              data-title="Use Camera"
              id="useCamera"
            >
              <i class="fa-solid fa-camera"></i>
            </button>
          </div>
          <div class="action-bar__actions-buttons">
            <button
              class="btn btn-ghost"
              data-title="Clear Form"
              id="clearForm"
            >
              <i class="fa-solid fa-rotate-left"></i>
            </button>
            <button
              class="btn btn-primary"
              data-title="Analyze"
              id="analyzeText"
            >
              Analyze
            </button>
          </div>
        </div>
      </div>
    `;
  
    // Inject the action bar into the container
    const actionsContainer = document.getElementById('actions-container');
    if (actionsContainer) {
      actionsContainer.innerHTML = actionsHTML;
    }
  }
  
  // Load the action bar when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', loadActionBar);
  