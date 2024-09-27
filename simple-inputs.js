
// Additional DOMContentLoaded listener for buttons
document.addEventListener("DOMContentLoaded", function() {
    console.log('Setting up button click listeners...');
    // Function to look for elements until they are found
    function waitForElement(selector, callback) {
        const elements = document.querySelectorAll(selector);
        if (elements.length) {
            console.log(`Elements found for selector "${selector}".`);
            callback(elements); // Run the callback once the elements are found
        } else {
            console.log(`Elements not found for selector "${selector}". Waiting...`);
            requestAnimationFrame(() => waitForElement(selector, callback)); // Keep checking
        }
    }

    // Use the function to wait for the buttons to be present in the DOM
    waitForElement('.woman-button', function(buttons) {
        console.log(`Found ${buttons.length} ".woman-button" elements.`);
        // Add click event listener to each button
        buttons.forEach(function(button, index) {
            console.log(`Adding click listener to button ${index + 1}.`);
            button.addEventListener('click', function() {
                console.log(`Button ${index + 1} clicked. Toggling 'active' class.`);
                // Remove 'active' class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                // Add 'active' class to the clicked button
                this.classList.add('active');
                console.log(`Button ${index + 1} is now active.`);
            });
        });
    });
});

// Additional DOMContentLoaded listener for dropdowns
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up dropdown toggle functionality...');
    const addMoreLink = document.querySelector('.link-more_training');
    const dropDown2 = document.getElementById('drop-down-2-wrapper');
    const dropDown3 = document.getElementById('drop-down-3-wrapper');

    if (!addMoreLink || !dropDown2 || !dropDown3) {
        console.log('One or more dropdown elements not found. Aborting dropdown setup.');
        return;
    }

    // Initially hide dropdowns 2 and 3
    dropDown2.style.display = 'none';
    dropDown3.style.display = 'none';
    console.log('Initially hid dropDown2 and dropDown3.');

    // Smooth transition
    dropDown2.style.transition = 'opacity 0.5s ease, height 0.5s ease';
    dropDown3.style.transition = 'opacity 0.5s ease, height 0.5s ease';
    console.log('Applied transition styles to dropDown2 and dropDown3.');

    // Handler for clicking "Weitere hinzufügen"
    addMoreLink.addEventListener('click', function(event) {
        console.log('"Weitere hinzufügen" link clicked.');
        event.preventDefault(); // Prevent default link behavior

        if (dropDown2.style.display === 'none') {
            dropDown2.style.display = 'flex'; // Show second dropdown
            dropDown2.style.opacity = 1; // Add transition
            console.log('Displayed dropDown2.');
        } else if (dropDown3.style.display === 'none') {
            dropDown3.style.display = 'flex'; // Show third dropdown
            dropDown3.style.opacity = 1; // Add transition
            addMoreLink.style.display = 'none'; // Hide the link after the third dropdown is shown
            console.log('Displayed dropDown3 and hid the "Weitere hinzufügen" link.');
        }
    });
});

// Radio Button Handler
document.body.addEventListener('click', function(event) {
    console.log('Body click event detected.');
    const wrapper = event.target.closest('.radio-field_wrapper');
    if (wrapper) {
        console.log('Radio field wrapper clicked:', wrapper);
        const block = wrapper.closest('.radios-abnehmziel');
        if (block) {
            console.log('Found parent block ".radios-abnehmziel".');
            const wrappers = block.querySelectorAll('.radio-field_wrapper');
            wrappers.forEach(wrap => {
                console.log(`Resetting radio wrapper: ${wrap}`);
                resetRadio(wrap);
            });

            // Add 'checked' class to the clicked wrapper and change SVG fill to white
            setRadio(wrapper, true);
        }
    }
});

function resetRadio(wrapper) {
    console.log('Resetting radio:', wrapper);
    wrapper.classList.remove('checked');
    const paths = wrapper.querySelectorAll('.ms-tooltip svg path');
    paths.forEach(path => {
        path.setAttribute('fill', '#303030'); // Reset fill to original color
        console.log('Reset SVG path fill to #303030.');
    });
}

function setRadio(wrapper, isChecked) {
    if (isChecked) {
        console.log('Setting radio as checked:', wrapper);
        wrapper.classList.add('checked');
        const paths = wrapper.querySelectorAll('.ms-tooltip svg path');
        paths.forEach(path => {
            path.setAttribute('fill', 'white'); // Set the SVG path color to white when checked
            console.log('Set SVG path fill to white.');
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Select all elements with the class 'woman-button'
    const womanButtons = document.querySelectorAll('.radio-button-man');

    // Iterate over each element and apply the inline style for the pointer cursor
    womanButtons.forEach(button => {
        button.style.cursor = 'pointer';
    });

    console.log('Pointer cursor added to woman buttons.');
});
