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
        'Krafttraining': 14.28,  // Updated MET value for Krafttraining
        'cardio-liss': 6.66,
        'cardio-hiit': 9.52
    };

    let weight = 0;

    // Function to dynamically fetch the correct weight based on the selected calculation type (Miflin or KFA)
    function getWeightFromGrundumsatz() {
        const calcType = document.querySelector('input[name="kfa-or-miflin"]:checked').value;
        if (calcType === 'miflin') {
            weight = parseInt(document.getElementById('weight-2').value, 10) || 0;
            console.log(`Weight (Miflin) used for calculation: ${weight}`);
        } else {
            weight = parseInt(document.getElementById('weight-3-kfa').value, 10) || 0;
            console.log(`Weight (KFA) used for calculation: ${weight}`);
        }
    }

    // Add event listener to toggle between Miflin and KFA
    const calcTypeInputs = document.querySelectorAll('input[name="kfa-or-miflin"]');
    calcTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            console.log(`Calculation type changed to: ${input.value}`);
            getWeightFromGrundumsatz();
            updateTotalCalories(); // Recalculate after changing the weight source
        });
    });

    // Function to observe changes in sliders and input fields
    function observeWeightInputChange(wrapperClass, inputId) {
        const handleTextElement = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);

        // Observe changes in slider handle text
        if (handleTextElement) {
            const observer = new MutationObserver(() => {
                const value = parseInt(handleTextElement.textContent, 10) || 0;
                inputElement.value = value;
                console.log(`Observed slider change: ${value} for ${inputId}`);
                getWeightFromGrundumsatz(); // Trigger weight fetch
                updateTotalCalories(); // Update total calories after weight change
            });

            observer.observe(handleTextElement, { childList: true });
        }

        // Add input event listener to handle manual input changes
        inputElement.addEventListener('input', () => {
            const value = parseInt(inputElement.value, 10) || 0;
            handleTextElement.textContent = value;
            console.log(`Manual input change: ${value} for ${inputId}`);
            getWeightFromGrundumsatz();
            updateTotalCalories();
        });
    }

    // Attach the observer to weight sliders and inputs
    observeWeightInputChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');  // Miflin weight slider
    observeWeightInputChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');  // KFA weight slider

    // Function to calculate calories for each training session
    function calculateTrainingCalories(activityType, minutesInputId, sessionsInputId) {
        const minutesInput = document.getElementById(minutesInputId);
        const sessionsInput = document.getElementById(sessionsInputId);

        let minutes = parseInt(minutesInput.value, 10) || 0;
        let sessions = parseInt(sessionsInput.value, 10) || 0;

        console.log(`Activity Type Selected: ${activityType}`);  // Correct activity displayed

        let MET = MET_VALUES[activityType] || 0;
        if (!activityType || minutes === 0 || sessions === 0 || weight === 0 || MET === 0) {
            console.log(`Missing input for calculation - Activity: ${activityType}, Minutes: ${minutes}, Sessions: ${sessions}, Weight: ${weight}, MET: ${MET}`);
            return 0;
        }

        // Calculate calories per minute based on the activity's MET, weight, and time
        const caloriesPerMinute = (MET * 3.5 * weight) / 200;
        const totalCalories = caloriesPerMinute * minutes * sessions;
        console.log(`Calories for ${activityType}: ${totalCalories}`);
        return Math.round(totalCalories);
    }

    // Function to update the total calories for all sessions
    function updateTotalCalories() {
        getWeightFromGrundumsatz(); // Ensure weight is fetched each time a change is made
    
        const totalCaloriesSession1 = calculateTrainingCalories($('#drop-down-1').val(), 'training-minuten', 'training-woche');
        const totalCaloriesSession2 = calculateTrainingCalories($('#drop-down-2').val(), 'training-minuten-2', 'training-woche-2');
        const totalCaloriesSession3 = calculateTrainingCalories($('#drop-down-3').val(), 'training-minuten-3', 'training-woche-3');
    
        const totalCalories = totalCaloriesSession1 + totalCaloriesSession2 + totalCaloriesSession3;
    
        const totalCaloriesElement = document.getElementById('total-calories');
        const activeCaloriesElement = document.getElementById('active-right'); 
    
        if (totalCalories > 0) {
            const dailyCalories = Math.round(totalCalories / 7); // Divide by 7 to get daily calories
    
            totalCaloriesElement.textContent = `${dailyCalories} kcal`; // Update with daily calories
            activeCaloriesElement.textContent = `${dailyCalories} kcal`; // Update with daily calories in active-right
    
            totalCaloriesElement.style.display = 'flex';
            console.log(`Daily calories: ${dailyCalories} kcal`);
        } else {
            totalCaloriesElement.style.display = 'none';
            activeCaloriesElement.textContent = '0 kcal'; // Reset active calories if total is 0
            console.log(`Total calories: ${totalCalories} kcal (hidden)`);
        }
    }
    

    // Function to set up training sessions
    function setupTrainingSession(dropdownId, minutesInputId, sessionsInputId) {
        const activityDropdown = $(`#${dropdownId}`);
        const minutesInput = document.getElementById(minutesInputId);
        const sessionsInput = document.getElementById(sessionsInputId);

        // Remove any previous event listeners to avoid multiple triggers
        activityDropdown.off('change');

        // Event for detecting dropdown changes
        activityDropdown.on('change', function () {
            const selectedActivity = $(this).val();  // Capture the value on change
            if (selectedActivity) {  // Check if the selected activity is valid
                console.log(`Dropdown changed: ${selectedActivity}`);
                updateTotalCalories();  // Update total calories for all sessions
            } else {
                console.log('No valid activity selected.');
            }
        });

        // Input events
        minutesInput.addEventListener('input', function () {
            console.log(`Minutes input for ${minutesInputId}: ${minutesInput.value}`);
            updateTotalCalories();  // Update total calories for all sessions
        });

        sessionsInput.addEventListener('input', function () {
            console.log(`Sessions input for ${sessionsInputId}: ${sessionsInput.value}`);
            updateTotalCalories();  // Update total calories for all sessions
        });
    }

    // Initialize nice-select and training sessions
    $(document).ready(function () {
        $('select').niceSelect();  // Initialize nice-select for all select elements
        setupTrainingSession('drop-down-1', 'training-minuten', 'training-woche');
        setupTrainingSession('drop-down-2', 'training-minuten-2', 'training-woche-2');
        setupTrainingSession('drop-down-3', 'training-minuten-3', 'training-woche-3');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Select necessary DOM elements
    const grundumsatzElement = document.getElementById('grund-right');
    const alltagsbewegungElement = document.getElementById('altag-right');
    const aktivesTrainingElement = document.getElementById('active-right');
    const totalCaloriesElement = document.querySelector('.result-tats-chlich');
    const nahrungsverbrennungElement = document.getElementById('nahrungsburn');

    const fallbackCalories = 1280; // Fallback if no Grundumsatz is provided yet

    // Function to update the total actual calorie burn
    function updateActualCalories() {
        const grundumsatz = parseInt(grundumsatzElement.textContent, 10) || 0;
        const alltagsbewegung = parseInt(alltagsbewegungElement.textContent, 10) || 0;
        const aktivesTraining = parseInt(aktivesTrainingElement.textContent, 10) || 0;

        // If Grundumsatz is available, use it; otherwise, use fallback (1280 kcal)
        const baseCalories = grundumsatz || fallbackCalories;

        const totalCalories = baseCalories + alltagsbewegung + aktivesTraining;
        totalCaloriesElement.textContent = `${totalCalories}`;

        calculateNahrungsverbrennung(totalCalories);
    }

    // Function to calculate Nahrungsverbrennung
    function calculateNahrungsverbrennung(totalCalories) {
        const nahrungsverbrennung = totalCalories * 0.08; // 8% of total calories
        nahrungsverbrennungElement.textContent = `${Math.round(nahrungsverbrennung)} kcal`;
    }

    // Set initial value of totalCaloriesElement to the fallback value (1280 kcal) on page load
    totalCaloriesElement.textContent = `${fallbackCalories}`;

    // Add listeners to the text fields for changes
    [grundumsatzElement, alltagsbewegungElement, aktivesTrainingElement].forEach(element => {
        const observer = new MutationObserver(updateActualCalories);
        observer.observe(element, { childList: true, subtree: true }); // Observe changes to the text content
    });

    console.log('Listeners for Grundumsatz, Alltagsbewegung, and Aktives Training added successfully.');
});




