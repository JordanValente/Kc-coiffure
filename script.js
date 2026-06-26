// Navigation : scroll effect + menu mobile
const navbar = document.getElementById('navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = menuToggle.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('active');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none';
    spans[1].style.opacity  = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            menuToggle.querySelectorAll('span').forEach(s => {
                s.style.transform = 'none';
                s.style.opacity   = '1';
            });
        }
    });
});

// Galerie dynamique : 3 photos aléatoires au chargement, bouton "Voir plus" pour le reste
const galleryGrid = document.getElementById('galleryGrid');
const showMoreBtn = document.getElementById('showMoreBtn');

const localPhotos = [
    "1000014209.HEIC",
    "1000015739.JPG",
    "1000016357.JPG",
    "1000016579.JPG",
    "1000016635.JPG",
    "1434906464948649969.JPG",
    "2428389859622835158.JPG",
    "2442986605621758912.JPG",
    "295341576070224355.JPG",
    "5843544016896871159.JPG",
    "5878086769404283240.JPG",
    "6762477278438249809.JPG",
    "7081114608800117376.JPG",
    "7929391502948490040.JPG",
    "8777824078707904769.HEIC",
    "BLONDPOLAIRE.JPG",
    "1000017854.PNG",
    "1000018114.PNG",
    "1000018483.JPG",
    "1000018485.JPG"
];

let shuffledPhotos = [];

function shuffleArray(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderPhotos(photos) {
    photos.forEach(filename => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.style.animation = 'fadeIn 0.5s ease-out';
        div.innerHTML = `
            <img src="photos/${filename}" alt="Réalisation Kc.coiffure">
            <div class="gallery-overlay"><span>Réalisation</span></div>
        `;
        galleryGrid.appendChild(div);
    });
}

function initGallery() {
    if (!galleryGrid) return;
    shuffledPhotos = shuffleArray(localPhotos);
    renderPhotos(shuffledPhotos.slice(0, 3));
    if (shuffledPhotos.length > 3 && showMoreBtn) {
        showMoreBtn.style.display = 'inline-block';
    }
}

if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
        renderPhotos(shuffledPhotos.slice(3));
        showMoreBtn.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', initGallery);
