document.addEventListener("DOMContentLoaded", () => {
    const useCameraButton = document.getElementById("useCamera");
    const cameraInput = document.getElementById("cameraInput");
    const typeIngredients = document.getElementById("typeIngredients");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const analyzeButton = document.getElementById("analyzeText");
    const clearFormButton = document.getElementById("clearForm");
  
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");
    const resultsSection = document.getElementById("resultsSection");
    const noResultsSection = document.getElementById("noResults");
  
    // Hide the image preview container initially
    if (imagePreviewContainer) {
      imagePreviewContainer.style.display = "none";  // Ensure this line is in place to hide the preview container initially.
    }
  
    // Event listener for the Use Camera button
    useCameraButton.addEventListener("click", (event) => {
      event.preventDefault();
      cameraInput.click(); // Trigger the file input click event
    });
  
    // Event listener for the file input
    cameraInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
  
        reader.onload = function (e) {
          // Set the image preview source
          imagePreview.src = e.target.result;
  
          // Hide the #typeIngredients field and show the #imagePreviewContainer
          if (typeIngredients) typeIngredients.style.display = "none";
          if (imagePreviewContainer) imagePreviewContainer.style.display = "block";
  
          // Change the analyze button ID to analyzeImage
          if (analyzeButton) analyzeButton.id = "analyzeImage";
        };
  
        reader.readAsDataURL(file);
      }
    });
  
    // Change the functionality of the Analyze button when an image is uploaded
    analyzeButton.addEventListener("click", () => {
      if (imagePreviewContainer.style.display === "block") {
        alert("Analyzing the uploaded image...");
  
        // Show progress bar
        if (progressContainer) progressContainer.style.display = "block";
        if (progressBar) progressBar.value = 0;
  
        // Start OCR process
        Tesseract.recognize(
          imagePreview.src,
          'eng',
          {
            logger: (m) => {
              if (m.status === "recognizing text") {
                // Update progress bar with current progress
                if (progressBar) progressBar.value = m.progress * 100;
              }
            }
          }
        )
        .then(({ data: { text } }) => {
          // Hide the progress bar
          if (progressContainer) progressContainer.style.display = "none";
  
          // Process the extracted text
          handleTextAnalysis(text);
        })
        .catch((error) => {
          console.error("OCR error:", error);
  
          // Hide the progress bar and show error message
          if (progressContainer) progressContainer.style.display = "none";
          if (resultsSection) resultsSection.innerHTML = `<p>There was an error scanning the image. Please try again.</p>`;
        });
      } else {
        alert("Analyzing the entered text...");
        // Add your text analysis logic here
      }
    });
  
    // Event listener for the Clear Form button
    clearFormButton.addEventListener("click", (event) => {
      event.preventDefault();
  
      // Clear the file input
      cameraInput.value = "";
  
      // Reset the UI
      if (imagePreview) imagePreview.src = ""; // Clear the image preview
      if (imagePreviewContainer) imagePreviewContainer.style.display = "none"; // Hide the image preview container
      if (typeIngredients) typeIngredients.style.display = "block"; // Show the typeIngredients field
  
      // Reset the analyze button ID to analyzeText
      if (analyzeButton) analyzeButton.id = "analyzeText";
    });
  
    // Function to handle the text analysis
    function handleTextAnalysis(extractedText) {
      // Split the extracted text into individual ingredients
      const ingredients = extractedText.split("\n").map(item => item.trim()).filter(item => item.length > 0);
  
      // Process and display the results
      displayResults(ingredients);
    }
  
    // Function to display results in the results section
    function displayResults(ingredientsFound) {
      const resultsContent = document.querySelector(".results__content");
  
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
          header.innerHTML = `
            <div class="accordion-item__header-title">${title}</div>
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
  });
  