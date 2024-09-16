document.addEventListener('DOMContentLoaded', function() {
    const miflinRadio = document.getElementById('miflin');
    const kfaRadio = document.getElementById('kfa');
    const miflinInput = document.getElementById('input-miflin');
    const kfaInput = document.getElementById('input-kfa');

    // Initialize both divs to be hidden
    miflinInput.style.display = 'block';
    kfaInput.style.display = 'none';

    // Add transition for smoother showing/hiding
    miflinInput.style.transition = 'opacity 0.5s ease';
    kfaInput.style.transition = 'opacity 0.5s ease';

    // Function to show the correct input block based on the selected radio button
    function toggleInputs() {
        if (miflinRadio.checked) {
            // Show miflin input, hide kfa input
            kfaInput.style.opacity = '0';
            setTimeout(() => {
                kfaInput.style.display = 'none';
                miflinInput.style.display = 'block';
                setTimeout(() => miflinInput.style.opacity = '1', 10); // Small delay to trigger opacity transition
            }, 500); // Duration to match the transition

        } else if (kfaRadio.checked) {
            // Show kfa input, hide miflin input
            miflinInput.style.opacity = '0';
            setTimeout(() => {
                miflinInput.style.display = 'none';
                kfaInput.style.display = 'block';
                setTimeout(() => kfaInput.style.opacity = '1', 10); // Small delay to trigger opacity transition
            }, 500); // Duration to match the transition
        }
    }

    // Event listeners for radio buttons
    miflinRadio.addEventListener('change', toggleInputs);
    kfaRadio.addEventListener('change', toggleInputs);

    // Initialize to show the selected input on page load
    toggleInputs();
});


document.getElementById("popup_kfa").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    console.log("Popup button clicked");

    // Check which gender is selected
    const selectedGender = document.querySelector('input[name="geschlecht"]:checked');
    console.log("Selected gender:", selectedGender ? selectedGender.value : "None");

    if (selectedGender) {
        const genderValue = selectedGender.value.toLowerCase(); // Ensure lowercase comparison

        // Hide all popups first
        document.querySelectorAll('.kfa-mann, .kfa-woman').forEach(popup => {
            popup.style.display = 'none';
            console.log("Hiding popup:", popup.classList);
        });

        // Show the correct popup based on selected gender
        let popupToShow;
        if (genderValue === "mann") {
            popupToShow = document.querySelector('.kfa-mann');
            console.log("Showing male popup");
        } else if (genderValue === "frau") {
            popupToShow = document.querySelector('.kfa-woman');
            console.log("Showing female popup");
        }
        
        if (popupToShow) {
            popupToShow.style.display = 'block';
            // Now, ensure radio buttons inside the popup are selected properly
            const radioButtons = popupToShow.querySelectorAll('input[type="radio"]');
            console.log("Found radio buttons:", radioButtons.length);

            // Add event listener to each radio button
            radioButtons.forEach(radio => {
                console.log("Adding event listener to radio button with value:", radio.value);
                radio.addEventListener("change", function() {
                    const selectedValue = this.value;
                    console.log("Radio button selected:", selectedValue);
                    document.getElementById("kfa-2").value = selectedValue;
                    console.log("Updated KFA input value to:", selectedValue);
                    
                    // Close popup after selecting (optional)
                    popupToShow.style.display = 'none';
                    console.log("Closing popup after selection");
                });
            });
        }

    } else {
        // No gender selected, show a warning message (optional)
        alert("Bitte wähle dein Geschlecht aus");
        console.log("No gender selected");
    }
});

// Close popup when .exit-intent-popup-close is clicked
document.querySelectorAll('.exit-intent-popup-close').forEach(closeButton => {
    closeButton.addEventListener("click", function() {
        console.log("Exit popup close button clicked");
        document.querySelectorAll('.kfa-mann, .kfa-woman').forEach(popup => {
            popup.style.display = 'none';
            console.log("Popup closed");
        });
    });
});
