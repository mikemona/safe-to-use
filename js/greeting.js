// Define a function to initialize the greeting message
function initializeGreeting() {
    console.log("Initializing greeting message"); // Debugging if function is called

    // Find the journal greeting element after loading the page
    const journalGreeting = document.getElementById("journalGreeting");

    // Check if the journalGreeting element is found
    if (!journalGreeting) {
        console.error("Error: journalGreeting element not found");
        return;
    }

    // Get the current hour and determine the time of day
    const currentHour = new Date().getHours();
    let timeOfDay;

    if (currentHour >= 0 && currentHour < 12) {
        timeOfDay = "morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        timeOfDay = "afternoon";
    } else {
        timeOfDay = "evening";
    }

    // Set the greeting message
    const greetingMessage = ` ${timeOfDay}`;
    console.log(`Greeting message set: ${greetingMessage}`); // Debugging

    // Update the text content of the journalGreeting element
    journalGreeting.textContent = greetingMessage;

    // If still empty, add a placeholder for visibility
    if (!journalGreeting.textContent.trim()) {
        journalGreeting.innerHTML = '&nbsp;'; // Add a non-breaking space if empty
    }
}

// Export the function for usage after loading dynamic content
window.initializeGreeting = initializeGreeting;
