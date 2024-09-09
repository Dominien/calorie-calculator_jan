document.addEventListener('DOMContentLoaded', (event) => {
        const numericInputs = document.querySelectorAll('.input-calculator');
    
        numericInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
            });
    
            input.addEventListener('keydown', (event) => {
                // Allow: backspace, delete, tab, escape, enter and .
                if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' || 
                    event.key === 'Escape' || event.key === 'Enter' || 
                    // Allow: Ctrl/cmd+A
                    (event.key === 'a' && (event.ctrlKey === true || event.metaKey === true)) || 
                    // Allow: Ctrl/cmd+C
                    (event.key === 'c' && (event.ctrlKey === true || event.metaKey === true)) || 
                    // Allow: Ctrl/cmd+V
                    (event.key === 'v' && (event.ctrlKey === true || event.metaKey === true)) || 
                    // Allow: Ctrl/cmd+X
                    (event.key === 'x' && (event.ctrlKey === true || event.metaKey === true)) || 
                    // Allow: home, end, left, right
                    (event.key === 'Home' || event.key === 'End' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            });
        });
    });


document.addEventListener("DOMContentLoaded", function() {
    if (window.innerWidth <= 1024) { // Only run this on mobile devices
        function addSmoothTouchListeners(rangeSliderWrapperClass, inputId) {
            const handle = document.querySelector(`.${rangeSliderWrapperClass} .range-slider_handle`);
            const slider = document.querySelector(`.${rangeSliderWrapperClass} .track-range-slider`);

            let isDragging = false;
            let startX = 0;
            let startY = 0;

            handle.addEventListener('touchstart', function(e) {
                isDragging = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;

                // Disable body scroll by preventing default on touchmove
                document.body.style.overflow = 'hidden'; // Prevent page scrolling
                document.addEventListener('touchmove', onTouchMove, { passive: false }); // passive: false is crucial here
                document.addEventListener('touchend', onTouchEnd);
            });

            function onTouchMove(e) {
                if (!isDragging) return;

                // Prevent any vertical scroll
                e.preventDefault();

                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;

                // If the user is dragging more horizontally than vertically
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    const rect = slider.getBoundingClientRect();
                    const offsetX = currentX - rect.left;
                    const percentage = (offsetX / slider.clientWidth) * 100;

                    const wrapper = document.querySelector(`.${rangeSliderWrapperClass}`);
                    const min = parseFloat(wrapper.getAttribute("fs-rangeslider-min"));
                    const max = parseFloat(wrapper.getAttribute("fs-rangeslider-max"));
                    const value = Math.round(min + (percentage / 100) * (max - min));

                    document.getElementById(inputId).value = value;

                    // Use requestAnimationFrame for smoother updates
                    requestAnimationFrame(() => {
                        setHandleText(rangeSliderWrapperClass, inputId);
                    });
                }
            }

            function onTouchEnd() {
                isDragging = false;
                document.body.style.overflow = ''; // Re-enable page scrolling

                // Remove touch event listeners
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            }
        }

        // Apply the smooth touch listeners to all sliders
        addSmoothTouchListeners('wrapper-step-range_slider', 'age-2');
        addSmoothTouchListeners('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        addSmoothTouchListeners('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    }
});


