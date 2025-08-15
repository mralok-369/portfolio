// Portfolio JavaScript - Alok Kumar
// Modern, accessible, and performant interactions

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Navbar Functionality
class NavbarController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }

    init() {
        // Add scroll effect to navbar
        window.addEventListener('scroll', throttle(this.handleNavbarScroll.bind(this), 16));
        
        // Add smooth scrolling to nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', throttle(this.updateActiveNavLink.bind(this), 100));
    }

    handleNavbarScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Remove active class from all links
            this.navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Smooth scroll to target section
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Animation Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        // Create intersection observer for animations
        this.createIntersectionObserver();
        
        // Add profile picture animations
        this.initProfilePicAnimations();
        
        // Add typing effect to hero subtitle (if desired)
        this.initTypingEffect();
    }

    createIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all animatable elements
        const elementsToAnimate = document.querySelectorAll(
            '.skill-card, .project-card, .timeline-item, .contact-item'
        );
        
        elementsToAnimate.forEach(el => {
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    initProfilePicAnimations() {
        const profilePic = document.querySelector('.profile-pic');
        
        if (profilePic) {
            profilePic.addEventListener('mouseenter', () => {
                profilePic.style.transform = 'scale(1.05) rotate(5deg)';
            });

            profilePic.addEventListener('mouseleave', () => {
                profilePic.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    }

    initTypingEffect() {
        const subtitle = document.querySelector('.hero-content .subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let index = 0;
        const typeSpeed = 50; // milliseconds per character
        
        const typeWriter = () => {
            if (index < text.length) {
                subtitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            }
        };
        
        // Start typing effect after hero animation
        setTimeout(typeWriter, 1000);
    }
}

// Contact Form Controller
class ContactFormController {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(this.form);
        
        // Get form values
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Validate form
        if (!this.validateForm(name, email, subject, message)) {
            return;
        }
        
        // Create mailto link
        const mailtoLink = this.createMailtoLink(name, email, subject, message);
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        this.showSuccessMessage();
        
        // Reset form after a delay
        setTimeout(() => {
            this.form.reset();
        }, 1000);
    }

    validateForm(name, email, subject, message) {
        const errors = [];
        
        if (!name || name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!email || !this.isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!subject || subject.trim().length < 3) {
            errors.push('Subject must be at least 3 characters long');
        }
        
        if (!message || message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            this.showErrorMessage(errors);
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    createMailtoLink(name, email, subject, message) {
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        return `mailto:mralok369@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    showSuccessMessage() {
        // Create and show success notification
        const notification = this.createNotification(
            'Success!',
            'Thank you for your message! Your email client should now open with the pre-filled message.',
            'success'
        );
        this.showNotification(notification);
    }

    showErrorMessage(errors) {
        const errorText = errors.join('\n');
        const notification = this.createNotification(
            'Please fix the following errors:',
            errorText,
            'error'
        );
        this.showNotification(notification);
    }

    createNotification(title, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 1rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        return notification;
    }

    showNotification(notification) {
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Skills Animation Controller
class SkillsAnimationController {
    constructor() {
        this.skillCards = document.querySelectorAll('.skill-card');
        this.init();
    }

    init() {
        this.skillCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => this.animateSkillCard(card, 'enter'));
            card.addEventListener('mouseleave', () => this.animateSkillCard(card, 'leave'));
            
            // Stagger the initial animation
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    animateSkillCard(card, action) {
        const tags = card.querySelectorAll('.skill-tag');
        
        if (action === 'enter') {
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.05)';
                    tag.style.background = 'var(--primary-blue)';
                    tag.style.color = 'white';
                }, index * 50);
            });
        } else {
            tags.forEach(tag => {
                tag.style.transform = 'scale(1)';
                tag.style.background = 'var(--light-blue)';
                tag.style.color = 'var(--primary-blue)';
            });
        }
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load time
        window.addEventListener('load', this.logPageLoadTime.bind(this));
        
        // Monitor scroll performance
        let scrollCount = 0;
        window.addEventListener('scroll', throttle(() => {
            scrollCount++;
            if (scrollCount % 100 === 0) {
                console.log(`Scroll events processed: ${scrollCount}`);
            }
        }, 16));
    }

    logPageLoadTime() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        }
    }
}

// Main Application Initialization
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.initializeComponents.bind(this));
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.navbar = new NavbarController();
            this.animations = new AnimationController();
            this.contactForm = new ContactFormController();
            this.skillsAnimation = new SkillsAnimationController();
            
            // Initialize performance monitoring in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                this.performanceMonitor = new PerformanceMonitor();
            }
            
            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
        }
    }
}

// Global form submission handler (fallback)
window.handleFormSubmit = function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    const mailtoLink = `mailto:mralok369@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    window.location.href = mailtoLink;
    event.target.reset();
    
    alert('Thank you for your message! Your email client should now open with the pre-filled message.');
};

// Initialize the application
const app = new PortfolioApp();

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp };
}