/**
 * Value Propositions Carousel
 * Continuous sliding carousel with 6-second pauses between movements
 */
class ValuePropsCarousel {
    constructor() {
        // DOM elements
        this.wrapper = document.querySelector('.value-props-wrapper');
        this.slider = document.querySelector('.value-props-slider');

        // Exit if elements don't exist
        if (!this.wrapper || !this.slider) return;

        // Get the first value-prop card and calculate its width
        const firstCard = this.slider.querySelector('.value-prop');
        this.cardWidth = firstCard ? firstCard.offsetWidth : 450; // fallback to 450 if no card exists

        // Configuration
        this.cardGap = 48; // 3rem = 48px
        this.animationDuration = 1000; // 1 second slide animation
        this.pauseDuration = 5000; // 5 seconds pause between slides

        // State
        this.originalCards = [];
        this.cardQueue = [];
        this.isAnimating = false;
        this.isPaused = false;
        this.currentTranslateX = 0;
        this.animationTimer = null;
        this.visibleCards = this.calculateVisibleCards();

        // Initialize
        this.init();
    }

    init() {
        // Store original cards
        this.storeOriginalCards();

        // Setup initial DOM state
        this.setupInitialDOM();

        // Add event listeners
        this.addEventListeners();

        // Start the animation loop
        this.startCarousel();
    }

    storeOriginalCards() {
        // Get all original value-prop cards
        const cards = this.slider.querySelectorAll('.value-prop');

        // Store originals and create queue
        cards.forEach(card => {
            this.originalCards.push(card.cloneNode(true));
        });

        // Create infinite queue (duplicate the array for seamless loop)
        this.cardQueue = [...this.originalCards, ...this.originalCards.map(card => card.cloneNode(true))];
    }

    setupInitialDOM() {
        // Clear current slider
        this.slider.innerHTML = '';

        // Calculate how many cards to show (visible + 2 buffer)
        const cardsToShow = Math.min(this.visibleCards + 2, this.cardQueue.length);

        // Add initial cards to DOM
        for (let i = 0; i < cardsToShow; i++) {
            this.slider.appendChild(this.cardQueue[i].cloneNode(true));
        }

        // Track current position in queue
        this.currentQueueIndex = cardsToShow;
    }

    calculateVisibleCards() {
        const wrapperWidth = this.wrapper.offsetWidth;
        const cardTotalWidth = this.cardWidth + this.cardGap;

        // Calculate based on viewport width
        if (window.innerWidth <= 480) {
            return 2;
        } else if (window.innerWidth <= 768) {
            return 3;
        } else if (window.innerWidth <= 1024) {
            return 4;
        } else {
            // For larger screens, calculate based on available space
            return Math.floor(wrapperWidth / cardTotalWidth) || 4;
        }
    }

    addEventListeners() {
        // Pause on hover
        this.wrapper.addEventListener('mouseenter', () => this.pause());
        this.wrapper.addEventListener('mouseleave', () => this.resume());

        // Handle window resize with debouncing
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });

        // Handle page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    async startCarousel() {
        if (this.isPaused || this.isAnimating) return;

        // Wait for pause duration
        await this.wait(this.pauseDuration);

        if (!this.isPaused) {
            // Perform slide animation
            await this.slideToNext();

            // Continue the loop
            this.startCarousel();
        }
    }

    async slideToNext() {
        if (this.isAnimating) return;

        this.isAnimating = true;

        // Calculate slide distance (one card width + gap)
        const slideDistance = this.cardWidth + this.cardGap;

        // Apply transform for smooth slide
        this.currentTranslateX -= slideDistance;
        this.slider.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        this.slider.style.transform = `translateX(${this.currentTranslateX}px)`;

        // Wait for animation to complete
        await this.wait(this.animationDuration);

        // Update DOM (remove first, add next)
        this.updateDOM();

        this.isAnimating = false;
    }

    updateDOM() {
        // Disable transition for instant repositioning
        this.slider.style.transition = 'none';

        // Remove the first card
        const firstCard = this.slider.firstElementChild;
        if (firstCard) {
            firstCard.remove();
        }

        // Add next card from queue
        const nextCard = this.getNextCard();
        this.slider.appendChild(nextCard);

        // Reset transform position (move back by one card width)
        this.currentTranslateX += this.cardWidth + this.cardGap;
        this.slider.style.transform = `translateX(${this.currentTranslateX}px)`;

        // Force reflow to apply the instant transform
        this.slider.offsetHeight;
    }

    getNextCard() {
        // Get next card from queue
        const card = this.cardQueue[this.currentQueueIndex % this.cardQueue.length];
        this.currentQueueIndex++;

        // Reset index if we've gone through all cards
        if (this.currentQueueIndex >= this.cardQueue.length) {
            this.currentQueueIndex = 0;
        }

        return card.cloneNode(true);
    }

    pause() {
        this.isPaused = true;
        clearTimeout(this.animationTimer);
    }

    resume() {
        if (!this.isPaused) return;

        this.isPaused = false;
        this.startCarousel();
    }

    handleResize() {
        // Get current card width
        const firstCard = this.slider.querySelector('.value-prop');
        const newCardWidth = firstCard ? firstCard.offsetWidth : 450;

        // Update card width if changed
        if (newCardWidth !== this.cardWidth) {
            this.cardWidth = newCardWidth;
        }

        // Recalculate visible cards
        const newVisibleCards = this.calculateVisibleCards();

        if (newVisibleCards !== this.visibleCards) {
            this.visibleCards = newVisibleCards;
            // Reset the carousel with new dimensions
            this.reset();
        }
    }

    reset() {
        // Pause current animation
        this.pause();

        // Reset state
        this.currentTranslateX = 0;
        this.currentQueueIndex = 0;
        this.isAnimating = false;

        // Reset DOM
        this.setupInitialDOM();

        // Reset transform
        this.slider.style.transition = 'none';
        this.slider.style.transform = 'translateX(0)';

        // Restart after a brief delay
        setTimeout(() => {
            this.isPaused = false;
            this.startCarousel();
        }, 100);
    }

    wait(ms) {
        return new Promise(resolve => {
            this.animationTimer = setTimeout(resolve, ms);
        });
    }

    destroy() {
        // Clean up event listeners and timers
        this.pause();
        clearTimeout(this.animationTimer);

        // Reset DOM to original state if needed
        this.slider.innerHTML = '';
        this.originalCards.forEach(card => {
            this.slider.appendChild(card.cloneNode(true));
        });

        // Reset styles
        this.slider.style.transform = '';
        this.slider.style.transition = '';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.valuePropsCarousel = new ValuePropsCarousel();
    });
} else {
    // DOM is already loaded
    window.valuePropsCarousel = new ValuePropsCarousel();
}
