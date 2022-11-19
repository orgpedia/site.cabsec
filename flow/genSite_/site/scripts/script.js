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
