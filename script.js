document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    // Function to show section
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // Function to toggle mobile menu
    function toggleMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        isMenuOpen = !isMenuOpen;
        
        // Toggle classes with a slight delay for better animation
        if (isMenuOpen) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add touch event prevention
            document.addEventListener('touchmove', preventScroll, { passive: false });
        } else {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Remove touch event prevention
            document.removeEventListener('touchmove', preventScroll);
        }
    }

    // Prevent scroll function
    function preventScroll(e) {
        e.preventDefault();
    }

    // Enhanced close menu function
    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('touchmove', preventScroll);
        }
    }

    // Handle navigation clicks with improved mobile experience
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active section
            showSection(targetId);
            
            // Close mobile menu with slight delay for animation
            setTimeout(closeMenu, 50);

            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');

            // Smooth scroll to section with offset for header
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerOffset = 60;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });

        // Add touch feedback
        link.addEventListener('touchstart', () => {
            link.style.opacity = '0.7';
        });

        link.addEventListener('touchend', () => {
            link.style.opacity = '1';
        });
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Handle touch events for mobile
    document.addEventListener('touchstart', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Prevent scrolling when menu is open on mobile
    navMenu.addEventListener('touchmove', (e) => {
        if (isMenuOpen) {
            e.preventDefault();
        }
    }, { passive: false });

    // Show home section by default
    showSection('home');

    // Update active link based on current section
    function updateActiveLink() {
        const currentSection = document.querySelector('section.active');
        if (currentSection) {
            const currentId = currentSection.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Observe section changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateActiveLink();
            }
        });
    });

    sections.forEach(section => {
        observer.observe(section, { attributes: true });
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Intersection Observer for revealing sections
const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal');
    sectionObserver.observe(section);
});

// Dynamic typing effect for role text
const roleText = "Data Analyst & Marketing Specialist";
const typingText = document.querySelector('.typing-text');

if (typingText) {
    typingText.textContent = '';
    let charIndex = 0;

    const typeWriter = () => {
        if (charIndex < roleText.length) {
            typingText.textContent += roleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    };

    // Start typing animation when the element is in view
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                typingObserver.unobserve(entry.target);
            }
        });
    });

    typingObserver.observe(typingText);
}

// Project cards hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});
