// Kc.coiffure — navigation mobile + galerie filtrable
// Ancienne version du site : branche git `sauvegarde-ancien-site`

// --- Menu mobile -----------------------------------------------------------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
    navLinks.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
}

menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// --- Galerie ---------------------------------------------------------------
// Pour ajouter une photo : la copier dans photos/ puis l'ajouter ici avec sa catégorie
// (couleur, coiffage ou coupe). Préférer le JPG au HEIC (non affiché par Chrome/Firefox).
const photos = [
    { file: "1000016357.JPG", cat: "couleur", alt: "Longs cheveux blonds ondulés" },
    { file: "1000018485.JPG", cat: "coiffage", alt: "Chignon bohème orné de fleurs blanches" },
    { file: "5843544016896871159.JPG", cat: "couleur", alt: "Balayage caramel sur cheveux lisses" },
    { file: "1434906464948649969.JPG", cat: "coupe", alt: "Carré flou blond ondulé" },
    { file: "chignon-mariage.JPG", cat: "coiffage", alt: "Chignon brun avec barrette fleur" },
    { file: "balayage-meches-caramel.JPG", cat: "couleur", alt: "Mèches blondes et balayage caramel" },
    { file: "1000016635.JPG", cat: "coiffage", alt: "Longues boucles blond doré" },
    { file: "BLONDPOLAIRE.JPG", cat: "couleur", alt: "Blond polaire" },
    { file: "7929391502948490040.JPG", cat: "coiffage", alt: "Chignon bas orné de fleurs" },
    { file: "ombre-blond-miel.JPG", cat: "couleur", alt: "Ombré brun vers blond miel" },
    { file: "1000020288.JPG", cat: "coupe", alt: "Carré court cuivré" },
    { file: "7081114608800117376.JPG", cat: "coiffage", alt: "Coiffure mi-attachée aux ondulations" },
    { file: "1000016579.JPG", cat: "couleur", alt: "Balayage caramel ondulé" },
    { file: "8777824078707904769.JPG", cat: "coupe", alt: "Carré ondulé blond méché" },
    { file: "2442986605621758912.JPG", cat: "couleur", alt: "Cheveux lisses aux reflets blonds" },
    { file: "1000018114.PNG", cat: "coiffage", alt: "Queues-de-cheval ondulées avec bijoux" },
    { file: "1000015739.JPG", cat: "coupe", alt: "Coupe courte ondulée méchée" },
    { file: "295341576070224355.JPG", cat: "couleur", alt: "Cheveux lisses blond cendré" },
    { file: "1000018483.JPG", cat: "coiffage", alt: "Coiffure attachée avec fleur bleue" },
    { file: "1000019767.PNG", cat: "coupe", alt: "Avant / après sur cheveux bouclés" },
    { file: "6762477278438249809.JPG", cat: "couleur", alt: "Cheveux lisses méchés" },
    { file: "5878086769404283240.JPG", cat: "coupe", alt: "Carré dégradé blond" },
    { file: "1000014209.JPG", cat: "coupe", alt: "Coupe courte aux reflets cuivrés" },
    { file: "1000020194.PNG", cat: "couleur", alt: "Blond lumineux sur cheveux longs et lisses" },
    { file: "2428389859622835158.JPG", cat: "couleur", alt: "Mèches sur cheveux lisses" },
    { file: "file_000000006fb4820a95155bf63170aff3.PNG", cat: "couleur", alt: "Blond beige lisse" },
    { file: "1000017854.PNG", cat: "couleur", alt: "Le balayage, lumière et naturel" }
];

const catLabels = { couleur: "Couleur", coiffage: "Coiffage", coupe: "Coupe" };
const PAGE_SIZE = 8;

const galleryGrid = document.getElementById('galleryGrid');
const showMoreBtn = document.getElementById('showMoreBtn');
const chips = document.querySelectorAll('.chip');

let currentFilter = 'tous';
let visibleCount = PAGE_SIZE;

function renderGallery() {
    const list = photos.filter(p => currentFilter === 'tous' || p.cat === currentFilter);
    galleryGrid.innerHTML = '';
    list.slice(0, visibleCount).forEach(p => {
        const fig = document.createElement('figure');
        fig.className = 'gallery-item';
        const frame = document.createElement('div');
        frame.className = 'frame';
        const img = document.createElement('img');
        img.src = `photos/${p.file}`;
        img.alt = `${p.alt} — réalisation Kc.coiffure`;
        img.loading = 'lazy';
        frame.appendChild(img);
        const cap = document.createElement('figcaption');
        cap.textContent = catLabels[p.cat];
        fig.append(frame, cap);
        galleryGrid.appendChild(fig);
    });
    showMoreBtn.hidden = list.length <= visibleCount;
}

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        currentFilter = chip.dataset.filter;
        visibleCount = PAGE_SIZE;
        chips.forEach(c => {
            const active = c === chip;
            c.classList.toggle('is-active', active);
            c.setAttribute('aria-pressed', String(active));
        });
        renderGallery();
    });
});

showMoreBtn.addEventListener('click', () => {
    visibleCount += PAGE_SIZE;
    renderGallery();
});

renderGallery();
