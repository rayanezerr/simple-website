const form = document.getElementById('form');
const username_input = document.getElementById('username_input');
const email_input = document.getElementById('email_input');
const password_input = document.getElementById('password_input');
const repeat_password_input = document.getElementById('repeat_password_input');
const error_message = document.getElementById('error_message');

form.addEventListener('submit', (e) => {
    let errors = [];

    if (repeat_password_input) {
        errors = getSignupFormErrors(username_input.value, email_input.value, password_input.value, repeat_password_input.value);
    }

    else {
        errors = getLoginFormErrors(username_input.value, password_input.value);
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join(', ');
    }

});


function getSignupFormErrors(username, email, password, repeatPassword) {
    let errors = [];
    if (username==='' || username==null) {
        errors.push('Username is required');
        username_input.parentElement.classList.add('incorrect');
    }

    if (email==='' || email==null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }

    if (password==='' || password==null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }

    if (repeatPassword==='' || repeatPassword==null) {
        errors.push('Repeat Password is required');
        repeat_password_input.parentElement.classList.add('incorrect');
    }

    if (password!==repeatPassword) {
        errors.push('Passwords do not match');
        password_input.parentElement.classList.add('incorrect');
        repeat_password_input.parentElement.classList.add('incorrect');
    }
    return errors;
}

function getLoginFormErrors(username, password) {
    let errors = [];
    if (username==='' || username==null) {
        errors.push('Username is required');
        username_input.parentElement.classList.add('incorrect');
    }

    if (password==='' || password==null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }

    return errors;
}


const allInputs = [username_input, email_input, password_input, repeat_password_input];

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
            error_message.innerText = '';
        }
    });
});