document.addEventListener('DOMContentLoaded', function() {
    const numericInputs = document.querySelectorAll('.input-calculator');

// List of input IDs that should allow commas
const allowCommaFields = ['wunschgewicht', 'weight-2', 'weight-3-kfa'];

// Restrict input based on whether commas are allowed
numericInputs.forEach(input => {
    console.log(`Checking input field with ID: ${input.id}`);
    
    if (allowCommaFields.includes(input.id)) {
        console.log(`Allowing comma input for field: ${input.id}`);
        
        // Allow numbers, commas, and periods for specific fields
        input.addEventListener('input', () => {
            console.log(`Input event triggered for field: ${input.id}, value before: ${input.value}`);
            input.value = input.value.replace(/[^0-9,\.]/g, ''); 
            console.log(`Updated value for field: ${input.id}, value after: ${input.value}`);
        });

        input.addEventListener('keydown', (event) => {
            console.log(`Keydown event on field: ${input.id}, key: ${event.key}`);
            // Allow certain keys such as backspace, delete, tab, etc.
            if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(event.key) ||
                (event.key === 'a' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'c' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'v' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'x' && (event.ctrlKey || event.metaKey))) {
                console.log(`Allowed special key: ${event.key}`);
                return;
            }

            // Ensure numeric input with commas or periods
            if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
                (event.keyCode < 96 || event.keyCode > 105) && event.key !== ',' && event.key !== '.') {
                console.log(`Prevented key: ${event.key}`);
                event.preventDefault();
            } else {
                console.log(`Allowed key: ${event.key}`);
            }
        });
    } else {
        console.log(`Restricting input to numbers for field: ${input.id}`);
        
        // Allow only numbers for other fields
        input.addEventListener('input', () => {
            console.log(`Input event triggered for numeric-only field: ${input.id}, value before: ${input.value}`);
            input.value = input.value.replace(/[^0-9]/g, ''); 
            console.log(`Updated value for numeric-only field: ${input.id}, value after: ${input.value}`);
        });

        input.addEventListener('keydown', (event) => {
            console.log(`Keydown event on numeric-only field: ${input.id}, key: ${event.key}`);
            // Allow certain keys such as backspace, delete, tab, etc.
            if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(event.key) ||
                (event.key === 'a' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'c' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'v' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'x' && (event.ctrlKey || event.metaKey))) {
                console.log(`Allowed special key: ${event.key}`);
                return;
            }

            // Ensure numeric input only for other fields
            if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
                (event.keyCode < 96 || event.keyCode > 105)) {
                console.log(`Prevented key: ${event.key}`);
                event.preventDefault();
            } else {
                console.log(`Allowed key: ${event.key}`);
            }
        });
    }
});


    // Function to update range slider position and value for weight and KFA
    function updateRangeSliderPosition(rangeSliderWrapperClass, value, withTransition) {
        const wrapper = document.querySelector(`.${rangeSliderWrapperClass}`);
        const handle = wrapper.querySelector(".range-slider_handle");
        const fill = wrapper.querySelector(".range-slider_fill");

        const min = parseFloat(wrapper.getAttribute("fs-rangeslider-min"));
        const max = parseFloat(wrapper.getAttribute("fs-rangeslider-max"));

        // Ensure the value stays within the range
        value = Math.max(min, Math.min(value, max));

        // Calculate percentage relative to the slider's range
        const percentage = ((value - min) / (max - min)) * 100;

        // Apply transition if needed
        handle.style.transition = withTransition ? 'left 0.3s ease' : 'none';
        fill.style.transition = withTransition ? 'width 0.3s ease' : 'none';

        // Set handle and fill to a max of 100% and a min of 0%
        handle.style.left = `${Math.min(Math.max(percentage, 0), 100)}%`;
        fill.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
    }

    // Sync input field value with slider handle text for weight and KFA
    function setInputValue(rangeSliderWrapperClass, inputId) {
        const handleText = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`).textContent;
        document.getElementById(inputId).value = handleText;
        handleInputChange();
    }

    // Update handle text based on input value for weight and KFA
    function setHandleText(rangeSliderWrapperClass, inputId) {
        const inputValue = document.getElementById(inputId).value;
        const handleText = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`);
        handleText.textContent = inputValue;
        updateRangeSliderPosition(rangeSliderWrapperClass, inputValue, true);
        handleInputChange();
    }

    // Function to handle input changes for weight and KFA
    function handleInputChange() {
        // Get the input values from the sliders
        const weight = document.getElementById("weight-3-kfa").value;
        const kfa = document.getElementById("kfa-2").value;
    }

    // Function to handle input changes and slider sync for weight and KFA
    function observeChanges(rangeSliderWrapperClass, inputId) {
        const handleTextElement = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);

        const observer = new MutationObserver(() => {
            if (inputElement.value !== handleTextElement.textContent) {
                inputElement.value = handleTextElement.textContent;
                handleInputChange();
            }
        });

        observer.observe(handleTextElement, { childList: true });

        inputElement.addEventListener('input', () => {
            if (inputElement.value !== handleTextElement.textContent) {
                handleTextElement.textContent = inputElement.value;
                updateRangeSliderPosition(rangeSliderWrapperClass, inputElement.value, true);
            }
        });
    }

    // Add listeners for slider handle movement for weight and KFA
    function addHandleMovementListener(rangeSliderWrapperClass, inputId) {
        const handle = document.querySelector(`.${rangeSliderWrapperClass} .range-slider_handle`);
        const slider = document.querySelector(`.${rangeSliderWrapperClass} .track-range-slider`);

        handle.addEventListener('mousedown', () => {
            updateRangeSliderPosition(rangeSliderWrapperClass, document.getElementById(inputId).value, false);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        slider.addEventListener('click', (event) => {
            const rect = slider.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const percentage = (offsetX / slider.clientWidth) * 100;

            const wrapper = document.querySelector(`.${rangeSliderWrapperClass}`);
            const min = parseFloat(wrapper.getAttribute("fs-rangeslider-min"));
            const max = parseFloat(wrapper.getAttribute("fs-rangeslider-max"));
            const value = Math.round(min + (percentage / 100) * (max - min));

            document.getElementById(inputId).value = value;
            setHandleText(rangeSliderWrapperClass, inputId);
        });

        function onMouseMove() {
            setInputValue(rangeSliderWrapperClass, inputId);
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // Initialize values and add listeners for weight and KFA
    setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
    setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');

    addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
    addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');

    observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
    observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');

    // Additional Range Sliders for Age, Height, Steps
    setInputValue('wrapper-step-range_slider', 'age-2');
    setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
    setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4'); // New steps slider

    addHandleMovementListener('wrapper-step-range_slider', 'age-2');
    addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
    addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4'); // New steps slider

    observeChanges('wrapper-step-range_slider', 'age-2');
    observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
    observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4'); // New steps slider
});


document.addEventListener("DOMContentLoaded", function() {
    // Function to look for elements until they are found
    function waitForElement(selector, callback) {
        const elements = document.querySelectorAll(selector);
        if (elements.length) {
            callback(elements); // Run the callback once the elements are found
        } else {
            requestAnimationFrame(() => waitForElement(selector, callback)); // Keep checking
        }
    }

    // Use the function to wait for the buttons to be present in the DOM
    waitForElement('.woman-button', function(buttons) {
        // Add click event listener to each button
        buttons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Remove 'active' class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                // Add 'active' class to the clicked button
                this.classList.add('active');
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const addMoreLink = document.querySelector('.link-more_training');
    const dropDown2 = document.getElementById('drop-down-2-wrapper');
    const dropDown3 = document.getElementById('drop-down-3-wrapper');
    
    // Initially hide dropdowns 2 and 3
    dropDown2.style.display = 'none';
    dropDown3.style.display = 'none';

    // Smooth transition
    dropDown2.style.transition = 'opacity 0.5s ease, height 0.5s ease';
    dropDown3.style.transition = 'opacity 0.5s ease, height 0.5s ease';

    // Handler for clicking "Weitere hinzufügen"
    addMoreLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior

        if (dropDown2.style.display === 'none') {
            dropDown2.style.display = 'flex'; // Show second dropdown
            dropDown2.style.opacity = 1; // Add transition
        } else if (dropDown3.style.display === 'none') {
            dropDown3.style.display = 'flex'; // Show third dropdown
            dropDown3.style.opacity = 1; // Add transition
            addMoreLink.style.display = 'none'; // Hide the link after the third dropdown is shown
        }
    });
});

// Radio Button Handler
document.body.addEventListener('click', function(event) {
    const wrapper = event.target.closest('.radio-field_wrapper');
    if (wrapper) {
        const block = wrapper.closest('.radios-abnehmziel');
        if (block) {
            const wrappers = block.querySelectorAll('.radio-field_wrapper');
            wrappers.forEach(wrap => resetRadio(wrap));

            // Add 'checked' class to the clicked wrapper and change SVG fill to white
            setRadio(wrapper, true);
        }
    }
});

function resetRadio(wrapper) {
    wrapper.classList.remove('checked');
    const paths = wrapper.querySelectorAll('.ms-tooltip svg path');
    paths.forEach(path => {
        path.setAttribute('fill', '#303030'); // Reset fill to original color
    });
}

function setRadio(wrapper, isChecked) {
    if (isChecked) {
        wrapper.classList.add('checked');
        const paths = wrapper.querySelectorAll('.ms-tooltip svg path');
        paths.forEach(path => {
            path.setAttribute('fill', 'white'); // Set the SVG path color to white when checked
        });
    }
}
