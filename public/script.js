const MAX_LENGTH = 20;

document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const charCounter = document.getElementById('charCounter');
    const submitBtn = document.getElementById('submitBtn');
    const validationWarning = document.getElementById('validationWarning');

    // Alerts
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    const successMessageText = document.getElementById('successMessageText');

    // Real-time character counter
    messageInput.addEventListener('input', () => {
        const length = messageInput.value.length;
        charCounter.textContent = `${length} / ${MAX_LENGTH}`;

        if (length > MAX_LENGTH) {
            charCounter.classList.add('error');
            messageInput.style.borderColor = 'var(--error)';
        } else {
            charCounter.classList.remove('error');
            messageInput.style.borderColor = '';
        }

        // Hide warning if user starts typing again
        validationWarning.classList.remove('show');
        hideAlerts();
    });

    function hideAlerts() {
        errorAlert.classList.remove('show');
        successAlert.classList.remove('show');
        setTimeout(() => {
            errorAlert.style.display = 'none';
            successAlert.style.display = 'none';
        }, 20); // Wait for transition
    }

    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const message = messageInput.value;
        hideAlerts();

        // 1. FRONTEND VALIDATION
        // This is what the attacker bypasses!
        if (message.length > MAX_LENGTH) {
            // Fails validation -> Show error UI and STOP (no network request)
            validationWarning.classList.add('show');
            errorAlert.style.display = 'flex';

            // Small delay to allow display flex to apply before adding class for opacity
            setTimeout(() => {
                errorAlert.classList.add('show');
            }, 10);
            return;
        }

        if (message.length === 0) {
            return; // Ignore empty submissions
        }

        // 2. NETWORK REQUEST
        // Validation passed, proceed to send to backend
        setLoading(true);

        try {
            // Note: If someone intercepts this request with Burp Suite, 
            // they can change the JSON body to a very long string.
            // Since the backend doesn't re-validate, it will accept it!
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            setLoading(false);

            if (data.status === 'success') {
                successMessageText.textContent = data.receivedText;
                successAlert.style.display = 'flex';
                setTimeout(() => {
                    successAlert.classList.add('show');
                }, 10);

                // Reset input on success
                messageInput.value = '';
                charCounter.textContent = `0 / ${MAX_LENGTH}`;
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            alert('Failed to connect to the server');
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
});
