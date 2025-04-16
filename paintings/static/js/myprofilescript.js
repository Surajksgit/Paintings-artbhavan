// myprofilescript.js

const codeSpan = document.getElementById('country-code');
    const countryField = document.querySelector('select[name="country"], input[name="country"]');
    const phoneField = document.querySelector('input[name="phone"]');

    const countryPhoneCode = {
        "India": "+91",
        "United States": "+1",
        "United Kingdom": "+44",
        "Canada": "+1",
        "Australia": "+61",
    };

    function updateCodeDisplay() {
        const country = countryField.value;
        const code = countryPhoneCode[country] || "+";
        codeSpan.textContent = code;
    }

    document.addEventListener("DOMContentLoaded", updateCodeDisplay);
    countryField.addEventListener("change", updateCodeDisplay);


    