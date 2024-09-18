const form = document.getElementById('form');
const username_input = document.getElementById('username_input');
const email_input = document.getElementById('email_input');
const password_input = document.getElementById('password_input');
const repeat_password_input = document.getElementById('repeat_password_input');
const error_message = document.getElementById('error_message');

form.addEventListener('submit', async (e) => {
    let errors = [];
    let isSignup = repeat_password_input !== null;

    if (isSignup) {
        errors = getSignupFormErrors(username_input.value, email_input.value, password_input.value, repeat_password_input.value);
    }

    else {
        errors = getLoginFormErrors(username_input.value, password_input.value);
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join('\n');
    } 
    else {
        if (isSignup) {
            e.preventDefault();
            
            const username = username_input.value;
            const email = email_input.value;

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password: password_input.value, repeat_password: repeat_password_input.value })
                });

                const data = await response.json();
                
                if (response.ok) {
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 100);
                } else {
                    if (username!=='' && email!=='') {
                        error_message.innerText = data.error;
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                error_message.innerText = 'An unexpected error occurred.';

            }
        
        }
        
        
        else {
            e.preventDefault();
            
            const username = username_input.value;
            const password = password_input.value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = "/snake/index.html";
                    
                } else {
                    if (username!=='' && password!=='') {
                        error_message.innerText = data.error;
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                error_message.innerText = 'An unexpected error occurred.';

            }
        }
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