document.addEventListener("DOMContentLoaded", function() {
    // Target the last element with the class 'inside-handle-text'
    const sliderHandleText = document.querySelectorAll('.inside-handle-text');
    const lastSliderHandleText = sliderHandleText[sliderHandleText.length - 1]; // Select the last one
    const alertBox = document.querySelector('.alert_age-bmi.alter-regler_150');

    if (!lastSliderHandleText) {
        console.log('Error: Last slider handle text element not found.');
        return;
    }

    if (!alertBox) {
        console.log('Error: Alert box element not found.');
        return;
    }

    // Ensure the alert box is initially hidden
    alertBox.style.display = 'none';
    console.log('Initialized: Alert box is hidden.');

    // Create a MutationObserver to watch for changes in the slider's value
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const currentValue = parseInt(lastSliderHandleText.textContent, 10);
                console.log('Slider value changed:', currentValue);

                if (currentValue === 150) {
                    alertBox.style.display = 'block';
                    console.log('Alert box shown: Value is 150.');
                } else {
                    alertBox.style.display = 'none';
                    console.log('Alert box hidden: Value is not 150.');
                }
            }
        });
    });

    // Observe the slider's displayed value for changes
    observer.observe(lastSliderHandleText, {
        childList: true, // Watch for changes in the element's children (text content)
    });
    console.log('MutationObserver is set up and observing the last slider handle text.');
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



    
        // Function to set the input value based on the handle text
        function setInputValue(rangeSliderWrapperClass, inputId) {
            var handleText = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`).textContent;
            document.getElementById(inputId).value = handleText;
            handleInputChange();
        }
    
        // Function to update range slider handle text based on input value
        function setHandleText(rangeSliderWrapperClass, inputId) {
            var inputValue = document.getElementById(inputId).value;
            var handleText = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`);
            handleText.textContent = inputValue;
            updateRangeSliderPosition(rangeSliderWrapperClass, inputValue, true);
            handleInputChange();
        }
    
        // Update range slider position based on input value
        function updateRangeSliderPosition(rangeSliderWrapperClass, value, withTransition) {
            const wrapper = document.querySelector(`.${rangeSliderWrapperClass}`);
            const handle = wrapper.querySelector(".range-slider_handle");
            const track = wrapper.querySelector(".track-range-slider");
            const fill = wrapper.querySelector(".range-slider_fill");
    
            const min = parseFloat(wrapper.getAttribute("fs-rangeslider-min"));
            const max = parseFloat(wrapper.getAttribute("fs-rangeslider-max"));
            const step = parseFloat(wrapper.getAttribute("fs-rangeslider-step"));
    
            const percentage = (value - min) / (max - min) * 100;
    
            if (withTransition) {
                handle.style.transition = 'left 0.3s ease';
                fill.style.transition = 'width 0.3s ease';
            } else {
                handle.style.transition = 'none';
                fill.style.transition = 'none';
            }
    
            handle.style.left = `${Math.min(Math.max(percentage, 0), 100)}%`;
            fill.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
        }
    
        // Function to observe changes to the handle text and input field value
        function observeChanges(rangeSliderWrapperClass, inputId) {
            const handleTextElement = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`);
            const inputElement = document.getElementById(inputId);
    
            const observer = new MutationObserver(() => {
                if (inputElement.value !== handleTextElement.textContent) {
                    inputElement.value = handleTextElement.textContent;
                    handleInputChange();
                }
            });
    
            observer.observe(handleTextElement, { childList: true, subtree: true });
    
            inputElement.addEventListener('input', () => {
                if (inputElement.value !== handleTextElement.textContent) {
                    handleTextElement.textContent = inputElement.value;
                    updateRangeSliderPosition(rangeSliderWrapperClass, inputElement.value, true);
                }
            });
        }
    
        // Event listener for range slider handle movement
        function addHandleMovementListener(rangeSliderWrapperClass, inputId) {
            var handle = document.querySelector(`.${rangeSliderWrapperClass} .range-slider_handle`);
            var slider = document.querySelector(`.${rangeSliderWrapperClass} .track-range-slider`);
    
            handle.addEventListener('mousedown', function() {
                updateRangeSliderPosition(rangeSliderWrapperClass, document.getElementById(inputId).value, false);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
    
            handle.addEventListener('touchstart', function() {
                updateRangeSliderPosition(rangeSliderWrapperClass, document.getElementById(inputId).value, false);
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            });
    
            slider.addEventListener('click', function(event) {
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
    
            function onTouchMove() {
                setInputValue(rangeSliderWrapperClass, inputId);
            }
    
            function onTouchEnd() {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            }
        }
    
        // Event listener for input field changes
        function addInputFieldListener(rangeSliderWrapperClass, inputId) {
            var inputField = document.getElementById(inputId);
            inputField.addEventListener('input', function() {
                if (inputField.value.length > 3) {
                    inputField.value = inputField.value.slice(0, 3);
                }
                setHandleText(rangeSliderWrapperClass, inputId);
                // Remove the transition after the animation is done
                setTimeout(() => {
                    const handle = document.querySelector(`.${rangeSliderWrapperClass} .range-slider_handle`);
                    const fill = document.querySelector(`.${rangeSliderWrapperClass} .range-slider_fill`);
                    handle.style.transition = 'none';
                    fill.style.transition = 'none';
                }, 300);
            });
        }
    
        // Set initial values
        setInputValue('wrapper-step-range_slider', 'age-2');
        setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    
        // Add listeners for handle movement
        addHandleMovementListener('wrapper-step-range_slider', 'age-2');
        addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    
        // Add listeners for input field changes
        addInputFieldListener('wrapper-step-range_slider', 'age-2');
        addInputFieldListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        addInputFieldListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    
        // Add observer to keep input and handle in sync
        observeChanges('wrapper-step-range_slider', 'age-2');
        observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-2"]', 'height-2');
        observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-3"]', 'weight-2');
    
        // Add event listeners to FAQ questions with debounce
        document.querySelectorAll('.faq2_question').forEach((questionElement) => {
            questionElement.addEventListener('click', debounce(toggleFAQ, 300)); // 300ms debounce delay
        });

        // Add event listener to the "Mehr zum Ergebnis" link
        document.querySelector('.more-info_on-calc').addEventListener('click', handleMoreInfoClick);
    });

