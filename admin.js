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


    // 3. --- DONNÉES GALERIE ---
    const galleryRef = ref(db, 'galleryData');
    let savedImages = [];

    onValue(galleryRef, (snapshot) => {
        const data = snapshot.val();
        savedImages = data || [];
        renderGallery();
    });

    function renderGallery() {
        if(!adminGalleryGrid) return;
        adminGalleryGrid.innerHTML = '';
        
        if (savedImages.length === 0) {
            adminGalleryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted);">Aucune photo dans la galerie pour le moment.</p>';
            return;
        }

        savedImages.forEach((imgObj, index) => {
            const div = document.createElement('div');
            div.className = 'admin-item';
            
            div.innerHTML = `
                <img src="${imgObj.src}" alt="Photo de galerie">
                <input type="text" value="${imgObj.text}" data-index="${index}" class="img-text-input" placeholder="Texte sur l'image">
                <button class="btn-delete" data-index="${index}" data-storage-path="${imgObj.storagePath || ''}">🗑</button>
            `;
            
            adminGalleryGrid.appendChild(div);
        });

        // Suppressions
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', async (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const storagePath = e.target.getAttribute('data-storage-path');
                
                if (confirm('Voulez-vous vraiment supprimer cette photo de la base de données publique ?')) {
                    // Supprimer du storage si c'est une image uploadée
                    if(storagePath) {
                        try {
                            const imgRef = storageRef(storage, storagePath);
                            await deleteObject(imgRef);
                        } catch(err) {
                            console.error("Erreur suppression image:", err);
                        }
                    }
                    
                    savedImages.splice(index, 1);
                    set(galleryRef, savedImages);
                }
            });
        });

        // Édition du texte
        document.querySelectorAll('.img-text-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                savedImages[index].text = e.target.value;
                set(galleryRef, savedImages).then(() => {
                    e.target.style.borderColor = "#4ade80";
                    setTimeout(() => e.target.style.borderColor = "var(--color-pink)", 1000);
                });
            });
        });
    }

    // 4. --- UPLOAD GALERIE VIA FIREBASE STORAGE ---
    if(adminFileInput) {
        adminFileInput.addEventListener('change', function() {
            const files = this.files;
            if (!files || files.length === 0) return;

            Array.from(files).forEach(file => {
                if (!file.type.startsWith('image/')) return;
                
                // Petit indicateur de chargement
                adminFileInput.previousElementSibling.innerText = "Téléchargement en cours...";

                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = async function() {
                    try {
                        // 1. Upload dans storage
                        const fileName = 'gallery/' + Date.now() + '_' + file.name;
                        const imgStorageRef = storageRef(storage, fileName);
                        
                        await uploadString(imgStorageRef, reader.result, 'data_url');
                        const downloadUrl = await getDownloadURL(imgStorageRef);
                        
                        // 2. Ajouter dans Realtime Database
                        savedImages.unshift({ 
                            src: downloadUrl, 
                            text: "Nouvelle Réalisation",
                            storagePath: fileName
                        });
                        
                        await set(galleryRef, savedImages);
                        
                    } catch(error) {
                        alert("Erreur lors de l'upload: " + error.message);
                    } finally {
                        adminFileInput.value = '';
                        adminFileInput.previousElementSibling.innerText = "Formats acceptés : JPG, PNG";
                    }
                };
            });
        });
    }
});
