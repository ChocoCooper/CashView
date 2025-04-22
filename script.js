// User Data with multiple accounts
const userData = {
    name: "Guest",
    email: "",
    accounts: [
        {
            type: "Savings",
            number: "XXXX-7890",
            balance: 700000.00,
            currency: "INR",
            active: true
        }
    ],
    crypto: {
        BTC: { balance: 0.0425, address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5" },
        ETH: { balance: 1.25, address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
        LTC: { balance: 5.6, address: "Lad3r7Y6XhT5Z28b8W8gH3gW1K2zQvN4V" },
        XRP: { balance: 1500, address: "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV" },
        USDT: { balance: 2500, address: "0x3C2B8BeE5fB6A7f6F3E6D83b7F6D1C5F5B6A7F6D" }
    },
    transactions: [
        {
            id: "T001",
            type: "credit",
            title: "Salary",
            description: "Monthly salary deposit",
            amount: 50000,
            date: "2025-04-01",
            category: "deposit"
        },
        {
            id: "T002",
            type: "debit",
            title: "Grocery",
            description: "Supermarket purchase",
            amount: -1500,
            date: "2025-04-02",
            category: "bill"
        }
    ]
};

// Crypto Data for Prices
const cryptoData = {
    BTC: { price: null, change: 2.5 },
    ETH: { price: null, change: -1.2 },
    LTC: { price: null, change: 0.8 },
    XRP: { price: null, change: 3.1 },
    USDT: { price: null, change: 0.0 }
};

// DOM Elements
const sidebar = document.getElementById('sidebar');
const header = document.getElementById('header');
const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');
const currentBalance = document.getElementById('current-balance');
const mainBalance = document.getElementById('main-balance');
const transactionsList = document.getElementById('transactions-list');
const fullTransactionsList = document.getElementById('full-transactions-list');
const cryptoWallet = document.getElementById('crypto-wallet');
const toast = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
let currentPage = 'get-started';

function navigateTo(page) {
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    document.getElementById(`${page}-page`).classList.add('active');
    const activeLink = document.getElementById(`${page}-link`);
    if (activeLink) activeLink.classList.add('active');

    // Hide header and sidebar on get-started and auth pages
    if (page === 'get-started' || page === 'auth') {
        header.style.display = 'none';
        sidebar.style.display = 'none';
    } else {
        header.style.display = 'flex';
        sidebar.style.display = 'block';
    }

    currentPage = page;
    sidebar.classList.remove('active');
    overlay.classList.remove('active');

    // Render page-specific content
    if (page === 'dashboard') {
        updateBalances();
        renderRecentTransactions();
    } else if (page === 'transactions') {
        renderFilteredTransactions();
    } else if (page === 'crypto') {
        renderCryptoWallet();
        fetchCryptoPrices();
    } else if (page === 'profile') {
        renderProfile();
    }
}

// Event Listeners for Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page === 'logout') {
            logout();
        } else {
            navigateTo(page);
        }
    });
});

// Sidebar Toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Authentication
let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedIn = false;

function registerUser(username, email, password) {
    if (users.some(u => u.email === email)) {
        showToast('Email already registered', 'error');
        return false;
    }
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    showToast('Registration successful! Please login.');
    return true;
}

function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        loggedIn = true;
        userData.name = user.username;
        userData.email = user.email;
        showToast('Login successful!');
        navigateTo('dashboard');
        return true;
    }
    showToast('Invalid email or password', 'error');
    return false;
}

function logout() {
    loggedIn = false;
    userData.name = "Guest";
    userData.email = "";
    navigateTo('get-started');
    showToast('Logged out successfully');
}

// Get Started Page
document.getElementById('get-started-login-btn').addEventListener('click', () => navigateTo('auth'));
document.getElementById('get-started-register-btn').addEventListener('click', () => {
    navigateTo('auth');
    switchAuthTab('register');
});

// Auth Page
const authTabs = document.querySelectorAll('.auth-tab');
const authTabContents = document.querySelectorAll('.auth-tab-content');

