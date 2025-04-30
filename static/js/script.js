document.addEventListener('DOMContentLoaded', function() {
    // Initialize form sections
    const sections = document.querySelectorAll('.form-section');
    const progressBar = document.querySelector('.progress');
    let currentSection = 1;
    
    // Initialize toggle buttons
    initializeToggles();
    
    // Initialize radio buttons with animation
    initializeRadioButtons();
    
    // Handle next button clicks
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (validateSection(currentSection)) {
                // Hide current section
                document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.remove('active');
                
                // Show next section
                currentSection++;
                document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
                
                // Update progress bar
                updateProgressBar();
                
                // Scroll to top of form
                document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
                
                // Animate the new section entrance
                animateSection(currentSection);
            }
        });
    });
    
    // Handle previous button clicks
    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Hide current section
            document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.remove('active');
            
            // Show previous section
            currentSection--;
            document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
            
            // Update progress bar
            updateProgressBar();
            
            // Scroll to top of form
            document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
            
            // Animate the new section entrance
            animateSection(currentSection);
        });
    });
    
    // Handle form submission
    document.getElementById('prediction-form').addEventListener('submit', function(e) {
        if (!validateSection(currentSection)) {
            e.preventDefault();
            return;
        }
        
        // Show loader
        const loader = document.querySelector('.loader');
        loader.classList.add('active');
        
        // Collect form data for result page
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const systolic = document.getElementById('ap_hi').value;
        const diastolic = document.getElementById('ap_lo').value;
        
        // Calculate BMI
        const bmi = (weight / ((height/100) * (height/100))).toFixed(1);
        
        // Add data to form for result page
        const bmiInput = document.createElement('input');
        bmiInput.type = 'hidden';
        bmiInput.name = 'bmi';
        bmiInput.value = bmi;
        this.appendChild(bmiInput);
        
        const bpInput = document.createElement('input');
        bpInput.type = 'hidden';
        bpInput.name = 'bp';
        bpInput.value = `${systolic}/${diastolic}`;
        this.appendChild(bpInput);
        
        // Simulate form submission delay for animation
        setTimeout(() => {
            // Form will submit naturally
        }, 2000);
    });
    
    // Initialize animations
    initializeAnimations();
    
    // Functions
    function updateProgressBar() {
        const percentage = (currentSection / sections.length) * 100;
        progressBar.style.width = `${percentage}%`;
    }
    
    function validateSection(sectionNumber) {
        const section = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
        const inputs = section.querySelectorAll('input[required]');
        let valid = true;
        
        inputs.forEach(input => {
            if (!input.value) {
                valid = false;
                input.classList.add('error');
                
                // Add shake animation
                input.classList.add('shake');
                setTimeout(() => {
                    input.classList.remove('shake');
                }, 500);
                
                // Add error message if it doesn't exist
                let errorMsg = input.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('div');
                    errorMsg.classList.add('error-message');
                    errorMsg.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    
                    // Animate error message
                    anime({
                        targets: errorMsg,
                        opacity: [0, 1],
                        translateY: [10, 0],
                        easing: 'easeOutExpo',
                        duration: 600
                    });
                }
            } else {
                input.classList.remove('error');
                
                // Remove error message if it exists
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
        
        // Validate specific fields
        if (sectionNumber === 1) {
            const age = document.getElementById('age').value;
            if (age && (age < 18 || age > 120)) {
                valid = false;
                showError(document.getElementById('age'), 'Age must be between 18 and 120');
            }
            
            const height = document.getElementById('height').value;
            if (height && (height < 100 || height > 250)) {
                valid = false;
                showError(document.getElementById('height'), 'Height must be between 100 and 250 cm');
            }
            
            const weight = document.getElementById('weight').value;
            if (weight && (weight < 30 || weight > 300)) {
                valid = false;
                showError(document.getElementById('weight'), 'Weight must be between 30 and 300 kg');
            }
        }
        
        if (sectionNumber === 2) {
            const systolic = document.getElementById('ap_hi').value;
            if (systolic && (systolic < 70 || systolic > 250)) {
                valid = false;
                showError(document.getElementById('ap_hi'), 'Systolic BP must be between 70 and 250 mmHg');
            }
            
            const diastolic = document.getElementById('ap_lo').value;
            if (diastolic && (diastolic < 40 || diastolic > 150)) {
                valid = false;
                showError(document.getElementById('ap_lo'), 'Diastolic BP must be between 40 and 150 mmHg');
            }
        }
        
        return valid;
    }
    
    function showError(input, message) {
        input.classList.add('error');
        
        // Add shake animation
        input.classList.add('shake');
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
        
        // Add or update error message
        let errorMsg = input.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('div');
            errorMsg.classList.add('error-message');
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }
        
        errorMsg.textContent = message;
        
        // Animate error message
        anime({
            targets: errorMsg,
            opacity: [0, 1],
            translateY: [10, 0],
            easing: 'easeOutExpo',
            duration: 600
        });
    }
    
    function initializeToggles() {
        document.querySelectorAll('.toggle-container').forEach(container => {
            const options = container.querySelectorAll('.toggle-option');
            const hiddenInput = container.previousElementSibling.nextElementSibling;
            
            // Set default active state
            options[0].classList.add('active');
            
            options.forEach(option => {
                option.addEventListener('click', function() {
                    // Remove active class from all options
                    options.forEach(opt => opt.classList.remove('active'));
                    
                    // Add active class to clicked option
                    this.classList.add('active');
                    
                    // Update hidden input value
                    hiddenInput.value = this.getAttribute('data-value');
                    
                    // Animate the selection
                    anime({
                        targets: this,
                        backgroundColor: [
                            { value: '#ffffff', duration: 0 },
                            { value: '#ff5d8f', duration: 300 }
                        ],
                        scale: [
                            { value: 0.95, duration: 100 },
                            { value: 1, duration: 200 }
                        ],
                        easing: 'easeOutExpo'
                    });
                });
            });
        });
    }
    
    function initializeRadioButtons() {
        document.querySelectorAll('.radio-option input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const label = this.nextElementSibling;
                    
                    // Animate the selection
                    anime({
                        targets: label,
                        scale: [
                            { value: 0.95, duration: 100 },
                            { value: 1, duration: 200 }
                        ],
                        easing: 'easeOutExpo'
                    });
                }
            });
        });
    }
    
    function animateSection(sectionNumber) {
        const section = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
        
        // Animate form groups
        anime({
            targets: section.querySelectorAll('.form-group'),
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            easing: 'easeOutExpo',
            duration: 800
        });
        
        // Animate buttons
        anime({
            targets: section.querySelectorAll('button'),
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100, {start: 500}),
            easing: 'easeOutExpo',
            duration: 800
        });
    }
    
    function initializeAnimations() {
        // Initial animations
        anime({
            targets: '.card',
            opacity: [0, 1],
            translateY: [50, 0],
            easing: 'easeOutExpo',
            duration: 1200
        });
        
        anime({
            targets: '.card-header',
            opacity: [0, 1],
            translateY: [30, 0],
            easing: 'easeOutExpo',
            duration: 1200,
            delay: 300
        });
        
        // Animate the first section
        setTimeout(() => {
            animateSection(1);
        }, 800);
        
        // Add floating animation to pulse icon
        anime({
            targets: '.pulse-icon',
            translateY: ['-5px', '5px'],
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            duration: 1500
        });
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #FF5252 !important;
        }
        
        .error-message {
            color: #FF5252;
            font-size: 12px;
            margin-top: 5px;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});
