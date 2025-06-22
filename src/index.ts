interface User {
  email: string;
  password: string;
  phone: string;
}

type InputType = 'email' | 'phone' | 'password' | 'confirm-password' | 'telephone' | 'required'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ as RegExp
const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/ as RegExp
const pwdRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ as RegExp

const loginForm = document.getElementById('login-form')! as HTMLFormElement
const signupForm = document.getElementById('signup-form')! as HTMLFormElement
const loginLink = document.getElementById('login-link') as HTMLAnchorElement
const signupLink = document.getElementById('signup-link') as HTMLAnchorElement
const login = document.getElementById('login') as HTMLButtonElement
const signup = document.getElementById('signup') as HTMLButtonElement

const loginContainer = loginForm.parentElement as HTMLElement
const signupContainer = signupForm.parentElement as HTMLElement

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
  ] as User[],

  secondaryUsers: [
    {
      email: 'janedoe.manhattan@yahoo.com',
      password: 'j@aned031230',
      phone: '+1421424242',
    }
  ] as User[],

  async login(email: string, password: string): Promise<{ success: boolean, message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = this.users.find(user => user.email === email && user.password === password)
    
    if (user) {
      return { success: true, message: 'Login successful' }
    } 
    
    return { success: false, message: 'Invalid email or password' }
  },

  async signup(email: string, password: string, phone: string): Promise<{ success: boolean, message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (this.users.find(user => user.email === email)) {
      return { success: false, message: 'Email already registered' }
    }

    const newUser: User = { email, password, phone }
    this.users.push(newUser)
    this.secondaryUsers.push(newUser)

    return { success: true, message: 'Signup successful' }
  }
}

loginForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault()

  const emailInput = document.getElementById('email') as HTMLInputElement
  const pwdInput = document.getElementById('pwd') as HTMLInputElement

  const email = emailInput.value.trim()
  const pwd = pwdInput.value.trim()

  if (!emailInput || !pwdInput) {
    // window.alert('Email or password should not be empty')
    console.log('Email or password should not be empty')
  }
  
  hideErrorMessage(emailInput)
  hideErrorMessage(pwdInput)
  
  let isValid: boolean = true

  if (!validateInput(email, 'email').valid) {
    showErrorMessage(emailInput, validateInput(email, 'email').error!)
    isValid = false
  }

  if (!validateInput(pwd, 'password').valid) {
    showErrorMessage(pwdInput, validateInput(pwd, 'password').error!)
    isValid = false
  }

  if (isValid) {
    try {
      const response = await mockData.login(email, pwd)
      if (response.success) {
        loginForm.reset()
        window.location.href = '/src/demo.html'
      } else {
        showErrorMessage(emailInput, response.message!);
        showErrorMessage(pwdInput, response.message!);
      }
    } catch (error) {
      showErrorMessage(emailInput, 'An error occurred. Please try again.');
      showErrorMessage(pwdInput, 'An error occurred. Please try again.');
    }
  }
})

signupForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault()

  const emailInput = document.getElementById('signup-email') as HTMLInputElement
  const pwdInput = document.getElementById('signup-pwd') as HTMLInputElement
  const confirmPwdInput = document.getElementById('confirm-pwd') as HTMLInputElement
  const phoneInput = document.getElementById('phone') as HTMLInputElement

  const email = emailInput.value.trim()
  const pwd = pwdInput.value.trim()
  const confirmPwd = confirmPwdInput.value.trim()
  const phone = phoneInput.value.trim()

  hideErrorMessage(emailInput)
  hideErrorMessage(pwdInput)
  hideErrorMessage(confirmPwdInput)
  hideErrorMessage(phoneInput)

  if (!validateInput(email, 'email').valid) {
    showErrorMessage(emailInput, validateInput(email, 'email').error!)
  }

  if (!validateInput(pwd, 'password').valid) {
    showErrorMessage(pwdInput, validateInput(pwd, 'password').error!)
  }

  if (!validateInput(confirmPwd, 'confirm-password').valid) {
    showErrorMessage(confirmPwdInput, validateInput(confirmPwd, 'confirm-password').error!)
  }

  if (!validateInput(phone, 'phone').valid) {
    showErrorMessage(phoneInput, validateInput(phone, 'phone').error!)
  }

  let isSignupValid: boolean = true

  if (isSignupValid) {
    try {
      const response = await mockData.signup(email, pwd, phone);
      if (response.success) {
        signupForm.reset();
        switchForm('login')
      } else {
        showErrorMessage(emailInput, response.message!);
      }
    } catch (error) {
      showErrorMessage(emailInput, 'An error occurred. Please try again.');
    }
  }
})

signupLink.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault()
  switchForm('signup')
})

loginLink.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault()
  switchForm('login')
})

function validateInput(value: string, type: InputType, compareValue: string = ''): { valid: boolean, error?: string } {
  value = value.trim()

  switch (type) {
    case 'email':
      if (!value) {
        return { valid: false, error: 'Email is required'}
      } else if (!emailRegex.test(value)) {
        return { valid: false, error: 'Invalid email' }
      }
      return { valid: true }

    case 'phone':
      if (!value) {
        return { valid: false, error: 'Phone number is required' }
      } else if (!phoneRegex.test(value)) {
        return { valid: false, error: 'Invalid phone number' }
      }
      return { valid: true }

    case 'password':
      if (!value) {
        return { valid: false, error: 'Password is required' }
      } else if (!pwdRegex.test(value)) {
        return { valid: false, error: 'Incorrect password. Try again' }
      }
      return { valid: true }

    case 'confirm-password':
      if (!value) {
        return { valid: false, error: 'Confirm password is required' }
      }

      if (value !== compareValue) {
        return { valid: false, error: 'Password do not match' }
      }
      return { valid: true }

    case 'required':
      return value ? { valid: true } : { valid: false, error: 'This field is required' }

    default:
      return { valid: false, error: 'Unknown input type' }
  }
}

function show(element: HTMLElement): void {
  element.classList.add('form-active')
  element.classList.remove('form-inactive')
}

function hide(element: HTMLElement): void {
  element.classList.add('form-inactive')
  element.classList.remove('form-active')
}

function switchForm(form: 'login' | 'signup'): void {
  if (form === 'login') {
    show(loginContainer)
    hide(signupContainer)
  } else {
    show(signupContainer)
    hide(loginContainer)
  }
}

function showErrorMessage(input: HTMLInputElement, message: string): void {
  const container = input.parentElement as HTMLElement
  const errorMsg = container.querySelector('.error-msg') as HTMLSpanElement
  errorMsg.textContent = message
  input.classList.add('error-active')
}

function hideErrorMessage(input: HTMLInputElement): void {
  const container = input.parentElement as HTMLElement
  const errorMsg = container.querySelector('.error-msg') as HTMLSpanElement
  errorMsg.textContent = ''
  input.classList.remove('error-active')
}