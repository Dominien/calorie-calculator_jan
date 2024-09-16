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

    // Check which gender is selected
    const selectedGender = document.querySelector('input[name="geschlecht"]:checked');
    
    if (selectedGender) {
        const genderValue = selectedGender.value;

        // Hide all popups first
        document.querySelectorAll('.kfa-mann, .kfa-woman').forEach(popup => {
            popup.style.display = 'none';
        });

        // Show the correct popup based on selected gender
        if (genderValue === "Mann") {
            document.querySelector('.kfa-mann').style.display = 'block';
        } else if (genderValue === "frau") {
            document.querySelector('.kfa-woman').style.display = 'block';
        }

        // Add event listener to update KFA input when radio button is selected
        const radioButtons = document.querySelectorAll('input[name^="kfa-percent-' + genderValue + '"]');
        radioButtons.forEach(radio => {
            radio.addEventListener("change", function() {
                const selectedValue = this.value;
                document.getElementById("kfa-2").value = selectedValue;
                // Optionally, you can close the popup after selecting
                document.querySelectorAll('.kfa-mann, .kfa-woman').forEach(popup => {
                    popup.style.display = 'none';
                });
            });
        });

    } else {
        // No gender selected, show a warning message (optional)
        alert("Bitte wähle dein Geschlecht aus");
    }
});

// Close popup when .exit-intent-popup-close is clicked
document.querySelectorAll('.exit-intent-popup-close').forEach(closeButton => {
    closeButton.addEventListener("click", function() {
        document.querySelectorAll('.kfa-mann, .kfa-woman').forEach(popup => {
            popup.style.display = 'none';
        });
    });
});
