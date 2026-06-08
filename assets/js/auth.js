import { apiCall } from "./api.js";


async function login(email, password) {
    return apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

async function register(name, email, password, password_confirmation) {
    return apiCall('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, password_confirmation })
    });
}

async function logout() {
    const response = await apiCall('/logout', {
        method: 'POST'
    });
    localStorage.removeItem('token'); 
    return response;
}

export const handleRegister = async (event) => {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const password_confirmation = document.getElementById('register-password-confirmation').value;
    try {
        await register(name, email, password, password_confirmation);
        alert('Registration successful!');
        window.location.href = 'login.html';
    } catch (error) {
        alert(`Registration failed: ${error.message}`);
    }
};


export const handleLogin = async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        const data = await login(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful!');
        const isAdmin = data.user.roles?.some(role => role.name === 'admin');
        if (isAdmin) {
            window.location.href = 'admin/product.html';
        }else {
            window.location.href = 'index.html';
        }
        // window.location.href = 'index.html';
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
}

export const handleLogout = async () => {
    try {
        await logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Logout successful!');
        window.location.href = 'login.html';
    } catch (error) {
        alert(`Logout failed: ${error.message}`);
    }
}

export const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.roles?.some(role => role.name === 'admin') || false;
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.isAdmin = isAdmin;
window.getUser = getUser;