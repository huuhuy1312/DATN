const slides = document.querySelectorAll('.slide');

let currentSlide = 0;
const numSlide = slides.length;

const gotoSlide = function (slide) {
    slides.forEach((ele, i) => {
        ele.style.transform = `translateX(${(i - slide) * 100}%)`
    })
}
gotoSlide(0);

const btnSlideRight = document.querySelector('.slider__btn--right');
const btnSlideLeft = document.querySelector('.slider__btn--left');

const previousSlide = function () {
    if (currentSlide > 0) {
        currentSlide--;
        gotoSlide(currentSlide);
    }
    else {
        currentSlide = numSlide;
        gotoSlide(currentSlide - 1);
    }
}

const nextSlide = function () {
    if (currentSlide < numSlide - 1) {
        currentSlide++;
        gotoSlide(currentSlide);
    }
    else {
        currentSlide = 0;
        gotoSlide(currentSlide);
    }
}
btnSlideLeft.addEventListener('click', previousSlide);
btnSlideRight.addEventListener('click', nextSlide);
// Press keyboard to slide
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    e.key === 'ArrowRight' && nextSlide();
})

// Create dots

const dots = document.querySelector('.dots');
const createDots = function () {
    slides.forEach(function (_, i) {
        dots.insertAdjacentHTML('beforeend',
            `<button class="dots__dot" data-slide="${i}"></button>`);
    })
}
createDots();
// Activate Dots
const activeDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
        dot.classList.remove('dots__dot--active');
    })

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}
activeDots(0);
dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
        gotoSlide(e.target.dataset.slide);
        activeDots(e.target.dataset.slide);
    }
})