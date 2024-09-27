document.addEventListener('DOMContentLoaded', function () { //Stelle für Änderung
    // Select necessary DOM elements

    const genderInputs = document.querySelectorAll('input[name="geschlecht"]');
    const calcTypeInputs = document.querySelectorAll('input[name="kfa-or-miflin"]');
    const ageInput = document.getElementById('age-2');
    const heightInput = document.getElementById('height-2');
    const weightInput = document.getElementById('weight-2');
    const weightKfaInput = document.getElementById('weight-3-kfa'); // KFA weight input
    const kfaInput = document.getElementById('kfa-2');
    const stepsInput = document.getElementById('steps-4'); // Steps input
    const grundumsatzElement = document.getElementById('grund-right'); // Grundumsatz result element
    const altagElement = document.getElementById('altag-right'); // Alltagsbewegung result element
    const stepsResultElement = document.querySelector('.wrapper-steps_kcals .steps_result-text');
    const stepsWrapperResult = document.querySelector('.wrapper-steps_kcals'); // Steps kcal wrapper

    let gender = '';
    let calcType = 'miflin'; // Default to Miflin
    let age = 0;
    let height = 0;
    let weight = 0;
    let kfa = 0; // Body Fat Percentage for KFA calculation
    let dailySteps = 0;

    // Hide steps result by default if value is 0
    stepsWrapperResult.style.display = 'none';

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

    // Input change listeners for Miflin inputs
    ageInput.addEventListener('input', () => {
        age = parseFloat(ageInput.value, 10) || 0;

        calculateResult();
    });

    heightInput.addEventListener('input', () => {
        height = parseFloat(heightInput.value, 10) || 0;
        calculateResult();
    });

    weightInput.addEventListener('input', () => {
        weight = parseFloat(weightInput.value.replace(',', '.')) || 0;
        calculateResult();
    });

    // Input change listeners for KFA inputs
    weightKfaInput.addEventListener('input', () => {
        weight = parseFloat(weightKfaInput.value.replace(',', '.')) || 0;
        calculateResult();
    });

    kfaInput.addEventListener('input', () => {
        kfa = parseFloat(kfaInput.value, 10) || 0;
        calculateResult();
    });

    // Input change listener for Steps input
    stepsInput.addEventListener('input', () => {
        dailySteps = parseFloat(stepsInput.value.replace(/\./g, ''), 10) || 0; // Removing periods and converting to integer
        calculateStepsCalories();
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

    // Calculation function for BMR
    function calculateResult() {
        // Fetch values from sliders' handle text if available
        age = getSliderValue('wrapper-step-range_slider', 'age-2');
        height = getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        weight = calcType === 'miflin' ? getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2') : getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        kfa = calcType === 'kfa' ? getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2') : 0;
    
    
        let result = 0;
    
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
                result = 864 + 13.8 * (weight * (1 - kfa / 100)); // KFA formula
            }
        }
    
    
        // Select the wrapper for Grundumsatz result
        const grundumsatzWrapper = document.querySelector('.wrapper-result_grundumsatz');
    
        // Update both elements with the calculated Grundumsatz
        if ((calcType === 'miflin' && weight && height && age && gender) || (calcType === 'kfa' && weight && kfa && gender)) {
            const roundedResult = Math.round(result);
    
            // Update the Grundumsatz element in the first section
            grundumsatzElement.textContent = `${roundedResult} kcal`;
    
            // Update the other element with the Grundumsatz result
            const grundumsatzResultElement = document.querySelector('.wrapper-result_grundumsatz .steps_result-text');
            if (grundumsatzResultElement) {
                grundumsatzResultElement.textContent = `${roundedResult} kcal`;
            }
    
            // Set wrapper display to flex if result is greater than 0
            if (roundedResult > 0 && grundumsatzWrapper) {
                grundumsatzWrapper.style.display = 'flex';
            }
    
        } else {
            // Reset both elements to 0 kcal if inputs are incomplete
            grundumsatzElement.textContent = '0 kcal';
    
            const grundumsatzResultElement = document.querySelector('.wrapper-result_grundumsatz .steps_result-text');
            if (grundumsatzResultElement) {
                grundumsatzResultElement.textContent = '0 kcal';
            }
    
            // Set wrapper display to none if result is 0
            if (grundumsatzWrapper) {
                grundumsatzWrapper.style.display = 'none';
            }
    
        }
    }
    
    

    // New function to calculate calories burned from daily steps
    function calculateStepsCalories() {
        const stepsCalories = dailySteps * 0.04; // On average, walking burns 0.04 kcal per step


        // Only show the result if the value is greater than 0
        if (dailySteps > 0) {
            stepsWrapperResult.style.display = 'flex';
            stepsResultElement.textContent = `${Math.round(stepsCalories)} kcal`;
            altagElement.textContent = `${Math.round(stepsCalories)} kcal`; // Update Alltagsbewegung
        } else {
            stepsWrapperResult.style.display = 'none'; // Hide if steps are 0
            altagElement.textContent = '0 kcal'; // Reset Alltagsbewegung if steps are 0
        }
    }

    // Get the value from the slider handle or the input field
    function getSliderValue(wrapperClass, inputId) {
        const handleText = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);

        // Use the handle text value if available, else fall back to the input value
        const valueFromHandle = handleText ? parseFloat(handleText.textContent, 10) || 0 : 0;
        const valueFromInput = parseFloat(inputElement.value, 10) || 0;


        return valueFromHandle || valueFromInput;
    }

    // Add listeners for custom sliders
    function addSliderListeners() {
        // Observe age, height, weight, weight-KFA, and KFA sliders
        observeSliderChange('wrapper-step-range_slider', 'age-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4'); // Steps slider
    }

    function observeSliderChange(wrapperClass, inputId) {
        const handleTextElement = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);
    
        // Observe changes in slider handle text
        const observer = new MutationObserver(() => {
            const value = handleTextElement.textContent;
            if (document.activeElement !== inputElement) {
                inputElement.value = value;
            }
    
            if (inputId === 'steps-4') {
                dailySteps = parseFloat(value.replace(',', '.')) || 0;
                calculateStepsCalories();
            } else {
                calculateResult(); // Trigger result calculation when the slider handle moves
            }
        });
    
        observer.observe(handleTextElement, { childList: true });
    
        // Also listen to direct input changes
        inputElement.addEventListener('input', () => {
            handleTextElement.textContent = inputElement.value;
            if (inputId === 'steps-4') {
                dailySteps = parseFloat(inputElement.value.replace(',', '.')) || 0;
                calculateStepsCalories();
            } else {
                calculateResult();
            }
        });
    }
    

    // Initial setup
    toggleCalcType();
    addSliderListeners(); // Attach slider listeners
});




