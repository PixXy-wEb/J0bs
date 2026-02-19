// Initialize EmailJS with your public key
(function() {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    // You can get this from your EmailJS dashboard (Account > API Keys)
    emailjs.init('7p2w-rRo0xFaHYOaU'); // [citation:10]
})();

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const formMessage = document.getElementById('formMessage');
    
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });

    // Form submission handler
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            setLoadingState(true);
            
            // Generate random contact number [citation:10]
            const contactNumber = Math.floor(Math.random() * 100000);
            document.querySelector('input[name="contact_number"]').value = contactNumber;
            
            try {
                // Send email using EmailJS
                // Replace these with your actual EmailJS IDs:
                // - 'YOUR_SERVICE_ID': From EmailJS dashboard (Email Services)
                // - 'YOUR_TEMPLATE_ID': From EmailJS dashboard (Email Templates) [citation:6]
                const result = await emailjs.sendForm(
                    'service_vnhlyhg',    // e.g., 'service_xyz'
                    'template_z7pfcq6',   // e.g., 'template_abc'
                    contactForm
                );
                
                if (result.text === 'OK') {
                    showMessage('success', '¡Mensaje enviado con éxito! Te responderé a la brevedad.');
                    contactForm.reset();
                    
                    // Clear any validation styles
                    document.querySelectorAll('.form-control').forEach(field => {
                        field.classList.remove('error');
                    });
                }
            } catch (error) {
                console.error('EmailJS Error:', error);
                showMessage('error', 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo o contacta directamente por email.');
            } finally {
                setLoadingState(false);
            }
        });
    }
    
    // Real-time validation
    const formControls = document.querySelectorAll('.form-control[required]');
    formControls.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Phone number formatting (optional)
    const phoneInput = document.getElementById('user_phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
                e.target.value = value;
            }
        });
    }
    
    // Validation functions
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Email validation
        const emailField = document.getElementById('user_email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                showFieldError(emailField, 'Ingresa un email válido');
                isValid = false;
            }
        }
        
        if (!isValid) {
            showMessage('error', 'Por favor completa todos los campos requeridos correctamente.');
        }
        
        return isValid;
    }
    
    function validateField(field) {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo es requerido');
            return false;
        } else {
            clearFieldError(field);
            return true;
        }
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Check if error message already exists
        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '13px';
        errorDiv.style.marginTop = '5px';
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }
    
    function showMessage(type, text) {
        formMessage.className = 'form-message ' + type;
        formMessage.textContent = text;
        formMessage.style.display = 'block';
        
        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
});