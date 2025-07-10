document.addEventListener('DOMContentLoaded', () => {
    // Update cart count
    updateCartCount();

    // Handle tab switching
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const switchFormLinks = document.querySelectorAll('.switch-form');

    // Check if user is already logged in
    checkLoginStatus();

    // Tab click event
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Switch form links
    switchFormLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetForm = link.getAttribute('data-form');
            
            // Update active tab
            authTabs.forEach(t => {
                t.classList.remove('active');
                if (t.getAttribute('data-tab') === targetForm) {
                    t.classList.add('active');
                }
            });
            
            // Show target form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Validate form
            if (!email || !password) {
                showError(loginForm, 'Vui lòng nhập đầy đủ thông tin');
                return;
            }
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                showError(loginForm, 'Email hoặc mật khẩu không đúng');
                return;
            }
            
            // Login successful
            loginUser(user, rememberMe);
        });
    }

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validate form
            if (!name || !email || !password || !confirmPassword) {
                showError(registerForm, 'Vui lòng nhập đầy đủ thông tin');
                return;
            }
            
            if (password !== confirmPassword) {
                showError(registerForm, 'Mật khẩu xác nhận không khớp');
                return;
            }
            
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                showError(registerForm, 'Email đã được sử dụng');
                return;
            }
            
            // Add new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success message
            showSuccess(registerForm, 'Đăng ký thành công! Vui lòng đăng nhập.');
            
            // Clear form
            registerForm.reset();
            
            // Switch to login form after a delay
            setTimeout(() => {
                document.querySelector('.auth-tab[data-tab="login"]').click();
            }, 2000);
        });
    }

    // Site title click event
    document.getElementById('siteTitle').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Cart button click event
    document.getElementById('btnViewCart').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'cart.html';
    });
});

// Show error message
function showError(form, message) {
    // Remove any existing error messages
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insert after the submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.parentNode.insertBefore(errorDiv, submitBtn.nextSibling);
    
    // Show error message
    setTimeout(() => {
        errorDiv.classList.add('show');
    }, 10);
    
    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 3000);
}

// Show success message
function showSuccess(form, message) {
    // Remove any existing success messages
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Insert at the top of the form
    form.insertBefore(successDiv, form.firstChild);
    
    // Show success message
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 10);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 3000);
}

// Login user
function loginUser(user, rememberMe) {
    // Store user session
    const session = {
        userId: user.id,
        name: user.name,
        email: user.email,
        loggedInAt: new Date().toISOString(),
        rememberMe
    };
    
    localStorage.setItem('userSession', JSON.stringify(session));
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Check login status
function checkLoginStatus() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    
    if (session) {
        // User is logged in, redirect to home page
        window.location.href = 'index.html';
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}