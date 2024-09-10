document.addEventListener('DOMContentLoaded', function () {
    // Select necessary DOM elements
    const genderInputs = document.querySelectorAll('input[name="geschlecht"]');
    const calcTypeInputs = document.querySelectorAll('input[name="kfa-or-miflin"]');
    const ageInput = document.getElementById('age-2');
    const heightInput = document.getElementById('height-2');
    const weightInput = document.getElementById('weight-2');
    const weightKfaInput = document.getElementById('weight-3-kfa'); // KFA weight input
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
            console.log(`Gender selected: ${gender}`);
            calculateResult();
        });
    });

    // Calculation type selection
    calcTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            calcType = input.value;
            console.log(`Calculation type selected: ${calcType}`);
            toggleCalcType();
            calculateResult();
        });
    });

    // Input change listeners for Miflin inputs
    ageInput.addEventListener('input', () => {
        age = parseInt(ageInput.value, 10) || 0;
        console.log(`Age input: ${age}`);
        calculateResult();
    });

    heightInput.addEventListener('input', () => {
        height = parseInt(heightInput.value, 10) || 0;
        console.log(`Height input: ${height}`);
        calculateResult();
    });

    weightInput.addEventListener('input', () => {
        weight = parseInt(weightInput.value, 10) || 0;
        console.log(`Weight input: ${weight}`);
        calculateResult();
    });

    // Input change listeners for KFA inputs
    weightKfaInput.addEventListener('input', () => {
        weight = parseInt(weightKfaInput.value, 10) || 0;
        console.log(`Weight (KFA) input: ${weight}`);
        calculateResult();
    });

    kfaInput.addEventListener('input', () => {
        kfa = parseInt(kfaInput.value, 10) || 0;
        console.log(`KFA input: ${kfa}`);
        calculateResult();
    });

    // Function to toggle between Miflin and KFA input fields
    function toggleCalcType() {
        const miflinInputs = document.getElementById('input-miflin');
        const kfaInputs = document.getElementById('input-kfa');
        if (calcType === 'miflin') {
            miflinInputs.style.display = 'block';
            kfaInputs.style.display = 'none';
            console.log('Switched to Miflin inputs');
        } else {
            miflinInputs.style.display = 'none';
            kfaInputs.style.display = 'block';
            console.log('Switched to KFA inputs');
        }
    }

    // Calculation function
    function calculateResult() {
        let result = 0;
        console.log(`Starting calculation with gender: ${gender}, type: ${calcType}, weight: ${weight}, height: ${height}, age: ${age}, kfa: ${kfa}`);

        if (calcType === 'miflin') {
            // Miflin St. Jeor formula (using height, weight, age)
            if (gender === 'Mann') {
                result = 10 * weight + 6.25 * height - 5 * age + 5; // For males
            } else if (gender === 'frau') {
                result = 10 * weight + 6.25 * height - 5 * age - 161; // For females
            }
        } else if (calcType === 'kfa') {
            // Calculate BMR with KFA (only using weight and body fat percentage)
            if (weight > 0 && kfa > 0) {
                result = 370 + 21.6 * (weight * (1 - kfa / 100)); // KFA formula
            }
        }

        // Display the result if all required fields are filled
        if ((calcType === 'miflin' && weight && height && age && gender) || (calcType === 'kfa' && weight && kfa && gender)) {
            wrapperResult.style.display = 'flex';
            resultElement.textContent = `${Math.round(result)} kcal`;
            console.log(`Result displayed: ${Math.round(result)} kcal`);
        } else {
            wrapperResult.style.display = 'none'; // Hide result if inputs are incomplete
            console.log('Incomplete inputs, hiding result');
        }
    }

    // Sync custom range slider changes
    function syncCustomSliders() {
        observeChanges('wrapper-step-range_slider', 'age-2');
        observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
        observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');
    }

    // Initial setup
    toggleCalcType();
    syncCustomSliders(); // Attach slider listeners
});
