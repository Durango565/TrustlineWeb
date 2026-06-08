/**
 * Trustline Technologies - Main JS
 * Handles UI interactions and form submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const statusDiv = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type=\"submit\"]');
    const originalBtnText = submitBtn.innerText;

    // Visual feedback: Loading
    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending...';
    statusDiv.classList.add('hidden');

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        statusDiv.innerText = 'Your request is received. We\'ll be in touch shortly to secure your Pilot\'s Seat.';
        statusDiv.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error('Server error. Please try again later.');
      }
    } catch (error) {
      statusDiv.innerText = error.message || 'Something went wrong. Please try again.';
      statusDiv.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = originalBtnText;
    }
  });
}
