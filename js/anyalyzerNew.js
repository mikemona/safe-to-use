document.addEventListener("DOMContentLoaded", () => {
    // Initialize elements
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

    // Initialize bad ingredients data
    let badIngredients = {};
    let ingredientMappings = {};

    fetch("../data/badIngredients.json")
        .then((response) => response.json())
        .then((data) => {
            badIngredients = data.ingredients;
            ingredientMappings = data.ingredientMappings;
        })
        .catch((error) => console.error("Error fetching bad ingredients:", error));

    // Hide initial sections
    if (imagePreviewContainer) imagePreviewContainer.style.display = "none";
    if (resultsSection) resultsSection.style.display = "none";
    if (noResultsSection) noResultsSection.style.display = "none";
    if (progressContainer) progressContainer.style.display = "none";

    // Use Camera functionality
    useCameraButton.addEventListener("click", (event) => {
        event.preventDefault();
        cameraInput.click();
    });

    cameraInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;

                if (typeIngredients) typeIngredients.value = "";
                if (typeIngredients) typeIngredients.style.display = "none";
                if (imagePreviewContainer) imagePreviewContainer.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Analyze button functionality
    analyzeButton.addEventListener("click", (event) => {
        event.preventDefault();

        if (progressContainer) progressContainer.style.display = "block";
        if (progressBar) progressBar.value = 0;

        if (imagePreviewContainer.style.display === "block") {
            processImage();
        } else {
            const ingredientsText = typeIngredients.value.trim();
            if (ingredientsText) {
                processText(ingredientsText);
            } else {
                if (progressContainer) progressContainer.style.display = "none";
                displayError("Please enter ingredients to analyze.");
            }
        }
    });

    // Clear Form functionality
    clearFormButton.addEventListener("click", (event) => {
        event.preventDefault();

        cameraInput.value = "";
        imagePreview.src = "";

        if (typeIngredients) typeIngredients.value = "";
        if (imagePreviewContainer) imagePreviewContainer.style.display = "none";
        if (typeIngredients) typeIngredients.style.display = "block";
        if (resultsSection) resultsSection.style.display = "none";
        if (noResultsSection) noResultsSection.style.display = "none";
        if (progressContainer) progressContainer.style.display = "none";
    });

    function processImage() {
        Tesseract.recognize(
            imagePreview.src,
            "eng",
            {
                logger: (m) => {
                    if (m.status === "recognizing text") {
                        if (progressBar) progressBar.value = m.progress * 100;
                    }
                },
            }
        )
            .then(({ data: { text } }) => {
                if (progressContainer) progressContainer.style.display = "none";
                processText(text);
            })
            .catch((error) => {
                console.error("OCR error:", error);
                if (progressContainer) progressContainer.style.display = "none";
                displayError("There was an error scanning the image. Please try again.");
            });
    }

    function processText(text) {
        const ingredients = text
            .split(/[\n,]/)
            .map((item) => item.trim().toLowerCase())
            .filter((item) => item.length > 0);

        const mappedIngredients = ingredients.map((ingredient) => {
            return ingredientMappings[ingredient] || ingredient;
        });

        displayResults(mappedIngredients);
    }

    function displayResults(ingredientsFound) {
        const resultsContent = document.querySelector(".results__content");
        if (resultsContent) resultsContent.innerHTML = "";

        let hasResults = false;
        let flaggedCount = 0;

        ingredientsFound.forEach((ingredient) => {
            const matchingKey = Object.keys(badIngredients).find(
                (key) => key.toLowerCase() === ingredient
            );

            if (matchingKey) {
                hasResults = true;
                flaggedCount++;
                createAccordionItem(matchingKey, badIngredients[matchingKey]);
            } else {
                const closestMatch = findClosestMatch(ingredient, Object.keys(badIngredients));
                if (closestMatch) {
                    hasResults = true;
                    flaggedCount++;
                    createAccordionItem(
                        `${ingredient} (did you mean ${closestMatch}?)`,
                        badIngredients[closestMatch]
                    );
                }
            }
        });

        if (hasResults) {
            if (resultsSection) resultsSection.style.display = "block";
            if (noResultsSection) noResultsSection.style.display = "none";

            const flaggedCountElement = document.createElement("p");
            flaggedCountElement.textContent = `${flaggedCount} ingredient(s) flagged as bad.`;
            resultsContent.prepend(flaggedCountElement);
        } else {
            if (noResultsSection) {
                noResultsSection.textContent = "No bad ingredients were found!";
                noResultsSection.style.display = "block";
            }
            if (resultsSection) resultsSection.style.display = "none";
        }

        if (progressContainer) progressContainer.style.display = "none";
    }

    function createAccordionItem(title, content) {
        const resultsContent = document.querySelector(".results__content");
        if (!resultsContent) return;

        const accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");

        const header = document.createElement("div");
        header.classList.add("accordion-item__header");
        header.innerHTML = `<div class="accordion-item__header-title">${title}</div><i class="fa-solid fa-angle-down"></i>`;

        const contentElement = document.createElement("div");
        contentElement.classList.add("accordion-item__content");
        contentElement.innerHTML = `<p>${content}</p>`;

        header.addEventListener("click", () => {
            const icon = header.querySelector("i");
            if (contentElement.style.maxHeight) {
                contentElement.style.maxHeight = null;
                icon.style.transform = "rotate(0deg)";
            } else {
                contentElement.style.maxHeight = `${contentElement.scrollHeight}px`;
                icon.style.transform = "rotate(180deg)";
            }
        });

        accordionItem.appendChild(header);
        accordionItem.appendChild(contentElement);
        resultsContent.appendChild(accordionItem);
    }

    function findClosestMatch(word, list, threshold = 2) {
        let closestMatch = null;
        let closestDistance = Infinity;

        list.forEach((item) => {
            const distance = getLevenshteinDistance(word, item);
            if (distance < closestDistance && distance <= threshold) {
                closestMatch = item;
                closestDistance = distance;
            }
        });

        return closestMatch;
    }

    function getLevenshteinDistance(a, b) {
        const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                matrix[i][j] =
                    b[i - 1] === a[j - 1]
                        ? matrix[i - 1][j - 1]
                        : Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) + 1;
            }
        }
        return matrix[b.length][a.length];
    }

    function displayError(message) {
        const resultsContent = document.querySelector(".results__content");
        if (resultsContent) resultsContent.innerHTML = `<p>${message}</p>`;
    }
});
