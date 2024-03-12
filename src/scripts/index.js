const header = document.querySelector('header');
const scrollChange = 1;

window.addEventListener('scroll', function() {
    const scroll = window.scrollY;

    if (scroll >= scrollChange) {
        header.classList.add('header--scroll');
    }
    else {
        header.classList.remove('header--scroll');
    }
})