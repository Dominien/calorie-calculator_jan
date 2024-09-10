document.addEventListener('DOMContentLoaded', function () {
    // Select necessary DOM elements
    const genderInputs = document.querySelectorAll('input[name="geschlecht"]');
    const calcTypeInputs = document.querySelectorAll('input[name="kfa-or-miflin"]');
    const ageInput = document.getElementById('age-2');
    const heightInput = document.getElementById('height-2');
    const weightInput = document.getElementById('weight-2');
    const kfaInput = document.getElementById('kfa-2');
    const resultElement = document.querySelector('.steps_result-text');
    const wrapperResult = document.querySelector('.wrapper-result_grundumsatz');

    let gender = '';
    let calcType = 'miflin'; // Default to Miflin
    let age = 0;
    let height = 0;
    let weight = 0;
    let kfa = 0; // Body Fat Percentage for KFA calculation

    // Gender selection
    genderInputs.forEach(input => {
        input.addEventListener('change', () => {
            gender = input.value;
            calculateResult();
        });
    });

    // Calculation type selection
    calcTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            calcType = input.value;
            toggleCalcType();
            calculateResult();
        });
    });

    // Input change listeners
    ageInput.addEventListener('input', () => {
        age = parseInt(ageInput.value, 10) || 0;
        calculateResult();
    });

    heightInput.addEventListener('input', () => {
        height = parseInt(heightInput.value, 10) || 0;
        calculateResult();
    });

    weightInput.addEventListener('input', () => {
        weight = parseInt(weightInput.value, 10) || 0;
        calculateResult();
    });

    kfaInput.addEventListener('input', () => {
        kfa = parseInt(kfaInput.value, 10) || 0;
        calculateResult();
    });

    // Function to toggle between Miflin and KFA input fields
    function toggleCalcType() {
        const miflinInputs = document.getElementById('input-miflin');
        const kfaInputs = document.getElementById('input-kfa');
        if (calcType === 'miflin') {
            miflinInputs.style.display = 'block';
            kfaInputs.style.display = 'none';
        } else {
            miflinInputs.style.display = 'none';
            kfaInputs.style.display = 'block';
        }
    }

    // Calculation function
    function calculateResult() {
        let result = 0;

        if (calcType === 'miflin') {
            // Miflin St. Jeor formula
            if (gender === 'Mann') {
                result = 10 * weight + 6.25 * height - 5 * age + 5; // For males
            } else if (gender === 'frau') {
                result = 10 * weight + 6.25 * height - 5 * age - 161; // For females
            }
        } else if (calcType === 'kfa') {
            // Calculate BMR with KFA (Body Fat Percentage)
            if (weight > 0 && kfa > 0) {
                result = 370 + 21.6 * (weight * (1 - kfa / 100)); // KFA formula
            }
        }

        // Display the result if all required fields are filled
        if ((calcType === 'miflin' && weight && height && age && gender) || (calcType === 'kfa' && weight && kfa && gender)) {
            wrapperResult.style.display = 'flex';
            resultElement.textContent = `${Math.round(result)} kcal`;
        } else {
            wrapperResult.style.display = 'none'; // Hide result if inputs are incomplete
        }
    }

    // Initial setup
    toggleCalcType();
});
