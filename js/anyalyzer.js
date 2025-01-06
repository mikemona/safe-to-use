// Function to hide sections initially
function initializePage() {
  const resultsSection = document.getElementById("results");
  const noResultsSection = document.getElementById("noResults");

  // Ensure both sections are hidden initially
  if (resultsSection) resultsSection.style.display = "none";
  if (noResultsSection) noResultsSection.style.display = "none";
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

// Function to capitalize each word in a string
function capitalizeWords(str) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Function to check and normalize ingredients
function checkIngredients() {
  const input = document.getElementById("ingredientsInput").value;
  const ingredients = input
    .toLowerCase() // Normalize input to lowercase for matching purposes
    .replace(/[^\w\s,]/g, "") // Remove special characters
    .split(",")
    .map((i) => i.trim());

  const resultsSection = document.getElementById("results");
  const resultsContent = document.querySelector(".results__content");
  const noResultsSection = document.getElementById("noResults");

  // Hide both sections initially
  resultsSection.style.display = "none";
  noResultsSection.style.display = "none";

  // Clear previous results
  resultsContent.innerHTML = "";
  noResultsSection.innerHTML = "";

  const ingredientKeys = Object.keys(badIngredients);
  let hasResults = false;

  // Process ingredients
  ingredients.forEach((ingredient) => {
    // Check if the ingredient has a mapping (case insensitive)
    const mappedIngredient = ingredientMappings[ingredient.toLowerCase()] || ingredient;

    let title = "";
    let content = "";

    // Case-insensitive search for exact match
    const matchingKey = ingredientKeys.find(key => key.toLowerCase() === mappedIngredient.toLowerCase());

    if (matchingKey) {
      // Use the exact case from the JSON data
      title = matchingKey;
      content = badIngredients[matchingKey];
    } else {
      // If no exact match, suggest closest match with "did you mean"
      const closestMatch = findClosestMatch(mappedIngredient, ingredientKeys);
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
      header.innerHTML = `
        <div class="accordion-item__header-title">${title}</div>
        <i class="fa-solid fa-angle-down"></i>
      `;

      const contentElement = document.createElement("div");
      contentElement.classList.add("accordion-item__content");
      contentElement.innerHTML = `<p>${content}</p>`;
      contentElement.style.maxHeight = null;

      // Append header and content to accordion item
      accordionItem.appendChild(header);
      accordionItem.appendChild(contentElement);

      // Toggle accordion on click
      header.addEventListener("click", () => {
        // Rotate icon on open/close
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

  if (hasResults) {
    resultsSection.style.display = "block"; // Show results section
    resultsSection.scrollIntoView({ behavior: "smooth" }); // Scroll to results
  } else if (ingredients.length > 0 && ingredients[0] !== "") {
    // Show "No Results Found" message in noResults section
    noResultsSection.innerHTML = "<p>No bad ingredients found!</p>";
    noResultsSection.style.display = "block"; // Show noResults section
    noResultsSection.scrollIntoView({ behavior: "smooth" }); // Scroll to noResults
  }
}



// Clear form functionality
document.getElementById("clearForm").addEventListener("click", () => {
  const ingredientsInput = document.getElementById("ingredientsInput");
  const resultsSection = document.getElementById("results");
  const resultsContent = document.querySelector(".results__content");
  const noResultsSection = document.getElementById("noResults");

  // Clear input field
  if (ingredientsInput) {
    ingredientsInput.value = "";
  }

  // Clear results content and no results section
  resultsContent.innerHTML = "";
  noResultsSection.innerHTML = "";

  // Hide both sections
  resultsSection.style.display = "none";
  noResultsSection.style.display = "none";

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Call initializePage on page load
document.addEventListener("DOMContentLoaded", initializePage);
