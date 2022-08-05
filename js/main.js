const navbarBtn = document.querySelector('.header__content-navbar-btn');
const navbarMenu = document.querySelector('.header__content-navbar-menu');
navbarBtn.addEventListener('click', function (e) {
  e.preventDefault();

  if (navbarBtn.classList.contains('active')) {
    navbarBtn.classList.remove('active');
    navbarMenu.style = `left: -240px; transition: left 0.5s`;
  } else {
    navbarBtn.classList.add('active');
    navbarMenu.style = `left: 0; transition: left 0.5s`;
  }
});
document.addEventListener('mouseup', function (e) {
  if (e.target != navbarBtn) {
    navbarMenu.style = `left: -240px; transition: left 0.5s`;
    navbarBtn.classList.remove('active');
  }
});
navbarMenu.addEventListener('mouseup', function (e) {
  e.stopPropagation();
});

class Slider {
  constructor(options) {
    this.slider = options.slider;
    this.sliderList = this.slider.querySelector('.header__content-info-slider__list');
    this.sliderItems = this.slider.querySelectorAll('.header__content-info-slider__list-item');
    this.btnPrev = this.slider.querySelector('.header__content-info-slider__controls-prev');
    this.btnNext = this.slider.querySelector('.header__content-info-slider__controls-next');
    this.width = this.sliderItems[0].clientWidth;
    this.height = this.sliderItems[0].clientHeight;
    this.activeSlide = 0;
    this.timeMove = 1000;
    this.dir = options.direction.toUpperCase() == 'X' ? 'X' : 'Y';
    this.moveSlide = this.dir == 'X' ? this.width : this.height;
    this.dotsDisable = options.dotsDisable;
    this.interval = options.interval == undefined ? this.timeMove + 1000 : options.interval;
    window.addEventListener('resize', () => {
      this.width = document.querySelector('.header__content-info-slider').clientWidth;
      this.height = document.querySelector('.header__content-info-slider').clientHeight;
      this.moveSlide = this.dir == 'X' ? this.width : this.height;
      this.sliderList.style = `width: ${this.width}px;
            height: ${this.sliderItems[0].cli}px;
            `;
      this.sliderItems.forEach((slide, num) => {
        if (num != this.activeSlide) {
          slide.style.transform = `translate${this.dir}(${this.moveSlide}px)`;
        }

        if (num == this.sliderItems.length - 1) {
          slide.style.transform = `translate${this.dir}(${-this.moveSlide}px)`;
        }
      });
    });

    if (this.dotsDisable == 'false') {
      this.active = true;
      this.ul = document.createElement('ul');
      this.ul.classList.add('slider__dots');
      this.sliderItems.forEach(() => {
        const li = document.createElement('li');
        this.ul.appendChild(li);
      });
      this.slider.appendChild(this.ul);
      this.dots = this.slider.querySelectorAll('.slider__dots li');
      this.dots[this.activeSlide].classList.add('active');
      this.dots.forEach((dot, key) => {
        dot.addEventListener('click', () => {
          this.controlsDots(key);
        });
      });
    }

    if (options.play == 'true') {
      let autoPlay = setInterval(() => {
        this.move(this.btnNext);
      }, this.interval);
      this.slider.addEventListener('mouseenter', () => {
        clearInterval(autoPlay);
      });
      this.slider.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
          this.move(this.btnNext);
        }, this.interval);
      });
    }

    this.sliderList.style = `width: ${this.width}px;
        height: ${this.height}px;
        `;
    this.sliderItems.forEach((slide, num) => {
      slide.style = `position: absolute;
            top: 0;
            left: 0;`;
    });
    this.sliderItems.forEach((slide, num) => {
      if (num != this.activeSlide) {
        slide.style.transform = `translate${this.dir}(${this.moveSlide}px)`;
      }

      if (num == this.sliderItems.length - 1) {
        slide.style.transform = `translate${this.dir}(${-this.moveSlide}px)`;
      }
    });
    this.btnNext.addEventListener('click', () => {
      this.move(this.btnNext);
    });
    this.btnPrev.addEventListener('click', () => {
      this.move(this.btnPrev);
    });
  }

  move(btn) {
    this.btnNext.disabled = true;
    this.btnPrev.disabled = true;
    setTimeout(() => {
      this.btnNext.disabled = false;
      this.btnPrev.disabled = false;
    }, this.timeMove + 200);
    let btnPrevOrNext = btn == this.btnNext ? -this.moveSlide : this.moveSlide; // let btnPrevOrNext;
    // if (btn == btnNext) { btnPrevOrNext = -moveSlide} else {
    //     btnPrevOrNext = moveSlide
    // }

    this.sliderItems.forEach((slide, num) => {
      if (num != this.activeSlide) {
        slide.style.transform = `translate${this.dir}(${-btnPrevOrNext}px)`;
        slide.style.transition = `0ms`;
      }
    });
    this.sliderItems[this.activeSlide].style.transform = `translate${this.dir}(${btnPrevOrNext}px)`;
    this.sliderItems[this.activeSlide].style.transition = `${this.timeMove}ms`;

    if (this.dotsDisable == 'false') {
      this.dots[this.activeSlide].classList.remove('active');
    }

    ;

    if (btn == this.btnNext) {
      this.activeSlide++;

      if (this.activeSlide >= this.sliderItems.length) {
        this.activeSlide = 0;
      }
    } else if (btn == this.btnPrev) {
      this.activeSlide--;

      if (this.activeSlide < 0) {
        this.activeSlide = this.sliderItems.length - 1;
      }
    }

    this.sliderItems[this.activeSlide].style.transform = `translate${this.dir}(${0}px)`;
    this.sliderItems[this.activeSlide].style.transition = `${this.timeMove}ms`;

    if (this.dotsDisable == 'false') {
      this.dots[this.activeSlide].classList.add('active');
    }

    ;
  }

  controlsDots(dotKey) {
    if (this.active && dotKey != this.activeSlide) {
      this.sliderItems.forEach(slide => {
        slide.style.transition = `0ms`;
      });
      this.active = false;
      this.dots.forEach(dot => {
        dot.classList.remove('active');
      });
      let moveLeftOrRight = dotKey > this.activeSlide ? this.moveSlide : -this.moveSlide;
      this.sliderItems[dotKey].style.transform = `translate${this.dir}(${moveLeftOrRight}px)`;
      setTimeout(() => {
        this.sliderItems[this.activeSlide].style.transform = `translate${this.dir}(${-moveLeftOrRight}px)`;
        this.sliderItems[this.activeSlide].style.transition = `${this.timeMove}ms`;
        this.dots[this.activeSlide].classList.remove('active');
        this.activeSlide = dotKey;
        this.sliderItems[this.activeSlide].style.transform = `translate${this.dir}(${0}px`;
        this.sliderItems[this.activeSlide].style.transition = `${this.timeMove}ms`;
        this.dots[this.activeSlide].classList.add('active');
      }, 100);
      setTimeout(() => {
        this.active = true;
      }, this.timeMove + 200);
    }
  }

}

