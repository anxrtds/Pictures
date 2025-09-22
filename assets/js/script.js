const slides = document.querySelectorAll('.slide');
const total = slides.length;
let currentIndex = 0;


function updateSlides() {
    const container = document.querySelector('.carousel');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const spacing = containerWidth * 0.1;

    slides.forEach((slide, i) => {
        const img = slide.querySelector('img');
        if (img) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;


            let baseHeight = containerHeight * 0.5;


            let width = baseHeight * aspectRatio;
            const maxWidth = containerWidth * 0.8;
            if (width > maxWidth) {
                width = maxWidth;
                baseHeight = width / aspectRatio;
            }

            slide.style.width = `${width}px`;
            slide.style.height = `${baseHeight}px`;
            const figcaption = slide.querySelector('figcaption');
            figcaption.style.marginTop = `${0}px`;
        }
    });
    const visibleCount = 2;
    slides.forEach((slide, i) => {
        let diff = i - currentIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;


        const offset = diff * spacing;
        slide.style.left = `calc(50% + ${offset}px)`;


        slide.style.zIndex = total - Math.abs(diff);


        const scale = diff === 0 ? 1 : 1 - Math.abs(diff) * 0.3;
        slide.style.transform = `translate(-50%, -50%) scale(${scale})`;

        const figcaption = slide.querySelector('figcaption');
        if(diff === 0) figcaption.style.visibility = 'visible';
        else figcaption.style.visibility = 'hidden';

        if (Math.abs(diff) > visibleCount) {
            slide.style.opacity = 0;
            slide.style.pointerEvents = 'none';
        } else {
            slide.style.opacity = 1;
            slide.style.pointerEvents = 'auto';
        }
    });
}

function updateArrows() {
    const carousel = document.querySelector('.carousel');
    const arrowsbtn = document.querySelectorAll('.arrows button');
    const arrows = document.querySelector('.arrows');
    
    const baseSize = carousel.clientWidth * 0.01;
    arrows.style.setProperty('gap', `${baseSize * 0.5}px`);

    arrowsbtn.forEach(btn => {
        btn.style.fontSize = `${baseSize}px`;
        btn.style.padding = `${baseSize * 0.3}px ${baseSize * 0.6}px ${baseSize * 0.4}px ${baseSize * 0.6}px`;
        btn.style.borderRadius = `${baseSize * 0.2}px`;
    });
}

function updateFontSize() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        const figcaption = slide.querySelector('figcaption');
        const carousel = document.querySelector('.carousel');
        const baseSize = carousel.clientWidth * 0.01;
        figcaption.style.fontSize = `${baseSize}px`;
    });
}


document.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + total) % total;
    updateSlides();
});

document.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % total;
    updateSlides();
});


window.addEventListener('resize', () => {
    updateSlides();
    updateArrows();
    updateFontSize();
});

window.addEventListener('load', ()=>{
    updateArrows();
    updateFontSize();
    updateSlides();
})


updateSlides();