document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DARK MODE TOGGLE LOGIC
    // ----------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';

    // Set initial icon state
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // Toggle function
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icon
        if (themeToggle) {
            themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }


    // ----------------------------------------------------------------------
    // 2. SCROLL-REVEAL ANIMATION (Intersection Observer)
    // ----------------------------------------------------------------------

    const scrollElements = document.querySelectorAll(".js-scroll");

    // Pre-calculate stagger for project cards
    const projectCards = document.querySelectorAll("#work .project-card.js-scroll");
    projectCards.forEach((card, index) => {
        card.style.setProperty('--item-index', index);
    });

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        // Check if element top is less than 100% (or specified %) of the viewport height
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("animated");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            // Check if the element is 80% or more in view
            if (elementInView(el, 80)) {
                displayScrollElement(el);
            }
        });
    };

    // Use Intersection Observer for better performance than scroll event
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                displayScrollElement(entry.target);
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Root margin pulls the trigger point down, so animation starts slightly before it hits the bottom
        rootMargin: "0px 0px -100px 0px",
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe all elements with the .js-scroll class
    scrollElements.forEach(el => observer.observe(el));

    // Optional: run a quick check on load for elements already in view
    handleScrollAnimation(); 
});
// --- Code to add to script.js ---

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const domain = card.getAttribute('data-domain');
            
            // Hide all cards initially
            card.style.display = 'none';
            card.classList.remove('animated'); // Reset animation state
            
            if (filterValue === 'all' || domain === filterValue) {
                // Show matching cards and re-enable scroll-reveal
                card.style.display = 'block';
                // Trigger the animation for the newly visible cards (optional)
                setTimeout(() => card.classList.add('animated'), 100); 
            }
        });

        // Optional: Highlight the active filter button
        filterButtons.forEach(btn => btn.classList.remove('active-filter'));
        button.classList.add('active-filter');
    });
});
// ----------------------------------------------------------------------
// 3. LIGHTBOX / IMAGE MODAL LOGIC (Add to script.js)
// ----------------------------------------------------------------------

const lightbox = document.getElementById('lightbox');
const closeBtn = document.querySelector('.close-btn');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxTriggers = document.querySelectorAll('.js-lightbox-trigger');

lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault(); // Stop the link from navigating away

        const imageSrc = trigger.getAttribute('data-image-src');
        const title = trigger.getAttribute('data-lightbox-title');

        if (imageSrc) {
            lightboxImage.src = imageSrc;
            lightboxTitle.textContent = title;
            lightbox.classList.remove('hidden');
            // Force display to block before the transition starts
            lightbox.style.display = 'flex'; 
        } else {
            console.error('Lightbox trigger missing data-image-src attribute.');
        }
    });
});

// Close lightbox when the 'x' is clicked
closeBtn.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    // Hide after transition
    setTimeout(() => {
        lightbox.style.display = 'none';
    }, 300);
});

// Close lightbox when clicking outside (on the black background)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }
});
// ----------------------------------------------------------------------
// 4. PROJECT FILTER LOGIC (NEW)
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // ... existing setup code ...

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');

            // Filter cards
            projectCards.forEach(card => {
                const domain = card.getAttribute('data-domain');
                
                // Hide non-matching cards smoothly
                if (filterValue === 'all' || domain.includes(filterValue)) {
                    card.style.display = 'block';
                    // Optional: Re-animate visible cards
                    card.classList.add('animated'); 
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animated');
                }
            });
        });
    });

    // ... existing scroll animation logic ...
});