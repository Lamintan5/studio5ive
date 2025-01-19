function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const geoApiKey = 'e62ed52fe1914a1189737fb5a08071d6'; 
    const currencyApiKey = '4b17bace6855f24d877aa384';
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoApiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const country = data.results[0].components.country;
            const currencyCode = getCurrencyCode(country);
            if (currencyCode) {
                convertCurrency(currencyCode, currencyApiKey);
            } else {
                document.getElementById("location").innerHTML = `Unable to determine currency for ${country}`;
            }
        })
        .catch(error => {
            console.error('Error fetching the country data:', error);
            document.getElementById("location").innerHTML = "Unable to retrieve country information.";
        });
}

function convertCurrency(targetCurrency, apiKey) {
    const baseCurrency = 'USD';

    const amountElements = document.querySelectorAll('.pricing__cost');
    const currencyElements = document.querySelectorAll('.pricing__currency');
    const currencyUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    fetch(currencyUrl)
        .then(response => response.json())
        .then(data => {
            const kenyanNumber = "+254706751272";
            const usNumber = "+16592702766";
            const phoneElements = document.querySelectorAll('.contact-phone');

            const exchangeRate = data.conversion_rates[targetCurrency];

            if (!exchangeRate) {
                throw new Error('Invalid target currency or no exchange rate available.');
            }

            amountElements.forEach((amountElement, index) => {
                const amount = parseFloat(amountElement.textContent);
                const convertedAmount = (amount * exchangeRate).toFixed(0);
                const currencyElement = currencyElements[index];
                currencyElement.textContent = targetCurrencySymbol(targetCurrency);
                amountElement.textContent = convertedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            });

            document.getElementById("location").innerHTML = `Prices converted to ${targetCurrency}`;
            
            phoneElements.forEach(phoneElement => {
                if (targetCurrency === 'KES') {
                    phoneElement.textContent = kenyanNumber;
                } else {
                    phoneElement.textContent = usNumber;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching the exchange rate data:', error);
            document.getElementById("location").innerHTML = "Unable to retrieve exchange rate information.";
        });
}
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("location").innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("location").innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("location").innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("location").innerHTML = "An unknown error occurred.";
            break;
    }
}

function getCurrencyCode(country) {
    const countryCurrencyMap = {
        "Afghanistan": "AFN",
        "Albania": "ALL",
        "Algeria": "DZD",
        "Andorra": "EUR",
        "Angola": "AOA",
        "Antigua and Barbuda": "XCD",
        "Argentina": "ARS",
        "Armenia": "AMD",
        "Australia": "AUD",
        "Austria": "EUR",
        "Azerbaijan": "AZN",
        "Bahamas": "BSD",
        "Bahrain": "BHD",
        "Bangladesh": "BDT",
        "Barbados": "BBD",
        "Belarus": "BYN",
        "Belgium": "EUR",
        "Belize": "BZD",
        "Benin": "XOF",
        "Bhutan": "BTN",
        "Bolivia": "BOB",
        "Bosnia and Herzegovina": "BAM",
        "Botswana": "BWP",
        "Brazil": "BRL",
        "Brunei": "BND",
        "Bulgaria": "BGN",
        "Burkina Faso": "XOF",
        "Burundi": "BIF",
        "Cabo Verde": "CVE",
        "Cambodia": "KHR",
        "Cameroon": "XAF",
        "Canada": "CAD",
        "Central African Republic": "XAF",
        "Chad": "XAF",
        "Chile": "CLP",
        "China": "CNY",
        "Colombia": "COP",
        "Comoros": "KMF",
        "Congo": "CDF",
        "Costa Rica": "CRC",
        "Croatia": "HRK",
        "Cuba": "CUP",
        "Cyprus": "EUR",
        "Czech Republic": "CZK",
        "Denmark": "DKK",
        "Djibouti": "DJF",
        "Dominica": "XCD",
        "Dominican Republic": "DOP",
        "Ecuador": "USD",
        "Egypt": "EGP",
        "El Salvador": "USD",
        "Equatorial Guinea": "XAF",
        "Eritrea": "ERN",
        "Estonia": "EUR",
        "Eswatini": "SZL",
        "Ethiopia": "ETB",
        "Fiji": "FJD",
        "Finland": "EUR",
        "France": "EUR",
        "Gabon": "XAF",
        "Gambia": "GMD",
        "Georgia": "GEL",
        "Germany": "EUR",
        "Ghana": "GHS",
        "Greece": "EUR",
        "Grenada": "XCD",
        "Guatemala": "GTQ",
        "Guinea": "GNF",
        "Guinea-Bissau": "XOF",
        "Guyana": "GYD",
        "Haiti": "HTG",
        "Honduras": "HNL",
        "Hungary": "HUF",
        "Iceland": "ISK",
        "India": "INR",
        "Indonesia": "IDR",
        "Iran": "IRR",
        "Iraq": "IQD",
        "Ireland": "EUR",
        "Israel": "ILS",
        "Italy": "EUR",
        "Jamaica": "JMD",
        "Japan": "JPY",
        "Jordan": "JOD",
        "Kazakhstan": "KZT",
        "Kenya": "KES",
        "Kiribati": "AUD",
        "Korea, North": "KPW",
        "Korea, South": "KRW",
        "Kosovo": "EUR",
        "Kuwait": "KWD",
        "Kyrgyzstan": "KGS",
        "Laos": "LAK",
        "Latvia": "EUR",
        "Lebanon": "LBP",
        "Lesotho": "LSL",
        "Liberia": "LRD",
        "Libya": "LYD",
        "Liechtenstein": "CHF",
        "Lithuania": "EUR",
        "Luxembourg": "EUR",
        "Madagascar": "MGA",
        "Malawi": "MWK",
        "Malaysia": "MYR",
        "Maldives": "MVR",
        "Mali": "XOF",
        "Malta": "EUR",
        "Marshall Islands": "USD",
        "Mauritania": "MRU",
        "Mauritius": "MUR",
        "Mexico": "MXN",
        "Micronesia": "USD",
        "Moldova": "MDL",
        "Monaco": "EUR",
        "Mongolia": "MNT",
        "Montenegro": "EUR",
        "Morocco": "MAD",
        "Mozambique": "MZN",
        "Myanmar": "MMK",
        "Namibia": "NAD",
        "Nauru": "AUD",
        "Nepal": "NPR",
        "Netherlands": "EUR",
        "New Zealand": "NZD",
        "Nicaragua": "NIO",
        "Niger": "XOF",
        "Nigeria": "NGN",
        "North Macedonia": "MKD",
        "Norway": "NOK",
        "Oman": "OMR",
        "Pakistan": "PKR",
        "Palau": "USD",
        "Palestine": "ILS",
        "Panama": "PAB",
        "Papua New Guinea": "PGK",
        "Paraguay": "PYG",
        "Peru": "PEN",
        "Philippines": "PHP",
        "Poland": "PLN",
        "Portugal": "EUR",
        "Qatar": "QAR",
        "Romania": "RON",
        "Russia": "RUB",
        "Rwanda": "RWF",
        "Saint Kitts and Nevis": "XCD",
        "Saint Lucia": "XCD",
        "Saint Vincent and the Grenadines": "XCD",
        "Samoa": "WST",
        "San Marino": "EUR",
        "Sao Tome and Principe": "STN",
        "Saudi Arabia": "SAR",
        "Senegal": "XOF",
        "Serbia": "RSD",
        "Seychelles": "SCR",
        "Sierra Leone": "SLL",
        "Singapore": "SGD",
        "Slovakia": "EUR",
        "Slovenia": "EUR",
        "Solomon Islands": "SBD",
        "Somalia": "SOS",
        "South Africa": "ZAR",
        "South Sudan": "SSP",
        "Spain": "EUR",
        "Sri Lanka": "LKR",
        "Sudan": "SDG",
        "Suriname": "SRD",
        "Sweden": "SEK",
        "Switzerland": "CHF",
        "Syria": "SYP",
        "Taiwan": "TWD",
        "Tajikistan": "TJS",
        "Tanzania": "TZS",
        "Thailand": "THB",
        "Timor-Leste": "USD",
        "Togo": "XOF",
        "Tonga": "TOP",
        "Trinidad and Tobago": "TTD",
        "Tunisia": "TND",
        "Turkey": "TRY",
        "Turkmenistan": "TMT",
        "Tuvalu": "AUD",
        "Uganda": "UGX",
        "Ukraine": "UAH",
        "United Arab Emirates": "AED",
        "United Kingdom": "GBP",
        "United States": "USD",
        "Uruguay": "UYU",
        "Uzbekistan": "UZS",
        "Vanuatu": "VUV",
        "Vatican City": "EUR",
        "Venezuela": "VES",
        "Vietnam": "VND",
        "Yemen": "YER",
        "Zambia": "ZMW",
        "Zimbabwe": "ZWL"
    };
    return countryCurrencyMap[country];
}

function targetCurrencySymbol(currencyCode) {
    // This function maps currency codes to their respective symbols.
    // You can add more currencies and their symbols as needed.
    const currencySymbolMap = {
        "AFN": "؋",
        "ALL": "L",
        "DZD": "د.ج",
        "EUR": "€",
        "AOA": "Kz",
        "XCD": "$",
        "ARS": "$",
        "AMD": "֏",
        "AUD": "$",
        "AZN": "₼",
        "BSD": "$",
        "BHD": ".د.ب",
        "BDT": "৳",
        "BBD": "$",
        "BYN": "Br",
        "BZD": "BZ$",
        "XOF": "CFA",
        "BTN": "Nu.",
        "BOB": "Bs.",
        "BAM": "KM",
        "BWP": "P",
        "BRL": "R$",
        "BND": "$",
        "BGN": "лв",
        "BIF": "FBu",
        "CVE": "$",
        "KHR": "៛",
        "XAF": "FCFA",
        "CAD": "$",
        "CLP": "$",
        "CNY": "¥",
        "COP": "$",
        "KMF": "CF",
        "CDF": "FC",
        "CRC": "₡",
        "HRK": "kn",
        "CUP": "$",
        "CZK": "Kč",
        "DKK": "kr",
        "DJF": "Fdj",
        "DOP": "$",
        "USD": "$",
        "EGP": "E£",
        "SVC": "$",
        "ERN": "Nfk",
        "SZL": "L",
        "ETB": "Br",
        "FJD": "$",
        "GMD": "D",
        "GEL": "₾",
        "GHS": "GH₵",
        "GIP": "£",
        "GTQ": "Q",
        "GNF": "FG",
        "GYD": "$",
        "HTG": "G",
        "HNL": "L",
        "HUF": "Ft",
        "ISK": "kr",
        "INR": "₹",
        "IDR": "Rp",
        "IRR": "﷼",
        "IQD": "ع.د",
        "ILS": "₪",
        "JMD": "J$",
        "JPY": "¥",
        "JOD": "JD",
        "KZT": "₸",
        "KES": "Ksh",
        "KPW": "₩",
        "KRW": "₩",
        "KWD": "KD",
        "KGS": "с",
        "LAK": "₭",
        "LBP": "ل.ل",
        "LSL": "L",
        "LRD": "$",
        "LYD": "ل.د",
        "CHF": "CHF",
        "MGA": "Ar",
        "MWK": "MK",
        "MYR": "RM",
        "MVR": "ރ.",
        "MRU": "UM",
        "MUR": "₨",
        "MXN": "$",
        "MDL": "MDL",
        "MNT": "₮",
        "MAD": "د.م.",
        "MZN": "MT",
        "MMK": "K",
        "NAD": "$",
        "NPR": "₨",
        "NZD": "$",
        "NIO": "C$",
        "NGN": "₦",
        "MKD": "ден",
        "NOK": "kr",
        "OMR": "ر.ع.",
        "PKR": "₨",
        "PAB": "B/.",
        "PGK": "K",
        "PYG": "₲",
        "PEN": "S/",
        "PHP": "₱",
        "PLN": "zł",
        "QAR": "ر.ق",
        "RON": "lei",
        "RUB": "₽",
        "RWF": "RF",
        "WST": "WS$",
        "STN": "Db",
        "SAR": "ر.س",
        "RSD": "дин.",
        "SCR": "₨",
        "SLL": "Le",
        "SGD": "$",
        "SBD": "$",
        "SOS": "Sh",
        "ZAR": "R",
        "SSP": "£",
        "LKR": "රු",
        "SDG": "ج.س.",
        "SRD": "$",
        "SEK": "kr",
        "CHF": "CHF",
        "SYP": "£",
        "TWD": "NT$",
        "TJS": "ЅМ",
        "TZS": "TSh",
        "THB": "฿",
        "TOP": "T$",
        "TTD": "TT$",
        "TND": "د.ت",
        "TRY": "₺",
        "TMT": "T",
        "UGX": "USh",
        "UAH": "₴",
        "AED": "د.إ",
        "GBP": "£",
        "UYU": "$U",
        "UZS": "лв",
        "VUV": "VT",
        "VES": "Bs.",
        "VND": "₫",
        "YER": "﷼",
        "ZMW": "ZK",
        "ZWL": "$",
    };
    return currencySymbolMap[currencyCode] || currencyCode;
}

getCurrentLocation();

