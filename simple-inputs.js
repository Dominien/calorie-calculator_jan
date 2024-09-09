document.addEventListener('DOMContentLoaded', function() {
    const numericInputs = document.querySelectorAll('.input-calculator');

    // Restrict input to only numeric values
    numericInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
        });

        input.addEventListener('keydown', (event) => {
            // Allow certain keys such as backspace, delete, tab, etc.
            if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(event.key) ||
                (event.key === 'a' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'c' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'v' && (event.ctrlKey || event.metaKey)) || 
                (event.key === 'x' && (event.ctrlKey || event.metaKey))) {
                return;
            }
            // Ensure numeric input
            if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        });
    });

    // Handle touch events for sliders on mobile
    if (window.innerWidth <= 1024) {
        function addSmoothTouchListeners(rangeSliderWrapperClass, inputId) {
            const handle = document.querySelector(`.${rangeSliderWrapperClass} .range-slider_handle`);
            const slider = document.querySelector(`.${rangeSliderWrapperClass} .track-range-slider`);
            let isDragging = false;

            handle.addEventListener('touchstart', function(e) {
                isDragging = true;
                document.body.style.overflow = 'hidden'; // Prevent page scrolling
                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd);
            });

            function onTouchMove(e) {
                if (!isDragging) return;
                e.preventDefault(); // Prevent vertical scrolling

                const rect = slider.getBoundingClientRect();
                const offsetX = e.touches[0].clientX - rect.left;
                const percentage = (offsetX / slider.clientWidth) * 100;

                const wrapper = document.querySelector(`.${rangeSliderWrapperClass}`);
                const min = parseFloat(wrapper.getAttribute("fs-rangeslider-min"));
                const max = parseFloat(wrapper.getAttribute("fs-rangeslider-max"));
                const value = Math.round(min + (percentage / 100) * (max - min));

                document.getElementById(inputId).value = value;
                requestAnimationFrame(() => setHandleText(rangeSliderWrapperClass, inputId));
            }

            function onTouchEnd() {
                isDragging = false;
                document.body.style.overflow = ''; // Re-enable page scrolling
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            }
        }

        // Add touch listeners for all sliders including steps
        addSmoothTouchListeners('wrapper-step-range_slider', 'age-2');
        addSmoothTouchListeners('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        addSmoothTouchListeners('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
        addSmoothTouchListeners('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4');
    }

    // Sync input field value with slider handle text
    function setInputValue(rangeSliderWrapperClass, inputId) {
        const handleText = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`).textContent;
        document.getElementById(inputId).value = handleText;
        handleInputChange();
    }

    // Update handle text based on input value
    function setHandleText(rangeSliderWrapperClass, inputId) {
        const inputValue = document.getElementById(inputId).value;
        const handleText = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`);
        handleText.textContent = inputValue;
        updateRangeSliderPosition(rangeSliderWrapperClass, inputValue, true);
        handleInputChange();
    }

    // Update range slider position
    function updateRangeSliderPosition(rangeSliderWrapperClass, value, withTransition) {
        const wrapper = document.querySelector(`.${rangeSliderWrapperClass}`);
        const handle = wrapper.querySelector(".range-slider_handle");
        const fill = wrapper.querySelector(".range-slider_fill");

        const min = parseFloat(wrapper.getAttribute("fs-rangeslider-min"));
        const max = parseFloat(wrapper.getAttribute("fs-rangeslider-max"));

        const percentage = ((value - min) / (max - min)) * 100;

        handle.style.transition = withTransition ? 'left 0.3s ease' : 'none';
        fill.style.transition = withTransition ? 'width 0.3s ease' : 'none';

        handle.style.left = `${Math.min(Math.max(percentage, 0), 100)}%`;
        fill.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
    }

    // Simplified handleInputChange function for all range sliders
    function handleInputChange() {
        // Get the input values from the range sliders
        let age = document.getElementById("age-2").value;
        let height = document.getElementById("height-2").value;
        let weight = document.getElementById("weight-2").value;
        let steps = document.getElementById("steps-4").value;

        // You can log the values for debugging purposes
        console.log("Age:", age, "Height:", height, "Weight:", weight, "Steps:", steps);

        // Optionally update the visual state of sliders
        updateSliderUI();
    }

    // Optionally update the visual state of the sliders
    function updateSliderUI() {
        const sliders = [
            { element: document.querySelector('.wrapper-step-range_slider'), max: 99 },
            { element: document.querySelector('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]'), max: 220 },
            { element: document.querySelector('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]'), max: 150 },
            { element: document.querySelector('.wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]'), max: 40000 }
        ];

        sliders.forEach(slider => {
            const handle = slider.element.querySelector('.range-slider_handle');
            const fill = slider.element.querySelector('.range-slider_fill');
            const value = parseFloat(slider.element.querySelector('.inside-handle-text').textContent);
            const max = slider.max;

            // Update the fill bar width based on the value
            const percentage = (value / max) * 100;
            handle.style.left = `${percentage}%`;
            fill.style.width = `${percentage}%`;
        });
    }

    // Handle changes in input field and slider sync
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

    // Add listeners for slider handle movement
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

    // Event listener for input field changes
    function addInputFieldListener(rangeSliderWrapperClass, inputId) {
        const inputField = document.getElementById(inputId);
        inputField.addEventListener('input', function() {
            if (inputField.value.length > 5) {
                inputField.value = inputField.value.slice(0, 5); // Limit the length to 5 for steps
            }
            setHandleText(rangeSliderWrapperClass, inputId);
            setTimeout(() => {
                const handle = document.querySelector(`.${rangeSliderWrapperClass} .range-slider_handle`);
                handle.style.transition = 'none';
            }, 300);
        });
    }

    // Initialize values and add listeners
    setInputValue('wrapper-step-range_slider', 'age-2');
    setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
    setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4'); // New steps slider

    addHandleMovementListener('wrapper-step-range_slider', 'age-2');
    addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
    addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4'); // New steps slider

    addInputFieldListener('wrapper-step-range_slider', 'age-2');
    addInputFieldListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
    addInputFieldListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    addInputFieldListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-4"]', 'steps-4'); // New steps slider

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
    const dropDown2 = document.getElementById('drop-down-2');
    const dropDown3 = document.getElementById('drop-down-3');
    
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



     // Delegation for '.radio-field_wrapper' click events
     document.body.addEventListener('click', function(event) {
         const wrapper = event.target.closest('.radio-field_wrapper');
         if (wrapper) {
             const block = wrapper.closest('.radios-abnehmziel');
             if (block) {
                 const wrappers = block.querySelectorAll('.radio-field_wrapper');
                 wrappers.forEach(wrap => {
                     resetRadio(wrap);
                 });
 
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
 
     document.addEventListener('DOMContentLoaded', function() {
        // Select all checkboxes with the name "wich-calc"
        const checkboxes = document.querySelectorAll('input[name="wich-calc"]');
    
        // Add event listener to each checkbox
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // If this checkbox is checked
                if (this.checked) {
                    // Remove 'w--redirected-checked' class from all checkboxes
                    checkboxes.forEach(box => {
                        const wrapper = box.closest('.w-checkbox');
                        const checkboxInput = wrapper.querySelector('.w-checkbox-input');
                        if (checkboxInput) {
                            checkboxInput.classList.remove('w--redirected-checked');
                        }
                    });
    
                    // Add 'w--redirected-checked' class to the clicked checkbox
                    const wrapper = this.closest('.w-checkbox');
                    const checkboxInput = wrapper.querySelector('.w-checkbox-input');
                    if (checkboxInput) {
                        checkboxInput.classList.add('w--redirected-checked');
                    }
                } else {
                    // Remove 'w--redirected-checked' class when unchecked
                    const wrapper = this.closest('.w-checkbox');
                    const checkboxInput = wrapper.querySelector('.w-checkbox-input');
                    if (checkboxInput) {
                        checkboxInput.classList.remove('w--redirected-checked');
                    }
                }
            });
        });
    });
    
    
 

