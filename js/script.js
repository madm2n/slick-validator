const ACTIVE_CLASS = 'active';
const ERROR_CLASS = 'error';
const ERROR_MESSAGE_CLASS = 'error-message';

Validator.register({
  name: 'required',
  fn: (value) => {
    return !!value;
  }
});

Validator.register({
  name: 'email',
  fn: (value) => {
    return !value || /(.+)@(.+){2,}\.(.+){2,}/.test(value);
  }
});

function init() {
  const $submit = document.getElementById('submit');
  const $form = document.getElementById('survey-form');
  const $fields = document.getElementsByClassName('field');

  const checked = ['checkbox', 'radio'];
  const applyValidator = {
    required: ($input) => {
      return $input.hasAttribute('required');
    },
    email: ($input) => {
      return $input.getAttribute('type') === 'email';
    }
  };

  const Validate = () => new Validation(fields(), rules, messages);
  const rules = {};
  const messages = {
    name: 'Please fill in your name.',
    email: 'Provide valid email address.',
    gender: 'Please select one.',
    message: 'We\'d like to hear from you.'
  };

  function fields() {
    const fields = {};

    for (const $field of $fields) {
      const $inputs = $getInputs($field);

      for (const $input of $inputs) {
        if (!$input || !$input.name) {
          continue
        }
  
        if (checked.includes($input.type) && $input.checked) {
          fields[$input.name] = $input.value
        } else {
          fields[$input.name] = '';
        }
  
        if (!checked.includes($input.type)) {
          fields[$input.name] = $input.value
        }
      }
    }

    return fields;
  }

  function toggle($input, $field) {
    return () => {
      if ($input.value) {
        $field.classList.add(ACTIVE_CLASS);
      } else {
        $field.classList.toggle(ACTIVE_CLASS);
      }
    }
  }

  function $getInput($field) {
    return $field.querySelector('input, textarea, select');
  }

  function $getInputs($field) {
    return $field.querySelectorAll('input, textarea, select');
  }

  function $getError($field) {
    return $field.querySelector(`.${ERROR_MESSAGE_CLASS}`);
  }

  for (const $field of $fields) {
    const $input = $getInput($field);

    if ($input) {
      const listener = toggle($input, $field);

      $input.addEventListener('focus', listener);
      $input.addEventListener('focusout', listener);

      if (typeof rules[$input.name] === 'undefined') {
        rules[$input.name] = [];

        for (const name in applyValidator) {
          if (applyValidator[name]($input)) {
            rules[$input.name].push(name);
          }
        }
      }

      if ($input.value) {
        listener();
      }
    }
  }

  $submit.addEventListener('click', (event) => {
    event.preventDefault();

    const validator = Validate();

    if (!validator.validate()) {
      const errors = validator.errors();

      for (const $field of $fields) {
        const $error = $getError($field);
        const $input = $getInput($field);
        const message = errors[$input.name];

        if (message) {
          $field.classList.add(ERROR_CLASS);
        } else {
          $field.classList.remove(ERROR_CLASS);
        }

        if ($error && message) {
          $error.innerText = message;
        } else if ($error) {
          $error.innerText = '';
        }
      }
    } else {
      $form.$submit();
    }
  });
}

init();