document.addEventListener('DOMContentLoaded', function () {
    // Select necessary DOM elements
    console.log('DOM fully loaded and parsed.');

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

    console.log('Elements selected, initial setup complete.');

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

    // Input change listener for Steps input
    stepsInput.addEventListener('input', () => {
        dailySteps = parseInt(stepsInput.value.replace(/\./g, ''), 10) || 0; // Removing periods and converting to integer
        console.log(`Daily steps input: ${dailySteps}`);
        calculateStepsCalories();
    });

    // Function to toggle between Miflin and KFA input fields
    function toggleCalcType() {
        const miflinInputs = document.getElementById('input-miflin');
        const kfaInputs = document.getElementById('input-kfa');
        if (calcType === 'miflin') {
            miflinInputs.style.display = 'block';
            kfaInputs.style.display = 'none';
            console.log('Switched to Miflin inputs.');
        } else {
            miflinInputs.style.display = 'none';
            kfaInputs.style.display = 'block';
            console.log('Switched to KFA inputs.');
        }
    }

    // Calculation function for BMR
    function calculateResult() {
        console.log('Calculating BMR...');
        // Fetch values from sliders' handle text if available
        age = getSliderValue('wrapper-step-range_slider', 'age-2');
        height = getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        weight = calcType === 'miflin' ? getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2') : getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        kfa = calcType === 'kfa' ? getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2') : 0;
    
        console.log(`Values: Age = ${age}, Height = ${height}, Weight = ${weight}, KFA = ${kfa}`);
    
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
                result = 370 + 21.6 * (weight * (1 - kfa / 100)); // KFA formula
            }
        }
    
        console.log(`BMR Result: ${result}`);
    
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
    
            console.log(`Displayed Grundumsatz: ${roundedResult} kcal`);
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
    
            console.log('Incomplete inputs, Grundumsatz set to 0 kcal');
        }
    }
    
    

    // New function to calculate calories burned from daily steps
    function calculateStepsCalories() {
        console.log('Calculating calories from daily steps...');
        const stepsCalories = dailySteps * 0.04; // On average, walking burns 0.04 kcal per step

        console.log(`Steps Calories: ${stepsCalories}`);

        // Only show the result if the value is greater than 0
        if (dailySteps > 0) {
            stepsWrapperResult.style.display = 'flex';
            stepsResultElement.textContent = `${Math.round(stepsCalories)} kcal`;
            altagElement.textContent = `${Math.round(stepsCalories)} kcal`; // Update Alltagsbewegung
            console.log(`Displayed Steps Calories: ${Math.round(stepsCalories)} kcal`);
        } else {
            stepsWrapperResult.style.display = 'none'; // Hide if steps are 0
            altagElement.textContent = '0 kcal'; // Reset Alltagsbewegung if steps are 0
            console.log('No steps input, Steps result set to 0 kcal');
        }
    }

    // Get the value from the slider handle or the input field
    function getSliderValue(wrapperClass, inputId) {
        const handleText = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);

        // Use the handle text value if available, else fall back to the input value
        const valueFromHandle = handleText ? parseInt(handleText.textContent, 10) || 0 : 0;
        const valueFromInput = parseInt(inputElement.value, 10) || 0;

        console.log(`Slider Value: ${valueFromHandle || valueFromInput} for ${inputId}`);

        return valueFromHandle || valueFromInput;
    }

    // Add listeners for custom sliders
    function addSliderListeners() {
        console.log('Adding slider listeners...');
        // Observe age, height, weight, weight-KFA, and KFA sliders
        observeSliderChange('wrapper-step-range_slider', 'age-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4'); // Steps slider
    }

    // Function to observe slider changes
    function observeSliderChange(wrapperClass, inputId) {
        const handleTextElement = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);

        console.log(`Observing changes for: ${inputId}`);

        // Observe changes in slider handle text
        const observer = new MutationObserver(() => {
            const value = handleTextElement.textContent;
            inputElement.value = value;
            console.log(`Observed slider change: ${value} for ${inputId}`);

            if (inputId === 'steps-4') {
                dailySteps = parseInt(value, 10);
                calculateStepsCalories();
            } else {
                calculateResult(); // Trigger result calculation when the slider handle moves
            }
        });

        observer.observe(handleTextElement, { childList: true });

        // Also listen to direct input changes
        inputElement.addEventListener('input', () => {
            handleTextElement.textContent = inputElement.value;
            console.log(`Direct input change: ${inputElement.value} for ${inputId}`);
            if (inputId === 'steps-4') {
                dailySteps = parseInt(inputElement.value, 10);
                calculateStepsCalories();
            } else {
                calculateResult();
            }
        });
    }

    // Initial setup
    toggleCalcType();
    addSliderListeners(); // Attach slider listeners
    console.log('Initial setup complete.');
});



