// Get common elements
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const api = `http://localhost:8080/api/auth`
// Password toggle functionality
function setupPasswordToggle(passwordInputId, toggleButtonId, eyeIconId) {
    const passwordInput = document.getElementById(passwordInputId);
    const toggleButton = document.getElementById(toggleButtonId);
    const eyeIcon = document.getElementById(eyeIconId);

    if (!passwordInput || !toggleButton || !eyeIcon) return;

    toggleButton.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'password') {
            eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        } else {
            eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
        }
    });
}

// Setup password toggles for login page
if (document.getElementById('loginForm')) {
    setupPasswordToggle('loginPassword', 'loginTogglePassword', 'loginEyeIcon');
}

// Setup password toggles for signup page
if (document.getElementById('signupForm')) {
    setupPasswordToggle('signupPassword', 'signupTogglePassword', 'signupEyeIcon');
    setupPasswordToggle('confirmPassword', 'confirmTogglePassword', 'confirmEyeIcon');
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        let body

        if (email.includes('@')) {
            body = JSON.stringify({
                email,
                password
            })
        } else {
            body = JSON.stringify({
                username: email,
                password
            })
        }
        // Add your login logic here
        console.log('Login attempt:', { email, password });
        const response = await fetch(`${api}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        if (response.status === 404) {
            showNotification('Login failed, user not found');
        }
        if (!response.ok) {
            showNotification('an error occured');
        }
        const res = await response.json()
        localStorage.setItem('jwt', res.jwt_token)
        showNotification('Success! You have been signed in.');
        window.location.href = "/index.html"
        // Optional: Clear form
        setTimeout(() => {
            loginForm.reset();
        }, 1000);
    });
}

// Handle signup form submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', true);
            return;
        }

        // Add your signup logic here
        console.log('Signup attempt:', { name, email, password });

        showNotification('Account created successfully! Welcome to ByteCamp.');

        // Optional: Clear form and redirect to login
        setTimeout(() => {
            signupForm.reset();
            // window.location.href = 'login.html';
        }, 2000);
    });
}

// Social authentication buttons
const googleBtn = document.getElementById('googleBtn');
const githubBtn = document.getElementById('githubBtn');

if (googleBtn) {
    googleBtn.addEventListener('click', function () {
        showNotification('Authenticating with Google...');
        // Add Google OAuth logic here
    });
}

if (githubBtn) {
    githubBtn.addEventListener('click', function () {
        showNotification('Authenticating with GitHub...');
        // Add GitHub OAuth logic here
    });
}

// Notification function
function showNotification(message, isError = false) {
    notificationText.textContent = message;

    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}