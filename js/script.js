const ACTIVE_CLASS = 'active';

function init () {
  const $form = document.getElementById('survey-form');
  const $fields = document.getElementsByClassName('field');

  function toggle($input, $field) {
    return () => {
      if ($input.value) {
        $field.classList.add(ACTIVE_CLASS);
      } else {
        $field.classList.toggle(ACTIVE_CLASS);
      }
    }
  }

  for (const $field of $fields) {
    const $input = $field.querySelector('input, textarea, select');

    if ($input) {
      const listener = toggle($input, $field);

      $input.addEventListener('focus', listener);
      $input.addEventListener('focusout', listener);
  
      if ($input.value) {
        listener();
      }
    }
  }

  $form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Submitted');
  });
}

init();