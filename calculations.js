


// We ADD Always here PLS :D // We ADD Always here PLS :D // We ADD Always here PLS :D // We ADD Always here PLS :D // We ADD Always here PLS :D // We ADD Always here PLS :D
// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D
// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D


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
    var totalCaloriesElement = document.querySelector('.result-tats-chlich'); 
    var weightInputElementMiflin = document.getElementById('weight-2'); 
    var weightInputElementKfa = document.getElementById('weight-3-kfa'); 
    var grundUmsatzElement = document.getElementById('grund-right'); 
    var warningMessageElement = document.querySelector('.warning-message_wrapper'); 
    var zielKalorienElement = document.querySelector('.result_zielkalorien'); 
    var zielKcalElement = document.querySelector('.span-result.ziel-kcal'); 
    var radios = document.getElementsByName('Gewichtverlust'); 
    var targetWeightElement = document.getElementById('wunschgewicht'); 
    var weeksElement = document.querySelector('.span-result.weeks'); 
    var monthsElement = document.querySelector('.span-result.months'); 
    var targetWeightResultElement = document.querySelector('.span-result.target-weight'); 
    var defizitElement = document.querySelector('.result-defizit'); 
    var fettAbnahmeElement = document.querySelector('.result-fettabhnahme'); 

    // Select gender buttons
    var womanButton = document.querySelector('.woman-button.right');
    var manButton = document.querySelector('.woman-button.man');
    var genderWarning = document.querySelector('.text-warning.gender');

    // Function to hide the gender warning on selection
    function hideGenderWarning() {
        if (genderWarning) {
            genderWarning.style.display = 'none'; // Hide the warning when a gender is selected
        }
    }

    // Add event listeners to gender buttons if they exist
    if (womanButton) {
        womanButton.addEventListener('click', hideGenderWarning);
    }
    if (manButton) {
        manButton.addEventListener('click', hideGenderWarning);
    }

    // Function to get the selected calculation method
    function getSelectedCalculationMethod() {
        var methodRadios = document.getElementsByName('kfa-or-miflin');
        for (var i = 0; i < methodRadios.length; i++) {
            if (methodRadios[i].checked) {
                return methodRadios[i].value;
            }
        }
        return null;
    }

    // Function to handle live validation on input fields
    function hideWarningOnInput(inputElement, warningElement) {
        if (!inputElement || !warningElement) return;
        var handler = function() {
            if (inputElement.value.trim() !== '' && parseFloat(inputElement.value) > 0) {
                warningElement.style.display = 'none'; // Hide the warning if the input is valid
            }
        };
        inputElement.addEventListener('input', handler);
        inputElement.addEventListener('change', handler); 
    }

    // Function to handle live validation on slider changes using MutationObserver
    function hideWarningOnSliderInput(sliderElement, inputElement, warningElement) {
        if (!sliderElement || !inputElement || !warningElement) return;
        var handleTextElement = sliderElement.querySelector('.inside-handle-text');
        if (handleTextElement) {
            var observer = new MutationObserver(function() {
                var sliderValue = parseFloat(handleTextElement.textContent) || 0;
                inputElement.value = sliderValue;
                if (sliderValue > 0) {
                    warningElement.style.display = 'none'; 
                }
                var event = createNewEvent('input');
                inputElement.dispatchEvent(event);
            });
            observer.observe(handleTextElement, { childList: true, characterData: true, subtree: true });
        }
    }

    // Attach validation to inputs and sliders
    function attachValidation(inputId, sliderSelector) {
        var inputElement = document.getElementById(inputId);
        if (!inputElement) return;
        var closestWrapper = inputElement.closest('.input-wrapper-calc');
        var warningElement = null;
        if (closestWrapper) {
            warningElement = closestWrapper.querySelector('.text-warning');
        }
        hideWarningOnInput(inputElement, warningElement);
        var sliderElement = document.querySelector(sliderSelector);
        if (sliderElement) {
            hideWarningOnSliderInput(sliderElement, inputElement, warningElement);
        }
    }

    // Add event listener specifically for age-2 handle text
    var ageHandleTextElement = document.getElementById('age-2_handle-text');
    var ageInputElement = document.getElementById('age-2');
    var ageWarningElement = null;
    if (ageInputElement) {
        var ageClosestWrapper = ageInputElement.closest('.input-wrapper-calc');
        if (ageClosestWrapper) {
            ageWarningElement = ageClosestWrapper.querySelector('.text-warning');
        }
    }

    if (ageHandleTextElement && ageInputElement) {
        var observer = new MutationObserver(function() {
            var sliderValue = parseFloat(ageHandleTextElement.textContent) || 0;
            ageInputElement.value = sliderValue;

            // Hide the warning if the input is valid
            if (sliderValue > 0 && ageWarningElement) {
                ageWarningElement.style.display = 'none';
            }

            var event = createNewEvent('input');
            ageInputElement.dispatchEvent(event);
        });
        observer.observe(ageHandleTextElement, { childList: true, characterData: true, subtree: true });
    }

    // Add live validation for Wunschgewicht (since it may not have a slider)
    var wunschgewichtInput = document.getElementById('wunschgewicht');
    var wunschgewichtWarning = null;
    if (wunschgewichtInput) {
        var wunschgewichtClosestWrapper = wunschgewichtInput.closest('.input-wrapper-calc');
        if (wunschgewichtClosestWrapper) {
            wunschgewichtWarning = wunschgewichtClosestWrapper.querySelector('.text-warning');
        }
        hideWarningOnInput(wunschgewichtInput, wunschgewichtWarning);
    }

    // Attach validation to inputs and sliders
    attachValidation('age-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-1"]');
    attachValidation('height-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]');
    attachValidation('weight-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]');
    attachValidation('weight-3-kfa', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]');
    attachValidation('kfa-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]');

    // Function to validate inputs and show warnings if any are missing or invalid
    function validateInputs() {
        var isValid = true;
    
        // Validate gender selection or check if one of the buttons has the 'active' class
        var selectedGender = document.querySelector('input[name="geschlecht"]:checked');
        var hasActiveClass = false;
        if (womanButton && womanButton.classList.contains('active')) {
            hasActiveClass = true;
        }
        if (manButton && manButton.classList.contains('active')) {
            hasActiveClass = true;
        }
    
        if (!selectedGender && !hasActiveClass) {
            if (genderWarning) {
                genderWarning.style.display = 'block'; // Show warning if no gender is selected and no active class
            }
            isValid = false;
        } else {
            if (genderWarning) {
                genderWarning.style.display = 'none'; // Hide warning if gender is selected or one has active class
            }
        }

        var calculationMethod = getSelectedCalculationMethod();
        // Additional input validation logic for miflin and kfa
        if (calculationMethod === 'miflin') {
            var ageInput = document.getElementById('age-2');
            var ageWarning = null;
            if (ageInput) {
                var ageClosestWrapper = ageInput.closest('.input-wrapper-calc');
                if (ageClosestWrapper) {
                    ageWarning = ageClosestWrapper.querySelector('.text-warning');
                }
            }
            if (!ageInput || ageInput.value.trim() === '' || parseFloat(ageInput.value) <= 0) {
                if (ageWarning) ageWarning.style.display = 'block';
                isValid = false;
            } else {
                if (ageWarning) ageWarning.style.display = 'none';
            }

            var heightInput = document.getElementById('height-2');
            var heightWarning = null;
            if (heightInput) {
                var heightClosestWrapper = heightInput.closest('.input-wrapper-calc');
                if (heightClosestWrapper) {
                    heightWarning = heightClosestWrapper.querySelector('.text-warning');
                }
            }
            if (!heightInput || heightInput.value.trim() === '' || parseFloat(heightInput.value) <= 0) {
                if (heightWarning) heightWarning.style.display = 'block';
                isValid = false;
            } else {
                if (heightWarning) heightWarning.style.display = 'none';
            }

            var weightWarning = null;
            if (weightInputElementMiflin) {
                var weightClosestWrapper = weightInputElementMiflin.closest('.input-wrapper-calc');
                if (weightClosestWrapper) {
                    weightWarning = weightClosestWrapper.querySelector('.text-warning');
                }
            }
            if (!weightInputElementMiflin || weightInputElementMiflin.value.trim() === '' || parseFloat(weightInputElementMiflin.value) <= 0) {
                if (weightWarning) weightWarning.style.display = 'block';
                isValid = false;
            } else {
                if (weightWarning) weightWarning.style.display = 'none';
            }
        } else if (calculationMethod === 'kfa') {
            var weightWarningKfa = null;
            if (weightInputElementKfa) {
                var weightClosestWrapperKfa = weightInputElementKfa.closest('.input-wrapper-calc');
                if (weightClosestWrapperKfa) {
                    weightWarningKfa = weightClosestWrapperKfa.querySelector('.text-warning');
                }
            }
            if (!weightInputElementKfa || weightInputElementKfa.value.trim() === '' || parseFloat(weightInputElementKfa.value) <= 0) {
                if (weightWarningKfa) weightWarningKfa.style.display = 'block';
                isValid = false;
            } else {
                if (weightWarningKfa) weightWarningKfa.style.display = 'none';
            }

            var kfaInput = document.getElementById('kfa-2');
            var kfaWarning = null;
            if (kfaInput) {
                var kfaClosestWrapper = kfaInput.closest('.input-wrapper-calc');
                if (kfaClosestWrapper) {
                    kfaWarning = kfaClosestWrapper.querySelector('.text-warning');
                }
            }
            if (!kfaInput || kfaInput.value.trim() === '' || parseFloat(kfaInput.value) <= 0) {
                if (kfaWarning) kfaWarning.style.display = 'block';
                isValid = false;
            } else {
                if (kfaWarning) kfaWarning.style.display = 'none';
            }
        }

        // Validate Wunschgewicht
        if (!wunschgewichtInput || wunschgewichtInput.value.trim() === '' || parseFloat(wunschgewichtInput.value) <= 0) {
            if (wunschgewichtWarning) wunschgewichtWarning.style.display = 'block'; 
            isValid = false;
        } else {
            if (wunschgewichtWarning) wunschgewichtWarning.style.display = 'none';
        }

        // Validate weight loss goal selection (Abnehmziel)
        var selectedValue = null;
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                selectedValue = radios[i].value;
                break;
            }
        }
        var abnehmzielWarning = document.querySelector('.wrapper-abnehmziel .text-warning.here');
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

    // Unified function to handle total calorie updates and weight loss results
    function updateResults() {
        var calculationMethod = getSelectedCalculationMethod();

        var currentWeight = 0;
        if (calculationMethod === 'miflin') {
            currentWeight = parseFloat(weightInputElementMiflin && weightInputElementMiflin.value) || 0;
        } else if (calculationMethod === 'kfa') {
            currentWeight = parseFloat(weightInputElementKfa && weightInputElementKfa.value) || 0;
        }

        var targetWeight = parseFloat(targetWeightElement && targetWeightElement.value) || 0;
        var totalCalories = totalCaloriesElement ? totalCaloriesElement.textContent : '';
        var totalCaloriesValue = parseInt(totalCalories.replace(/\D/g, '')) || 0;

        var grundUmsatzText = grundUmsatzElement ? grundUmsatzElement.textContent : '';
        var grundUmsatzValue = parseInt(grundUmsatzText.replace(/\D/g, '')) || 0;

        var selectedValue = null;
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                selectedValue = radios[i].value;
                break;
            }
        }

        if (
            isNaN(totalCaloriesValue) || totalCaloriesValue <= 0 ||
            isNaN(currentWeight) || currentWeight <= 0 ||
            isNaN(grundUmsatzValue) || grundUmsatzValue <= 0 ||
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

        var weeklyWeightLossPercentage = 0;
        if (selectedValue === 'Langsames Abnehmen') {
            weeklyWeightLossPercentage = 0.005;
        } else if (selectedValue === 'Moderates Abnehmen') {
            weeklyWeightLossPercentage = 0.0075;
        } else if (selectedValue === 'Schnelles Abnehmen') {
            weeklyWeightLossPercentage = 0.01;
        }

        var weeklyWeightLossKg = currentWeight * weeklyWeightLossPercentage;
        var calorieDeficitPerDay = Math.round((weeklyWeightLossKg * 7700) / 7);
        var targetCalories = Math.max(0, totalCaloriesValue - calorieDeficitPerDay);

        if (zielKalorienElement) zielKalorienElement.textContent = targetCalories > 0 ? targetCalories : '0';
        if (zielKcalElement) zielKcalElement.textContent = targetCalories > 0 ? targetCalories : '0'; 

        if (warningMessageElement) {
            if (targetCalories < grundUmsatzValue) {
                warningMessageElement.style.display = 'flex';
                var warningMessage = warningMessageElement.querySelector('.warning-message');
                if (warningMessage) {
                    warningMessage.textContent = 'Warnhinweis: Nicht weniger als ' + grundUmsatzValue + ' kcal essen, da dies dein Grundumsatz ist.';
                }
            } else {
                warningMessageElement.style.display = 'none';
            }
        }

        if (fettAbnahmeElement) fettAbnahmeElement.textContent = weeklyWeightLossKg.toFixed(2); 
        if (defizitElement) defizitElement.textContent = calorieDeficitPerDay.toString(); 

        var totalWeightToLose = currentWeight - targetWeight;
        var totalCaloricDeficitNeeded = totalWeightToLose * 7700;
        var daysToReachGoal = Math.round(totalCaloricDeficitNeeded / calorieDeficitPerDay);
        var weeksToReachGoal = Math.round(daysToReachGoal / 7);
        var monthsToReachGoal = (weeksToReachGoal / 4.345).toFixed(1);

        if (weeksElement) weeksElement.textContent = weeksToReachGoal.toString();
        if (monthsElement) monthsElement.textContent = monthsToReachGoal.toString();
        if (targetWeightResultElement) targetWeightResultElement.textContent = targetWeight.toString();
    }

    // Function to initialize event listeners
    function initializeListeners() {
        if (totalCaloriesElement) {
            var observer = new MutationObserver(updateResults);
            observer.observe(totalCaloriesElement, { childList: true, subtree: true });
        }

        if (radios.length > 0) {
            for (var i = 0; i < radios.length; i++) {
                radios[i].addEventListener('change', function() {
                    updateResults();

                    var abnehmzielWarning = document.querySelector('.wrapper-abnehmziel .text-warning.here');
                    if (abnehmzielWarning) {
                        abnehmzielWarning.style.display = 'none';
                    }
                });
            }
        }

        var methodRadios = document.getElementsByName('kfa-or-miflin');
        if (methodRadios.length > 0) {
            for (var i = 0; i < methodRadios.length; i++) {
                methodRadios[i].addEventListener('change', function() {
                    updateResults();
                });
            }
        }

        var berechnenButton = document.getElementById('check-inputs');
        if (berechnenButton) {
            berechnenButton.addEventListener('click', function (event) {
                event.preventDefault();
                if (validateInputs()) {
                    updateResults();
                }
            });
        }

        updateResults();
    }

    initializeListeners();
});

