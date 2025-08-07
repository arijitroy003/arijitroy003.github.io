// Portfolio Website JavaScript
// Professional interactions and animations

document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    initNavigation();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Header scroll effect
    initHeaderScrollEffect();
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    // Tech tag hover effects
    initTechTagInteractions();
    
    // Contact form interactions (if added later)
    initContactInteractions();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize header scroll effect
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class based on scroll position
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return; // Skip animations if user prefers reduced motion
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger effect for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-item, .timeline-item, .skill-category, .contact-link');
    animateElements.forEach(el => observer.observe(el));
}

/**
 * Initialize tech tag interactions
 */
function initTechTagInteractions() {
    const techTags = document.querySelectorAll('.tech-tag, .skill-tag');
    
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Add ripple effect or highlight related technologies
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add click handler for potential future functionality
        tag.addEventListener('click', function() {
            // Could show more information about the technology
            console.log(`Clicked on: ${this.textContent}`);
        });
    });
}

/**
 * Initialize contact interactions
 */
function initContactInteractions() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add analytics tracking or custom behavior
            const linkType = this.querySelector('span:last-child').textContent;
            console.log(`Contact link clicked: ${linkType}`);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Utility function to throttle scroll events
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initialize typing animation for hero subtitle (optional enhancement)
 */
function initTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
}

/**
 * Add scroll progress indicator (optional enhancement)
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 1001;
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        progressBar.style.transform = `scaleX(${scrollPercent})`;
        progressBar.style.width = '100%';
    }, 10));
}

/**
 * Initialize theme toggle (optional dark mode)
 */
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--ui-primary);
        color: var(--ui-background);
        border: none;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-lg);
    `;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });
    
    document.body.appendChild(themeToggle);
}

/**
 * Add CSS for scroll animations
 */
function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .about-item,
        .timeline-item,
        .skill-category,
        .contact-link {
            opacity: 0;
            transform: translateY(30px);
        }
        
        .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            box-shadow: var(--shadow-sm);
        }
        
        .nav-link.active {
            color: var(--ui-accent);
            font-weight: 600;
        }
        
        @media (prefers-color-scheme: dark) {
            .header.scrolled {
                background: rgba(17, 24, 39, 0.98);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize additional styles
addScrollAnimationStyles();

// Optional enhancements (uncomment to enable)
// initTypingAnimation();
// initScrollProgress();
// initThemeToggle();

// Performance optimization: Remove unused event listeners on page unload
window.addEventListener('beforeunload', function() {
    // Clean up any event listeners if needed
    console.log('Cleaning up event listeners...');
});