function switchAuthTab(tab) {
    authTabs.forEach(t => t.classList.remove('active'));
    authTabContents.forEach(c => c.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-tab`).classList.add('active');
}

authTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.getAttribute('data-tab')));
});

document.getElementById('switch-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    switchAuthTab('login');
});

document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    loginUser(email, password);
});

document.getElementById('register-btn').addEventListener('click', () => {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!username || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        showToast('Invalid email format', 'error');
        return;
    }
    if (registerUser(username, email, password)) {
        switchAuthTab('login');
    }
});

// Balance and Transactions
function updateBalances() {
    const activeAccount = userData.accounts.find(a => a.active);
    const balance = activeAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    currentBalance.textContent = balance;
    mainBalance.textContent = balance;
}

function renderRecentTransactions() {
    transactionsList.innerHTML = '';
    const recentTransactions = userData.transactions.slice(-3).reverse();
    if (recentTransactions.length === 0) {
        transactionsList.innerHTML = '<div class="empty-message">No recent transactions</div>';
        return;
    }
    recentTransactions.forEach(transaction => {
        const card = document.createElement('div');
        card.className = 'transaction-card';
        card.innerHTML = `
            <div class="transaction-card-header">
                <div class="transaction-card-title">${transaction.title}</div>
                <div class="transaction-card-amount ${transaction.type}">
                    ${transaction.type === 'credit' ? '+' : '-'}₹${Math.abs(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
            </div>
            <div class="transaction-card-details">${transaction.description}</div>
            <div class="transaction-card-footer">
                <div class="transaction-card-date">${transaction.date}</div>
            </div>
        `;
        transactionsList.appendChild(card);
    });
}

let cachedFilteredTransactions = [];

function renderFilteredTransactions(page = 1, perPage = 10) {
    fullTransactionsList.innerHTML = '';
    const dateRange = document.getElementById('date-range').value;
    const transactionType = document.getElementById('transaction-type').value;
    const amountRange = document.getElementById('amount-range').value;

    cachedFilteredTransactions = userData.transactions.filter(transaction => {
        const now = new Date();
        const transactionDate = new Date(transaction.date);
        let dateMatch = true;
        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const cutoff = new Date(now.setDate(now.getDate() - days));
            dateMatch = transactionDate >= cutoff;
        }

        const typeMatch = transactionType === 'all' || transaction.category === transactionType || 
                         (transactionType === 'credit' && transaction.type === 'credit') || 
                         (transactionType === 'debit' && transaction.type === 'debit');

        let amountMatch = true;
        if (amountRange !== 'all') {
            const amount = Math.abs(transaction.amount);
            if (amountRange === '1000') amountMatch = amount < 1000;
            else if (amountRange === '5000') amountMatch = amount >= 1000 && amount <= 5000;
            else if (amountRange === '5001') amountMatch = amount > 5000;
        }

        return dateMatch && typeMatch && amountMatch;
    }).reverse();

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedTransactions = cachedFilteredTransactions.slice(start, end);

    if (paginatedTransactions.length === 0) {
        fullTransactionsList.innerHTML = '<div class="empty-message">No transactions match your filters</div>';
        return;
    }

    paginatedTransactions.forEach(transaction => {
        const card = document.createElement('div');
        card.className = 'transaction-card';
        card.innerHTML = `
            <div class="transaction-card-header">
                <div class="transaction-card-title">${transaction.title}</div>
                <div class="transaction-card-amount ${transaction.type}">
                    ${transaction.type === 'credit' ? '+' : '-'}₹${Math.abs(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
            </div>
            <div class="transaction-card-details">${transaction.description}</div>
            <div class="transaction-card-footer">
                <div class="transaction-card-date">${transaction.date}</div>
            </div>
        `;
        fullTransactionsList.appendChild(card);
    });

    // Pagination Controls
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    pagination.style.display = 'flex';
    pagination.style.gap = '10px';
    pagination.style.marginTop = '20px';
    pagination.style.justifyContent = 'center';
    pagination.innerHTML = `
        <button class="btn btn-outline" onclick="renderFilteredTransactions(${page - 1})" ${page === 1 ? 'disabled' : ''}>Previous</button>
        <button class="btn btn-outline" onclick="renderFilteredTransactions(${page + 1})" ${end >= cachedFilteredTransactions.length ? 'disabled' : ''}>Next</button>
    `;
    fullTransactionsList.appendChild(pagination);
}

// Filter Event Listeners
document.getElementById('date-range').addEventListener('change', () => renderFilteredTransactions());
document.getElementById('transaction-type').addEventListener('change', () => renderFilteredTransactions());
document.getElementById('amount-range').addEventListener('change', () => renderFilteredTransactions());

// Deposit Functionality
document.getElementById('deposit-page-submit').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('deposit-page-amount').value);
    const method = document.getElementById('deposit-page-method').value;
    const remarks = document.getElementById('deposit-page-remarks').value.trim();

    if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount greater than 0', 'error');
        return;
    }
    if (amount > 1000000) {
        showToast('Deposit amount cannot exceed ₹10,00,000', 'error');
        return;
    }
    if (!method) {
        showToast('Please select a deposit method', 'error');
        return;
    }
    if (remarks.length > 100) {
        showToast('Remarks cannot exceed 100 characters', 'error');
        return;
    }

    const activeAccount = userData.accounts.find(a => a.active);
    activeAccount.balance += amount;
    userData.transactions.push({
        id: `T${Date.now()}`,
        type: 'credit',
        title: 'Deposit',
        description: `Deposited via ${method}${remarks ? `: ${remarks}` : ''}`,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        category: 'deposit'
    });

    updateBalances();
    renderRecentTransactions();
    showToast(`Successfully deposited ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
    document.getElementById('deposit-page-amount').value = '';
    document.getElementById('deposit-page-remarks').value = '';
});

// Withdraw Functionality
document.getElementById('withdraw-page-submit').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('withdraw-page-amount').value);
    const method = document.getElementById('withdraw-page-method').value;
    const remarks = document.getElementById('withdraw-page-remarks').value.trim();

    if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount greater than 0', 'error');
        return;
    }
    if (amount > 500000) {
        showToast('Withdrawal amount cannot exceed ₹5,00,000', 'error');
        return;
    }
    if (!method) {
        showToast('Please select a withdrawal method', 'error');
        return;
    }
    if (remarks.length > 100) {
        showToast('Remarks cannot exceed 100 characters', 'error');
        return;
    }

    const activeAccount = userData.accounts.find(a => a.active);
    if (amount > activeAccount.balance) {
        showToast('Insufficient balance', 'error');
        return;
    }

    activeAccount.balance -= amount;
    userData.transactions.push({
        id: `T${Date.now()}`,
        type: 'debit',
        title: 'Withdrawal',
        description: `Withdrawn via ${method}${remarks ? `: ${remarks}` : ''}`,
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        category: 'withdraw'
    });

    updateBalances();
    renderRecentTransactions();
    showToast(`Successfully withdrawn ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
    document.getElementById('withdraw-page-amount').value = '';
    document.getElementById('withdraw-page-remarks').value = '';
});

// Transfer Functionality
const transferTypeSelect = document.getElementById('transfer-page-type');
const accountGroup = document.getElementById('transfer-page-account-group');
const upiGroup = document.getElementById('transfer-page-upi-group');

transferTypeSelect.addEventListener('change', () => {
    if (transferTypeSelect.value === 'upi') {
        accountGroup.style.display = 'none';
        upiGroup.style.display = 'block';
    } else {
        accountGroup.style.display = 'block';
        upiGroup.style.display = 'none';
    }
});

document.getElementById('transfer-page-submit').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('transfer-page-amount').value);
    const transferType = document.getElementById('transfer-page-type').value;
    const accountNumber = document.getElementById('transfer-page-account-number').value.trim();
    const upiId = document.getElementById('transfer-page-upi').value.trim();
    const remarks = document.getElementById('transfer-page-remarks').value.trim();

    if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount greater than 0', 'error');
        return;
    }
    if (amount > 200000) {
        showToast('Transfer amount cannot exceed ₹2,00,000', 'error');
        return;
    }
    if (transferType === 'upi' && !upiId) {
        showToast('Please enter a valid UPI ID', 'error');
        return;
    }
    if (transferType !== 'upi' && !accountNumber) {
        showToast('Please enter a valid account number', 'error');
        return;
    }
    if (transferType !== 'upi' && !/^\d{10,16}$/.test(accountNumber)) {
        showToast('Account number must be 10-16 digits', 'error');
        return;
    }
    if (transferType === 'upi' && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
        showToast('Invalid UPI ID format', 'error');
        return;
    }
    if (remarks.length > 100) {
        showToast('Remarks cannot exceed 100 characters', 'error');
        return;
    }

    const activeAccount = userData.accounts.find(a => a.active);
    if (amount > activeAccount.balance) {
        showToast('Insufficient balance', 'error');
        return;
    }

    activeAccount.balance -= amount;
    userData.transactions.push({
        id: `T${Date.now()}`,
        type: 'debit',
        title: 'Money Transfer',
        description: `Transferred to ${transferType === 'upi' ? upiId : accountNumber}${remarks ? `: ${remarks}` : ''}`,
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        category: 'transfer'
    });

    updateBalances();
    renderRecentTransactions();
    showToast(`Successfully transferred ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
    document.getElementById('transfer-page-amount').value = '';
    document.getElementById('transfer-page-account-number').value = '';
    document.getElementById('transfer-page-upi').value = '';
    document.getElementById('transfer-page-remarks').value = '';
});

// Crypto Wallet
async function fetchCryptoPrices(maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,ripple,tether&vs_currencies=inr&include_24hr_change=true'
            );
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            cryptoData.BTC.price = data.bitcoin.inr;
            cryptoData.ETH.price = data.ethereum.inr;
            cryptoData.LTC.price = data.litecoin.inr;
            cryptoData.XRP.price = data.ripple.inr;
            cryptoData.USDT.price = data.tether.inr;
            cryptoData.BTC.change = data.bitcoin.inr_24h_change.toFixed(2);
            cryptoData.ETH.change = data.ethereum.inr_24h_change.toFixed(2);
            cryptoData.LTC.change = data.litecoin.inr_24h_change.toFixed(2);
            cryptoData.XRP.change = data.ripple.inr_24h_change.toFixed(2);
            cryptoData.USDT.change = data.tether.inr_24h_change.toFixed(2);
            renderCryptoWallet();
            return;
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt === maxRetries) {
                showToast('Failed to fetch crypto prices', 'error');
                renderCryptoWallet(); // Render with null prices
            }
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
    }
}

