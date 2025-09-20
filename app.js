// Kamchatka Interactive Guide Application
class KamchatkaGuide {
    constructor() {
        this.sections = [
            'intro', 'history', 'nature', 'attractions', 
            'local-tips', 'route-2days', 'modern-life'
        ];
        this.currentSectionIndex = 0;
        this.isTransitioning = false;
    }

    init() {
        console.log('Initializing Kamchatka Guide...');
        
        this.setupEventListeners();
        this.updateProgress();
        this.updateNavigation();
        this.setupMobileMenu();
        this.addInteractiveElements();
        this.addAccessibilityFeatures();
        this.addAnimatedCounters();
        
        // Initialize with intro section
        this.showSection(0);
        this.updateActiveNavLink();
        
        console.log('Камчатский путеводитель загружен успешно! 🌋');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Start journey button
        const startBtn = document.getElementById('start-journey');
        console.log('Start journey button found:', !!startBtn);
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Start journey clicked - navigating to section 1 (history)');
                this.goToSection(1); // Go to history section
            });
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Navigation links found:', navLinks.length);
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const sectionId = link.dataset.section;
                const sectionIndex = this.sections.indexOf(sectionId);
                console.log('Nav link clicked:', sectionId, 'index:', sectionIndex);
                if (sectionIndex !== -1) {
                    this.goToSection(sectionIndex);
                }
            });
        });

        // Previous/Next buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        console.log('Navigation buttons found - Prev:', !!prevBtn, 'Next:', !!nextBtn);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                this.previousSection();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                this.nextSection();
            });
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSection();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSection(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSection(this.sections.length - 1);
                    break;
                case 'Escape':
                    this.closeSidebar();
                    break;
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });

        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href.startsWith('#section-')) return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 99;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                `;
                
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', () => {
                    this.closeSidebar();
                });
            }
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        
        if (sidebar) {
            const isActive = sidebar.classList.contains('active');
            
            if (isActive) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        }
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            }
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
            
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            }
        }
    }

    showSection(index) {
        console.log('Showing section:', index, this.sections[index]);
        
        // Hide all sections first
        this.sections.forEach((sectionId) => {
            const section = document.getElementById(`section-${sectionId}`);
            if (section) {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });
        
        // Show target section
        const targetSection = document.getElementById(`section-${this.sections[index]}`);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            
            // Force reflow for smooth transition
            targetSection.offsetHeight;
            
            // Apply final styles
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        }
    }

    goToSection(index) {
        console.log('Going to section:', index, 'of', this.sections.length);
        
        if (this.isTransitioning || index < 0 || index >= this.sections.length) {
            console.log('Navigation blocked:', { isTransitioning: this.isTransitioning, index, sectionsLength: this.sections.length });
            return;
        }

        if (index === this.currentSectionIndex) {
            console.log('Already on section', index);
            return;
        }

        this.isTransitioning = true;
        
        // Update current section index
        this.currentSectionIndex = index;

        // Show the new section
        this.showSection(index);
        
        // Update UI elements
        this.updateProgress();
        this.updateNavigation();
        this.updateActiveNavLink();
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
        
        // Reset transitioning flag
        setTimeout(() => {
            this.isTransitioning = false;
            console.log('Transition completed to section:', index);
        }, 300);
    }

    nextSection() {
        console.log('Next section requested, current:', this.currentSectionIndex);
        if (this.currentSectionIndex < this.sections.length - 1) {
            this.goToSection(this.currentSectionIndex + 1);
        } else {
            console.log('Already at last section');
        }
    }

    previousSection() {
        console.log('Previous section requested, current:', this.currentSectionIndex);
        if (this.currentSectionIndex > 0) {
            this.goToSection(this.currentSectionIndex - 1);
        } else {
            console.log('Already at first section');
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const progress = ((this.currentSectionIndex + 1) / this.sections.length) * 100;
            progressFill.style.width = `${progress}%`;
            console.log('Progress bar updated to:', progress + '%');
        } else {
            console.log('Progress bar element not found');
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            const isFirstSection = this.currentSectionIndex === 0;
            prevBtn.disabled = isFirstSection;
            prevBtn.style.opacity = isFirstSection ? '0.5' : '1';
            prevBtn.style.cursor = isFirstSection ? 'not-allowed' : 'pointer';
        }

        if (nextBtn) {
            const isLastSection = this.currentSectionIndex === this.sections.length - 1;
            nextBtn.disabled = isLastSection;
            nextBtn.style.opacity = isLastSection ? '0.5' : '1';
            nextBtn.style.cursor = isLastSection ? 'not-allowed' : 'pointer';
            
            // Update text for last section
            if (isLastSection) {
                nextBtn.textContent = 'Завершить';
            } else {
                nextBtn.textContent = 'Далее →';
            }
        }
    }

    updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            const sectionId = link.dataset.section;
            const sectionIndex = this.sections.indexOf(sectionId);
            
            if (sectionIndex === this.currentSectionIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    addInteractiveElements() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.card, .highlight-card, .nature-card, .attraction-card, .tip-card, .change-card, .wildlife-card, .quote-card, .route-day-card, .period-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!this.style.transform.includes('translateY')) {
                    this.style.transform = 'translateY(-4px)';
                    this.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS animation for ripple effect
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
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
                .animate-on-scroll {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `;
            document.head.appendChild(style);
        }

        // Add scroll animations
        this.addScrollAnimations();
    }

    addScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-on-scroll');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            const animateElements = document.querySelectorAll(
                '.timeline-item-history, .nature-card, .attraction-card, .quote-card, .route-day-card, .period-card'
            );
            
            animateElements.forEach(element => {
                observer.observe(element);
            });
        }
    }

    addAccessibilityFeatures() {
        // Add ARIA labels and roles
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            section.setAttribute('role', 'tabpanel');
            section.setAttribute('aria-labelledby', `nav-${this.sections[index]}`);
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.setAttribute('role', 'tab');
            link.setAttribute('id', `nav-${this.sections[index]}`);
            link.setAttribute('aria-controls', `section-${this.sections[index]}`);
        });

        // Add keyboard support for quote cards
        const quoteCards = document.querySelectorAll('.quote-card');
        quoteCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
        });
    }

    addAnimatedCounters() {
        const highlightNumbers = document.querySelectorAll('.highlight-number, .stat-number, .demo-number');
        
        const animateCounter = (element) => {
            const text = element.textContent;
            const numberMatch = text.match(/\d+/);
            if (!numberMatch) return;
            
            const target = parseInt(numberMatch[0]);
            const suffix = text.replace(/\d+/g, '');
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                element.textContent = Math.floor(current) + suffix;
            }, 16);
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.animated) {
                        setTimeout(() => {
                            animateCounter(entry.target);
                        }, Math.random() * 500);
                        entry.target.dataset.animated = 'true';
                    }
                });
            }, { threshold: 0.5 });

            highlightNumbers.forEach(element => {
                observer.observe(element);
            });
        }
    }

    // Utility methods
    getCurrentSectionName() {
        return this.sections[this.currentSectionIndex];
    }

    getProgress() {
        return Math.round(((this.currentSectionIndex + 1) / this.sections.length) * 100);
    }
}

