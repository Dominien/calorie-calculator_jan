document.addEventListener('DOMContentLoaded', function() {
    const miflinRadio = document.getElementById('miflin');
    const kfaRadio = document.getElementById('kfa');
    const miflinInput = document.getElementById('input-miflin');
    const kfaInput = document.getElementById('input-kfa');

    // Initialize both divs to be hidden
    miflinInput.style.display = 'none';
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

    // Pre-select the miflin radio button on page load
    miflinRadio.checked = true;

    // Event listeners for radio buttons
    miflinRadio.addEventListener('change', toggleInputs);
    kfaRadio.addEventListener('change', toggleInputs);

    // Initialize to show the selected input on page load
    toggleInputs();
});
