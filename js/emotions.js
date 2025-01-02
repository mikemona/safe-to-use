function generateEmotionCheckboxes() {
  console.log("generateEmotionCheckboxes function is called");

  const checkboxGroup = document.getElementById('emotion-checkbox-group');
  if (!checkboxGroup) {
      console.log("Checkbox group container not found.");
      return;
  }

  const emotionCategories = {
     "Positive": {
    emotions: [
      "Happy", "Excited", "Grateful", "Content", "Proud", "Joyful", "Relieved", "Optimistic", "Elated",
      "Inspired", "Euphoric", "Hopeful", "Pleased", "Calm", "Peaceful", "Motivated", "Confident", "Empowered",
      "Loving", "Trusting", "Gracious", "Thankful", "Secure", "Lighthearted", "Uplifted", "Cheerful", 
      "Affectionate", "Fulfilling", "Radiant", "Pleasant", "Satisfied", "Generous", "Creative", "Free", 
      "Comfortable", "Balanced", "Radiating", "Inspired", "Connected", "Successful", "Blessed"
    ],
    colorClass: "btn-check--positive",
  },
  "Negative": {
    emotions: [
      "Sad", "Angry", "Stressed", "Anxious", "Frustrated", "Guilty", "Fearful", "Overwhelmed", "Disappointed", 
      "Lonely", "Regretful", "Hopeless", "Embarrassed", "Irritated", "Resentful", "Hurt", "Desperate", "Helpless", 
      "Miserable", "Gloomy", "Uncertain", "Rejected", "Shameful", "Bitter", "Livid", "Heartbroken", 
      "Confused", "Tense", "Vulnerable", "Insecure", "Exhausted", "Dismayed", "Distressed", "Troubled", 
      "Nervous", "Fearful", "Anguished", "Despondent", "Melancholy", "Skeptical", "Isolated"
    ],
    colorClass: "btn-check--negative",
  },
  "Neutral": {
    emotions: [
      "Bored", "Calm", "Relaxed", "Indifferent", "Apathetic", "Confused", "Melancholy", "Satisfied", "Doubtful", 
      "Content", "Uncertain", "Mild", "Indifferent", "Neutral", "Balanced", "Stable", "Detached", "Ambivalent", 
      "Lukewarm", "Meh", "Uninterested", "Quiet", "Passive", "Unmoved", "Equanimous", "Serene", 
      "Laid-back", "Dispassionate", "Nonchalant", "Unconcerned", "Composed", "Cool-headed", "Tolerant", 
      "Neutral", "Resigned", "Quiet", "Relaxed", "Steady", "Stagnant", "Normal", "Routine"
    ],
    colorClass: "btn-check--neutral",
  },
  "Mixed": {
    emotions: [
      "Curious", "Insecure", "Lonely", "Inspired", "Jealous", "Playful", "Hopeful", "Motivated", "Worried", 
      "Conflicted", "Ambivalent", "Uncertain", "Fascinated", "Nostalgic", "Cautious", "Trusting", "Skeptical", 
      "Excited", "Pessimistic", "Reflective", "Surprised", "Suspicious", "Doubtful", "Intrigued", 
      "Awkward", "Shocked", "Torn", "Unsettled", "Uneasy", "Anticipative", "Worried", "Frightened", 
      "Baffled", "Regretful", "Vulnerable", "Doubtful", "Disturbed", "Surprised", "Restless", "Perplexed"
    ],
    colorClass: "btn-check--mixed",
  }
  };

  let checkboxesHTML = '';

  // Generate checkboxes based on categories
  for (const [category, { emotions, colorClass }] of Object.entries(emotionCategories)) {
      // checkboxesHTML += `<h3>${category}</h3><div class="checkbox-group__category">`;
      emotions.forEach((emotion, index) => {
          const checkboxId = `${category.toLowerCase()}-checkbox-${index + 1}`;
          checkboxesHTML += `
              <div class="btn-check ${colorClass}">
                  <input type="checkbox" class="form-check-input"  id="${checkboxId}" autocomplete="off">
                  <label class="btn btn-primary" for="${checkboxId}">${emotion}</label>
              </div>
          `;
      });
      checkboxesHTML += '</div>';
  }

  // Log the generated HTML for debugging
  console.log(checkboxesHTML);

  checkboxGroup.innerHTML = checkboxesHTML;

  // Log the success message once the checkboxes are added
  console.log("Categorized checkboxes generated and added to the page.");
}
