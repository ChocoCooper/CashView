const BASE_URL = 'https://cashview-backend.onrender.com'; // Replace with your backend URL after deployment

// User Data (mock for demo, will be fetched from backend in production)
const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    accounts: [{
        type: "Savings",
        number: "XXXX-7890",
        balance: 700000.00,
        currency: "INR",
        active: true
    }],
    crypto: {
        BTC: { balance: 0.0425, address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5" },
        ETH: { balance: 1.25, address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
        LTC: { balance: 5.6, address: "LRMtb18YZTq7UJ9Y4rUjQ1Z2vXnsZ3JHsK" },
        XRP: { balance: 320, address: "rPdvC6ccq8hCdPKSPJkPmyZ4Mi1oG2FFkT" },
        USDT: { balance: 500, address: "0x55d398326f99059fF775485246999027B3197955" }
    },
    transactions: [
        { id: "T1001", type: "credit", title: "Salary Credit", description: "From XYZ Corp", amount: 45000.00, date: "2023-06-01", category: "salary" },
        { id: "T1002", type: "debit", title: "Electricity Bill", description: "BSES Rajdhani", amount: 1850.00, date: "2023-05-28", category: "bill" },
        { id: "T1003", type: "debit", title: "Grocery Shopping", description: "Big Bazaar", amount: 3250.50, date: "2023-05-27", category: "shopping" },
        { id: "T1004", type: "credit", title: "Interest Credit", description: "Interest on XXXX-7890", amount: 542.50, date: "2023-05-25", category: "interest" },
        { id: "T1005", type: "debit", title: "Credit Card Payment", description: "HDFC Bank Card", amount: 12500.00, date: "2023-05-20", category: "payment" },
        { id: "T1006", type: "debit", title: "Rent Payment", description: "To XXXX-4321", amount: 15000.00, date: "2023-05-15", category: "rent" },
        { id: "T1007", type: "credit", title: "Freelance Payment", description: "From Tech Solutions", amount: 25000.00, date: "2023-05-10", category: "income" },
        { id: "T1008", type: "debit", title: "Dining Out", description: "The Great Kabab Factory", amount: 1850.00, date: "2023-05-08", category: "food" },
        { id: "C1001", type: "debit", title: "BTC Purchase", description: "Bought 0.01 BTC", amount: 18000.00, date: "2023-05-05", category: "crypto" },
        { id: "C1002", type: "credit", title: "ETH Sale", description: "Sold 0.5 ETH", amount: 7500.00, date: "2023-05-03", category: "crypto" },
        { id: "B1001", type: "debit", title: "Internet Bill", description: "Airtel Fiber", amount: 1199.00, date: "2023-05-15", category: "bill" }
    ],
    monthlyStats: { income: 42500.00, expenses: 18750.00 }
};

const cryptoData = {
    BTC: { name: "Bitcoin", price: 0, change24h: 0, icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", color: "var(--btc-orange)" },
    ETH: { name: "Ethereum", price: 0, change24h: 0, icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", color: "var(--eth-purple)" },
    LTC: { name: "Litecoin", price: 0, change24h: 0, icon: "https://cryptologos.cc/logos/litecoin-ltc-logo.png", color: "var(--ltc-silver)" },
    XRP: { name: "Ripple", price: 0, change24h: 0, icon: "https://cryptologos.cc/logos/xrp-xrp-logo.png", color: "var(--xrp-blue)" },
    USDT: { name: "Tether", price: 83.5, change24h: 0.1, icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", color: "var(--usdt-green)" }
};

// Page Templates
const templates = {
    dashboard: `
        <div class="page active" id="dashboard-page">
            <div class="welcome-card">
                <h2>Welcome back!</h2>
                <p>You have 3 new notifications and 2 pending transactions. Manage your finances easily with CashView.</p>
            </div>
            <div class="quick-actions">
                <a href="/deposit" class="action-btn" id="deposit-btn"><div class="action-icon"><i class="fa fa-rupee"></i></div><span>Deposit</span></a>
                <a href="/withdraw" class="action-btn" id="withdraw-btn"><div class="action-icon"><i class="fas fa-money-bill-wave"></i></div><span>Withdraw</span></a>
                <a href="/transfer" class="action-btn" id="quick-transfer-btn"><div class="action-icon"><i class="fas fa-paper-plane"></i></div><span>Quick Transfer</span></a>
                <a href="/crypto" class="action-btn" id="crypto-btn"><div class="action-icon"><i class="fab fa-bitcoin"></i></div><span>Crypto</span></a>
            </div>
            <div class="balance-card">
                <div class="balance-header">
                    <h3>Account Summary</h3>
                    <a href="/transactions" class="view-all"><span>View Details</span><i class="fas fa-chevron-right"></i></a>
                </div>
                <div class="balance-amount">₹<span id="main-balance">7,00,000.00</span></div>
                <div class="balance-subtext">Current Balance • Savings Account • XXXX-7890</div>
                <div class="balance-stats">
                    <div class="stat-item"><div class="stat-label">Income (this month)</div><div class="stat-value">₹42,500.00</div></div>
                    <div class="stat-item"><div class="stat-label">Expenses (this month)</div><div class="stat-value">₹18,750.00</div></div>
                    <div class="stat-item"><div class="stat-label">Next Payday</div><div class="stat-value">5 days</div></div>
                </div>
            </div>
            <div class="transactions-section">
                <div class="section-header">
                    <h3>Recent Transactions</h3>
                    <a href="/transactions" class="view-all" id="view-all-transactions"><span>View All</span><i class="fas fa-chevron-right"></i></a>
                </div>
                <div class="transactions-container" id="transactions-list"></div>
            </div>
        </div>`,
    transactions: `
        <div class="page active" id="transactions-page">
            <h2 class="page-title">Transaction History</h2>
            <div class="card">
                <div class="filter-section">
                    <div class="filter-group">
                        <label class="form-label">Date Range</label>
                        <select class="form-control" id="date-range">
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 3 months</option>
                            <option value="180">Last 6 months</option>
                            <option value="all">All transactions</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="form-label">Transaction Type</label>
                        <select class="form-control" id="transaction-type">
                            <option value="all">All Transactions</option>
                            <option value="credit">Credits</option>
                            <option value="debit">Debits</option>
                            <option value="transfer">Transfers</option>
                            <option value="crypto">Crypto</option>
                            <option value="bill">Bills</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="form-label">Amount Range</label>
                        <select class="form-control" id="amount-range">
                            <option value="all">Any amount</option>
                            <option value="1000">Less than ₹1,000</option>
                            <option value="5000">₹1,000 - ₹5,000</option>
                            <option value="5001">More than ₹5,000</option>
                        </select>
                    </div>
                </div>
                <div class="transactions-container" id="full-transactions-list"></div>
            </div>
        </div>`,
    deposit: `
        <div class="page active" id="deposit-page">
            <h2 class="page-title">Deposit Money</h2>
            <div class="card">
                <div class="form-group">
                    <label class="form-label">From Account</label>
                    <select class="form-control"><option>Savings Account (XXXX-7890)</option></select>
                </div>
                <div class="form-group">
                    <label class="form-label">Deposit Method</label>
                    <select class="form-control" id="deposit-page-method">
                        <option value="cash">Cash Deposit</option>
                        <option value="cheque">Cheque Deposit</option>
                        <option value="transfer">Bank Transfer</option>
                        <option value="upi">UPI Payment</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount (₹)</label>
                    <div class="input-group">
                        <i class="fa fa-rupee input-icon"></i>
                        <input type="number" class="form-control" id="deposit-page-amount" placeholder="Enter amount">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Remarks (Optional)</label>
                    <input type="text" class="form-control" id="deposit-page-remarks" placeholder="e.g. Salary, Gift, etc.">
                </div>
                <button class="btn btn-primary" id="deposit-page-submit">Deposit</button>
            </div>
        </div>`,
    withdraw: `
        <div class="page active" id="withdraw-page">
            <h2 class="page-title">Withdraw Money</h2>
            <div class="card">
                <div class="form-group">
                    <label class="form-label">From Account</label>
                    <select class="form-control"><option>Savings Account (XXXX-7890)</option></select>
                </div>
                <div class="form-group">
                    <label class="form-label">Withdrawal Method</label>
                    <select class="form-control" id="withdraw-page-method">
                        <option value="atm">ATM Withdrawal</option>
                        <option value="branch">Branch Withdrawal</option>
                        <option value="transfer">Bank Transfer</option>
                        <option value="upi">UPI Payment</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount (₹)</label>
                    <div class="input-group">
                        <i class="fa fa-rupee input-icon"></i>
                        <input type="number" class="form-control" id="withdraw-page-amount" placeholder="Enter amount">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Remarks (Optional)</label>
                    <input type="text" class="form-control" id="withdraw-page-remarks" placeholder="e.g. Shopping, Bills, etc.">
                </div>
                <button class="btn btn-primary" id="withdraw-page-submit">Withdraw</button>
            </div>
        </div>`,
    transfer: `
        <div class="page active" id="transfer-page">
            <h2 class="page-title">Transfer Money</h2>
            <div class="card">
                <div class="form-group">
                    <label class="form-label">From Account</label>
                    <select class="form-control"><option>Savings Account (XXXX-7890)</option></select>
                </div>
                <div class="form-group">
                    <label class="form-label">Transfer Type</label>
                    <select class="form-control" id="transfer-page-type">
                        <option value="internal">Within CashView Bank</option>
                        <option value="external">Other Bank (NEFT/IMPS/RTGS)</option>
                        <option value="upi">UPI Transfer</option>
                    </select>
                </div>
                <div class="form-group" id="transfer-page-account-group">
                    <label class="form-label">Account Number</label>
                    <input type="text" class="form-control" id="transfer-page-account" placeholder="Enter account number">
                </div>
                <div class="form-group" id="transfer-page-upi-group" style="display: none;">
                    <label class="form-label">UPI ID</label>
                    <input type="text" class="form-control" id="transfer-page-upi" placeholder="Enter UPI ID">
                </div>
                <div class="form-group">
                    <label class="form-label">Amount (₹)</label>
                    <div class="input-group">
                        <i class="fa fa-rupee input-icon"></i>
                        <input type="number" class="form-control" id="transfer-page-amount" placeholder="Enter amount">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Remarks (Optional)</label>
                    <input type="text" class="form-control" id="transfer-page-remarks" placeholder="e.g. Loan repayment, Gift, etc.">
                </div>
                <button class="btn btn-primary" id="transfer-page-submit">Transfer Money</button>
            </div>
        </div>`,
    crypto: `
        <div class="page active" id="crypto-page">
            <h2 class="page-title">Crypto Wallet</h2>
            <div class="card">
                <div class="crypto-tabs">
                    <div class="crypto-tab active" data-tab="wallet">My Wallet</div>
                    <div class="crypto-tab" data-tab="buy">Buy Crypto</div>
                    <div class="crypto-tab" data-tab="sell">Sell Crypto</div>
                    <div class="crypto-tab" data-tab="deposit">Deposit</div>
                    <div class="crypto-tab" data-tab="withdraw">Withdraw</div>
                </div>
                <div class="crypto-tab-content active" id="wallet-tab">
                    <div class="crypto-grid" id="crypto-wallet"></div>
                </div>
                <div class="crypto-tab-content" id="buy-tab">
                    <div class="form-group">
                        <label class="form-label">Select Cryptocurrency</label>
                        <select class="form-control" id="buy-crypto-select">
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="LTC">Litecoin (LTC)</option>
                            <option value="XRP">Ripple (XRP)</option>
                            <option value="USDT">Tether (USDT)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Amount in ₹</label>
                        <div class="input-group">
                            <i class="fa fa-rupee input-icon"></i>
                            <input type="number" class="form-control" id="buy-crypto-amount" placeholder="Enter amount">
                        </div>
                        <div class="crypto-conversion" id="buy-crypto-conversion">≈ 0 BTC</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Payment Method</label>
                        <select class="form-control">
                            <option>Bank Transfer</option>
                            <option>Credit/Debit Card</option>
                            <option>UPI Payment</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" id="buy-crypto-btn">Buy Crypto</button>
                </div>
                <div class="crypto-tab-content" id="sell-tab">
                    <div class="form-group">
                        <label class="form-label">Select Cryptocurrency</label>
                        <select class="form-control" id="sell-crypto-select">
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="LTC">Litecoin (LTC)</option>
                            <option value="XRP">Ripple (XRP)</option>
                            <option value="USDT">Tether (USDT)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Amount to Sell</label>
                        <div class="input-group">
                            <i class="fas fa-coins input-icon"></i>
                            <input type="number" class="form-control" id="sell-crypto-amount" placeholder="Enter amount">
                        </div>
                        <div class="crypto-conversion" id="sell-crypto-conversion">≈ ₹0</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Deposit To</label>
                        <select class="form-control">
                            <option>Savings Account (XXXX-7890)</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" id="sell-crypto-btn">Sell Crypto</button>
                </div>
                <div class="crypto-tab-content" id="deposit-tab">
                    <div class="form-group">
                        <label class="form-label">Select Cryptocurrency</label>
                        <select class="form-control" id="deposit-crypto-select">
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="LTC">Litecoin (LTC)</option>
                            <option value="XRP">Ripple (XRP)</option>
                            <option value="USDT">Tether (USDT)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Deposit Address</label>
                        <div class="crypto-address">
                            <span id="deposit-crypto-address">3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5</span>
                            <button class="copy-btn" id="copy-deposit-address"><i class="fas fa-copy"></i></button>
                        </div>
                    </div>
                    <div class="qr-code" id="deposit-qr-code">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5" alt="BTC Deposit Address">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Minimum Deposit</label>
                        <div class="crypto-address"><span id="deposit-min-amount">0.0001 BTC</span></div>
                    </div>
                    <div style="background-color: rgba(108, 92, 231, 0.1); padding: 10px; border-radius: 8px; margin-top: 15px; color: var(--primary); font-size: 14px;">
                        <i class="fas fa-info-circle"></i> Send only the selected cryptocurrency to this address. Sending other assets may result in permanent loss.
                    </div>
                </div>
                <div class="crypto-tab-content" id="withdraw-tab">
                    <div class="form-group">
                        <label class="form-label">Select Cryptocurrency</label>
                        <select class="form-control" id="withdraw-crypto-select">
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="LTC">Litecoin (LTC)</option>
                            <option value="XRP">Ripple (XRP)</option>
                            <option value="USDT">Tether (USDT)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Withdrawal Address</label>
                        <input type="text" class="form-control" id="withdraw-crypto-address" placeholder="Enter external wallet address">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Amount</label>
                        <div class="crypto-amount-group">
                            <div class="input-group" style="flex: 2;">
                                <i class="fas fa-coins input-icon"></i>
                                <input type="number" class="form-control" id="withdraw-crypto-amount" placeholder="Enter amount">
                            </div>
                            <button class="btn btn-outline" style="flex: 1;" id="withdraw-max-btn">Max</button>
                        </div>
                        <div class="crypto-conversion" id="withdraw-crypto-conversion">Available: 0.0425 BTC</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Network Fee</label>
                        <div class="crypto-address"><span id="withdraw-network-fee">≈ 0.0005 BTC</span></div>
                    </div>
                    <button class="btn btn-primary" id="withdraw-crypto-btn">Withdraw Crypto</button>
                </div>
            </div>
        </div>`,
    profile: `
        <div class="page active" id="profile-page">
            <h2 class="page-title">My Profile</h2>
            <div class="card">
                <div class="profile-section">
                    <div class="profile-picture">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                        </svg>
                    </div>
                    <div class="profile-info">
                        <div><h3 id="profile-name">John Doe</h3><p style="color: var(--gray);">Customer since 2018</p></div>
                        <div><div class="info-group"><div class="info-label">Email</div><div class="info-value" id="profile-email">john.doe@example.com</div></div></div>
                    </div>
                </div>
                <div class="edit-form" id="profile-edit-form">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="edit-name" value="John Doe">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="edit-email" value="john.doe@example.com">
                    </div>
                    <button class="btn btn-primary" id="save-profile-btn">Save Changes</button>
                    <button class="btn btn-outline" id="cancel-edit-btn">Cancel</button>
                </div>
                <button class="btn btn-outline" style="margin-top: 20px;" id="edit-profile-btn"><i class="fas fa-edit"></i> Edit Profile</button>
            </div>
        </div>`,
    support: `
        <div class="page active" id="support-page">
            <h2 class="page-title">Help & Support</h2>
            <div class="card">
                <h3>Frequently Asked Questions</h3>
                <div style="margin-top: 20px;">
                    <div style="border-bottom: 1px solid var(--gray-light); padding: 15px 0;">
                        <div style="font-weight: 600; margin-bottom: 10px;">How do I reset my password?</div>
                        <div style="color: var(--gray);">You can reset your password by clicking on "Forgot Password" on the login page.</div>
                    </div>
                    <div style="border-bottom: 1px solid var(--gray-light); padding: 15px 0;">
                        <div style="font-weight: 600; margin-bottom: 10px;">What are the transfer limits?</div>
                        <div style="color: var(--gray);">The daily transfer limit is ₹1,00,000 for NEFT and ₹2,00,000 for IMPS.</div>
                    </div>
                    <div style="border-bottom: 1px solid var(--gray-light); padding: 15px 0;">
                        <div style="font-weight: 600; margin-bottom: 10px;">How do I update my mobile number?</div>
                        <div style="color: var(--gray);">You can update your mobile number in the "Profile" section or by visiting a branch.</div>
                    </div>
                </div>
            </div>
            <div class="card">
                <h3>Contact Us</h3>
                <div style="margin-top: 20px;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: rgba(108, 92, 231, 0.1); display: flex; align-items: center; justify-content: center; color: var(--primary);"><i class="fas fa-phone-alt"></i></div>
                        <div><div style="font-weight: 600;">Customer Care</div><div style="color: var(--gray);">1800 123 4567 (24x7)</div></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: rgba(108, 92, 231, 0.1); display: flex; align-items: center; justify-content: center; color: var(--primary);"><i class="fas fa-envelope"></i></div>
                        <div><div style="font-weight: 600;">Email Support</div><div style="color: var(--gray);">support@cashview.com</div></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: rgba(108, 92, 231, 0.1); display: flex; align-items: center; justify-content: center; color: var(--primary);"><i class="fas fa-map-marker-alt"></i></div>
                        <div><div style="font-weight: 600;">Branch Locator</div><div style="color: var(--gray);">Find the nearest branch or ATM</div></div>
                    </div>
                </div>
            </div>
        </div>`
};

// Authentication Functions
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    router.navigate('/login');
}

async function login(username, password) {
    try {