document.addEventListener('DOMContentLoaded', function () {
    const MET_VALUES = {
        'Krafttraining': 6,
        'cardio (LISS)': 7,
        'cardio (HIIT)': 9
    };

    let weight = 0;  // This will be dynamically fetched from the Grundumsatz section.

    // Function to fetch weight from the Grundumsatz section
    function getWeightFromGrundumsatz() {
        const calcType = document.querySelector('input[name="kfa-or-miflin"]:checked').value;
        if (calcType === 'miflin') {
            weight = parseInt(document.getElementById('weight-2').value, 10) || 0;
        } else {
            weight = parseInt(document.getElementById('weight-3-kfa').value, 10) || 0;
        }
        console.log(`Weight used for calculation: ${weight}`);
    }

    // Function to calculate calories for each training session
    function calculateTrainingCalories(dropdownId, minutesInputId, sessionsInputId) {
        const activityDropdown = document.querySelector(`#${dropdownId} .current`);
        const minutesInput = document.getElementById(minutesInputId);
        const sessionsInput = document.getElementById(sessionsInputId);

        let activityType = activityDropdown ? activityDropdown.textContent.trim() : '';
        let minutes = parseInt(minutesInput.value, 10) || 0;
        let sessions = parseInt(sessionsInput.value, 10) || 0;

        // Get MET value based on the selected activity
        let MET = MET_VALUES[activityType] || 0;
        if (!activityType || minutes === 0 || sessions === 0 || weight === 0 || MET === 0) {
            return 0;
        }

        const caloriesPerMinute = (MET * 3.5 * weight) / 200;
        const totalCalories = caloriesPerMinute * minutes * sessions;
        return Math.round(totalCalories);
    }

    // Function to update the total calories for all sessions
    function updateTotalCalories() {
        const totalCalories = 
            calculateTrainingCalories('drop-down-1', 'training-minuten', 'training-woche') +
            calculateTrainingCalories('drop-down-2', 'training-minuten-2', 'training-woche-2') +
            calculateTrainingCalories('drop-down-3', 'training-minuten-3', 'training-woche-3');

        const totalCaloriesElement = document.getElementById('total-calories');

        if (totalCalories > 0) {
            totalCaloriesElement.textContent = `${totalCalories} kcal`;
            totalCaloriesElement.style.display = 'flex';  // Show the element when calories > 0
        } else {
            totalCaloriesElement.style.display = 'none';  // Hide the element when calories are 0
        }
    }

    // Add event listeners for each training session
    function setupTrainingSession(dropdownId, minutesInputId, sessionsInputId) {
        const activityDropdown = document.querySelector(`#${dropdownId}`);
        const minutesInput = document.getElementById(minutesInputId);
        const sessionsInput = document.getElementById(sessionsInputId);

        activityDropdown.addEventListener('click', function () {
            setTimeout(updateTotalCalories, 100);
        });

        minutesInput.addEventListener('input', function () {
            updateTotalCalories();
        });

        sessionsInput.addEventListener('input', function () {
            updateTotalCalories();
        });
    }

    // Initialize training sessions
    getWeightFromGrundumsatz();
    setupTrainingSession('drop-down-1', 'training-minuten', 'training-woche');
    setupTrainingSession('drop-down-2', 'training-minuten-2', 'training-woche-2');
    setupTrainingSession('drop-down-3', 'training-minuten-3', 'training-woche-3');
});