// Initialize the application
let guide;

function initializeKamchatkaGuide() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            guide = new KamchatkaGuide();
            guide.init();
            window.kamchatkaGuide = guide;
            document.body.classList.add('loaded');
        });
    } else {
        guide = new KamchatkaGuide();
        guide.init();
        window.kamchatkaGuide = guide;
        document.body.classList.add('loaded');
    }
}

// Start initialization
initializeKamchatkaGuide();

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Страница скрыта');
    } else {
        console.log('Страница активна');
    }
});

// Utility functions
window.KamchatkaUtils = {
    printCurrentSection() {
        if (window.kamchatkaGuide) {
            const currentIndex = window.kamchatkaGuide.currentSectionIndex;
            const sectionId = window.kamchatkaGuide.sections[currentIndex];
            const section = document.getElementById(`section-${sectionId}`);
            
            if (section) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Камчатка - ${section.querySelector('.section-header h2')?.textContent || 'Раздел'}</title>
                        <link rel="stylesheet" href="style.css">
                        <style>
                            body { background: white; }
                            .sidebar, .navigation-controls, .mobile-menu-btn, .progress-bar { display: none !important; }
                            .main-content { margin-left: 0; max-width: 100%; }
                        </style>
                    </head>
                    <body>
                        <div class="container-app">
                            <main class="main-content">
                                ${section.outerHTML}
                            </main>
                        </div>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    },
    
    exportGuideData() {
        const data = {
            title: 'Камчатка: Земля огня и льда',
            currentSection: window.kamchatkaGuide?.currentSectionIndex || 0,
            timestamp: new Date().toISOString(),
            sections: window.kamchatkaGuide?.sections || [],
            progress: window.kamchatkaGuide?.getProgress() || 0
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kamchatka-guide-data.json';
        a.click();
        URL.revokeObjectURL(url);
    },
    
    getReadingProgress() {
        if (window.kamchatkaGuide) {
            return window.kamchatkaGuide.getProgress();
        }
        return 0;
    },

    goToSection(sectionName) {
        if (window.kamchatkaGuide) {
            const index = window.kamchatkaGuide.sections.indexOf(sectionName);
            if (index !== -1) {
                window.kamchatkaGuide.goToSection(index);
                return true;
            }
        }
        return false;
    }
};

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('Ошибка в приложении:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Необработанная ошибка Promise:', e.reason);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                console.log(`Время загрузки приложения: ${loadTime}ms`);
            }
            
            // Mark app as fully loaded
            document.documentElement.setAttribute('data-app-loaded', 'true');
        }, 0);
    });
}