// Weight loss Options HERE ALL SCRIPTS MADE by Marco.P :D
// Select necessary DOM elements
const totalCaloriesElement = document.querySelector('.result-tats-chlich');
const weightInputElement = document.getElementById('weight-2'); // Assuming weight comes from here
const grundUmsatzElement = document.getElementById('grund-right'); // BMR element
const warningMessageElement = document.querySelector('.warning-message_wrapper');
const zielKalorienElement = document.querySelector('.result_zielkalorien'); // Zielkalorien element

// Function to handle the display logic
function updateResults() {
    // Get the 'Tatsächlicher Kalorienverbrauch' value and extract the number
    const totalCalories = totalCaloriesElement.textContent;
    const totalCaloriesValue = parseInt(totalCalories.replace(/\D/g, '')); // Extract only the numeric part

    // Get the user's weight from input
    const weight = parseInt(weightInputElement.value);

    // Get BMR (Grundumsatz) value
    const grundUmsatzText = grundUmsatzElement.textContent;
    const grundUmsatzValue = parseInt(grundUmsatzText.replace(/\D/g, '')); // Extract only the numeric part

    // Get the selected radio button value for weight loss speed
    const radios = document.getElementsByName('Gewichtverlust');
    let selectedValue = null;
    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }

    // Only proceed if a weight loss option is selected
    if (!selectedValue) {
        console.log("No weight loss option selected.");
        return;
    }

    // Calculate weekly weight loss percentage based on selection
    let weeklyWeightLossPercentage = 0;
    if (selectedValue === 'Langsames Abnehmen') {
        weeklyWeightLossPercentage = 0.005;
    } else if (selectedValue === 'Moderates Abnehmen') {
        weeklyWeightLossPercentage = 0.0075;
    } else if (selectedValue === 'Schnelles Abnehmen') {
        weeklyWeightLossPercentage = 0.01;
    }

    // Only display the results if 'Tatsächlicher Kalorienverbrauch' is greater than 0
    if (totalCaloriesValue > 0) {
        const weeklyWeightLossKg = weight * weeklyWeightLossPercentage;
        const calorieDeficitPerDay = Math.round((weeklyWeightLossKg * 7700) / 7);
        const targetCalories = totalCaloriesValue - calorieDeficitPerDay;

        // Update Zielkalorien element
        zielKalorienElement.textContent = targetCalories > 0 ? targetCalories : 0; // Show 0 if targetCalories is negative

        // Check if target calories fall below BMR
        if (targetCalories < grundUmsatzValue) {
            // Show the warning message if target calories are less than BMR
            warningMessageElement.style.display = 'flex'; // Show warning box
            warningMessageElement.querySelector('.warning-message').textContent = `Warnhinweis: Das angestrebte Gewichtsverlustziel könnte möglicherweise nicht erreichbar sein, ohne deine Gesundheit zu riskieren. Wir empfehlen dir, nicht weniger als ${grundUmsatzValue} kcal zu essen, da dies dein Grundumsatz ist.`;
        } else {
            warningMessageElement.style.display = 'none'; // Hide warning box if safe
        }

        // Update calorie deficit and fat loss results
        document.querySelector('.result-defizit').textContent = calorieDeficitPerDay;
        document.querySelector('.result-fettabhnahme').textContent = weeklyWeightLossKg.toFixed(2);
    } else {
        // Hide results if 'Tatsächlicher Kalorienverbrauch' is not greater than 0
        document.querySelector('.result-defizit').textContent = 0;
        document.querySelector('.result-fettabhnahme').textContent = 0;
        warningMessageElement.style.display = 'none'; // Hide warning box if no valid data
        zielKalorienElement.textContent = 0; // Set Zielkalorien to 0 if no valid data
    }
}

