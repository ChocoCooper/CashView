const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const currentBalance = document.getElementById('current-balance');
const mainBalance = document.getElementById('main-balance');
const balanceSpinner = document.getElementById('balance-spinner');
const refreshBalance = document.getElementById('refresh-balance');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const fullTransactionsList = document.getElementById('full-transactions-list');
const transactionsList = document.getElementById('transactions-list');
const viewAllTransactions = document.getElementById('view-all-transactions');
const getStartedLoginBtn = document.getElementById('get-started-login-btn');
const getStartedRegisterBtn = document.getElementById('get-started-register-btn');
const authTabs = document.querySelectorAll('.auth-tab');
const authTabContents = document.querySelectorAll('.auth-tab-content');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const switchToLogin = document.getElementById('switch-to-login');
const depositBtn = document.getElementById('deposit-btn');
const withdrawBtn = document.getElementById('withdraw-btn');
const quickTransferBtn = document.getElementById('quick-transfer-btn');
const cryptoBtn = document.getElementById('crypto-btn');
const depositPageSubmit = document.getElementById('deposit-page-submit');
const withdrawPageSubmit = document.getElementById('withdraw-page-submit');
const transferPageSubmit = document.getElementById('transfer-page-submit');
const transferPageType = document.getElementById('transfer-page-type');
const transferPageAccountGroup = document.getElementById('transfer-page-account-group');
const transferPageUpiGroup = document.getElementById('transfer-page-upi-group');
const cryptoTabs = document.querySelectorAll('.crypto-tab');
const cryptoTabContents = document.querySelectorAll('.crypto-tab-content');
const cryptoWallet = document.getElementById('crypto-wallet');
const buyCryptoBtn = document.getElementById('buy-crypto-btn');
const sellCryptoBtn = document.getElementById('sell-crypto-btn');
const depositCryptoBtn = document.getElementById('deposit-crypto-btn');
const withdrawCryptoBtn = document.getElementById('withdraw-crypto-btn');
const buyCryptoAmount = document.getElementById('buy-crypto-amount');
const sellCryptoAmount = document.getElementById('sell-crypto-amount');
const depositCryptoAmount = document.getElementById('deposit-crypto-amount');
const withdrawCryptoAmount = document.getElementById('withdraw-crypto-amount');
const buyCryptoSelect = document.getElementById('buy-crypto-select');
const sellCryptoSelect = document.getElementById('sell-crypto-select');
const depositCryptoSelect = document.getElementById('deposit-crypto-select');
const withdrawCryptoSelect = document.getElementById('withdraw-crypto-select');
const buyCryptoConversion = document.getElementById('buy-crypto-conversion');
const sellCryptoConversion = document.getElementById('sell-crypto-conversion');
const withdrawCryptoConversion = document.getElementById('withdraw-crypto-conversion');
const withdrawCryptoAddress = document.getElementById('withdraw-crypto-address');
const withdrawMaxBtn = document.getElementById('withdraw-max-btn');
const withdrawNetworkFee = document.getElementById('withdraw-network-fee');
const copyDepositAddress = document.getElementById('copy-deposit-address');
const depositCryptoAddress = document.getElementById('deposit-crypto-address');
const depositQrCode = document.getElementById('deposit-qr-code');
const depositMinAmount = document.getElementById('deposit-min-amount');
const buyCryptoSpinner = document.getElementById('buy-crypto-spinner');
const sellCryptoSpinner = document.getElementById('sell-crypto-spinner');
const depositCryptoSpinner = document.getElementById('deposit-crypto-spinner');
const withdrawCryptoSpinner = document.getElementById('withdraw-crypto-spinner');
const cryptoConfirmModal = document.getElementById('crypto-confirm-modal');
const closeCryptoConfirm = document.getElementById('close-crypto-confirm');
const cancelCryptoConfirm = document.getElementById('cancel-crypto-confirm');
const confirmCryptoTransaction = document.getElementById('confirm-crypto-transaction');
const cryptoConfirmDetails = document.getElementById('crypto-confirm-details');
const crypto2faCode = document.getElementById('crypto-2fa-code');
const cryptoConfirmSpinner = document.getElementById('crypto-confirm-spinner');
const toastNotification = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const editProfileBtn = document.getElementById('edit-profile-btn');
const profileEditForm = document.getElementById('profile-edit-form');
const saveProfileBtn = document.getElementById('save-profile-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const editName = document.getElementById('edit-name');
const editEmail = document.getElementById('edit-email');
const dateRange = document.getElementById('date-range');
const transactionType = document.getElementById('transaction-type');
const amountRange = document.getElementById('amount-range');

let userData = {
    balance: 700000,
    cryptoWallet: {
        BTC: { balance: 0.0425 },
        ETH: { balance: 1.25 },
        LTC: { balance: 10 },
        XRP: { balance: 500 },
        USDT: { balance: 1000 },
        BNB: { balance: 5 }
    },
    transactions: [
        { type: 'credit', amount: 50000, remarks: 'Salary', date: '2025-04-20T10:30:00Z' },
        { type: 'debit', amount: 15000, remarks: 'Shopping', date: '2025-04-19T14:45:00Z' },
        { type: 'transfer', amount: 20000, remarks: 'To Friend', date: '2025-04-18T09:15:00Z' }
    ],
    profile: {
        username: 'John Doe',
        email: 'john.doe@example.com'
    }
};

let cryptoPrices = {
    BTC: { price: 5000000, change: 2.5 },
    ETH: { price: 200000, change: -1.8 },
    LTC: { price: 10000, change: 0.7 },
    XRP: { price: 50, change: 3.2 },
    USDT: { price: 83, change: 0.1 },
    BNB: { price: 40000, change: -0.9 }
};

let filteredTransactions = [...userData.transactions];
let pendingCryptoTransaction = null;

function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
    if (pageId === 'crypto') {
        renderCryptoWallet();
        updateCryptoConversions();
    }
    if (pageId === 'transactions') {
        renderFullTransactions();
    }
    if (window.innerWidth <= 1200) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function updateBalance() {
    currentBalance.textContent = userData.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    mainBalance.textContent = userData.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    if (isError) {
        toastNotification.classList.add('toast-danger');
    } else {
        toastNotification.classList.remove('toast-danger');
    }
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

function renderTransactions() {
    const sortedTransactions = [...userData.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentTransactions = sortedTransactions.slice(0, 3);
    if (recentTransactions.length === 0) {
        transactionsList.innerHTML = '<div class="empty-message">No recent transactions.</div>';
        return;
    }
    transactionsList.innerHTML = recentTransactions.map(tx => {
        let amountDisplay = '';
        if (tx.type === 'crypto' && tx.cryptoAmount && tx.cryptoCoin) {
            amountDisplay = `${tx.cryptoAmount.toFixed(8)} ${tx.cryptoCoin} - ₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        } else {
            amountDisplay = `₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        }
        return `
            <div class="transaction-card">
                <div class="transaction-card-header">
                    <div class="transaction-card-title">${tx.remarks || 'Transaction'}</div>
                    <div class="transaction-card-amount ${tx.type === 'credit' || tx.type === 'crypto' ? 'credit' : 'debit'}">
                        ${tx.type === 'credit' ? '+' : '-'} ${amountDisplay}
                    </div>
                </div>
                <div class="transaction-card-footer">
                    <div class="transaction-card-date">${new Date(tx.date).toLocaleString()}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderFullTransactions() {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortedTransactions.length === 0) {
        fullTransactionsList.innerHTML = '<div class="empty-message">No transactions match your filters.</div>';
        return;
    }
    fullTransactionsList.innerHTML = sortedTransactions.map(tx => {
        let amountDisplay = '';
        if (tx.type === 'crypto' && tx.cryptoAmount && tx.cryptoCoin) {
            amountDisplay = `${tx.cryptoAmount.toFixed(8)} ${tx.cryptoCoin} - ₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        } else {
            amountDisplay = `₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        }
        return `
            <div class="transaction-card">
                <div class="transaction-card-header">
                    <div class="transaction-card-title">${tx.remarks || 'Transaction'}</div>
                    <div class="transaction-card-amount ${tx.type === 'credit' || tx.type === 'crypto' ? 'credit' : 'debit'}">
                        ${tx.type === 'credit' ? '+' : '-'} ${amountDisplay}
                    </div>
                </div>
                <div class="transaction-card-details">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                <div class="transaction-card-footer">
                    <div class="transaction-card-date">${new Date(tx.date).toLocaleString()}</div>
                </div>
            </div>
        `;
    }).join('');
}

function filterTransactions() {
    const dateRangeValue = dateRange.value;
    const typeValue = transactionType.value;
    const amountRangeValue = amountRange.value;

    filteredTransactions = userData.transactions.filter(tx => {
        const txDate = new Date(tx.date);
        const now = new Date();
        let dateMatch = true;
        if (dateRangeValue !== 'all') {
            const days = parseInt(dateRangeValue);
            dateMatch = txDate >= new Date(now.setDate(now.getDate() - days));
        }

        const typeMatch = typeValue === 'all' || tx.type === typeValue;

        let amountMatch = true;
        if (amountRangeValue !== 'all') {
            if (amountRangeValue === '1000') amountMatch = tx.amount < 1000;
            else if (amountRangeValue === '5000') amountMatch = tx.amount >= 1000 && tx.amount <= 5000;
            else if (amountRangeValue === '5001') amountMatch = tx.amount > 5000;
        }

        return dateMatch && typeMatch && amountMatch;
    });

    renderFullTransactions();
}

async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=bitcoin,ethereum,litecoin,ripple,tether,binancecoin');
        const data = await response.json();
        cryptoPrices = {
            BTC: { price: data.find(c => c.id === 'bitcoin').current_price, change: data.find(c => c.id === 'bitcoin').price_change_percentage_24h },
            ETH: { price: data.find(c => c.id === 'ethereum').current_price, change: data.find(c => c.id === 'ethereum').price_change_percentage_24h },
            LTC: { price: data.find(c => c.id === 'litecoin').current_price, change: data.find(c => c.id === 'litecoin').price_change_percentage_24h },
            XRP: { price: data.find(c => c.id === 'ripple').current_price, change: data.find(c => c.id === 'ripple').price_change_percentage_24h },
            USDT: { price: data.find(c => c.id === 'tether').current_price, change: data.find(c => c.id === 'tether').price_change_percentage_24h },
            BNB: { price: data.find(c => c.id === 'binancecoin').current_price, change: data.find(c => c.id === 'binancecoin').price_change_percentage_24h }
        };
        renderCryptoWallet();
        updateCryptoConversions();
    } catch (error) {
        showToast('Failed to fetch crypto prices.', true);
    }
}

function renderCryptoWallet() {
    cryptoWallet.innerHTML = Object.entries(userData.cryptoWallet).map(([coin, data]) => {
        const price = cryptoPrices[coin]?.price || 0;
        const change = cryptoPrices[coin]?.change || 0;
        const value = (data.balance * price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return `
            <div class="crypto-card">
                <div class="crypto-header">
                    <div class="crypto-name">
                        <div class="crypto-icon ${coin.toLowerCase()}-icon">
                            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/${coin === 'BTC' ? 1 : coin === 'ETH' ? 1027 : coin === 'LTC' ? 2 : coin === 'XRP' ? 52 : coin === 'USDT' ? 825 : 1839}.png" alt="${coin}">
                        </div>
                        <span>${coin}</span>
                    </div>
                    <div class="crypto-price">₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="crypto-change ${change >= 0 ? 'positive-change' : 'negative-change'}">
                    ${change >= 0 ? '+' : ''}${change.toFixed(2)}% (24h)
                </div>
                <div class="crypto-balance">
                    <div class="crypto-balance-label">Balance</div>
                    <div class="crypto-balance-value">${data.balance.toFixed(8)} ${coin}</div>
                </div>
                <div class="crypto-balance">
                    <div class="crypto-balance-label">Value</div>
                    <div class="crypto-balance-value">₹${value}</div>
                </div>
                <div class="crypto-actions">
                    <button class="crypto-btn crypto-buy" data-coin="${coin}" data-action="buy">Buy</button>
                    <button class="crypto-btn crypto-sell" data-coin="${coin}" data-action="sell">Sell</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateCryptoConversions() {
    const buyCoin = buyCryptoSelect.value;
    const sellCoin = sellCryptoSelect.value;
    const withdrawCoin = withdrawCryptoSelect.value;
    const buyAmount = parseFloat(buyCryptoAmount.value) || 0;
    const sellAmount = parseFloat(sellCryptoAmount.value) || 0;
    const withdrawAmount = parseFloat(withdrawCryptoAmount.value) || 0;

    const buyPrice = cryptoPrices[buyCoin]?.price || 0;
    const sellPrice = cryptoPrices[sellCoin]?.price || 0;
    const withdrawPrice = cryptoPrices[withdrawCoin]?.price || 0;

    buyCryptoConversion.textContent = `≈ ${(buyAmount / buyPrice).toFixed(8)} ${buyCoin}`;
    sellCryptoConversion.textContent = `≈ ₹${(sellAmount * sellPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    withdrawCryptoConversion.textContent = `Available: ${userData.cryptoWallet[withdrawCoin]?.balance.toFixed(8) || 0} ${withdrawCoin}`;
}

function handleAuth() {
    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;
    const registerUsername = document.getElementById('register-username').value;
    const registerEmail = document.getElementById('register-email').value;
    const registerPassword = document.getElementById('register-password').value;
    const registerConfirmPassword = document.getElementById('register-confirm-password').value;

    if (loginEmail && loginPassword) {
        localStorage.setItem('auth', JSON.stringify({ email: loginEmail, password: loginPassword }));
        userData.profile.email = loginEmail;
        userData.profile.username = loginEmail.split('@')[0];
        showPage('dashboard');
        document.body.classList.remove('hide-sidebar-header');
        updateBalance();
        renderTransactions();
        profileName.textContent = userData.profile.username;
        profileEmail.textContent = userData.profile.email;
        showToast('Login successful!');
    } else if (registerUsername && registerEmail && registerPassword && registerPassword === registerConfirmPassword) {
        localStorage.setItem('auth', JSON.stringify({ email: registerEmail, password: registerPassword }));
        userData.profile.email = registerEmail;
        userData.profile.username = registerUsername;
        showPage('dashboard');
        document.body.classList.remove('hide-sidebar-header');
        updateBalance();
        renderTransactions();
        profileName.textContent = userData.profile.username;
        profileEmail.textContent = userData.profile.email;
        showToast('Registration successful!');
    } else {
        showToast('Please fill all fields correctly.', true);
    }
}

function handleCryptoBuy(coin, amount) {
    const price = cryptoPrices[coin]?.price || 0;
    const fiatCost = amount * price;
    if (fiatCost > userData.balance) {
        showToast('Insufficient fiat balance.', true);
        return false;
    }
    userData.balance -= fiatCost;
    userData.cryptoWallet[coin].balance += amount;
    userData.transactions.push({
        type: 'crypto',
        amount: fiatCost,
        cryptoAmount: amount,
        cryptoCoin: coin,
        remarks: `Bought ${amount.toFixed(8)} ${coin}`,
        date: new Date().toISOString()
    });
    updateBalance();
    renderCryptoWallet();
    renderTransactions();
    showToast(`Successfully bought ${amount.toFixed(8)} ${coin}!`);
    return true;
}

function handleCryptoSell(coin, amount) {
    const price = cryptoPrices[coin]?.price || 0;
    if (amount > userData.cryptoWallet[coin].balance) {
        showToast('Insufficient crypto balance.', true);
        return false;
    }
    const fiatGain = amount * price;
    userData.cryptoWallet[coin].balance -= amount;
    userData.balance += fiatGain;
    userData.transactions.push({
        type: 'crypto',
        amount: fiatGain,
        cryptoAmount: amount,
        cryptoCoin: coin,
        remarks: `Sold ${amount.toFixed(8)} ${coin}`,
        date: new Date().toISOString()
    });
    updateBalance();
    renderCryptoWallet();
    renderTransactions();
    showToast(`Successfully sold ${amount.toFixed(8)} ${coin}!`);
    return true;
}

function handleCryptoDeposit(coin, amount) {
    userData.cryptoWallet[coin].balance += amount;
    userData.transactions.push({
        type: 'crypto',
        amount: amount * (cryptoPrices[coin]?.price || 0),
        cryptoAmount: amount,
        cryptoCoin: coin,
        remarks: `Deposited ${amount.toFixed(8)} ${coin}`,
        date: new Date().toISOString()
    });
    renderCryptoWallet();
    renderTransactions();
    showToast(`Successfully deposited ${amount.toFixed(8)} ${coin}!`);
    return true;
}

function handleCryptoWithdraw(coin, amount, address) {
    const networkFee = 0.0005; // Example fee in coin's unit
    const totalAmount = amount + networkFee;
    if (totalAmount > userData.cryptoWallet[coin].balance) {
        showToast('Insufficient balance for withdrawal and fee.', true);
        return false;
    }
    userData.cryptoWallet[coin].balance -= totalAmount;
    userData.transactions.push({
        type: 'crypto',
        amount: amount * (cryptoPrices[coin]?.price || 0),
        cryptoAmount: amount,
        cryptoCoin: coin,
        remarks: `Withdrew ${amount.toFixed(8)} ${coin} to ${address.slice(0, 6)}...`,
        date: new Date().toISOString()
    });
    renderCryptoWallet();
    renderTransactions();
    showToast(`Successfully withdrew ${amount.toFixed(8)} ${coin}!`);
    return true;
}

function showCryptoConfirmModal(type, coin, amount, address = '') {
    pendingCryptoTransaction = { type, coin, amount, address };
    cryptoConfirmDetails.innerHTML = `
        <p><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
        <p><strong>Cryptocurrency:</strong> ${coin}</p>
        <p><strong>Amount:</strong> ${amount.toFixed(8)} ${coin}</p>
        ${type === 'buy' ? `<p><strong>Fiat Cost:</strong> ₹${(amount * (cryptoPrices[coin]?.price || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>` : ''}
        ${type === 'sell' ? `<p><strong>Fiat Gain:</strong> ₹${(amount * (cryptoPrices[coin]?.price || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>` : ''}
        ${type === 'withdraw' ? `<p><strong>Address:</strong> ${address}</p><p><strong>Network Fee:</strong> 0.0005 ${coin}</p>` : ''}
    `;
    cryptoConfirmModal.classList.add('active');
}

function validateCryptoAddress(address, coin) {
    const patterns = {
        BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
        ETH: /^0x[a-fA-F0-9]{40}$/,
        LTC: /^[LM][a-km-zA-HJ-NP-Z1-9]{26,34}$/,
        XRP: /^r[0-9a-zA-Z]{24,34}$/,
        USDT: /^0x[a-fA-F0-9]{40}$/,
        BNB: /^0x[a-fA-F0-9]{40}$/
    };
    return patterns[coin]?.test(address) || false;
}

// Event Listeners
document.addEventListener('click', (e) => {
    if (e.target === menuToggle || e.target === closeSidebar || e.target === overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if (e.target.closest('.nav-link')) {
        e.preventDefault();
        const page = e.target.closest('.nav-link').dataset.page;
        if (page === 'logout') {
            localStorage.removeItem('auth');
            document.body.classList.add('hide-sidebar-header');
            showPage('get-started');
        } else {
            showPage(page);
        }
    }

    if (e.target === getStartedLoginBtn) {
        showPage('auth');
        authTabs.forEach(tab => tab.classList.remove('active'));
        authTabContents.forEach(content => content.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
        document.getElementById('login-tab').classList.add('active');
    }

    if (e.target === getStartedRegisterBtn) {
        showPage('auth');
        authTabs.forEach(tab => tab.classList.remove('active'));
        authTabContents.forEach(content => content.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="register"]').classList.add('active');
        document.getElementById('register-tab').classList.add('active');
    }

    if (e.target.closest('.auth-tab')) {
        const tab = e.target.dataset.tab;
        authTabs.forEach(t => t.classList.remove('active'));
        authTabContents.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
    }

    if (e.target === switchToLogin) {
        authTabs.forEach(tab => tab.classList.remove('active'));
        authTabContents.forEach(content => content.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
        document.getElementById('login-tab').classList.add('active');
    }

    if (e.target === loginBtn || e.target === registerBtn) {
        handleAuth();
    }

    if (e.target === depositBtn) {
        e.preventDefault();
        showPage('deposit');
    }

    if (e.target === withdrawBtn) {
        e.preventDefault();
        showPage('withdraw');
    }

    if (e.target === quickTransferBtn) {
        e.preventDefault();
        showPage('transfer');
    }

    if (e.target === cryptoBtn) {
        e.preventDefault();
        showPage('crypto');
    }

    if (e.target === viewAllTransactions) {
        e.preventDefault();
        showPage('transactions');
    }

    if (e.target.closest('.crypto-tab')) {
        const tab = e.target.dataset.tab;
        cryptoTabs.forEach(t => t.classList.remove('active'));
        cryptoTabContents.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
        updateCryptoConversions();
    }

    if (e.target === copyDepositAddress) {
        navigator.clipboard.writeText(depositCryptoAddress.textContent);
        showToast('Address copied to clipboard!');
    }

    if (e.target === buyCryptoBtn) {
        const coin = buyCryptoSelect.value;
        const amount = parseFloat(buyCryptoAmount.value) / (cryptoPrices[coin]?.price || 1);
        if (!amount || amount <= 0) {
            showToast('Please enter a valid amount.', true);
            return;
        }
        buyCryptoSpinner.classList.add('active');
        buyCryptoBtn.disabled = true;
        setTimeout(() => {
            buyCryptoSpinner.classList.remove('active');
            buyCryptoBtn.disabled = false;
            showCryptoConfirmModal('buy', coin, amount);
        }, 1000);
    }

    if (e.target === sellCryptoBtn) {
        const coin = sellCryptoSelect.value;
        const amount = parseFloat(sellCryptoAmount.value);
        if (!amount || amount <= 0) {
            showToast('Please enter a valid amount.', true);
            return;
        }
        if (amount > userData.cryptoWallet[coin].balance) {
            showToast('Insufficient crypto balance.', true);
            return;
        }
        sellCryptoSpinner.classList.add('active');
        sellCryptoBtn.disabled = true;
        setTimeout(() => {
            sellCryptoSpinner.classList.remove('active');
            sellCryptoBtn.disabled = false;
            showCryptoConfirmModal('sell', coin, amount);
        }, 1000);
    }

    if (e.target === depositCryptoBtn) {
        const coin = depositCryptoSelect.value;
        const amount = parseFloat(depositCryptoAmount.value);
        if (!amount || amount <= 0 || amount < 0.0001) {
            showToast('Minimum deposit is 0.0001.', true);
            return;
        }
        depositCryptoSpinner.classList.add('active');
        depositCryptoBtn.disabled = true;
        setTimeout(() => {
            depositCryptoSpinner.classList.remove('active');
            depositCryptoBtn.disabled = false;
            showCryptoConfirmModal('deposit', coin, amount);
        }, 1000);
    }

    if (e.target === withdrawCryptoBtn) {
        const coin = withdrawCryptoSelect.value;
        const amount = parseFloat(withdrawCryptoAmount.value);
        const address = withdrawCryptoAddress.value;
        if (!amount || amount <= 0 || amount < 0.0001) {
            showToast('Minimum withdrawal is 0.0001.', true);
            return;
        }
        if (!validateCryptoAddress(address, coin)) {
            showToast('Invalid wallet address.', true);
            return;
        }
        withdrawCryptoSpinner.classList.add('active');
        withdrawCryptoBtn.disabled = true;
        setTimeout(() => {
            withdrawCryptoSpinner.classList.remove('active');
            withdrawCryptoBtn.disabled = false;
            showCryptoConfirmModal('withdraw', coin, amount, address);
        }, 1000);
    }

    if (e.target === closeCryptoConfirm || e.target === cancelCryptoConfirm) {
        cryptoConfirmModal.classList.remove('active');
        crypto2faCode.value = '';
        pendingCryptoTransaction = null;
    }

    if (e.target === confirmCryptoTransaction) {
        const code = crypto2faCode.value;
        if (!/^\d{6}$/.test(code)) {
            showToast('Please enter a valid 6-digit 2FA code.', true);
            return;
        }
        cryptoConfirmSpinner.classList.add('active');
        confirmCryptoTransaction.disabled = true;
        setTimeout(() => {
            cryptoConfirmSpinner.classList.remove('active');
            confirmCryptoTransaction.disabled = false;
            if (pendingCryptoTransaction) {
                const { type, coin, amount, address } = pendingCryptoTransaction;
                let success = false;
                if (type === 'buy') {
                    success = handleCryptoBuy(coin, amount);
                } else if (type === 'sell') {
                    success = handleCryptoSell(coin, amount);
                } else if (type === 'deposit') {
                    success = handleCryptoDeposit(coin, amount);
                } else if (type === 'withdraw') {
                    success = handleCryptoWithdraw(coin, amount, address);
                }
                if (success) {
                    cryptoConfirmModal.classList.remove('active');
                    crypto2faCode.value = '';
                    pendingCryptoTransaction = null;
                }
            }
        }, 1000);
    }

    if (e.target === withdrawMaxBtn) {
        const coin = withdrawCryptoSelect.value;
        const maxAmount = userData.cryptoWallet[coin].balance - 0.0005;
        withdrawCryptoAmount.value = maxAmount > 0 ? maxAmount.toFixed(8) : 0;
        updateCryptoConversions();
    }

    if (e.target === editProfileBtn) {
        editName.value = userData.profile.username;
        editEmail.value = userData.profile.email;
        profileEditForm.classList.add('active');
    }

    if (e.target === cancelEditBtn) {
        profileEditForm.classList.remove('active');
    }

    if (e.target === saveProfileBtn) {
        const newName = editName.value;
        const newEmail = editEmail.value;
        if (newName && newEmail) {
            userData.profile.username = newName;
            userData.profile.email = newEmail;
            profileName.textContent = newName;
            profileEmail.textContent = newEmail;
            profileEditForm.classList.remove('active');
            showToast('Profile updated successfully!');
        } else {
            showToast('Please fill all fields.', true);
        }
    }

    if (e.target.closest('.crypto-btn')) {
        const coin = e.target.dataset.coin;
        const action = e.target.dataset.action;
        if (action === 'buy') {
            buyCryptoSelect.value = coin;
            cryptoTabs.forEach(t => t.classList.remove('active'));
            cryptoTabContents.forEach(c => c.classList.remove('active'));
            document.querySelector('.crypto-tab[data-tab="buy"]').classList.add('active');
            document.getElementById('buy-tab').classList.add('active');
            updateCryptoConversions();
        } else if (action === 'sell') {
            sellCryptoSelect.value = coin;
            cryptoTabs.forEach(t => t.classList.remove('active'));
            cryptoTabContents.forEach(c => c.classList.remove('active'));
            document.querySelector('.crypto-tab[data-tab="sell"]').classList.add('active');
            document.getElementById('sell-tab').classList.add('active');
            updateCryptoConversions();
        }
    }
});

depositPageSubmit.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('deposit-page-amount').value);
    const remarks = document.getElementById('deposit-page-remarks').value;
    if (amount && amount > 0) {
        userData.balance += amount;
        userData.transactions.push({
            type: 'credit',
            amount,
            remarks,
            date: new Date().toISOString()
        });
        updateBalance();
        renderTransactions();
        showToast('Deposit successful!');
        document.getElementById('deposit-page-amount').value = '';
        document.getElementById('deposit-page-remarks').value = '';
    } else {
        showToast('Please enter a valid amount.', true);
    }
});

withdrawPageSubmit.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('withdraw-page-amount').value);
    const remarks = document.getElementById('withdraw-page-remarks').value;
    if (amount && amount > 0 && amount <= userData.balance) {
        userData.balance -= amount;
        userData.transactions.push({
            type: 'debit',
            amount,
            remarks,
            date: new Date().toISOString()
        });
        updateBalance();
        renderTransactions();
        showToast('Withdrawal successful!');
        document.getElementById('withdraw-page-amount').value = '';
        document.getElementById('withdraw-page-remarks').value = '';
    } else {
        showToast('Invalid amount or insufficient balance.', true);
    }
});

transferPageSubmit.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('transfer-page-amount').value);
    const remarks = document.getElementById('transfer-page-remarks').value;
    const type = transferPageType.value;
    const accountNumber = document.getElementById('transfer-page-account-number').value;
    const upiId = document.getElementById('transfer-page-upi').value;
    if (amount && amount > 0 && amount <= userData.balance && (type !== 'upi' ? accountNumber : upiId)) {
        userData.balance -= amount;
        userData.transactions.push({
            type: 'transfer',
            amount,
            remarks,
            date: new Date().toISOString()
        });
        updateBalance();
        renderTransactions();
        showToast('Transfer successful!');
        document.getElementById('transfer-page-amount').value = '';
        document.getElementById('transfer-page-remarks').value = '';
        document.getElementById('transfer-page-account-number').value = '';
        document.getElementById('transfer-page-upi').value = '';
    } else {
        showToast('Invalid amount, insufficient balance, or missing details.', true);
    }
});

transferPageType.addEventListener('change', () => {
    if (transferPageType.value === 'upi') {
        transferPageAccountGroup.style.display = 'none';
        transferPageUpiGroup.style.display = 'block';
    } else {
        transferPageAccountGroup.style.display = 'block';
        transferPageUpiGroup.style.display = 'none';
    }
});

[dateRange, transactionType, amountRange].forEach(filter => {
    filter.addEventListener('change', filterTransactions);
});

[buyCryptoAmount, sellCryptoAmount, withdrawCryptoAmount].forEach(input => {
    input.addEventListener('input', updateCryptoConversions);
});

[buyCryptoSelect, sellCryptoSelect, withdrawCryptoSelect].forEach(select => {
    select.addEventListener('change', updateCryptoConversions);
});

refreshBalance.addEventListener('click', () => {
    balanceSpinner.classList.add('active');
    setTimeout(() => {
        balanceSpinner.classList.remove('active');
        updateBalance();
        showToast('Balance refreshed!');
    }, 1000);
});

cryptoConfirmModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cancelCryptoConfirm.click();
    }
});

// Initialize
const auth = localStorage.getItem('auth');
if (auth) {
    document.body.classList.remove('hide-sidebar-header');
    showPage('dashboard');
    updateBalance();
    renderTransactions();
    profileName.textContent = userData.profile.username;
    profileEmail.textContent = userData.profile.email;
} else {
    document.body.classList.add('hide-sidebar-header');
    showPage('get-started');
}

fetchCryptoPrices();
setInterval(fetchCryptoPrices, 30000);
