let badIngredients = {};

// Fetch bad ingredients from JSON file
fetch("../data/badIngredients.json")
  .then((response) => response.json())
  .then((data) => {
    badIngredients = data; // Store the fetched data in the badIngredients variable
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

// Predefined mapping for common variations
const ingredientMapping = {
  hfcs: "high fructose corn syrup",
  "high-fructose corn syrup": "high fructose corn syrup",
  "sodium benzo": "sodium benzoate",
};

// Function to check ingredients
function checkIngredients() {
  const input = document.getElementById("ingredientsInput").value;
  const ingredients = input
    .toLowerCase()
    .replace(/[^\w\s,]/g, "") // Remove special characters
    .split(",")
    .map((i) => i.trim());

  const results = document.getElementById("results");
  results.innerHTML = "";

  const ingredientKeys = Object.keys(badIngredients);

  ingredients.forEach((ingredient) => {
    // Check against mapping
    const normalized = ingredientMapping[ingredient] || ingredient;

    let headerHTML = "";
    let contentHTML = "";

    // Check exact match
    if (badIngredients[normalized]) {
      const reason = badIngredients[normalized];
      headerHTML = `<span class="ingredient-name">${normalized}</span>`;
      contentHTML = `<p>${reason}</p>`;
    } else {
      // Check for approximate matches
      const closestMatch = findClosestMatch(normalized, ingredientKeys);
      if (closestMatch) {
        const reason = badIngredients[closestMatch];
        headerHTML = `<span class="ingredient-name">${normalized}</span> <em>(did you mean <b>${closestMatch}</b>?)</em>`;
        contentHTML = `<p>${reason}</p>`;
      }
    }

    if (headerHTML && contentHTML) {
      // Create the accordion item
      const accordionItem = document.createElement("div");
      accordionItem.classList.add("accordion-item");

      // Create the accordion header
      const accordionHeader = document.createElement("div");
      accordionHeader.classList.add("accordion-header");
      accordionHeader.innerHTML = `
        ${headerHTML}
        <button class="accordion-toggle">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      `;

      // Create the accordion content
      const accordionContent = document.createElement("div");
      accordionContent.classList.add("accordion-content");
      accordionContent.innerHTML = contentHTML;

      // Add click event to toggle the accordion
      accordionHeader.addEventListener("click", () => {
        accordionContent.classList.toggle("open");
        const icon = accordionHeader.querySelector(".accordion-toggle i");
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
      });

      // Append header and content to the accordion item
      accordionItem.appendChild(accordionHeader);
      accordionItem.appendChild(accordionContent);

      // Append the accordion item to the results
      results.appendChild(accordionItem);
    }
  });

  if (!results.innerHTML) {
    results.innerHTML = "<p>No bad ingredients found!</p>";
  }

  // Scroll to the results section
  results.scrollIntoView({ behavior: "smooth" });
}

// Clear Form button functionality
document.getElementById("clearForm").addEventListener("click", () => {
  // Clear the textarea
  const ingredientsInput = document.getElementById("ingredientsInput");
  if (ingredientsInput) {
    ingredientsInput.value = ""; // Clears the input field
  }

  // Clear the results
  const results = document.getElementById("results");
  if (results) {
    results.innerHTML = ""; // Clears the results content
  }

  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: "smooth" });
});
