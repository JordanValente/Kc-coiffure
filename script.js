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

// 2. --- GALERIE DEPUIS FIREBASE ---
const galleryGrid = document.getElementById('galleryGrid');
const defaultImages = [
    { src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800", text: "Brushing Élégant" },
    { src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800", text: "Coupe Carré" },
    { src: "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=800", text: "Balayage" }
];

function renderGallery(images) {
    if(!galleryGrid) return;
    galleryGrid.innerHTML = '';
    const imgsToDisplay = (images && images.length > 0) ? images : defaultImages;
    imgsToDisplay.forEach(imgObj => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.style.animation = 'fadeIn 0.5s ease-out';
        div.innerHTML = `
            <img src="${imgObj.src}" alt="Photo de galerie">
            <div class="gallery-overlay"><span>${imgObj.text}</span></div>
        `;
        galleryGrid.appendChild(div);
    });
}

// Chargement initial
onValue(ref(db, 'galleryData'), (snapshot) => {
    const data = snapshot.val();
    console.log("Données galerie reçues:", data);
    renderGallery(data);
}, (error) => {
    console.error("Erreur Firebase Galerie:", error);
    renderGallery(defaultImages); // Fallback en cas d'erreur de permission
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
