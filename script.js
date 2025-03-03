document.addEventListener("DOMContentLoaded", function () {
    function showSection(sectionId) {
        let aboutSection = document.getElementById("about");
        let projectsSection = document.getElementById("projects");
        let resumeSection = document.getElementById("resume");

        // Hide all sections first
        aboutSection.style.display = "none";
        projectsSection.style.display = "none";
        resumeSection.style.display = "none";

        let section = document.getElementById(sectionId);
        section.style.display = "block";
        section.style.opacity = "0";
        section.style.transform = "translateX(100%)";
        setTimeout(() => {
            section.style.opacity = "1";
            section.style.transform = "translateX(0)";
        }, 100);
        section.scrollIntoView({ behavior: "smooth" });
    }

    document.querySelector(".about-btn").addEventListener("click", function (e) {
        e.preventDefault();
        showSection("about");
    });

    document.querySelector(".projects-btn").addEventListener("click", function (e) {
        e.preventDefault();
        showSection("projects");
    });

    document.querySelector(".resume-btn").addEventListener("click", function (e) {
        e.preventDefault();
        showSection("resume");
    });

    document.querySelector(".home-btn").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("home").scrollIntoView({ behavior: "smooth" });
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});
