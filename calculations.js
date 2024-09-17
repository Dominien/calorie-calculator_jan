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
