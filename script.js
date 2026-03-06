// 1. Gestion de la barre de navigation
const navbar = document.getElementById('navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = menuToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Fermer le menu au clic sur un lien (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if(window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// 2. --- GALERIE STATIQUE ---
const galleryGrid = document.getElementById('galleryGrid');
// Liste des photos dans le dossier /photos
const localPhotos = [
    "1434906464948649969.JPG", "2428389859622835158.JPG", "2442986605621758912.JPG", 
    "295341576070224355.JPG", "5843544016896871159.JPG", "5878086769404283240.JPG", 
    "6762477278438249809.JPG", "7081114608800117376.JPG", "7929391502948490040.JPG",
    "8777824078707904769.HEIC"
];

function renderGallery() {
    if(!galleryGrid) return;
    galleryGrid.innerHTML = '';
    
    localPhotos.forEach(filename => {
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

// Lancement immédiat au chargement de la page
document.addEventListener('DOMContentLoaded', renderGallery);
