"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const pwdRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const login = document.getElementById('login');
const signup = document.getElementById('signup');
const loginContainer = loginForm.parentElement;
const signupContainer = signupForm.parentElement;
const mockData = {
    users: [
        {
            email: 'johndoe271298@yahoo.com',
            password: 's@mplePassword',
            phone: '+1234567890'
        },
        {
            email: 'randomEmail129@gmail.com',
            password: 'buongiornoItalia',
            phone: '+44124214124'
        }
    ],
    secondaryUsers: [
        {
            email: 'janedoe.manhattan@yahoo.com',
            password: 'j@aned031230',
            phone: '+1421424242',
        }
    ],
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 1000));
            const user = this.users.find(user => user.email === email && user.password === password);
            if (user) {
                return { success: true, message: 'Login successful' };
            }
            return { success: false, message: 'Invalid email or password' };
        });
    },
    signup(email, password, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 1000));
            if (this.users.find(user => user.email === email)) {
                return { success: false, message: 'Email already registered' };
            }
            const newUser = { email, password, phone };
            this.users.push(newUser);
            this.secondaryUsers.push(newUser);
            return { success: true, message: 'Signup successful' };
        });
    }
};
loginForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const pwdInput = document.getElementById('pwd');
    const email = emailInput.value.trim();
    const pwd = pwdInput.value.trim();
    if (!emailInput || !pwdInput) {
        console.log('Email or password should not be empty');
    }
    hideErrorMessage(emailInput);
    hideErrorMessage(pwdInput);
    let isValid = true;
    if (!validateInput(email, 'email').valid) {
        showErrorMessage(emailInput, validateInput(email, 'email').error);
        isValid = false;
    }
    if (!validateInput(pwd, 'password').valid) {
        showErrorMessage(pwdInput, validateInput(pwd, 'password').error);
        isValid = false;
    }
    if (isValid) {
        try {
            const response = yield mockData.login(email, pwd);
            if (response.success) {
                loginForm.reset();
                window.location.href = '/src/demo.html';
            }
            else {
                showErrorMessage(emailInput, response.message);
                showErrorMessage(pwdInput, response.message);
            }
        }
        catch (error) {
            showErrorMessage(emailInput, 'An error occurred. Please try again.');
            showErrorMessage(pwdInput, 'An error occurred. Please try again.');
        }
    }
}));
signupForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const emailInput = document.getElementById('signup-email');
    const pwdInput = document.getElementById('signup-pwd');
    const confirmPwdInput = document.getElementById('confirm-pwd');
    const phoneInput = document.getElementById('phone');
    const email = emailInput.value.trim();
    const pwd = pwdInput.value.trim();
    const confirmPwd = confirmPwdInput.value.trim();
    const phone = phoneInput.value.trim();
    hideErrorMessage(emailInput);
    hideErrorMessage(pwdInput);
    hideErrorMessage(confirmPwdInput);
    hideErrorMessage(phoneInput);
    if (!validateInput(email, 'email').valid) {
        showErrorMessage(emailInput, validateInput(email, 'email').error);
    }
    if (!validateInput(pwd, 'password').valid) {
        showErrorMessage(pwdInput, validateInput(pwd, 'password').error);
    }
    if (!validateInput(confirmPwd, 'confirm-password').valid) {
        showErrorMessage(confirmPwdInput, validateInput(confirmPwd, 'confirm-password').error);
    }
    if (!validateInput(phone, 'phone').valid) {
        showErrorMessage(phoneInput, validateInput(phone, 'phone').error);
    }
    let isSignupValid = true;
    if (isSignupValid) {
        try {
            const response = yield mockData.signup(email, pwd, phone);
            if (response.success) {
                signupForm.reset();
                switchForm('login');
            }
            else {
                showErrorMessage(emailInput, response.message);
            }
        }
        catch (error) {
            showErrorMessage(emailInput, 'An error occurred. Please try again.');
        }
    }
}));
signupLink.addEventListener('click', (event) => {
    event.preventDefault();
    switchForm('signup');
});
loginLink.addEventListener('click', (event) => {
    event.preventDefault();
    switchForm('login');
});
function validateInput(value, type, compareValue = '') {
    value = value.trim();
    switch (type) {
        case 'email':
            if (!value) {
                return { valid: false, error: 'Email is required' };
            }
            else if (!emailRegex.test(value)) {
                return { valid: false, error: 'Invalid email' };
            }
            return { valid: true };
        case 'phone':
            if (!value) {
                return { valid: false, error: 'Phone number is required' };
            }
            else if (!phoneRegex.test(value)) {
                return { valid: false, error: 'Invalid phone number' };
            }
            return { valid: true };
        case 'password':
            if (!value) {
                return { valid: false, error: 'Password is required' };
            }
            else if (!pwdRegex.test(value)) {
                return { valid: false, error: 'Incorrect password. Try again' };
            }
            return { valid: true };
        case 'confirm-password':
            if (!value) {
                return { valid: false, error: 'Confirm password is required' };
            }
            if (value !== compareValue) {
                return { valid: false, error: 'Password do not match' };
            }
            return { valid: true };
        case 'required':
            return value ? { valid: true } : { valid: false, error: 'This field is required' };
        default:
            return { valid: false, error: 'Unknown input type' };
    }
}
function show(element) {
    element.classList.add('form-active');
    element.classList.remove('form-inactive');
}
function hide(element) {
    element.classList.add('form-inactive');
    element.classList.remove('form-active');
}
function switchForm(form) {
    if (form === 'login') {
        show(loginContainer);
        hide(signupContainer);
    }
    else {
        show(signupContainer);
        hide(loginContainer);
    }
}
function showErrorMessage(input, message) {
    const container = input.parentElement;
    const errorMsg = container.querySelector('.error-msg');
    errorMsg.textContent = message;
    input.classList.add('error-active');
}
function hideErrorMessage(input) {
    const container = input.parentElement;
    const errorMsg = container.querySelector('.error-msg');
    errorMsg.textContent = '';
    input.classList.remove('error-active');
}
//# sourceMappingURL=index.js.map