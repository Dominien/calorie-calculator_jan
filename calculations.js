document.addEventListener('DOMContentLoaded', function () {
    // Cache frequently used DOM elements
    const genderInputs = document.querySelectorAll('input[name="geschlecht"]');
    const calcTypeInputs = document.querySelectorAll('input[name="kfa-or-miflin"]');
    const ageInput = document.getElementById('age-2');
    const heightInput = document.getElementById('height-2');
    const weightInput = document.getElementById('weight-2');
    const weightKfaInput = document.getElementById('weight-3-kfa');
    const kfaInput = document.getElementById('kfa-2');
    const stepsInput = document.getElementById('steps-4');
    const grundumsatzElement = document.getElementById('grund-right');
    const altagElement = document.getElementById('altag-right');
    const stepsResultElement = document.querySelector('.wrapper-steps_kcals .steps_result-text');
    const stepsWrapperResult = document.querySelector('.wrapper-steps_kcals');

    let gender = '';
    let calcType = 'miflin'; // Default calculation type
    let age = 0, height = 0, weight = 0, kfa = 0, dailySteps = 0;

    // Hide steps result by default if value is 0
    stepsWrapperResult.style.display = 'none';

    // Utility function for debouncing
    const debounce = (fn, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    };

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

    // Input change listeners for Miflin inputs with debouncing
    ageInput.addEventListener('input', debounce(() => {
        age = parseInt(ageInput.value, 10) || 0;
        calculateResult();
    }, 300));

    heightInput.addEventListener('input', debounce(() => {
        height = parseInt(heightInput.value, 10) || 0;
        calculateResult();
    }, 300));

    weightInput.addEventListener('input', debounce(() => {
        weight = parseInt(weightInput.value, 10) || 0;
        calculateResult();
    }, 300));

    // Input change listeners for KFA inputs with debouncing
    weightKfaInput.addEventListener('input', debounce(() => {
        weight = parseInt(weightKfaInput.value, 10) || 0;
        calculateResult();
    }, 300));

    kfaInput.addEventListener('input', debounce(() => {
        kfa = parseInt(kfaInput.value, 10) || 0;
        calculateResult();
    }, 300));

    // Input change listener for Steps input with debouncing
    stepsInput.addEventListener('input', debounce(() => {
        dailySteps = parseInt(stepsInput.value.replace(/\./g, ''), 10) || 0;
        calculateStepsCalories();
    }, 300));

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

    // Function to calculate BMR based on selected calculation type and input values
    function calculateResult() {
        age = getSliderValue('wrapper-step-range_slider', 'age-2');
        height = getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        weight = calcType === 'miflin' ? getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2') : getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        kfa = calcType === 'kfa' ? getSliderValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2') : 0;

        let result = 0;
        if (calcType === 'miflin') {
            result = gender === 'Mann' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
        } else if (calcType === 'kfa' && weight > 0 && kfa > 0) {
            result = 370 + 21.6 * (weight * (1 - kfa / 100));
        }

        updateResultDisplay(result);
    }

    // Function to update result display elements
    function updateResultDisplay(result) {
        const roundedResult = Math.round(result);
        const grundumsatzWrapper = document.querySelector('.wrapper-result_grundumsatz');
        grundumsatzElement.textContent = `${roundedResult} kcal`;

        const grundumsatzResultElement = document.querySelector('.wrapper-result_grundumsatz .steps_result-text');
        if (grundumsatzResultElement) grundumsatzResultElement.textContent = `${roundedResult} kcal`;

        if (roundedResult > 0 && grundumsatzWrapper) {
            grundumsatzWrapper.style.display = 'flex';
        } else if (grundumsatzWrapper) {
            grundumsatzWrapper.style.display = 'none';
        }
    }

    // Function to calculate calories burned from daily steps
    function calculateStepsCalories() {
        const stepsCalories = dailySteps * 0.04;
        if (dailySteps > 0) {
            stepsWrapperResult.style.display = 'flex';
            stepsResultElement.textContent = `${Math.round(stepsCalories)} kcal`;
            altagElement.textContent = `${Math.round(stepsCalories)} kcal`;
        } else {
            stepsWrapperResult.style.display = 'none';
            altagElement.textContent = '0 kcal';
        }
    }

    // Get the value from the slider handle or the input field
    function getSliderValue(wrapperClass, inputId) {
        const handleText = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);
        const valueFromHandle = handleText ? parseInt(handleText.textContent, 10) || 0 : 0;
        const valueFromInput = parseInt(inputElement.value, 10) || 0;
        return valueFromHandle || valueFromInput;
    }

    // Function to observe slider changes
    function observeSliderChange(wrapperClass, inputId) {
        const handleTextElement = document.querySelector(`.${wrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);

        if (handleTextElement) {
            const observer = new MutationObserver(() => {
                inputElement.value = handleTextElement.textContent;
                inputId === 'steps-4' ? calculateStepsCalories() : calculateResult();
            });
            observer.observe(handleTextElement, { childList: true });
        }

        inputElement.addEventListener('input', debounce(() => {
            handleTextElement.textContent = inputElement.value;
            inputId === 'steps-4' ? calculateStepsCalories() : calculateResult();
        }, 300));
    }

    // Attach slider listeners and input change listeners
    function addSliderListeners() {
        observeSliderChange('wrapper-step-range_slider', 'age-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');
        observeSliderChange('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4');
    }

    // Initialize setup
    toggleCalcType();
    addSliderListeners();
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


// We ADD Always here PLS :D // We ADD Always here PLS :D // We ADD Always here PLS :D // We ADD Always here PLS :D // We ADD Always here PLS :D // We ADD Always here PLS :D
// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D
// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D// We ADD Always here PLS :D


document.addEventListener('DOMContentLoaded', function () {
    // Select necessary DOM elements
    const totalCaloriesElement = document.querySelector('.result-tats-chlich'); 
    const weightInputElementMiflin = document.getElementById('weight-2'); 
    const weightInputElementKfa = document.getElementById('weight-3-kfa'); 
    const grundUmsatzElement = document.getElementById('grund-right'); 
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

    // Function to hide the gender warning on selection
    function hideGenderWarning() {
        genderWarning.style.display = 'none'; // Hide the warning when a gender is selected
    }

    // Add event listeners to gender buttons
    womanButton.addEventListener('click', hideGenderWarning);
    manButton.addEventListener('click', hideGenderWarning);

    // Function to get the selected calculation method
    function getSelectedCalculationMethod() {
        const methodRadios = document.getElementsByName('kfa-or-miflin');
        for (const radio of methodRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return null;
    }

    // Function to handle live validation on input fields
    function hideWarningOnInput(inputElement, warningElement) {
        const handler = () => {
            if (inputElement.value.trim() !== '' && parseFloat(inputElement.value) > 0) {
                warningElement.style.display = 'none'; // Hide the warning if the input is valid
            }
        };
        inputElement.addEventListener('input', handler);
        inputElement.addEventListener('change', handler); 
    }

    // Function to handle live validation on slider changes using MutationObserver
    function hideWarningOnSliderInput(sliderElement, inputElement, warningElement) {
        const handleTextElement = sliderElement.querySelector('.inside-handle-text');
        if (handleTextElement) {
            const observer = new MutationObserver(() => {
                const sliderValue = parseFloat(handleTextElement.textContent) || 0;
                inputElement.value = sliderValue;
                if (sliderValue > 0) {
                    warningElement.style.display = 'none'; 
                }
                const event = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(event);
            });
            observer.observe(handleTextElement, { childList: true, characterData: true, subtree: true });
        }
    }

    // Attach validation to inputs and sliders
    function attachValidation(inputId, sliderSelector) {
        const inputElement = document.getElementById(inputId);
        const warningElement = inputElement.closest('.input-wrapper-calc').querySelector('.text-warning');
        hideWarningOnInput(inputElement, warningElement);
        const sliderElement = document.querySelector(sliderSelector);
        if (sliderElement) {
            hideWarningOnSliderInput(sliderElement, inputElement, warningElement);
        }
    }

    // Add event listener specifically for age-2 handle text
    const ageHandleTextElement = document.getElementById('age-2_handle-text');
    const ageInputElement = document.getElementById('age-2');
    const ageWarningElement = ageInputElement.closest('.input-wrapper-calc').querySelector('.text-warning');

    if (ageHandleTextElement) {
        const observer = new MutationObserver(() => {
            const sliderValue = parseFloat(ageHandleTextElement.textContent) || 0;
            ageInputElement.value = sliderValue;

            // Hide the warning if the input is valid
            if (sliderValue > 0) {
                ageWarningElement.style.display = 'none';
            }
        });
        observer.observe(ageHandleTextElement, { childList: true, characterData: true, subtree: true });
    }

    // Add live validation for Wunschgewicht (since it may not have a slider)
    const wunschgewichtInput = document.getElementById('wunschgewicht');
    const wunschgewichtWarning = wunschgewichtInput.closest('.input-wrapper-calc').querySelector('.text-warning');
    hideWarningOnInput(wunschgewichtInput, wunschgewichtWarning);

    // Attach validation to inputs and sliders
    attachValidation('age-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-1"]');
    attachValidation('height-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]');
    attachValidation('weight-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]');
    attachValidation('weight-3-kfa', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]');
    attachValidation('kfa-2', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]');
    attachValidation('steps-4', '.wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]');

    // Function to validate inputs and show warnings if any are missing or invalid
    function validateInputs() {
        let isValid = true;
    
        // Validate gender selection or check if one of the buttons has the 'active' class
        const selectedGender = document.querySelector('input[name="geschlecht"]:checked');
        const hasActiveClass = womanButton.classList.contains('active') || manButton.classList.contains('active');
    
        if (!selectedGender && !hasActiveClass) {
            genderWarning.style.display = 'block'; // Show warning if no gender is selected and no active class
            isValid = false;
        } else {
            genderWarning.style.display = 'none'; // Hide warning if gender is selected or one has active class
        }

        const calculationMethod = getSelectedCalculationMethod();
        // Additional input validation logic for miflin and kfa
        if (calculationMethod === 'miflin') {
            const ageInput = document.getElementById('age-2');
            const ageWarning = ageInput.closest('.input-wrapper-calc').querySelector('.text-warning');
            if (ageInput.value.trim() === '' || parseFloat(ageInput.value) <= 0) {
                ageWarning.style.display = 'block';
                isValid = false;
            } else {
                ageWarning.style.display = 'none';
            }

            const heightInput = document.getElementById('height-2');
            const heightWarning = heightInput.closest('.input-wrapper-calc').querySelector('.text-warning');
            if (heightInput.value.trim() === '' || parseFloat(heightInput.value) <= 0) {
                heightWarning.style.display = 'block';
                isValid = false;
            } else {
                heightWarning.style.display = 'none';
            }

            const weightWarning = weightInputElementMiflin.closest('.input-wrapper-calc').querySelector('.text-warning');
            if (weightInputElementMiflin.value.trim() === '' || parseFloat(weightInputElementMiflin.value) <= 0) {
                weightWarning.style.display = 'block';
                isValid = false;
            } else {
                weightWarning.style.display = 'none';
            }
        } else if (calculationMethod === 'kfa') {
            const weightWarning = weightInputElementKfa.closest('.input-wrapper-calc').querySelector('.text-warning');
            if (weightInputElementKfa.value.trim() === '' || parseFloat(weightInputElementKfa.value) <= 0) {
                weightWarning.style.display = 'block';
                isValid = false;
            } else {
                weightWarning.style.display = 'none';
            }

            const kfaInput = document.getElementById('kfa-2');
            const kfaWarning = kfaInput.closest('.input-wrapper-calc').querySelector('.text-warning');
            if (kfaInput.value.trim() === '' || parseFloat(kfaInput.value) <= 0) {
                kfaWarning.style.display = 'block';
                isValid = false;
            } else {
                kfaWarning.style.display = 'none';
            }
        }

        // Validate Wunschgewicht
        if (wunschgewichtInput.value.trim() === '' || parseFloat(wunschgewichtInput.value) <= 0) {
            wunschgewichtWarning.style.display = 'block'; 
            isValid = false;
        } else {
            wunschgewichtWarning.style.display = 'none';
        }

        // Validate weight loss goal selection (Abnehmziel)
        const selectedValue = Array.from(radios).find(radio => radio.checked);
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

    // Unified function to handle total calorie updates and weight loss results
    function updateResults() {
        const calculationMethod = getSelectedCalculationMethod();

        let currentWeight = 0;
        if (calculationMethod === 'miflin') {
            currentWeight = parseFloat(weightInputElementMiflin.value) || 0;
        } else if (calculationMethod === 'kfa') {
            currentWeight = parseFloat(weightInputElementKfa.value) || 0;
        }

        const targetWeight = parseFloat(targetWeightElement.value) || 0;
        const totalCalories = totalCaloriesElement ? totalCaloriesElement.textContent : '';
        const totalCaloriesValue = parseInt(totalCalories.replace(/\D/g, '')) || 0;

        const grundUmsatzText = grundUmsatzElement ? grundUmsatzElement.textContent : '';
        const grundUmsatzValue = parseInt(grundUmsatzText.replace(/\D/g, '')) || 0;

        let selectedValue = null;
        for (const radio of radios) {
            if (radio.checked) {
                selectedValue = radio.value;
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
            defizitElement.textContent = '0';
            fettAbnahmeElement.textContent = '0';
            weeksElement.textContent = '0';
            monthsElement.textContent = '0';
            targetWeightResultElement.textContent = '0';
            zielKcalElement.textContent = '0';
            zielKalorienElement.textContent = '0';
            warningMessageElement.style.display = 'none';
            return;
        }

        let weeklyWeightLossPercentage = 0;
        if (selectedValue === 'Langsames Abnehmen') {
            weeklyWeightLossPercentage = 0.005;
        } else if (selectedValue === 'Moderates Abnehmen') {
            weeklyWeightLossPercentage = 0.0075;
        } else if (selectedValue === 'Schnelles Abnehmen') {
            weeklyWeightLossPercentage = 0.01;
        }

        const weeklyWeightLossKg = currentWeight * weeklyWeightLossPercentage;
        const calorieDeficitPerDay = Math.round((weeklyWeightLossKg * 7700) / 7);
        const targetCalories = Math.max(0, totalCaloriesValue - calorieDeficitPerDay);

        zielKalorienElement.textContent = targetCalories > 0 ? targetCalories : '0';
        zielKcalElement.textContent = targetCalories > 0 ? targetCalories : '0'; 

        if (targetCalories < grundUmsatzValue) {
            warningMessageElement.style.display = 'flex';
            const warningMessage = warningMessageElement.querySelector('.warning-message');
            if (warningMessage) {
                warningMessage.textContent = `Warnhinweis: Nicht weniger als ${grundUmsatzValue} kcal essen, da dies dein Grundumsatz ist.`;
            }
        } else {
            warningMessageElement.style.display = 'none';
        }

        fettAbnahmeElement.textContent = weeklyWeightLossKg.toFixed(2); 
        defizitElement.textContent = calorieDeficitPerDay; 

        const totalWeightToLose = currentWeight - targetWeight;
        const totalCaloricDeficitNeeded = totalWeightToLose * 7700;
        const daysToReachGoal = Math.round(totalCaloricDeficitNeeded / calorieDeficitPerDay);
        const weeksToReachGoal = Math.round(daysToReachGoal / 7);
        const monthsToReachGoal = (weeksToReachGoal / 4.345).toFixed(1);

        weeksElement.textContent = weeksToReachGoal;
        monthsElement.textContent = monthsToReachGoal;
        targetWeightResultElement.textContent = targetWeight;
    }

    // Function to initialize event listeners
    function initializeListeners() {
        if (totalCaloriesElement) {
            const observer = new MutationObserver(updateResults);
            observer.observe(totalCaloriesElement, { childList: true, subtree: true });
        }

        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateResults();

                const abnehmzielWarning = document.querySelector('.wrapper-abnehmziel .text-warning.here');
                if (abnehmzielWarning) {
                    abnehmzielWarning.style.display = 'none';
                }
            });
        });

        const methodRadios = document.getElementsByName('kfa-or-miflin');
        methodRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateResults();
            });
        });

        const berechnenButton = document.getElementById('check-inputs');
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
