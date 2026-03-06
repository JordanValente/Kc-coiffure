document.addEventListener('DOMContentLoaded', () => {
    
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
        // Animation simple du burger menu
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
    // 2. Gestion de l'affichage public de la galerie
    const galleryGrid = document.getElementById('galleryGrid');

    // --- GESTION AUTOMATISÉE : Chargement depuis le back-office ---
    let savedDataRaw = localStorage.getItem('kcGalleryData');
    let savedImages = [];
    
    if (!savedDataRaw) {
        // Migration ou initialisation avec valeurs par défaut
        let oldImages = JSON.parse(localStorage.getItem('kcGalleryImages') || '[]');
        if(oldImages.length > 0) {
            savedImages = oldImages.map(src => ({ src: src, text: "Réalisation" }));
        } else {
            savedImages = [
                { src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800", text: "Brushing Élégant" },
                { src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800", text: "Coupe Carré" },
                { src: "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=800", text: "Balayage" }
            ];
        }
    } else {
        savedImages = JSON.parse(savedDataRaw);
    }

    savedImages.forEach(imgObj => addImageToGrid(imgObj));

    function addImageToGrid(imgObj) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.style.animation = 'fadeIn 0.5s ease-out';
        
        div.innerHTML = `
            <img src="${imgObj.src}" alt="Photo de galerie">
            <div class="gallery-overlay"><span>${imgObj.text}</span></div>
        `;
        
        galleryGrid.appendChild(div);
    }

    // 3. --- AFFICHAGE DONNÉES CONTACT DYNAMIQUES ---
    const contactData = JSON.parse(localStorage.getItem('kcContactData'));
    if (contactData) {
        const phoneElem = document.getElementById('publicPhone');
        const emailElem = document.getElementById('publicEmail');
        const mailtoBtn = document.getElementById('publicMailtoBtn');

        if(phoneElem) phoneElem.innerText = contactData.phone;
        if(emailElem) {
            emailElem.innerText = contactData.email;
            emailElem.href = "mailto:" + contactData.email;
        }
        if(mailtoBtn) mailtoBtn.href = "mailto:" + contactData.email;
    }

    // 4. --- AFFICHAGE TARIFS DYNAMIQUES ---
    const pricingData = JSON.parse(localStorage.getItem('kcPricingData'));
    if (pricingData) {
        function renderPublicPricing(items, containerId) {
            const container = document.getElementById(containerId);
            if(!container) return;
            
            let html = '';
            items.forEach(item => {
                html += `<li>${item.name} - <strong style="color:var(--color-pink)">${item.price}</strong></li>`;
            });
            container.innerHTML = html;
        }

        renderPublicPricing(pricingData.base, 'publicPricingBase');
        renderPublicPricing(pricingData.soins, 'publicPricingSoins');
        renderPublicPricing(pricingData.tech, 'publicPricingTech');
    }
});