function renderCryptoWallet() {
    cryptoWallet.innerHTML = '';
    Object.keys(cryptoData).forEach(crypto => {
        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.innerHTML = `
            <div class="crypto-header">
                <div class="crypto-name">
                    <div class="${crypto.toLowerCase()}-icon crypto-icon">
                        <i class="fab fa-${crypto === 'BTC' ? 'bitcoin' : crypto === 'ETH' ? 'ethereum' : 'bitcoin'}"></i>
                    </div>
                    <span>${crypto}</span>
                </div>
                <div class="crypto-price">
                    ${cryptoData[crypto].price ? `₹${cryptoData[crypto].price.toLocaleString('en-IN')}` : 'Loading...'}
                </div>
            </div>
            <div class="crypto-change ${cryptoData[crypto].change >= 0 ? 'positive' : 'negative'}-change">
                ${cryptoData[crypto].change >= 0 ? '+' : ''}${cryptoData[crypto].change}%
            </div>
            <div class="crypto-balance">
                <div class="crypto-balance-label">Balance</div>
                <div class="crypto-balance-value">${userData.crypto[crypto].balance} ${crypto}</div>
            </div>
            <div class="crypto-actions">
                <button class="crypto-btn crypto-buy" data-crypto="${crypto}" data-action="buy">
                    <i class="fas fa-arrow-up"></i> Buy
                </button>
                <button class="crypto-btn crypto-sell" data-crypto="${crypto}" data-action="sell">
                    <i class="fas fa-arrow-down"></i> Sell
                </button>
            </div>
        `;
        cryptoWallet.appendChild(card);
    });
}

