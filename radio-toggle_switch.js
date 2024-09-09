document.addEventListener('DOMContentLoaded', function() {
    const miflinRadio = document.getElementById('miflin');
    const kfaRadio = document.getElementById('kfa');
    const miflinInput = document.getElementById('input-miflin');
    const kfaInput = document.getElementById('input-kfa');
    const miflinRadioWrapper = document.querySelector('label[for="miflin"] .w-radio-input');
    const kfaRadioWrapper = document.querySelector('label[for="kfa"] .w-radio-input');

    // Initialize both divs to be hidden
    miflinInput.style.display = 'none';
    kfaInput.style.display = 'none';

    // Add transition for smoother showing/hiding
    miflinInput.style.transition = 'opacity 0.5s ease';
    kfaInput.style.transition = 'opacity 0.5s ease';

    // Pre-select the miflin radio button on page load (without handling styling)
    miflinRadio.checked = true; // Make miflin selected by default
    miflinRadioWrapper.classList.add('w--redirected-checked'); // Add the style for checked

    // Function to show the correct input block based on the selected radio button
    function toggleInputs() {
        if (miflinRadio.checked) {
            // Update styles
            miflinRadioWrapper.classList.add('w--redirected-checked');
            kfaRadioWrapper.classList.remove('w--redirected-checked');

            // Show miflin input, hide kfa input
            kfaInput.style.opacity = '0';
            setTimeout(() => {
                kfaInput.style.display = 'none';
                miflinInput.style.display = 'block';
                setTimeout(() => miflinInput.style.opacity = '1', 10); // Small delay to trigger opacity transition
            }, 500); // Duration to match the transition

        } else if (kfaRadio.checked) {
            // Update styles
            kfaRadioWrapper.classList.add('w--redirected-checked');
            miflinRadioWrapper.classList.remove('w--redirected-checked');

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
