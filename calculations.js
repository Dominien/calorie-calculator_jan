document.addEventListener('DOMContentLoaded', function () {
    // Cross-browser event creation function
    function createNewEvent(eventName) {
        var event;
        if (typeof(Event) === 'function') {
            event = new Event(eventName, { bubbles: true });
        } else {
            event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
        }
        return event;
    }

    // Select necessary DOM elements
    const totalCaloriesElement = document.querySelector('.result-tats-chlich'); 
    const weightInput = document.getElementById('weight-2'); 
    const weightKfaInput = document.getElementById('weight-3-kfa'); 
    const grundumsatzElement = document.getElementById('grund-right'); 
    const warningMessageElement = document.querySelector('.warning-message_wrapper'); 
    const zielKalorienElement = document.querySelector('.result_zielkalorien'); 
    const zielKcalElement = document.querySelector('.span-result.ziel-kcal'); 
    const radios = document.getElementsByName('Gewichtverlust'); 
    const targetWeightElement = document.getElementById('wunschgewicht'); 
    const weeksElement = document.querySelector('.span-result.weeks'); 
    const monthsElement = document.querySelector('.span-result.months'); 
    const targetWeightResultElement = document.querySelector('.span-result.target-weight'); 
    const defizitElement = document.querySelector('.result-defizit'); 
    const fettAbnahmeElement = document.querySelector('.result-fettabhnahme'); 

    // Select gender buttons
    const womanButton = document.querySelector('.woman-button.right');
    const manButton = document.querySelector('.woman-button.man');
    const genderWarning = document.querySelector('.text-warning.gender');

    // Additional elements
    const genderInputs = document.querySelectorAll('input[name="geschlecht"]');
    const calcTypeInputs = document.querySelectorAll('input[name="kfa-or-miflin"]');
    const ageInput = document.getElementById('age-2');
    const heightInput = document.getElementById('height-2');
    const kfaInput = document.getElementById('kfa-2');
    const stepsInput = document.getElementById('steps-4'); // Steps input
    const altagElement = document.getElementById('altag-right'); // Alltagsbewegung result element
    const stepsResultElement = document.querySelector('.wrapper-steps_kcals .steps_result-text');
    const stepsWrapperResult = document.querySelector('.wrapper-steps_kcals'); // Steps kcal wrapper

    // Variables for user inputs
    let gender = '';
    let calcType = 'miflin'; // Default to 'miflin'
    let age = 0;
    let height = 0;
    let weight = 0;
    let kfa = 0; // Body Fat Percentage for KFA calculation
    let dailySteps = 0;

    // Hide steps result by default if value is 0
    if (stepsWrapperResult) stepsWrapperResult.style.display = 'none';

    // Function to hide the gender warning on selection
    function hideGenderWarning() {
        if (genderWarning) {
            genderWarning.style.display = 'none'; // Hide the warning when a gender is selected
        }
    }

    // Gender selection
    if (genderInputs.length > 0) {
        genderInputs.forEach(input => {
            input.addEventListener('change', () => {
                gender = input.value;
                hideGenderWarning();
                updateResults();
            });
        });
    }

    // Add event listeners to gender buttons if they exist
    if (womanButton) {
        womanButton.addEventListener('click', function() {
            gender = 'frau'; // Or the appropriate value
            hideGenderWarning();
            updateResults();
        });
    }
    if (manButton) {
        manButton.addEventListener('click', function() {
            gender = 'Mann'; // Or the appropriate value
            hideGenderWarning();
            updateResults();
        });
    }

    // Calculation type selection
    if (calcTypeInputs.length > 0) {
        calcTypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                calcType = input.value;
                toggleCalcType();
                updateResults();
            });
        });
    }

    // Function to toggle between Miflin and KFA input fields
    function toggleCalcType() {
        const miflinInputs = document.getElementById('input-miflin');
        const kfaInputs = document.getElementById('input-kfa');
        if (calcType === 'miflin') {
            if (miflinInputs) miflinInputs.style.display = 'block';
            if (kfaInputs) kfaInputs.style.display = 'none';
        } else {
            if (miflinInputs) miflinInputs.style.display = 'none';
            if (kfaInputs) kfaInputs.style.display = 'block';
        }
    }

    // Function to get the selected calculation method (now using calcType variable)
    function getSelectedCalculationMethod() {
        return calcType;
    }

    // Function to handle live validation on input fields
    function hideWarningOnInput(inputElement, warningElement) {
        if (!inputElement || !warningElement) return;
        var handler = function() {
            if (inputElement.value.trim() !== '' && parseFloat(inputElement.value) > 0) {
                warningElement.style.display = 'none'; // Hide the warning if the input is valid
            }
            updateResults();
        };
        inputElement.addEventListener('input', handler);
        inputElement.addEventListener('change', handler); 
    }

    // Function to handle live validation on slider changes using MutationObserver
    function hideWarningOnSliderInput(sliderElement, inputElement, warningElement) {
        if (!sliderElement || !inputElement) return;
        const handleTextElement = sliderElement.querySelector('.inside-handle-text');
        if (handleTextElement) {
            const observer = new MutationObserver(function() {
                const sliderValue = parseFloat(handleTextElement.textContent) || 0;
                inputElement.value = sliderValue;
                if (sliderValue > 0 && warningElement) {
                    warningElement.style.display = 'none'; 
                }
                const event = createNewEvent('input');
                inputElement.dispatchEvent(event);
                // Call updateResults
                updateResults();
            });
            observer.observe(handleTextElement, { childList: true, characterData: true, subtree: true });
        }
    }

    // Attach validation to inputs and sliders
    function attachValidation(inputId, sliderSelector) {
        const inputElement = document.getElementById(inputId);
        if (!inputElement) return;
        const closestWrapper = inputElement.closest('.input-wrapper-calc');
        let warningElement = null;
        if (closestWrapper) {
            warningElement = closestWrapper.querySelector('.text-warning');
        }
        hideWarningOnInput(inputElement, warningElement);
        const sliderElement = sliderSelector ? document.querySelector(sliderSelector) : null;
        if (sliderElement) {
            hideWarningOnSliderInput(sliderElement, inputElement, warningElement);
        }
    }

    // Add live validation for Wunschgewicht (since it may not have a slider)
    const wunschgewichtInput = document.getElementById('wunschgewicht');
    let wunschgewichtWarning = null;
    if (wunschgewichtInput) {
        const wunschgewichtClosestWrapper = wunschgewichtInput.closest('.input-wrapper-calc');
        if (wunschgewichtClosestWrapper) {
            wunschgewichtWarning = wunschgewichtClosestWrapper.querySelector('.text-warning');
        }
        hideWarningOnInput(wunschgewichtInput, wunschgewichtWarning);
    }

    // Function to validate inputs and show warnings if any are missing or invalid
    function validateInputs() {
        let isValid = true;

        // Validate gender selection
        if (!gender) {
            if (genderWarning) {
                genderWarning.style.display = 'block'; // Show warning if no gender is selected
            }
            isValid = false;
        } else {
            if (genderWarning) {
                genderWarning.style.display = 'none'; // Hide warning if gender is selected
            }
        }

        // Validate inputs based on calcType
        if (calcType === 'miflin') {
            if (!ageInput || ageInput.value.trim() === '' || parseFloat(ageInput.value) <= 0) {
                showWarning(ageInput);
                isValid = false;
            } else {
                hideWarning(ageInput);
            }

            if (!heightInput || heightInput.value.trim() === '' || parseFloat(heightInput.value) <= 0) {
                showWarning(heightInput);
                isValid = false;
            } else {
                hideWarning(heightInput);
            }

            if (!weightInput || weightInput.value.trim() === '' || parseFloat(weightInput.value) <= 0) {
                showWarning(weightInput);
                isValid = false;
            } else {
                hideWarning(weightInput);
            }

        } else if (calcType === 'kfa') {
            if (!weightKfaInput || weightKfaInput.value.trim() === '' || parseFloat(weightKfaInput.value) <= 0) {
                showWarning(weightKfaInput);
                isValid = false;
            } else {
                hideWarning(weightKfaInput);
            }

            if (!kfaInput || kfaInput.value.trim() === '' || parseFloat(kfaInput.value) <= 0) {
                showWarning(kfaInput);
                isValid = false;
            } else {
                hideWarning(kfaInput);
            }
        }

        // Validate Wunschgewicht (targetWeightElement)
        if (!targetWeightElement || targetWeightElement.value.trim() === '' || parseFloat(targetWeightElement.value) <= 0) {
            showWarning(targetWeightElement);
            isValid = false;
        } else {
            hideWarning(targetWeightElement);
        }

        // Validate weight loss goal selection (Abnehmziel)
        let selectedValue = null;
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                selectedValue = radios[i].value;
                break;
            }
        }
        const abnehmzielWarning = document.querySelector('.wrapper-abnehmziel .text-warning.here');
        if (!selectedValue) {
            isValid = false;
            if (abnehmzielWarning) {
                abnehmzielWarning.style.display = 'block';
            }
        } else {
            if (abnehmzielWarning) {
                abnehmzielWarning.style.display = 'none';
            }
        }

        return isValid;
    }

    function showWarning(inputElement) {
        const closestWrapper = inputElement.closest('.input-wrapper-calc');
        if (closestWrapper) {
            const warningElement = closestWrapper.querySelector('.text-warning');
            if (warningElement) {
                warningElement.style.display = 'block';
            }
        }
    }

    function hideWarning(inputElement) {
        const closestWrapper = inputElement.closest('.input-wrapper-calc');
        if (closestWrapper) {
            const warningElement = closestWrapper.querySelector('.text-warning');
            if (warningElement) {
                warningElement.style.display = 'none';
            }
        }
    }

    // Get the value from the slider handle or the input field
    function getSliderValue(wrapperSelector, inputId) {
        const handleTextElement = document.querySelector(`${wrapperSelector} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);

        // Use the handle text value if available, else fall back to the input value
        const valueFromHandle = handleTextElement ? parseFloat(handleTextElement.textContent) || 0 : 0;
        const valueFromInput = parseFloat(inputElement.value) || 0;

        return valueFromHandle || valueFromInput;
    }

    // Calculation function for BMR
    function calculateBMR() {
        // Fetch values from sliders' handle text if available
        age = getSliderValue('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-1"]', 'age-2');
        height = getSliderValue('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        weight = calcType === 'miflin' ? getSliderValue('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2') : getSliderValue('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        kfa = calcType === 'kfa' ? getSliderValue('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2') : 0;

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

        const roundedResult = Math.round(result);

        // Update Grundumsatz element
        if (grundumsatzElement) {
            grundumsatzElement.textContent = `${roundedResult} kcal`;
        }

        // Also update any other elements that display Grundumsatz
        const grundumsatzResultElement = document.querySelector('.wrapper-result_grundumsatz .steps_result-text');
        if (grundumsatzResultElement) {
            grundumsatzResultElement.textContent = `${roundedResult} kcal`;
        }

        return roundedResult;
    }

    // Function to calculate calories burned from daily steps
    function calculateStepsCalories() {
        dailySteps = getSliderValue('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4');

        const stepsCalories = dailySteps * 0.04; // On average, walking burns 0.04 kcal per step

        // Only show the result if the value is greater than 0
        if (dailySteps > 0) {
            if (stepsWrapperResult) stepsWrapperResult.style.display = 'flex';
            if (stepsResultElement) stepsResultElement.textContent = `${Math.round(stepsCalories)} kcal`;
            if (altagElement) altagElement.textContent = `${Math.round(stepsCalories)} kcal`; // Update Alltagsbewegung
        } else {
            if (stepsWrapperResult) stepsWrapperResult.style.display = 'none'; // Hide if steps are 0
            if (altagElement) altagElement.textContent = '0 kcal'; // Reset Alltagsbewegung if steps are 0
        }

        return stepsCalories;
    }

    // Unified function to handle total calorie updates and weight loss results
    function updateResults() {
        if (!validateInputs()) {
            return;
        }

        // First, calculate BMR
        const grundumsatzValue = calculateBMR();

        // Then, calculate steps calories
        const stepsCaloriesValue = calculateStepsCalories();

        // Now, get total calories (grundumsatz + steps calories)
        const totalCaloriesValue = grundumsatzValue + stepsCaloriesValue;

        // Update totalCaloriesElement
        if (totalCaloriesElement) {
            totalCaloriesElement.textContent = `${totalCaloriesValue} kcal`;
        }

        // Proceed with the rest of the calculations
        // Get current weight
        weight = calcType === 'miflin' ? parseFloat(weightInput.value) || 0 : parseFloat(weightKfaInput.value) || 0;

        // Get target weight
        const targetWeight = parseFloat(targetWeightElement && targetWeightElement.value) || 0;

        // Get selected weight loss goal
        let selectedValue = null;
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                selectedValue = radios[i].value;
                break;
            }
        }

        if (
            isNaN(totalCaloriesValue) || totalCaloriesValue <= 0 ||
            isNaN(weight) || weight <= 0 ||
            isNaN(grundumsatzValue) || grundumsatzValue <= 0 ||
            isNaN(targetWeight) || targetWeight <= 0 ||
            !selectedValue
        ) {
            if (defizitElement) defizitElement.textContent = '0';
            if (fettAbnahmeElement) fettAbnahmeElement.textContent = '0';
            if (weeksElement) weeksElement.textContent = '0';
            if (monthsElement) monthsElement.textContent = '0';
            if (targetWeightResultElement) targetWeightResultElement.textContent = '0';
            if (zielKcalElement) zielKcalElement.textContent = '0';
            if (zielKalorienElement) zielKalorienElement.textContent = '0';
            if (warningMessageElement) warningMessageElement.style.display = 'none';
            return;
        }

        // Continue with the rest of updateResults code, calculating calorie deficit, target calories, etc.
        let weeklyWeightLossPercentage = 0;
        if (selectedValue === 'Langsames Abnehmen') {
            weeklyWeightLossPercentage = 0.005;
        } else if (selectedValue === 'Moderates Abnehmen') {
            weeklyWeightLossPercentage = 0.0075;
        } else if (selectedValue === 'Schnelles Abnehmen') {
            weeklyWeightLossPercentage = 0.01;
        }

        const weeklyWeightLossKg = weight * weeklyWeightLossPercentage;
        const calorieDeficitPerDay = Math.round((weeklyWeightLossKg * 7700) / 7);
        const targetCalories = Math.max(0, totalCaloriesValue - calorieDeficitPerDay);

        if (zielKalorienElement) zielKalorienElement.textContent = targetCalories > 0 ? targetCalories : '0';
        if (zielKcalElement) zielKcalElement.textContent = targetCalories > 0 ? targetCalories : '0';

        if (warningMessageElement) {
            if (targetCalories < grundumsatzValue) {
                warningMessageElement.style.display = 'flex';
                const warningMessage = warningMessageElement.querySelector('.warning-message');
                if (warningMessage) {
                    warningMessage.textContent = 'Warnhinweis: Nicht weniger als ' + grundumsatzValue + ' kcal essen, da dies dein Grundumsatz ist.';
                }
            } else {
                warningMessageElement.style.display = 'none';
            }
        }

        if (fettAbnahmeElement) fettAbnahmeElement.textContent = weeklyWeightLossKg.toFixed(2);
        if (defizitElement) defizitElement.textContent = calorieDeficitPerDay.toString();

        const totalWeightToLose = weight - targetWeight;
        const totalCaloricDeficitNeeded = totalWeightToLose * 7700;
        const daysToReachGoal = Math.round(totalCaloricDeficitNeeded / calorieDeficitPerDay);
        const weeksToReachGoal = Math.round(daysToReachGoal / 7);
        const monthsToReachGoal = (weeksToReachGoal / 4.345).toFixed(1);

        if (weeksElement) weeksElement.textContent = weeksToReachGoal.toString();
        if (monthsElement) monthsElement.textContent = monthsToReachGoal.toString();
        if (targetWeightResultElement) targetWeightResultElement.textContent = targetWeight.toString();
    }

    // Initialize listeners
    function initializeListeners() {
        // Attach validation to inputs and sliders
        attachValidation('age-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-1"]');
        attachValidation('height-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]');
        attachValidation('weight-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]');
        attachValidation('weight-3-kfa', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]');
        attachValidation('kfa-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]');
        attachValidation('steps-4', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]');
        attachValidation('wunschgewicht', null); // Since wunschgewicht may not have a slider

        // Event listeners for weight loss goal radios
        if (radios.length > 0) {
            for (let i = 0; i < radios.length; i++) {
                radios[i].addEventListener('change', function() {
                    updateResults();

                    const abnehmzielWarning = document.querySelector('.wrapper-abnehmziel .text-warning.here');
                    if (abnehmzielWarning) {
                        abnehmzielWarning.style.display = 'none';
                    }
                });
            }
        }

        // Update results on page load
        updateResults();
    }

    // Initial setup
    toggleCalcType();
    initializeListeners();
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
        } else {
            weight = parseInt(document.getElementById('weight-3-kfa').value, 10) || 0;
        }
    }

    // Add event listener to toggle between Miflin and KFA
    const calcTypeInputs = document.querySelectorAll('input[name="kfa-or-miflin"]');
    calcTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
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
                getWeightFromGrundumsatz(); // Trigger weight fetch
                updateTotalCalories(); // Update total calories after weight change
            });

            observer.observe(handleTextElement, { childList: true });
        }

        // Add input event listener to handle manual input changes
        inputElement.addEventListener('input', () => {
            const value = parseInt(inputElement.value, 10) || 0;
            handleTextElement.textContent = value;
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


        let MET = MET_VALUES[activityType] || 0;
        if (!activityType || minutes === 0 || sessions === 0 || weight === 0 || MET === 0) {
            return 0;
        }

        // Calculate calories per minute based on the activity's MET, weight, and time
        const caloriesPerMinute = (MET * 3.5 * weight) / 200;
        const totalCalories = caloriesPerMinute * minutes * sessions;
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
        } else {
            totalCaloriesElement.style.display = 'none';
            activeCaloriesElement.textContent = '0 kcal'; // Reset active calories if total is 0
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
                updateTotalCalories();  // Update total calories for all sessions
            } else {
            }
        });

        // Input events
        minutesInput.addEventListener('input', function () {
            updateTotalCalories();  // Update total calories for all sessions
        });

        sessionsInput.addEventListener('input', function () {
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

});


document.addEventListener('DOMContentLoaded', function () {
    // Select necessary DOM elements for span results, inputs, and wrapper
    const zielKcalElement = document.querySelector('.span-result.ziel-kcal');
    const weeksElement = document.querySelector('.span-result.weeks');
    const monthsElement = document.querySelector('.span-result.months');
    const targetWeightElement = document.querySelector('.span-result.target-weight');
    const chartCanvas = document.getElementById('resultChart'); // Chart canvas element
    const wrapperCanvas = document.querySelector('.wrapper-canvas'); // Wrapper that starts hidden

    // Weight input fields
    const mifflinWeightInput = document.getElementById('weight-2'); // Mifflin input field
    const kfaWeightInput = document.getElementById('weight-3-kfa'); // KFA input field

    // Radio buttons to check which calculation method is selected
    const calcMethodMifflin = document.getElementById('miflin'); // Radio button for Mifflin method
    const calcMethodKfa = document.getElementById('kfa'); // Radio button for KFA method

    let chartInstance; // To store the chart instance for re-rendering

    // Function to make the canvas wrapper visible (when button is clicked)
    function showCanvas() {
        wrapperCanvas.style.display = 'block';
    }

    // Function to get the starting weight based on the selected calculation method
    function getStartingWeight() {
        if (calcMethodMifflin.checked) {
            return parseFloat(mifflinWeightInput.value) || 0;
        } else if (calcMethodKfa.checked) {
            return parseFloat(kfaWeightInput.value) || 0;
        }
        return 0;
    }

    // Function to get the span values
    function getResultValues() {
        const zielKcalValue = parseFloat(zielKcalElement.textContent);
        const weeksValue = parseFloat(weeksElement.textContent);
        const monthsValue = parseFloat(monthsElement.textContent);
        const targetWeightValue = parseFloat(targetWeightElement.textContent);

        const startingWeight = getStartingWeight();

        // Ensure all values and starting weight are greater than 0
        if (zielKcalValue > 0 && weeksValue > 0 && monthsValue > 0 && targetWeightValue > 0 && startingWeight > 0) {
            return { startingWeight, targetWeightValue, monthsValue };
        }
        return null;
    }

    // Function to generate 4 key points from the start date to the target date
    function generateKeyDates(numMonths) {
        const dates = [];
        let currentDate = new Date();

        // Calculate the intervals for the 4 key points (start, mid1, mid2, end)
        const interval = Math.floor(numMonths / 3);

        dates.push(currentDate.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }));
        currentDate.setMonth(currentDate.getMonth() + interval);

        dates.push(currentDate.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }));
        currentDate.setMonth(currentDate.getMonth() + interval);

        dates.push(currentDate.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }));
        currentDate.setMonth(currentDate.getMonth() + (numMonths - 2 * interval));

        // Add the final date (end date)
        dates.push(currentDate.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }));

        return dates;
    }

    // Function to generate 4 weight data points (start, mid1, mid2, target weight)
    function generateKeyWeightData(startWeight, targetWeight, months) {
        const weightData = [];
        const weightLossPerMonth = (startWeight - targetWeight) / months;

        const interval = Math.floor(months / 3);

        weightData.push(startWeight.toFixed(1));
        weightData.push((startWeight - weightLossPerMonth * interval).toFixed(1));
        weightData.push((startWeight - weightLossPerMonth * interval * 2).toFixed(1));
        weightData.push(targetWeight.toFixed(1));

        return weightData;
    }

    // Function to generate or update the chart using Chart.js
    function generateResultChart(startWeight, targetWeight, months) {
        const ctx = chartCanvas.getContext('2d');

        // If a chart already exists, destroy it before creating a new one
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create the horizontal fill gradient (90deg, starting with red on the left and green on the right)
        const gradientFill = ctx.createLinearGradient(0, 0, 400, 0);
        gradientFill.addColorStop(0, 'rgba(233, 62, 45, 0.3)');  // Light red on the left
        gradientFill.addColorStop(1, 'rgba(26, 183, 0, 0.3)');  // Light green on the right

        // Generate X-axis labels (key dates) and Y-axis data (key weights)
        const dates = generateKeyDates(months);
        const weightData = generateKeyWeightData(startWeight, targetWeight, months);

        // Dot color gradient (red to green)
        const pointColors = ['rgba(233, 62, 45, 1)', 'rgba(255, 165, 0, 1)', 'rgba(26, 183, 0, 1)', 'rgba(26, 183, 0, 1)']; // Red to green
        const pointSizes = [6, 6, 6, 6]; // Keep the size consistent across points

        // Delay chart creation slightly to ensure the canvas is fully visible
        setTimeout(() => {
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates, // Key dates (start, mid, end)
                    datasets: [{
                        data: weightData, // Weight from start to target weight
                        backgroundColor: gradientFill, // The background gradient (red to green)
                        borderColor: 'rgba(0, 150, 0, 1)', // Solid line border
                        borderWidth: 2,
                        fill: true, // Fill the area under the line
                        pointBackgroundColor: pointColors, // Red to green for points
                        pointBorderColor: '#fff',
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: 'rgba(0, 150, 0, 1)',
                        pointRadius: pointSizes, // Consistent size for points
                        pointHitRadius: 10
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false // This removes the legend
                        },
                        title: {
                            display: false // Remove the top headline
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return 'Gewicht: ' + tooltipItem.raw + ' Kg';
                                },
                                title: function(tooltipItem) {
                                    const label = tooltipItem[0].label;
                                    return label;
                                }
                            },
                            backgroundColor: 'rgba(0, 150, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                font: {
                                    size: 14
                                },
                                color: '#333'
                            },
                            ticks: {
                                color: '#333',
                                stepSize: 5 // Set the Y-axis step size
                            },
                            grid: {
                                display: true,
                                color: 'rgba(200, 200, 200, 0.2)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                font: {
                                    size: 14
                                },
                                color: '#333'
                            },
                            ticks: {
                                callback: function(value, index) {
                                    // Replace the first date with "Heute"
                                    return index === 0 ? 'Heute' : dates[index];
                                },
                                color: '#333' // Color of the X-axis labels
                            },
                            grid: {
                                display: false
                            }
                        }
                    },
                    maintainAspectRatio: false
                }
            });
        }, 100); // Delay of 100ms to ensure canvas is visible before rendering the chart
    }

    // Function to check if all values are greater than 0 and generate the chart
    function checkAndGenerateChart() {
        const resultValues = getResultValues();
        if (resultValues) {
            generateResultChart(resultValues.startingWeight, resultValues.targetWeightValue, resultValues.monthsValue);
            showCanvas(); // Show canvas only after chart is generated
        }
    }

    // Add event listener for the button (when clicked, display chart and generate it)
    const berechnenButton = document.getElementById('check-inputs'); // Assuming this is the button you mentioned
    berechnenButton.addEventListener('click', function (event) {
        event.preventDefault();
        checkAndGenerateChart(); // Generate the chart and show canvas
    });

    // Use MutationObserver to watch for changes in the text of the span elements
    const targetElements = [zielKcalElement, weeksElement, monthsElement, targetWeightElement];

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            checkAndGenerateChart(); // Call the chart generation when text content changes
        });
    });

    // Start observing changes in text content for the target elements
    targetElements.forEach(element => {
        observer.observe(element, { childList: true, subtree: true });
    });

});

