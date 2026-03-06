import { db, storage } from './firebase-config.js';
import { ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { ref as storageRef, uploadString, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// --- SÉCURITÉ : Vérification de la connexion ---
if (sessionStorage.getItem('kc_admin_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const adminGalleryGrid = document.getElementById('adminGalleryGrid');
    const adminFileInput = document.getElementById('adminFileInput');

    // 0. --- TEST DE CONNEXION FIREBASE ---
    get(ref(db, '.info/connected')).then((snapshot) => {
        if (snapshot.val() === true) {
            console.log("Connecté à Firebase !");
        } else {
            console.error("Non connecté à Firebase. Vérifiez vos règles de sécurité (Mode Test).");
        }
    });

    // 0b. --- MIGRATION AUTO (LocalStorage -> Firebase) ---
    // Si Firebase est vide mais que LocalStorage a des données, on les pousse.
    async function migrateToCloud() {
        const snapshot = await get(galleryRef);
        if (!snapshot.exists()) {
            console.log("Cloud vide, tentative de migration depuis LocalStorage...");
            const localData = JSON.parse(localStorage.getItem('kcGalleryData') || '[]');
            if (localData.length > 0) {
                await set(galleryRef, localData);
                console.log("Galerie migrée vers Firebase !");
            }
            // Pareil pour contact et tarifs...
            const localContact = JSON.parse(localStorage.getItem('kcContactData'));
            if (localContact) await set(contactRef, localContact);
            
            const localPricing = JSON.parse(localStorage.getItem('kcPricingData'));
            if (localPricing) await set(pricingRef, localPricing);
        }
    }
    migrateToCloud();

    // 1. --- DONNÉES CONTACT ---
    const contactRef = ref(db, 'contactData');
    onValue(contactRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('adminPhone').value = data.phone || '';
            document.getElementById('adminEmail').value = data.email || '';
        }
    });

    window.saveContact = function() {
        set(contactRef, {
            phone: document.getElementById('adminPhone').value,
            email: document.getElementById('adminEmail').value
        }).then(() => {
            alert("Contact sauvegardé en ligne !");
        });
    };

    // 1b. --- DONNÉES HERO ---
    const heroRef = ref(db, 'heroData');
    onValue(heroRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('heroSubtitle').value = data.subtitle || '';
            document.getElementById('heroTitle').value = data.title || '';
            document.getElementById('heroDesc').value = data.desc || '';
        }
    });

    window.saveHero = function() {
        set(heroRef, {
            subtitle: document.getElementById('heroSubtitle').value,
            title: document.getElementById('heroTitle').value,
            desc: document.getElementById('heroDesc').value
        }).then(() => alert("Hero sauvegardé en ligne !"));
    };

    // 1c. --- TITRES DES CARTES ---
    const cardTitlesRef = ref(db, 'cardTitles');
    onValue(cardTitlesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('cardTitle1').value = data.title1 || '';
            document.getElementById('cardSub1').value = data.sub1 || '';
            document.getElementById('cardTitle2').value = data.title2 || '';
            document.getElementById('cardSub2').value = data.sub2 || '';
            document.getElementById('cardTitle3').value = data.title3 || '';
            document.getElementById('cardSub3').value = data.sub3 || '';
        }
    });

    window.saveCardTitles = function() {
        set(cardTitlesRef, {
            title1: document.getElementById('cardTitle1').value,
            sub1: document.getElementById('cardSub1').value,
            title2: document.getElementById('cardTitle2').value,
            sub2: document.getElementById('cardSub2').value,
            title3: document.getElementById('cardTitle3').value,
            sub3: document.getElementById('cardSub3').value
        }).then(() => alert("Titres des cartes sauvegardés !"));
    };

    // 1d. --- DONNÉES FOOTER ---
    const footerRef = ref(db, 'footerData');
    onValue(footerRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('footerDesc').value = data.desc || '';
            document.getElementById('footerDays').value = data.days || '';
            document.getElementById('footerAppt').value = data.appt || '';
        }
    });

    window.saveFooter = function() {
        set(footerRef, {
            desc: document.getElementById('footerDesc').value,
            days: document.getElementById('footerDays').value,
            appt: document.getElementById('footerAppt').value
        }).then(() => alert("Footer sauvegardé en ligne !"));
    };

    // 2. --- DONNÉES TARIFS ---
    const pricingRef = ref(db, 'pricingData');
    
    // Par défaut si vide
    const defaultPricing = {
        base: [
            { name: "Coupe Femme / Homme", price: "25€ / 15€" },
            { name: "Brushing", price: "20€" },
            { name: "Couleur", price: "55€" }
        ],
        soins: [
            { name: "Soin Classique", price: "5€" },
            { name: "Soin Profond", price: "35€" },
            { name: "Shampoing", price: "5€" }
        ],
        tech: [
            { name: "Ombré Mi Longueur", price: "45€" },
            { name: "Mèche Papier", price: "50€" },
            { name: "Patine", price: "25€" }
        ]
    };

    let localPricingData = defaultPricing;

    onValue(pricingRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            localPricingData = data;
        }
        renderPricingCategory(localPricingData.base || [], 'adminPricingBase', 'base');
        renderPricingCategory(localPricingData.soins || [], 'adminPricingSoins', 'soins');
        renderPricingCategory(localPricingData.tech || [], 'adminPricingTech', 'tech');
    });

    function renderPricingCategory(items, categoryId, categoryKey) {
        const container = document.getElementById(categoryId);
        if(!container) return;
        let html = '';
        items.forEach((item, index) => {
            html += `
                <div class="flex-row admin-form-group">
                    <div>
                        <input type="text" value="${item.name}" placeholder="Nom prestation" onchange="updatePricing('${categoryKey}', ${index}, 'name', this.value)">
                    </div>
                    <div>
                        <input type="text" value="${item.price}" placeholder="Prix" onchange="updatePricing('${categoryKey}', ${index}, 'price', this.value)">
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    window.updatePricing = function(category, index, key, value) {
        localPricingData[category][index][key] = value;
        set(pricingRef, localPricingData);
    };


    // 3. --- DONNÉES GALERIE (PHOTOS LOCALES) ---
    const localPhotos = [
        "1434906464948649969.JPG", "2428389859622835158.JPG", "2442986605621758912.JPG", 
        "295341576070224355.JPG", "5843544016896871159.JPG", "5878086769404283240.JPG", 
        "6762477278438249809.JPG", "7081114608800117376.JPG", "7929391502948490040.JPG",
        "8777824078707904769.HEIC"
    ];

    const galleryTextsRef = ref(db, 'galleryTexts');
    let currentTexts = {};

    onValue(galleryTextsRef, (snapshot) => {
        currentTexts = snapshot.val() || {};
        renderAdminGallery();
    });

    function renderAdminGallery() {
        if(!adminGalleryGrid) return;
        adminGalleryGrid.innerHTML = '';
        
        localPhotos.forEach(filename => {
            const text = currentTexts[filename] || "Réalisation";
            const div = document.createElement('div');
            div.className = 'admin-item';
            
            div.innerHTML = `
                <img src="photos/${filename}" alt="Photo de galerie">
                <input type="text" value="${text}" data-filename="${filename}" class="local-img-text-input" placeholder="Texte sur l'image">
                <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 5px;">${filename}</p>
            `;
            
            adminGalleryGrid.appendChild(div);
        });

        // Édition du texte
        document.querySelectorAll('.local-img-text-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const filename = e.target.getAttribute('data-filename');
                currentTexts[filename] = e.target.value;
                
                set(galleryTextsRef, currentTexts).then(() => {
                    e.target.style.borderColor = "#4ade80";
                    setTimeout(() => e.target.style.borderColor = "var(--color-pink)", 1000);
                });
            });
        });
    }

    // Note: L'upload via admin est désactivé pour la galerie car on utilise le dossier local.
    // L'utilisateur doit ajouter les fichiers dans le dossier /photos/ sur son ordi/GitHub.
    if(adminFileInput) {
        adminFileInput.parentElement.style.display = 'none'; // On cache la zone d'upload
    }
});
