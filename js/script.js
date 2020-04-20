const ACTIVE_CLASS = 'active';
const ERROR_CLASS = 'error';

Validator.register({
  name: 'required',
  fn: (value) => {
    return !!value;
  }
});

Validator.register({
  name: 'email',
  fn: (value) => {
    return !value ||  /(.+)@(.+){2,}\.(.+){2,}/.test(value);
  }
})

function init () {
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
  
  const rules = {};
  const messages = {
    name: 'Please fill in your name.',
    email: 'Provide valid email address.'
  };
  const Validate = () => new Validation(fields(), rules, messages);

  function fields() {
    const fields = {};

    for (const $field of $fields) {
      const $input = $getInput($field);

      if (!$input || !$input.name) {
        continue
      }

      if (checked.includes($input.type) && $input.checked) {
        fields[$input.name] = $input.value
      }

      if (!checked.includes($input.type)) {
        fields[$input.name] = $input.value
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

  function $getError($field) {
    return $field.querySelector(`.${ERROR_CLASS}`);
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

        if (errors[$input.name]) {
          $field.classList.add(ERROR_CLASS);
        } else {
          $field.classList.remove(ERROR_CLASS);
        }

        if ($error && errors[$input.name]) {
          $error.innerText = errors[$input.name];
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