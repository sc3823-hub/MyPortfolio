document.addEventListener("DOMContentLoaded", function () {
    // Performance optimized variables
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
    let scrollTimeout;

    // Initialize sections with improved timing
    const visibleSections = new Set(['home']);
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.style.display = 'flex';
        requestAnimationFrame(() => {
            homeSection.classList.add('visible');
            const homeContent = homeSection.querySelector('.section-content');
            if (homeContent) homeContent.classList.add('visible');
        });
    }

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

    // Optimized scroll handler with debounce
    function onScroll() {
        if (!ticking) {
            cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                const scrollDelta = Math.abs(currentScroll - lastScrollTop);
                
                if (scrollDelta > 30) {
                    header.style.transform = currentScroll > lastScrollTop ? 
                        'translateY(-100%)' : 'translateY(0)';
                    lastScrollTop = currentScroll;
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    // Enhanced smooth scroll
    function smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 600;
        const startTime = performance.now();

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function scroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easing = easeOutCubic(progress);
            
            window.scrollTo(0, startPosition + (distance * easing));

            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        }

        requestAnimationFrame(scroll);
    }

    // Function to show section
    function showSection(sectionId) {
        console.log('Showing section:', sectionId); // Debug log

        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('visible');
        });

        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show the target section
        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (targetSection) {
            targetSection.style.display = 'flex';
            targetSection.classList.add('visible');
        }

        if (targetLink) {
            targetLink.classList.add('active');
        }

        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            console.log('Nav link clicked:', sectionId); // Debug log
            showSection(sectionId);
        });
    });

    // Handle mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Show initial section based on hash or default to home
    const initialSection = window.location.hash ? window.location.hash.substring(1) : 'home';
    showSection(initialSection);

    // Handle hash change
    window.addEventListener('hashchange', () => {
        const sectionId = window.location.hash.substring(1);
        showSection(sectionId);
    });

    // Optimized intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const content = target.querySelector('.section-content');
                
                requestAnimationFrame(() => {
                    target.classList.add('visible');
                    if (content) content.classList.add('visible');
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-20px'
    });

    sections.forEach(section => observer.observe(section));

    // Clean up function
    window.addEventListener('unload', () => {
        window.removeEventListener('scroll', onScroll);
        observer.disconnect();
        cancelAnimationFrame(scrollTimeout);
    });

    // Preload background image
    window.addEventListener('load', () => {
        const img = new Image();
        img.src = '5753195.webp';
        img.onload = () => {
            document.body.classList.add('bg-loaded');
        };
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

// Enhanced section reveal with staggered animations
const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            const content = section.querySelector('.section-content');
            const elements = content.children;
            
            // Animate section
            section.classList.add('visible');
            
            // Staggered animation for children
            Array.from(elements).forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100 * (index + 1));
            });
            
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

// Project cards enhanced hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(1.02, 1.02, 1.02)
        `;

        // Dynamic shadow
        const shadowX = (x - centerX) / 20;
        const shadowY = (y - centerY) / 20;
        card.style.boxShadow = `
            ${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.2)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.boxShadow = 'none';
    });
});

// Enhanced navigation hover effect
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px)';
        link.style.color = 'var(--primary-color)';
    });

    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
        link.style.color = '';
    });
});

// Animate sections on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate children with delay
            const children = entry.target.querySelectorAll('.animate-on-scroll');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, 200 * index);
            });
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '-50px'
});

document.querySelectorAll('.section').forEach(section => {
    animateOnScroll.observe(section);
});

// Modal functionality
const modal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');
const fileList = document.querySelector('.file-list');

// Close modal when clicking the close button or outside the modal
if (closeModal) {
    closeModal.onclick = () => modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Function to display files for a project
async function showProjectFiles(projectName, folderPath) {
    modal.style.display = "block";
    document.querySelector('.modal-title').textContent = projectName;
    
    try {
        // For demonstration, show static file list
        const files = [
            { name: 'Presentation.pptx', path: `${folderPath}/presentation.pptx` },
            { name: 'Data Analysis.xlsx', path: `${folderPath}/analysis.xlsx` },
            { name: 'Documentation.pdf', path: `${folderPath}/docs.pdf` }
        ];
        
        // Display the files
        fileList.innerHTML = files.map(file => `
            <div class="file-item">
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <a href="${file.path}" class="file-download" download>
                    <i class="fas fa-download"></i>
                </a>
            </div>
        `).join('');
    } catch (error) {
        fileList.innerHTML = '<p>Error loading files. Please try again later.</p>';
    }
}

// Update all view details buttons
document.querySelectorAll('.view-details-btn').forEach(button => {
    button.onclick = () => {
        const projectCard = button.closest('.project-card');
        const projectName = projectCard.querySelector('h3').textContent;
        const folderPath = button.getAttribute('data-folder');
        showProjectFiles(projectName, folderPath);
    }
});

// Remove any conflicting scroll or intersection observers
const existingObservers = ['sectionObserver', 'animateOnScroll', 'observer'];
existingObservers.forEach(observerName => {
    if (window[observerName]) {
        window[observerName].disconnect();
    }
});