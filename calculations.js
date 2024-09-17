document.addEventListener('DOMContentLoaded', function () {
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

    // Input change listeners for KFA inputs
    weightKfaInput.addEventListener('input', () => {
        weight = parseInt(weightKfaInput.value, 10) || 0;
        calculateResult();
    });

    kfaInput.addEventListener('input', () => {
        kfa = parseInt(kfaInput.value, 10) || 0;
        calculateResult();
    });

    // Input change listener for Steps input
    stepsInput.addEventListener('input', () => {
        dailySteps = parseInt(stepsInput.value.replace(/\./g, ''), 10) || 0; // Removing periods and converting to integer
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
                result = 370 + 21.6 * (weight * (1 - kfa / 100)); // KFA formula
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
        const valueFromHandle = handleText ? parseInt(handleText.textContent, 10) || 0 : 0;
        const valueFromInput = parseInt(inputElement.value, 10) || 0;


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

    // Function to observe slider changes
    function observeSliderChange(wrapperClass, inputId) {
        const handleTextElement = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);


        // Observe changes in slider handle text
        const observer = new MutationObserver(() => {
            const value = handleTextElement.textContent;
            inputElement.value = value;

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

