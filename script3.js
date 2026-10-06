const currencyFlags = {
    USD: 'US',
    INR: 'IN',
    EUR: 'EU',
    AUD: 'AU',
    GBP: 'GB',
    JPY: 'JP',
    CAD: 'CA',
    CHF: 'CH',
    CNY: 'CN',
    AED: 'AE',
    SGD: 'SG'
};

const currencyCodes = Object.keys(currencyFlags);
const form = document.getElementById('currencyForm');
const amountInput = document.getElementById('amountInput');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const resultText = document.getElementById('resultText');
const rateText = document.getElementById('rateText');
const resultBox = document.getElementById('resultBox');
const convertBtn = document.getElementById('convertBtn');

function formatAmount(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function updateFlag(selectElement, flagElement) {
    const currencyCode = selectElement.value;
    const countryCode = currencyFlags[currencyCode] || 'US';
    flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    flagElement.alt = `${currencyCode} flag`;
}

function populateCurrencies() {
    currencyCodes.forEach((code) => {
        const fromOption = document.createElement('option');
        fromOption.value = code;
        fromOption.textContent = code;

        const toOption = document.createElement('option');
        toOption.value = code;
        toOption.textContent = code;

        fromCurrency.appendChild(fromOption);
        toCurrency.appendChild(toOption);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';
    updateFlag(fromCurrency, document.querySelector('.from-flag'));
    updateFlag(toCurrency, document.querySelector('.to-flag'));
}

async function fetchRate(from, to) {
    if (from === to) return 1;

    const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`
    );

    if (!response.ok) {
        throw new Error('Unable to fetch the exchange rate right now.');
    }

    const data = await response.json();
    const rate = data[from.toLowerCase()]?.[to.toLowerCase()];

    if (!rate) {
        throw new Error('This currency pair is not available right now.');
    }

    return rate;
}

async function updateRateDisplay() {
    try {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const rate = await fetchRate(from, to);
        rateText.textContent = `1 ${from} = ${formatAmount(rate)} ${to}`;
    } catch (error) {
        rateText.textContent = 'Exchange rate unavailable';
    }
}

function swapCurrencies() {
    const previousFrom = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = previousFrom;
    updateFlag(fromCurrency, document.querySelector('.from-flag'));
    updateFlag(toCurrency, document.querySelector('.to-flag'));
    updateRateDisplay();
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const amount = Number(amountInput.value);
    if (!amount || amount < 0) {
        resultText.textContent = 'Please enter a valid amount greater than zero.';
        resultBox.classList.add('visible');
        return;
    }

    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    try {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const rate = await fetchRate(from, to);
        const convertedAmount = amount * rate;

        resultText.textContent = `${formatAmount(amount)} ${from} = ${formatAmount(convertedAmount)} ${to}`;
        resultBox.classList.add('visible');
        rateText.textContent = `1 ${from} = ${formatAmount(rate)} ${to}`;
    } catch (error) {
        resultText.textContent = error.message || 'Something went wrong during conversion.';
        resultBox.classList.add('visible');
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert';
    }
});

fromCurrency.addEventListener('change', () => {
    updateFlag(fromCurrency, document.querySelector('.from-flag'));
    updateRateDisplay();
});

toCurrency.addEventListener('change', () => {
    updateFlag(toCurrency, document.querySelector('.to-flag'));
    updateRateDisplay();
});

swapBtn.addEventListener('click', swapCurrencies);

populateCurrencies();
updateRateDisplay();
