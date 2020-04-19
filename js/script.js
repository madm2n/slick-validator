function init () {
  const $form = document.getElementById('survey-form');

  $form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Submitted');
  });
}

init();