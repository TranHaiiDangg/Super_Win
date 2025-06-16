    const mainSlideContainer = document.querySelector(".slide-container");
    const mainSlides = document.querySelectorAll(".slide");
    const mainPrevBtn = document.querySelector(".prev");
    const mainNextBtn = document.querySelector(".next");
    const mainDots = document.querySelectorAll(".dot");
    const mainSlideWidth = 880;

    let mainCurrentIndex = 1; // Bắt đầu từ slide 1 (vì slide 0 là clone của cuối)
    let mainAutoSlideInterval;

    function updateMainDots() {
      // Remove active class from all dots
      mainDots.forEach(dot => dot.classList.remove('active'));
      
      // Add active class to current dot
      // Subtract 1 from mainCurrentIndex because we have a clone at the start
      const dotIndex = mainCurrentIndex - 1;
      if (dotIndex >= 0 && dotIndex < mainDots.length) {
        mainDots[dotIndex].classList.add('active');
      }
    }

    function showMainSlide(index, transition = true) {
      if (!transition) mainSlideContainer.style.transition = "none";
      else mainSlideContainer.style.transition = "transform 0.5s ease-in-out";

      const offset = -index * mainSlideWidth;
      mainSlideContainer.style.transform = `translateX(${offset}px)`;
      mainCurrentIndex = index;
      updateMainDots();
    }

    function nextMainSlide() {
      if (mainCurrentIndex >= mainSlides.length - 1) return;
      showMainSlide(mainCurrentIndex + 1);
    }

    function prevMainSlide() {
      if (mainCurrentIndex <= 0) return;
      showMainSlide(mainCurrentIndex - 1);
    }

    function goToMainSlide(index) {
      // Add 1 to index because we have a clone at the start
      showMainSlide(index + 1);
      resetMainAutoSlide();
    }

    function resetMainAutoSlide() {
      clearInterval(mainAutoSlideInterval);
      mainAutoSlideInterval = setInterval(nextMainSlide, 5000);
    }

    // Khi chuyển xong slide clone → nhảy về slide thật
    mainSlideContainer.addEventListener("transitionend", () => {
      if (mainCurrentIndex === mainSlides.length - 1) {
        showMainSlide(1, false); // clone đầu → slide 1
      }
      if (mainCurrentIndex === 0) {
        showMainSlide(mainSlides.length - 2, false); // clone cuối → slide cuối thật
      }
    });

    mainNextBtn.addEventListener("click", () => {
      nextMainSlide();
      resetMainAutoSlide();
    });

    mainPrevBtn.addEventListener("click", () => {
      prevMainSlide();
      resetMainAutoSlide();
    });

    // Add click events to dots
    mainDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goToMainSlide(index);
      });
    });

    // Auto slide
    mainAutoSlideInterval = setInterval(nextMainSlide, 5000);

    // Khởi tạo
    showMainSlide(mainCurrentIndex);