// Event listener for changes in 'Tatsächlicher Kalorienverbrauch' (result-tats-chlich)
const observer = new MutationObserver(updateResults);

// Observe changes in the total calories burned element
observer.observe(totalCaloriesElement, { childList: true, subtree: true });

// Add event listeners to radio buttons to trigger recalculation when a weight loss option is selected
const radios = document.getElementsByName('Gewichtverlust');
for (const radio of radios) {
    radio.addEventListener('change', updateResults);
}

// Initial check when the page loads
updateResults();


// Biggest Part HERE ALL SCRIPTS MADE by Marco.P :D
document.addEventListener('DOMContentLoaded', function () {
    // Select necessary DOM elements
    const totalCaloriesElement = document.querySelector('.result-tats-chlich'); // Declared once at the top
    const weightInputElement = document.getElementById('weight-2'); // Assuming weight comes from here
    const targetWeightElement = document.getElementById('wunschgewicht'); // Wunschgewicht input
    const grundUmsatzElement = document.getElementById('grund-right'); // BMR element
    const warningMessageElement = document.querySelector('.warning-message_wrapper');
    const zielKalorienElement = document.querySelector('.result_zielkalorien'); // Zielkalorien element
    const weeksElement = document.querySelector('.span-result.weeks'); // Weeks to reach goal
    const monthsElement = document.querySelector('.span-result.months'); // Months to reach goal
    const targetWeightResultElement = document.querySelector('.span-result.target-weight'); // Target weight

// Function to validate inputs and show warnings if any are missing or invalid
function validateInputs() {
    let isValid = true; // Track if all inputs are valid

    // Wunschgewicht Validation
    const wunschgewichtInput = document.getElementById('wunschgewicht');
    const wunschgewichtWarning = wunschgewichtInput.closest('.input-wrapper-calc').querySelector('.text-warning');
    if (wunschgewichtInput.value.trim() === '' || parseInt(wunschgewichtInput.value) <= 0) {
        wunschgewichtWarning.style.display = 'block'; // Show warning if empty or less than or equal to 0
        isValid = false;
    } else {
        wunschgewichtWarning.style.display = 'none'; // Hide warning if valid
    }

    // Weight Loss Option Validation
    const abnehmzielRadios = document.getElementsByName('Gewichtverlust');
    const abnehmzielWarning = document.querySelector('.text-warning.here');
    let abnehmzielSelected = false;
    for (const radio of abnehmzielRadios) {
        if (radio.checked) {
            abnehmzielSelected = true;
            break;
        }
    }
    if (!abnehmzielSelected) {
        abnehmzielWarning.style.display = 'block'; // Show warning if no option is selected
        isValid = false;
    } else {
        abnehmzielWarning.style.display = 'none'; // Hide warning if valid
    }

    // Age Validation
    const ageInput = document.getElementById('age-2');
    const ageWarning = ageInput.closest('.input-wrapper-calc').querySelector('.text-warning');
    if (ageInput.value.trim() === '' || parseInt(ageInput.value) <= 0) {
        ageWarning.style.display = 'block'; // Show warning if empty or less than or equal to 0
        isValid = false;
    } else {
        ageWarning.style.display = 'none'; // Hide warning if valid
    }

    // Height Validation
    const heightInput = document.getElementById('height-2');
    const heightWarning = heightInput.closest('.input-wrapper-calc').querySelector('.text-warning');
    if (heightInput.value.trim() === '' || parseInt(heightInput.value) <= 0) {
        heightWarning.style.display = 'block'; // Show warning if empty or less than or equal to 0
        isValid = false;
    } else {
        heightWarning.style.display = 'none'; // Hide warning if valid
    }

    // Weight Validation
    const weightInput = document.getElementById('weight-2');
    const weightWarning = weightInput.closest('.input-wrapper-calc').querySelector('.text-warning');
    if (weightInput.value.trim() === '' || parseInt(weightInput.value) <= 0) {
        weightWarning.style.display = 'block'; // Show warning if empty or less than or equal to 0
        isValid = false;
    } else {
        weightWarning.style.display = 'none'; // Hide warning if valid
    }

    return isValid;
}

    // Function to handle the calculation and validation when the "Berechnen" button is clicked
    function handleCalculation(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Check if all inputs are valid
        if (validateInputs()) {
            // Proceed with calculations if inputs are valid
            updateResults();
        }
    }

    function updateResults() {
        // Get the 'Tatsächlicher Kalorienverbrauch' value and extract the number
        const totalCalories = totalCaloriesElement.textContent;
        const totalCaloriesValue = parseInt(totalCalories.replace(/\D/g, '')); // Extract only the numeric part
    
        // Get the user's current weight from input
        const currentWeight = parseInt(weightInputElement.value);
    
        // Get the user's target weight (Wunschgewicht)
        const targetWeight = parseInt(targetWeightElement.value);
    
        // Get BMR (Grundumsatz) value
        const grundUmsatzText = grundUmsatzElement.textContent;
        const grundUmsatzValue = parseInt(grundUmsatzText.replace(/\D/g, '')); // Extract only the numeric part
    
        // Get the selected radio button value for weight loss speed
        const radios = document.getElementsByName('Gewichtverlust');
        let selectedValue = null;
        for (const radio of radios) {
            if (radio.checked) {
                selectedValue = radio.value;
                break;
            }
        }
    
        // Only proceed if a weight loss option is selected
        if (!selectedValue) {
            console.log("No weight loss option selected.");
            return;
        }
    
        // Calculate weekly weight loss percentage based on selection
        let weeklyWeightLossPercentage = 0;
        if (selectedValue === 'Langsames Abnehmen') {
            weeklyWeightLossPercentage = 0.005;
        } else if (selectedValue === 'Moderates Abnehmen') {
            weeklyWeightLossPercentage = 0.0075;
        } else if (selectedValue === 'Schnelles Abnehmen') {
            weeklyWeightLossPercentage = 0.01;
        }
    
        // Only display the results if 'Tatsächlicher Kalorienverbrauch' is greater than 0
        if (totalCaloriesValue > 0 && targetWeight > 0 && currentWeight > 0) {
            const weeklyWeightLossKg = currentWeight * weeklyWeightLossPercentage;
            const calorieDeficitPerDay = Math.round((weeklyWeightLossKg * 7700) / 7);
            const targetCalories = totalCaloriesValue - calorieDeficitPerDay;
    
            // Check if target calories fall below BMR
            if (targetCalories < grundUmsatzValue) {
                // Show the warning message if target calories are less than BMR
                warningMessageElement.style.display = 'block'; // Show warning box
                warningMessageElement.querySelector('.warning-message').textContent = `Warnhinweis: Das angestrebte Gewichtsverlustziel könnte möglicherweise nicht erreichbar sein, ohne deine Gesundheit zu riskieren. Wir empfehlen dir, nicht weniger als ${grundUmsatzValue} kcal zu essen, da dies dein Grundumsatz ist.`;
            } else {
                warningMessageElement.style.display = 'none'; // Hide warning box if safe
            }
    
            // Update Zielkalorien element
            zielKalorienElement.textContent = targetCalories > 0 ? targetCalories : 0; // Show 0 if targetCalories is negative
    
            // Calculate the weight loss timeline
            const totalWeightToLose = currentWeight - targetWeight; // Weight to lose
            const totalCaloricDeficitNeeded = totalWeightToLose * 7700; // Total caloric deficit to lose the weight
    
            // Days, weeks, and months to reach the goal
            const daysToReachGoal = Math.round(totalCaloricDeficitNeeded / calorieDeficitPerDay);
            const weeksToReachGoal = Math.round(daysToReachGoal / 7);
            const monthsToReachGoal = (weeksToReachGoal / 4.345).toFixed(1); // Convert weeks to months
    
            // Update the HTML content for weeks, months, and target weight
            document.querySelector('.ziel-kcal').textContent = targetCalories > 0 ? targetCalories : 0; // Update Zielkalorien in the result text
            weeksElement.textContent = weeksToReachGoal;
            monthsElement.textContent = monthsToReachGoal;
            targetWeightResultElement.textContent = targetWeight;
        } else {
            // Reset or hide results if any values are missing or invalid
            document.querySelector('.result-defizit').textContent = 0;
            document.querySelector('.result-fettabhnahme').textContent = 0;
            warningMessageElement.style.display = 'none'; // Hide warning box if no valid data
            zielKalorienElement.textContent = 0; // Set Zielkalorien to 0 if no valid data
            weeksElement.textContent = 0;
            monthsElement.textContent = 0;
            targetWeightResultElement.textContent = 0;
        }
    }

    // Event listener for changes in 'Tatsächlicher Kalorienverbrauch' (result-tats-chlich)
    const observer = new MutationObserver(updateResults);

    // Observe changes in the total calories burned element
    observer.observe(totalCaloriesElement, { childList: true, subtree: true });

    // Add event listeners to radio buttons to trigger recalculation when a weight loss option is selected
    const radios = document.getElementsByName('Gewichtverlust');
    for (const radio of radios) {
        radio.addEventListener('change', updateResults);
    }

    // Add event listener to the "Berechnen" button
    const berechnenButton = document.getElementById('check-inputs');
    berechnenButton.addEventListener('click', handleCalculation);

    // Initial check when the page loads
    updateResults();
});
