document.addEventListener('DOMContentLoaded', function() {
    const numericInputs = document.querySelectorAll('.input-calculator');

    // Restrict input to only numeric values with debouncing
    numericInputs.forEach(input => {
        let debounceTimeout;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                input.value = input.value.replace(/[^0-9]/g, ''); // Allow only numbers
            }, 300); // Debouncing with 300ms delay
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
        }, { passive: true }); // Use passive listener for better performance
    });

    function updateRangeSliderPosition(rangeSliderWrapperClass, value, withTransition) {
        const wrapper = document.querySelector(`.${rangeSliderWrapperClass}`);
        if (!wrapper) return;
        const handle = wrapper.querySelector(".range-slider_handle");
        const fill = wrapper.querySelector(".range-slider_fill");

        const min = parseFloat(wrapper.getAttribute("fs-rangeslider-min"));
        const max = parseFloat(wrapper.getAttribute("fs-rangeslider-max"));

        value = Math.max(min, Math.min(value, max));
        const percentage = ((value - min) / (max - min)) * 100;

        handle.style.transition = withTransition ? 'left 0.3s ease' : 'none';
        fill.style.transition = withTransition ? 'width 0.3s ease' : 'none';

        handle.style.left = `${Math.min(Math.max(percentage, 0), 100)}%`;
        fill.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
    }

    function setInputValue(rangeSliderWrapperClass, inputId) {
        const handleText = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`)?.textContent;
        if (handleText) document.getElementById(inputId).value = handleText;
    }

    function observeChanges(rangeSliderWrapperClass, inputId) {
        const handleTextElement = document.querySelector(`.${rangeSliderWrapperClass} .inside-handle-text`);
        const inputElement = document.getElementById(inputId);
        if (!handleTextElement || !inputElement) return;

        const observer = new MutationObserver(() => {
            if (inputElement.value !== handleTextElement.textContent) {
                inputElement.value = handleTextElement.textContent;
            }
        });

        observer.observe(handleTextElement, { childList: true });
        inputElement.addEventListener('input', () => {
            if (inputElement.value !== handleTextElement.textContent) {
                handleTextElement.textContent = inputElement.value;
                updateRangeSliderPosition(rangeSliderWrapperClass, inputElement.value, true);
            }
        }, { passive: true });
    }

    function addHandleMovementListener(rangeSliderWrapperClass, inputId) {
        const handle = document.querySelector(`.${rangeSliderWrapperClass} .range-slider_handle`);
        const slider = document.querySelector(`.${rangeSliderWrapperClass} .track-range-slider`);

        if (!handle || !slider) return;

        // Touch support along with mouse events
        const startEvent = (event) => {
            event.preventDefault();
            document.addEventListener('mousemove', onMouseMove, { passive: true });
            document.addEventListener('mouseup', onMouseUp, { passive: true });
            document.addEventListener('touchmove', onMouseMove, { passive: true });
            document.addEventListener('touchend', onMouseUp, { passive: true });
        };

        const onMouseMove = () => {
            setInputValue(rangeSliderWrapperClass, inputId);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('touchend', onMouseUp);
        };

        handle.addEventListener('mousedown', startEvent, { passive: true });
        handle.addEventListener('touchstart', startEvent, { passive: true });

        slider.addEventListener('click', (event) => {
            const rect = slider.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const percentage = (offsetX / slider.clientWidth) * 100;

            const wrapper = document.querySelector(`.${rangeSliderWrapperClass}`);
            const min = parseFloat(wrapper.getAttribute("fs-rangeslider-min"));
            const max = parseFloat(wrapper.getAttribute("fs-rangeslider-max"));
            const value = Math.round(min + (percentage / 100) * (max - min));

            document.getElementById(inputId).value = value;
        }, { passive: true });
    }

    // Initialize the range sliders and input sync
    function initSliders() {
        setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        setInputValue('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');

        addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        addHandleMovementListener('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');

        observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-5"]', 'weight-3-kfa');
        observeChanges('wrapper-step-range_slider[fs-rangeslider-element="wrapper-6"]', 'kfa-2');
    }

    initSliders();
    
    // Dropdown functionality for additional training steps
    const addMoreLink = document.querySelector('.link-more_training');
    const dropDown2 = document.getElementById('drop-down-2-wrapper');
    const dropDown3 = document.getElementById('drop-down-3-wrapper');

    if (addMoreLink && dropDown2 && dropDown3) {
        dropDown2.style.display = 'none';
        dropDown3.style.display = 'none';

        addMoreLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (dropDown2.style.display === 'none') {
                dropDown2.style.display = 'flex';
            } else if (dropDown3.style.display === 'none') {
                dropDown3.style.display = 'flex';
                addMoreLink.style.display = 'none';
            }
        }, { passive: true });
    }

    // Radio button handler
    document.body.addEventListener('click', function(event) {
        const wrapper = event.target.closest('.radio-field_wrapper');
        if (wrapper) {
            const block = wrapper.closest('.radios-abnehmziel');
            const wrappers = block?.querySelectorAll('.radio-field_wrapper');
            wrappers?.forEach(wrap => resetRadio(wrap));
            setRadio(wrapper, true);
        }
    }, { passive: true });

    function resetRadio(wrapper) {
        wrapper.classList.remove('checked');
        const paths = wrapper.querySelectorAll('.ms-tooltip svg path');
        paths.forEach(path => path.setAttribute('fill', '#303030'));
    }

    function setRadio(wrapper, isChecked) {
        if (isChecked) {
            wrapper.classList.add('checked');
            const paths = wrapper.querySelectorAll('.ms-tooltip svg path');
            paths.forEach(path => path.setAttribute('fill', 'white'));
        }
    }
});
