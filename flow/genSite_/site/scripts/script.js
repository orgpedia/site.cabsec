const menuOpenBtn = document.querySelector('[data-menu-open-btn]')
const menuCloseBtn = document.querySelector('[data-sidebar-close-btn]')
const sidebar = document.querySelector('[data-sidebar]')
//const allMinister = document.querySelector('[data-all-minister]')
//const allMinisterList = document.querySelector('[data-minister-list]')
const searchBox = document.querySelector('[data-search-box]')
const searchBoxToggle = document.querySelector('[data-search-box-toggle]')
const searchBoxClose = document.querySelector('[data-search-box-close]')

const showMoreText = document.querySelector('[data-show-more-text]')
const atalAccordian = document.querySelector('[data-atal-accordian]')
const ministerHide = document.querySelector('[data-minister-hide]')


// Menu open 
menuOpenBtn.addEventListener('click', function () {
    sidebar.classList.remove('-translate-x-full')
    sidebar.classList.add('translate-x-0')
})

// Menu close 
menuCloseBtn.addEventListener('click', function () {
    sidebar.classList.remove('translate-x-0')
    sidebar.classList.add('-translate-x-full')
})


// All Minister List Menu 
// allMinister.addEventListener('click', function () {
//     allMinisterList.classList.toggle('hidden')
// })

// Search Box Open 
searchBox.addEventListener('click', function () {
    searchBoxToggle.classList.remove('hidden')
    searchBoxToggle.classList.add('block')
})

// Search Box close 
searchBoxClose.addEventListener('click', function () {
    searchBoxToggle.classList.add('hidden')
})

// atalAccordian.addEventListener('click', function () {
//     atalAccordian.nextElementSibling.classList.toggle('hidden')
//     ministerHide.classList.toggle('hidden')
// })

function readMore(button) {
    console.log("inside readMore");    
    detailElement = button.parentNode;
    expand_text = detailElement.querySelector('.expand_text');
    expand_text.classList.toggle('hidden');
    svg_elem = button.firstElementChild;

    if (svg_elem.hasAttribute("transform")) {
	svg_elem.removeAttribute("transform");
    }else {
	svg_elem.setAttribute("transform", "rotate(180)");
    }
}


//initCarousel();
//initPage();    

//const prevButton = document.getElementById('data-carousel-prev');
//const nextButton = document.getElementById('data-carousel-next');
//const page_num = document.getElementById('pg_num');

//console.log("Init");
// prevButton.addEventListener('click', () => {
//     const carousel = document.getElementById('controls-carousel').carousel;
//     carousel.prev();
//     position = carousel._getActiveItem().position;
//     page_num.textContent = position + 1;
//     console.log("Postition: " + position);
// });

// nextButton.addEventListener('click', () => {
//     const carousel = document.getElementById('controls-carousel').carousel;
//     carousel.next();
//     position = carousel._getActiveItem().position;
//     page_num.textContent = position + 1;
//     console.log("Postition: " + position);
// });


function initCarousel() {
    document.querySelectorAll('[data-carousel]').forEach(carouselEl => {
        const interval = carouselEl.getAttribute('data-carousel-interval')
        const slide = carouselEl.getAttribute('data-carousel') === 'slide' ? true : false

        const items = []
        let defaultPosition = 0
        if (carouselEl.querySelectorAll('[data-carousel-item]').length) {
            [...carouselEl.querySelectorAll('[data-carousel-item]')].map((carouselItemEl, position) => {
                items.push({
                    position: position,
                    el: carouselItemEl
                })

                if (carouselItemEl.getAttribute('data-carousel-item') === 'active') {
                    defaultPosition = position
                }
            })
        }

        const indicators = [];
        if (carouselEl.querySelectorAll('[data-carousel-slide-to]').length) {
            [...carouselEl.querySelectorAll('[data-carousel-slide-to]')].map((indicatorEl) => {
                indicators.push({
                    position: indicatorEl.getAttribute('data-carousel-slide-to'),
                    el: indicatorEl
                })
            })
        }

        carouselEl.carousel = new Carousel(items, {
            defaultPosition: defaultPosition,
            indicators: {
                items: indicators
            },
            interval: interval ? interval : 3000,
        })

        if (slide) {
            carousel.cycle();
        }

        // check for controls
        const carouselNextEl = carouselEl.querySelector('[data-carousel-next]')
        const carouselPrevEl = carouselEl.querySelector('[data-carousel-prev]')

        if (carouselNextEl) {
            carouselNextEl.addEventListener('click', () => {
                carousel.next()
            })
        }

        if (carouselPrevEl) {
            carouselPrevEl.addEventListener('click', () => {
                carousel.prev()
            })
        }

    })
}
