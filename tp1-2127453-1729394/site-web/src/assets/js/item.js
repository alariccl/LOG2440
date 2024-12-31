function validateMessage(input) {
  if (input.value.length > 50) {
    input.setCustomValidity("Le message doit contenir moins de 50 caractères.");
  } else if (input.value.split(/\s+/).length < 5) {
    input.setCustomValidity("Le message doit contenir au moins 5 mots.");
  } else {
    input.setCustomValidity("");
  }
}