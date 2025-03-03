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
