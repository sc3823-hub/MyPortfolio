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

    // Initialize menu items with delay indices
    navMenu.querySelectorAll('li').forEach((item, index) => {
        item.style.setProperty('--i', index + 1);
    });

    // Toggle menu function
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        
        if (isMenuOpen) {
            navMenu.style.display = 'block';
            // Small delay to ensure display: block takes effect
            setTimeout(() => {
                navMenu.classList.add('active');
                // Animate menu items
                const menuItems = navMenu.querySelectorAll('li');
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100 + (index * 100));
                });
            }, 10);
        } else {
            navMenu.classList.remove('active');
            // Reset menu items
            const menuItems = navMenu.querySelectorAll('li');
            menuItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });
            // Wait for transition to complete before hiding menu
            setTimeout(() => {
                if (!isMenuOpen) { // Double check menu is still closed
                    navMenu.style.display = 'none';
                }
            }, 300);
        }

        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    // Close menu function
    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset menu items
            const menuItems = navMenu.querySelectorAll('li');
            menuItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });

            // Wait for transition to complete before hiding menu
            setTimeout(() => {
                if (!isMenuOpen) { // Double check menu is still closed
                    navMenu.style.display = 'none';
                }
            }, 300);

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

    // Event Listeners
    hamburger.addEventListener('click', toggleMenu);

    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            if (isMenuOpen) {
                closeMenu();
                setTimeout(() => {
                    showSection(targetId);
                    updateActiveNavLink(targetId);
                }, 300);
            } else {
                showSection(targetId);
                updateActiveNavLink(targetId);
            }
        });
    });

    // Scroll handler
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                if (Math.abs(currentScroll - lastScrollTop) > 30) {
                    handleScroll(currentScroll);
                    lastScrollTop = currentScroll;
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    function handleScroll(scrollPos) {
        if (!isMenuOpen) {
            if (scrollPos > lastScrollTop && scrollPos > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
    }

    // Show section with optimized performance
    function showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Pre-load next section with optimized timing
        if (!visitedSections.has(sectionId)) {
            visitedSections.add(sectionId);
            section.style.display = 'flex';
            
            // Use double RAF for smoother animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    section.classList.add('visible');
                    const content = section.querySelector('.section-content');
                    if (content) {
                        content.classList.add('visible');
                    }
                });
            });
        }

        const headerHeight = document.querySelector('header').offsetHeight;
        const windowHeight = window.innerHeight;
        const sectionHeight = section.offsetHeight;
        let targetPosition;

        // Calculate position to center the section
        if (sectionHeight <= windowHeight - headerHeight) {
            // If section fits in viewport, center it
            targetPosition = section.offsetTop - ((windowHeight - sectionHeight) / 2);
        } else {
            // If section is taller, align to top with header offset
            targetPosition = section.offsetTop - headerHeight;
        }

        // Ensure we don't scroll past the top
        targetPosition = Math.max(0, targetPosition);

        // Optimized smooth scroll
        if (isMobile) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            smoothScrollTo(targetPosition, 600); // Increased duration for smoother feel
        }

        // Update active state after scroll
        setTimeout(() => {
            updateActiveNavLink(sectionId);
            
            // Ensure content is visible and centered
            const content = section.querySelector('.section-content');
            if (content) {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
        }, 100);
    }

    // Optimized smooth scroll with improved easing
    function smoothScrollTo(targetPosition, duration = 600) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);

            // Improved easing function for smoother motion
            const ease = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const position = startPosition + distance * ease(progress);

            window.scrollTo(0, position);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // Optimized section observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const content = section.querySelector('.section-content');
                
                // Use double RAF for smoother animation
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        section.classList.add('visible');
                        
                        if (content) {
                            // Add small delay for sequential animation
                            setTimeout(() => {
                                content.classList.add('visible');
                                
                                // Center content if needed
                                if (entry.intersectionRatio > 0.7) {
                                    const rect = content.getBoundingClientRect();
                                    const windowHeight = window.innerHeight;
                                    const headerHeight = document.querySelector('header').offsetHeight;
                                    
                                    if (rect.height < windowHeight - headerHeight) {
                                        const offset = (windowHeight - rect.height) / 2 - headerHeight;
                                        if (Math.abs(rect.top - offset) > 10) {
                                            window.scrollBy({
                                                top: rect.top - offset,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }
                                }
                            }, 50);
                        }
                    });
                });
            }
        });
    }, {
        threshold: [0.3, 0.7],
        rootMargin: '-5% 0px -5% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    // Update active link
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
        if (homeSection.querySelector('.section-content')) {
            homeSection.querySelector('.section-content').classList.add('visible');
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Preload background image
    window.addEventListener('load', () => {
        const img = new Image();
        img.src = '5753195.webp';
        img.onload = () => {
            document.body.classList.add('bg-loaded');
        };
    });

    // Clean up event listeners when navigating away
    window.addEventListener('unload', () => {
        window.removeEventListener('scroll', onScroll);
        sectionObserver.disconnect();
    });
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

