// Function to hide sections initially
function initializePage() {
  const resultsSection = document.getElementById("results");
  const noResultsSection = document.getElementById("noResults");
  const progressBar = document.getElementById("progressBar");

  // Hide sections initially
  if (resultsSection) resultsSection.style.display = "none";
  if (noResultsSection) noResultsSection.style.display = "none";
  if (progressBar) progressBar.style.display = "none";
}

let badIngredients = {};
let ingredientMappings = {};

// Fetch bad ingredients and ingredient mappings from JSON file
fetch("../data/badIngredients.json")
  .then((response) => response.json())
  .then((data) => {
    badIngredients = data.ingredients; // Store ingredients with their descriptions
    ingredientMappings = data.ingredientMappings; // Store ingredient abbreviations/variations
  })
  .catch((error) => console.error("Error fetching bad ingredients:", error));

// Function to analyze the text and handle ingredient mappings
function analyzeText(ingredients) {
  const mappedIngredients = ingredients.map((ingredient) => {
    const trimmedIngredient = ingredient.trim(); // Trim whitespace
    // Map ingredient using abbreviations/variations if available
    return ingredientMappings[trimmedIngredient.toLowerCase()] || trimmedIngredient;
  });

  // Process the mapped ingredients and display results
  displayResults(mappedIngredients);
}

// Utility function: Calculate Levenshtein Distance
function getLevenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) +
            1;
    }
  }
  return matrix[b.length][a.length];
}

// Utility function: Find the closest match for a word
function findClosestMatch(word, list, threshold = 2) {
  let closestMatch = null;
  let closestDistance = Infinity;

  for (const item of list) {
    const distance = getLevenshteinDistance(word, item);
    if (distance < closestDistance && distance <= threshold) {
      closestMatch = item;
      closestDistance = distance;
    }
  }
  return closestMatch;
}

// Event listener for the Analyze button
document.getElementById("analyzeText").addEventListener("click", (event) => {
  event.preventDefault();
  checkIngredients();
});

// Function to display results in the results section
function displayResults(ingredientsFound) {
  const resultsSection = document.getElementById("results");
  const resultsContent = document.querySelector(".results__content");
  const noResultsSection = document.getElementById("noResults");

  // Clear previous results
  if (resultsContent) resultsContent.innerHTML = "";

  let hasResults = false;

  // Process ingredients found in the input text
  ingredientsFound.forEach((ingredient) => {
    let title = "";
    let content = "";

    // Case-insensitive search for exact match
    const matchingKey = Object.keys(badIngredients).find(
      (key) => key.toLowerCase() === ingredient.toLowerCase()
    );

    if (matchingKey) {
      title = matchingKey;
      content = badIngredients[matchingKey];
    } else {
      // Suggest closest match with "did you mean"
      const closestMatch = findClosestMatch(ingredient, Object.keys(badIngredients));
      if (closestMatch) {
        title = `${ingredient} (did you mean ${closestMatch}?)`;
        content = badIngredients[closestMatch];
      }
    }

    if (title && content) {
      hasResults = true;

      // Create accordion item
      const accordionItem = document.createElement("div");
      accordionItem.classList.add("accordion-item");

      const header = document.createElement("div");
      header.classList.add("accordion-item__header");
      header.setAttribute("role", "button");
      header.innerHTML = 
        `<div class="accordion-item__header-title">${title}</div>
        <i class="fa-solid fa-angle-down"></i>`;

      const contentElement = document.createElement("div");
      contentElement.classList.add("accordion-item__content");
      contentElement.innerHTML = `<p>${content}</p>`;
      contentElement.style.maxHeight = null;

      // Append header and content to accordion item
      accordionItem.appendChild(header);
      accordionItem.appendChild(contentElement);

      // Toggle accordion on click
      header.addEventListener("click", () => {
        const icon = header.querySelector("i");
        if (contentElement.style.maxHeight) {
          contentElement.style.maxHeight = null; // Close accordion
          icon.style.transform = "rotate(0deg)"; // Reset icon rotation
        } else {
          contentElement.style.maxHeight = `${contentElement.scrollHeight}px`; // Open accordion
          icon.style.transform = "rotate(180deg)"; // Rotate icon
        }
      });

      // Append to results content
      resultsContent.appendChild(accordionItem);
    }
  });

  // Display results or no results section
  if (hasResults) {
    if (resultsSection) resultsSection.style.display = "block"; // Show results section
    if (resultsSection) resultsSection.scrollIntoView({ behavior: "smooth" }); // Scroll to results
    if (noResultsSection) noResultsSection.style.display = "none"; // Hide noResults section
  } else {
    if (noResultsSection) {
      noResultsSection.innerHTML = "<p>No bad ingredients were found!</p>";
      noResultsSection.style.display = "block"; // Show noResults section
      if (noResultsSection) noResultsSection.scrollIntoView({ behavior: "smooth" }); // Scroll to noResults
    }
    if (resultsSection) resultsSection.style.display = "none"; // Hide results section
  }
}

// Function to handle form clearing
function clearForm() {
  const ingredientsInput = document.getElementById("ingredientsInput");
  const resultsSection = document.getElementById("results");
  const resultsContent = document.querySelector(".results__content");
  const noResultsSection = document.getElementById("noResults");
  const progressBar = document.getElementById("progressBar");

  // Clear input field
  if (ingredientsInput) {
    ingredientsInput.value = "";
  }

  // Clear results content and no results section
  if (resultsContent) resultsContent.innerHTML = "";
  if (noResultsSection) noResultsSection.innerHTML = "";

  // Hide both sections
  if (resultsSection) resultsSection.style.display = "none";
  if (noResultsSection) noResultsSection.style.display = "none";
  if (progressBar) progressBar.style.display = "none";

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Event listener for the Analyze button
document.querySelector("[data-title='Analyze']").addEventListener("click", (event) => {
  event.preventDefault();
  const ingredientsInput = document.getElementById("ingredientsInput");
  if (ingredientsInput && ingredientsInput.value) {
    // Get ingredients from input and analyze them
    const ingredients = ingredientsInput.value.split(",").map((item) => item.trim());
    analyzeText(ingredients); // Use the analyzeText function to process the input
  }
});

// Event listener for the Clear Form button
document.getElementById("clearForm").addEventListener("click", clearForm);

// Call initializePage on page load
document.addEventListener("DOMContentLoaded", initializePage);