//Stelle für Änderung
let chartInstance = null; // Declare chartInstance globally


document.addEventListener('DOMContentLoaded', function () {
    // Function to hide all CTAs
    function hideAllCTAs() {
        const ctas = document.querySelectorAll('.cta_card-wrapper.cta-calculator');
        ctas.forEach(cta => {
            cta.style.display = 'none'; // Hide all CTAs
        });
    }

    // Function to get slider value from either the handle text or input field
    function getSliderValue(wrapperClass, inputId) {
        const handleText = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);
         // Use the handle text value if available, else fall back to the input value
    const valueFromHandle = handleText ? parseFloat(handleText.textContent.replace(',', '.')) || 0 : 0;
    const valueFromInput = parseFloat(inputElement.value.replace(',', '.')) || 0;

    return valueFromHandle || valueFromInput;
}

    // Function to calculate weight loss based on current weight and goal weight
    function calculateWeightLoss() {
        // Determine calculation type (Miflin or KFA)
        const calcType = document.querySelector('input[name="kfa-or-miflin"]:checked').value;

        // Fetch current weight depending on the calculation type
        const currentWeight = calcType === 'miflin'
            ? getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2')
            : getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');

        const goalWeight = parseFloat(document.querySelector('.target-weight').textContent) || 0;
        const weightLoss = currentWeight - goalWeight;

        return weightLoss > 0 ? weightLoss : 0;
    }

    // Function to show the correct CTA based on weight loss and gender
    function showCTA(gender, weightLoss) {
        // Hide all previous CTAs
        hideAllCTAs();

        let element;

        if (gender === 'frau') {
            if (weightLoss >= 1 && weightLoss <= 15) {
                element = document.querySelector('._1-15.woman');
            } else if (weightLoss >= 16 && weightLoss <= 25) {
                element = document.querySelector('._16-25.woman');
            } else if (weightLoss >= 26 && weightLoss <= 35) {
                element = document.querySelector('._26-35.woman');
            } else if (weightLoss > 35) {
                element = document.querySelector('._36-more.woman');
            }
        } else if (gender === 'mann') {
            if (weightLoss >= 1 && weightLoss <= 15) {
                element = document.querySelector('._1-15.man');
            } else if (weightLoss >= 16 && weightLoss <= 25) {
                element = document.querySelector('._16-25.man');
            } else if (weightLoss >= 26 && weightLoss <= 35) {
                element = document.querySelector('._26-35.man');
            } else if (weightLoss > 35) {
                element = document.querySelector('._36-more.man');
            }
        }

        if (element) {
            element.style.display = 'block';
        } else {
            console.log(`No matching CTA found for ${gender} with weight loss: ${weightLoss}`);
        }
    }

    // Function to display the correct CTA based on weight loss and gender
    function checkValuesAndDisplay() {
        const zielKcal = parseFloat(document.querySelector('.ziel-kcal').textContent);
        const weeks = parseFloat(document.querySelector('.weeks').textContent);
        const months = parseFloat(document.querySelector('.months').textContent);

        // Check for current weight based on the selected calculation type
        const calcType = document.querySelector('input[name="kfa-or-miflin"]:checked').value;
        const currentWeight = calcType === 'miflin'
            ? getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2')
            : getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');

        if (currentWeight <= 0) {
            hideAllCTAs(); // Hide CTA if weight is 0
            return;
        }

        const weightLoss = calculateWeightLoss();

        if (zielKcal > 1 && weeks > 1 && months > 1 && weightLoss > 1) {
            let gender = null;
            const radioButtons = document.querySelectorAll('input[name="geschlecht"]');
            radioButtons.forEach(radio => {
                if (radio.checked) {
                    gender = radio.value.toLowerCase();
                }
            });

            if (gender) {
                showCTA(gender, weightLoss);
            }
        } else {
            hideAllCTAs(); // Hide CTA if any of the key values are missing or invalid
        }
    }

    // Function to handle calculation type change and recheck inputs
    function onCalculationTypeChange() {
        console.log('Calculation type changed, checking relevant inputs.');
        // When switching between KFA and Miflin, recheck the inputs
        checkValuesAndDisplay();
    }

    // Function to set up the MutationObserver
    function observeValueChanges() {
        const targetElements = [
            document.querySelector('.ziel-kcal'),
            document.querySelector('.weeks'),
            document.querySelector('.months')
        ];

        const observer = new MutationObserver(() => {
            checkValuesAndDisplay();
        });

        targetElements.forEach(el => {
            observer.observe(el, { childList: true, subtree: true });
        });

        // Add input listener for weight and gender
        const currentWeightInput = document.getElementById('weight-2');
        const weightKfaInput = document.getElementById('weight-3-kfa');

        currentWeightInput.addEventListener('input', checkValuesAndDisplay);
        weightKfaInput.addEventListener('input', checkValuesAndDisplay);

        document.querySelectorAll('input[name="geschlecht"]').forEach(radio => {
            radio.addEventListener('change', checkValuesAndDisplay);
        });

        document.querySelectorAll('input[name="kfa-or-miflin"]').forEach(radio => {
            radio.addEventListener('change', () => {
                onCalculationTypeChange(); // Call this when the calculation type changes
            });
        });
    }

    console.log('DOM fully loaded. Starting observation.');
    observeValueChanges();
});
