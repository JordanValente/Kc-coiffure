import { db } from './firebase-config.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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

// 2. --- GALERIE DEPUIS DOSSIER LOCAL ---
const galleryGrid = document.getElementById('galleryGrid');
// Liste manuelle des photos dans le dossier /photos (obligatoire car JS navigateur ne peut pas scanner un dossier)
const localPhotos = [
    "1434906464948649969.JPG", "2428389859622835158.JPG", "2442986605621758912.JPG", 
    "295341576070224355.JPG", "5843544016896871159.JPG", "5878086769404283240.JPG", 
    "6762477278438249809.JPG", "7081114608800117376.JPG", "7929391502948490040.JPG",
    "8777824078707904769.HEIC"
];

function renderGallery(galleryTexts) {
    if(!galleryGrid) return;
    galleryGrid.innerHTML = '';
    
    // On boucle sur nos photos locales
    localPhotos.forEach(filename => {
        // On récupère le texte éventuellement personnalisé dans Firebase, sinon "Réalisation"
        const text = (galleryTexts && galleryTexts[filename]) ? galleryTexts[filename] : "Réalisation";
        
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.style.animation = 'fadeIn 0.5s ease-out';
        div.innerHTML = `
            <img src="photos/${filename}" alt="Photo de coiffure">
            <div class="gallery-overlay"><span>${text}</span></div>
        `;
        galleryGrid.appendChild(div);
    });
}

// On écoute maintenant 'galleryTexts' au lieu de 'galleryData' (qui contenait les URLs Firebase Storage)
onValue(ref(db, 'galleryTexts'), (snapshot) => {
    const texts = snapshot.val();
    console.log("Légendes reçues:", texts);
    renderGallery(texts);
}, (error) => {
    console.error("Erreur Firebase Galerie:", error);
    renderGallery({}); // Affiche les photos avec textes par défaut
});

// 3. --- CONTACT DEPUIS FIREBASE ---
onValue(ref(db, 'contactData'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const phoneElem = document.getElementById('publicPhone');
    const emailElem = document.getElementById('publicEmail');
    const mailtoBtn = document.getElementById('publicMailtoBtn');

    if(phoneElem) phoneElem.innerText = data.phone;
    if(emailElem) {
        emailElem.innerText = data.email;
        emailElem.href = "mailto:" + data.email;
    }
    if(mailtoBtn) mailtoBtn.href = "mailto:" + data.email;
});

// 4. --- TARIFS DEPUIS FIREBASE ---
onValue(ref(db, 'pricingData'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    function renderPublicPricing(items, containerId) {
        const container = document.getElementById(containerId);
        if(!container || !items) return;
        container.innerHTML = items.map(item =>
            `<li>${item.name} - <strong style="color:var(--color-pink)">${item.price}</strong></li>`
        ).join('');
    }

    renderPublicPricing(data.base, 'publicPricingBase');
    renderPublicPricing(data.soins, 'publicPricingSoins');
    renderPublicPricing(data.tech, 'publicPricingTech');
});

// 5. --- HERO DEPUIS FIREBASE ---
onValue(ref(db, 'heroData'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const sub = document.getElementById('publicHeroSubtitle');
    const title = document.getElementById('publicHeroTitle');
    const desc = document.getElementById('publicHeroDesc');
    if(sub) sub.innerText = data.subtitle;
    if(title) title.innerText = data.title;
    if(desc) desc.innerText = data.desc;
});

// 6. --- TITRES CARTES TARIFS DEPUIS FIREBASE ---
onValue(ref(db, 'cardTitles'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const setEl = (id, val) => { const el = document.getElementById(id); if(el && val) el.innerText = val; };
    setEl('pubCardTitle1', data.title1); setEl('pubCardSub1', data.sub1);
    setEl('pubCardTitle2', data.title2); setEl('pubCardSub2', data.sub2);
    setEl('pubCardTitle3', data.title3); setEl('pubCardSub3', data.sub3);
});

// 7. --- FOOTER DEPUIS FIREBASE ---
onValue(ref(db, 'footerData'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const setEl = (id, val) => { const el = document.getElementById(id); if(el && val) el.innerText = val; };
    setEl('publicFooterDesc', data.desc);
    setEl('publicFooterDays', data.days);
    setEl('publicFooterAppt', data.appt);
});

// Sync contact footer as well
onValue(ref(db, 'contactData'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const setEl = (id, val) => { const el = document.getElementById(id); if(el && val) el.innerText = val; };
    setEl('publicFooterPhone', data.phone);
    setEl('publicFooterEmail', data.email);
});
