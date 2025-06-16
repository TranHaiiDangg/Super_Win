
        class FlashDealsSlider {
            constructor() {
                this.productTrack = document.getElementById('productTrack');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.countdown = document.getElementById('countdown');
                
                this.currentIndex = 0;
                this.itemWidth = 220;
                this.gap = 10;
                this.visibleItems = this.calculateVisibleItems();
                this.totalItems = this.productTrack.children.length;
                this.maxIndex = this.calculateMaxIndex();
                this.autoSlideInterval = null;
                this.countdownInterval = null;
                
                this.init();
            }

            calculateVisibleItems() {
                const containerWidth = this.productTrack.parentElement.offsetWidth - 100; // Account for nav buttons
                const itemTotalWidth = this.itemWidth + this.gap;
                const calculated = Math.floor(containerWidth / itemTotalWidth);
                return Math.max(1, Math.min(calculated, this.totalItems));
            }

            calculateMaxIndex() {
                // Ensure we never have empty space at the end
                const maxPossibleIndex = this.totalItems - this.visibleItems;
                return Math.max(0, maxPossibleIndex);
            }

            init() {
                this.updateSlider();
                this.bindEvents();
                this.startAutoSlide();
                this.startCountdown();
                
                // Handle resize
                window.addEventListener('resize', () => {
                    this.visibleItems = this.calculateVisibleItems();
                    this.maxIndex = this.calculateMaxIndex();
                    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                    this.updateSlider();
                    this.createDots();
                });
            }


            updateSlider() {
                const translateX = -(this.currentIndex * (this.itemWidth + this.gap));
                this.productTrack.style.transform = `translateX(${translateX}px)`;
                this.updateButtonStates();
                this.updateDots();
            }

            updateButtonStates() {
                // Always enable buttons since we have looping behavior
                this.prevBtn.disabled = false;
                this.nextBtn.disabled = false;
                
                // Only disable if we don't have enough items to scroll
                if (this.maxIndex === 0) {
                    this.prevBtn.disabled = true;
                    this.nextBtn.disabled = true;
                }
            }

            nextSlide() {
                // Always move to next item, but prevent going beyond the safe boundary
                this.currentIndex = (this.currentIndex + 1) % (this.maxIndex + 1);
                this.updateSlider();
            }

            prevSlide() {
                // Move to previous item, with proper wrapping
                this.currentIndex = this.currentIndex === 0 ? this.maxIndex : this.currentIndex - 1;
                this.updateSlider();
            }

            bindEvents() {
                this.nextBtn.addEventListener('click', () => {
                    this.nextSlide();
                    this.resetAutoSlide();
                });

                this.prevBtn.addEventListener('click', () => {
                    this.prevSlide();
                    this.resetAutoSlide();
                });

                // Touch events for mobile
                let touchStartX = 0;
                let touchEndX = 0;

                this.productTrack.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                }, { passive: true });

                this.productTrack.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].clientX;
                    this.handleSwipe(touchStartX, touchEndX);
                }, { passive: true });

                // Pause auto-slide on hover
                this.productTrack.addEventListener('mouseenter', () => {
                    this.pauseAutoSlide();
                });

                this.productTrack.addEventListener('mouseleave', () => {
                    this.startAutoSlide();
                });
            }

            handleSwipe(startX, endX) {
                const swipeThreshold = 50;
                const diff = startX - endX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                    this.resetAutoSlide();
                }
            }

            startAutoSlide() {
                this.autoSlideInterval = setInterval(() => {
                    this.nextSlide();
                }, 4000);
            }

            pauseAutoSlide() {
                clearInterval(this.autoSlideInterval);
            }

            resetAutoSlide() {
                this.pauseAutoSlide();
                this.startAutoSlide();
            }

            startCountdown() {
                let hours = 1;
                let minutes = 28;
                let seconds = 49;

                this.countdownInterval = setInterval(() => {
                    if (seconds > 0) {
                        seconds--;
                    } else if (minutes > 0) {
                        minutes--;
                        seconds = 59;
                    } else if (hours > 0) {
                        hours--;
                        minutes = 59;
                        seconds = 59;
                    } else {
                        // Reset countdown when it reaches 00:00:00
                        hours = 1;
                        minutes = 28;
                        seconds = 49;
                    }

                    const formattedTime = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
                    this.countdown.textContent = formattedTime;
                }, 1000);
            }
        }

        // Initialize slider when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new FlashDealsSlider();
        });