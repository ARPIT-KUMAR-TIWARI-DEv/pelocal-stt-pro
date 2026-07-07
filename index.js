// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(45, 27, 105, 0.98)';
        navbar.style.padding = '15px 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(45, 27, 105, 0.95)';
        navbar.style.padding = '20px 0';
        navbar.style.boxShadow = 'none';
    }
});

// FAQ accordion functionality
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
        const accordionItem = button.closest('.accordion-item');
        accordionItem.classList.toggle('active');
    });
});

// Counter animation for statistics (if needed)
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize counters when in viewport
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add animation classes or trigger animations
            entry.target.classList.add('animate-in');
            
            // If there are counters in this section, animate them
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, 0, target, 2000);
            });
        }
    });
}, observerOptions);

// Observe sections that need animation
document.querySelectorAll('.benefits-section, .reviews-section').forEach(section => {
    observer.observe(section);
});

// Form submission handling (for the order form when implemented)
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            // Simple validation
            if (!formObject.name || !formObject.email || !formObject.birthdate) {
                alert('Please fill in all required fields');
                return;
            }
            
            // In a real implementation, you would send this data to your server
            console.log('Form submitted:', formObject);
            
            // Show success message
            alert('Thank you! Your soulmate sketch order has been received. You will receive your sketch within 24 hours.');
            
            // Reset form
            this.reset();
        });
    }
});

// Add floating elements animation
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

// Initialize on load
window.addEventListener('load', function() {
    animateFloatingElements();
    
    // Add loading animation
    document.body.classList.add('loaded');
});