const sliders = document.querySelectorAll('.header__content-info-slider');
sliders.forEach(slider => {
  const direction = slider.getAttribute('data-direction') == 'Y' ? 'Y' : 'X';
  const dotsDisable = slider.hasAttribute('dots-disabled') ? 'true' : 'false';
  const autoPlay = slider.hasAttribute('auto-play') ? 'true' : 'false';
  const timeInterval = Number(slider.getAttribute('interval'));
  const interval = timeInterval != 0 ? timeInterval : undefined;
  new Slider({
    slider: slider,
    timeMove: 1000,
    direction: direction,
    dotsDisable: dotsDisable,
    play: autoPlay,
    interval: interval
  });
});
const close = document.querySelector('.header__content-navbar-modal-overlay-window-right i');
const closeTwo = document.querySelector('.header__content-navbar-modal-overlay-window-left  i');
const link = document.querySelector('.header__content-navbar-modal-overlay-window-left a');
const btn = document.querySelector('.header__content-navbar-menu-user-icon');
const modal = document.querySelector('.header__content-navbar-modal');
const overlayMy = document.querySelector('.header__content-navbar-modal-overlay');
const windowMy = document.querySelector('.header__content-navbar-modal-overlay-window');
const rightField = document.querySelector('.header__content-navbar-modal-overlay-window-right');
const screenWidth = window.screen.width;
btn.addEventListener('click', () => {
  // modal.classList.toggle('.open');
  if (modal.classList.contains('open')) {
    modal.classList.remove('open');
    windowMy.classList.remove('open-display');
    overlayMy.classList.remove('open-display');
    setTimeout(() => {
      overlayMy.classList.remove('open-overlay');
      windowMy.classList.remove('open-window');
    }, 300);
  } else {
    modal.classList.add('open');
    windowMy.classList.add('open-display');
    overlayMy.classList.add('open-display');
    setTimeout(() => {
      overlayMy.classList.add('open-overlay');
      windowMy.classList.add('open-window');
    }, 300);
  }

  if (screenWidth <= 576) {
    rightField.style.display = 'none';
  }
});
close.addEventListener('click', () => {
  if (screenWidth > 576) {
    if (modal.classList.contains('open')) {
      modal.classList.remove('open');
      windowMy.classList.remove('open-display');
      overlayMy.classList.remove('open-display');
      setTimeout(() => {
        modal.classList.remove('open');
        overlayMy.classList.remove('open-overlay');
        windowMy.classList.remove('open-window');
      }, 300);
    }
  }

  if (screenWidth <= 576) {
    rightField.style.display = 'none';
  }
});
closeTwo.addEventListener('click', () => {
  if (modal.classList.contains('open')) {
    modal.classList.remove('open');
    windowMy.classList.remove('open-display');
    overlayMy.classList.remove('open-display');
    setTimeout(() => {
      modal.classList.remove('open');
      overlayMy.classList.remove('open-overlay');
      windowMy.classList.remove('open-window');
    }, 300);
  }

  if (screenWidth <= 576) {
    rightField.style.display = 'none';
  }
});
link.addEventListener('click', () => {
  rightField.style.display = 'flex';
  rightField.style.transition = 'display 5s';
});