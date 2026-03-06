// --- SÉCURITÉ : Vérification de la connexion ---
if (sessionStorage.getItem('kc_admin_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const adminGalleryGrid = document.getElementById('adminGalleryGrid');
    const adminFileInput = document.getElementById('adminFileInput');

    // 1. --- DONNÉES CONTACT ---
    const defaultContact = { phone: "06 XX XX XX XX", email: "kc.coiffureadomicile@gmail.com" };
    let contactData = JSON.parse(localStorage.getItem('kcContactData')) || defaultContact;
    
    document.getElementById('adminPhone').value = contactData.phone;
    document.getElementById('adminEmail').value = contactData.email;

    window.saveContact = function() {
        contactData.phone = document.getElementById('adminPhone').value;
        contactData.email = document.getElementById('adminEmail').value;
        localStorage.setItem('kcContactData', JSON.stringify(contactData));
        alert("Contact sauvegardé !");
    };

    // 2. --- DONNÉES TARIFS ---
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

    let pricingData = JSON.parse(localStorage.getItem('kcPricingData')) || defaultPricing;

    function renderPricingCategory(items, categoryId, categoryKey) {
        const container = document.getElementById(categoryId);
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

    renderPricingCategory(pricingData.base, 'adminPricingBase', 'base');
    renderPricingCategory(pricingData.soins, 'adminPricingSoins', 'soins');
    renderPricingCategory(pricingData.tech, 'adminPricingTech', 'tech');

    window.updatePricing = function(category, index, key, value) {
        pricingData[category][index][key] = value;
        localStorage.setItem('kcPricingData', JSON.stringify(pricingData));
    };


    // 3. --- DONNÉES GALERIE ---
    let savedDataRaw = localStorage.getItem('kcGalleryData');
    let savedImages = [];

    if (!savedDataRaw) {
        // Migration ou initialisation avec valeurs par défaut
        let oldImages = JSON.parse(localStorage.getItem('kcGalleryImages') || '[]');
        if (oldImages.length > 0) {
            savedImages = oldImages.map(src => ({ src: src, text: "Réalisation" }));
            localStorage.removeItem('kcGalleryImages'); // Nettoyage
        } else {
            savedImages = [
                { src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800", text: "Brushing Élégant" },
                { src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800", text: "Coupe Carré" },
                { src: "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=800", text: "Balayage" }
            ];
        }
        localStorage.setItem('kcGalleryData', JSON.stringify(savedImages));
    } else {
        savedImages = JSON.parse(savedDataRaw);
    }

    function renderGallery() {
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
                <button class="btn-delete" data-index="${index}">🗑</button>
            `;
            
            adminGalleryGrid.appendChild(div);
        });

        // Suppressions
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (confirm('Voulez-vous vraiment supprimer cette photo du site public ?')) {
                    savedImages.splice(index, 1);
                    localStorage.setItem('kcGalleryData', JSON.stringify(savedImages));
                    renderGallery();
                }
            });
        });

        // Édition du texte
        document.querySelectorAll('.img-text-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                savedImages[index].text = e.target.value;
                localStorage.setItem('kcGalleryData', JSON.stringify(savedImages));
                // Petit effet visuel pour confirmer la sauvegarde
                e.target.style.borderColor = "#4ade80";
                setTimeout(() => e.target.style.borderColor = "var(--color-pink)", 1000);
            });
        });
    }

    renderGallery();

    // 4. --- UPLOAD GALERIE ---
    adminFileInput.addEventListener('change', function() {
        const files = this.files;
        if (!files || files.length === 0) return;

        let filesProcessed = 0;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                filesProcessed++;
                return;
            }

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                // Ajouter sous le nouveau format objet
                savedImages.unshift({ src: reader.result, text: "Nouvelle Réalisation" });
                filesProcessed++;

                if (filesProcessed === files.length) {
                    try {
                        localStorage.setItem('kcGalleryData', JSON.stringify(savedImages));
                        renderGallery();
                        adminFileInput.value = '';
                    } catch (e) {
                        alert("Erreur: Image trop lourde, la mémoire du navigateur est pleine ! Essayez de compresser l'image avant.");
                    }
                }
            };
        });
    });
});
