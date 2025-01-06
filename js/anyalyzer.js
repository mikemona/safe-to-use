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

  const results = document.getElementById("result");
  results.innerHTML = ""; // Clear previous results

  const ingredientKeys = Object.keys(badIngredients);

  let hasResults = false; // Track if there are any results to show

  ingredients.forEach((ingredient) => {
    const normalized = ingredientMapping[ingredient] || ingredient;
    let title = "";
    let content = "";

    if (badIngredients[normalized]) {
      const reason = badIngredients[normalized];
      title = normalized;
      content = reason;
    } else {
      const closestMatch = findClosestMatch(normalized, ingredientKeys);
      if (closestMatch) {
        const reason = badIngredients[closestMatch];
        title = `${normalized} <em>(did you mean ${closestMatch}?)</em>`;
        content = reason;
      }
    }

    if (title && content) {
      hasResults = true;

      // Create accordion item
      const accordionItem = document.createElement("div");
      accordionItem.classList.add("accordion-item");

      // Accordion header
      const header = document.createElement("div");
      header.classList.add("accordion-item__header");
      header.setAttribute("role", "button");
      header.innerHTML = `
        <div class="accordion-item__header-title">${title}</div>
        <i class="fa-solid fa-angle-down"></i>
      `;

      // Accordion content
      const contentElement = document.createElement("div");
      contentElement.classList.add("accordion-item__content");
      contentElement.innerHTML = `<p>${content}</p>`;
      contentElement.style.maxHeight = null; // Ensure content is initially collapsed

      // Append header and content to accordion item
      accordionItem.appendChild(header);
      accordionItem.appendChild(contentElement);

      // Add click toggle functionality to header
      header.addEventListener("click", () => {
        if (contentElement.style.maxHeight) {
          contentElement.style.maxHeight = null; // Close the accordion
        } else {
          contentElement.style.maxHeight = `${contentElement.scrollHeight}px`; // Open the accordion
        }
      });

      // Append the accordion item to results
      results.appendChild(accordionItem);
    }
  });

  if (hasResults) {
    results.style.display = "flex"; // Show the results section
  } else {
    results.innerHTML = "<p>No bad ingredients found!</p>";
    results.style.display = "block"; // Ensure the section is visible
  }

  // Scroll to the results section
  results.scrollIntoView({ behavior: "smooth" });
}

// Clear Form button functionality
document.getElementById("clearForm").addEventListener("click", () => {
  const ingredientsInput = document.getElementById("ingredientsInput");
  if (ingredientsInput) {
    ingredientsInput.value = ""; // Clear the input field
  }

  const results = document.getElementById("result");
  if (results) {
    results.style.display = "none"; // Hide the results section
    results.innerHTML = ""; // Clear its content
  }

  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Clear Form button functionality
document.getElementById("clearForm").addEventListener("click", () => {
  // Clear the textarea
  const ingredientsInput = document.getElementById("ingredientsInput");
  if (ingredientsInput) {
    ingredientsInput.value = ""; // Clears the input field
  }

  // Clear the results
  const results = document.getElementById("result");
  if (results) {
    results.innerHTML = ""; // Clears the results content
  }

  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: "smooth" });
});
