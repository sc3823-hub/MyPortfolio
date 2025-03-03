document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements with performance optimization
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('header');
    let isMenuOpen = false;
    let isMobile = window.innerWidth <= 768;
    let lastScrollTop = 0;
    let ticking = false;
    let touchStartY = 0;
    let touchStartX = 0;
    let visitedSections = new Set(['home']);

    // Initialize menu state
    if (!hamburger || !navMenu) {
        console.error('Menu elements not found');
        return;
    }

    // Mobile detection
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
    }, { passive: true });

    // Add index to nav items for staggered animation
    navMenu.querySelectorAll('li').forEach((item, index) => {
        item.style.setProperty('--i', index + 1);
    });

    // Simplified menu toggle for mobile
    function toggleMenu(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Optimized touch handling
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (isMenuOpen) {
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);

            // Only prevent scroll if moving horizontally
            if (deltaY < Math.abs(deltaX)) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    // Optimized click handlers
    hamburger.addEventListener('click', toggleMenu, { passive: true });

    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    }, { passive: true });

    // Simplified navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            if (isMenuOpen) {
                closeMenu();
                // Reduced delay for mobile
                setTimeout(() => {
                    scrollToSection(targetId);
                }, 200);
            } else {
                scrollToSection(targetId);
            }
        }, { passive: true });
    });

    // Optimized scroll handling
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const offset = isMobile ? 60 : 80;
        const targetPosition = section.offsetTop - offset;

        if (isMobile) {
            // Simple scroll for mobile
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Smooth scroll for desktop
            smoothScrollTo(targetPosition);
        }

        updateActiveNavLink(sectionId);
    }

    // Simplified section visibility
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (!isMobile) {
                    const content = entry.target.querySelector('.section-content');
                    if (content) content.classList.add('visible');
                }
                updateActiveNavLink(entry.target.id);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.classList.add('visible');
        sectionObserver.observe(section);
    });

    // Simplified active link update
    function updateActiveNavLink(sectionId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === sectionId);
        });
    }

    // Initialize first section
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('visible');
        const content = homeSection.querySelector('.section-content');
        if (content) content.classList.add('visible');
    }
});

// Disable parallax effect on mobile
const isMobile = window.innerWidth <= 768;
if (!isMobile) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            requestAnimationFrame(() => {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            });
        }
    }, { passive: true });
}

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

// Optimized section reveal
const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    threshold: 0.15
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