// Crypto Tabs
const cryptoTabs = document.querySelectorAll('.crypto-tab');
const cryptoTabContents = document.querySelectorAll('.crypto-tab-content');

cryptoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        cryptoTabs.forEach(t => t.classList.remove('active'));
        cryptoTabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`${tab.getAttribute('data-tab')}-tab`).classList.add('active');
    });
});

// Profile
function renderProfile() {
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('edit-name').value = userData.name;
    document.getElementById('edit-email').value = userData.email;
}

document.getElementById('edit-profile-btn').addEventListener('click', () => {
    document.getElementById('profile-edit-form').classList.add('active');
});

document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    document.getElementById('profile-edit-form').classList.remove('active');
});

document.getElementById('save-profile-btn').addEventListener('click', () => {
    const newName = document.getElementById('edit-name').value.trim();
    const newEmail = document.getElementById('edit-email').value.trim();
    if (!newName || !newEmail) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
        showToast('Invalid email format', 'error');
        return;
    }
    userData.name = newName;
    userData.email = newEmail;
    const userIndex = users.findIndex(u => u.email === userData.email);
    if (userIndex !== -1) {
        users[userIndex].username = newName;
        users[userIndex].email = newEmail;
        localStorage.setItem('users', JSON.stringify(users));
    }
    renderProfile();
    document.getElementById('profile-edit-form').classList.remove('active');
    showToast('Profile updated successfully');
});

// Toast Notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.classList.remove('toast-danger');
    if (type === 'error') {
        toast.classList.add('toast-danger');
    }
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Quick Actions
document.getElementById('deposit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('deposit');
});
document.getElementById('withdraw-btn').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('withdraw');
});
document.getElementById('quick-transfer-btn').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('transfer');
});
document.getElementById('crypto-btn').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('crypto');
});
document.getElementById('view-all-transactions').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('transactions');
});

// Initialize
navigateTo('get-started');
