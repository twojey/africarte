// Affichage dynamique selon le mode (nombre de langues ou ratio langues/superficie)

document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('tooltip');
    const svg = document.querySelector('#carte-container svg');
    const legendDiv = document.getElementById('legende-couleur');
    const modeLangues = document.getElementById('mode-langues');
    const modeRatio = document.getElementById('mode-ratio');

    // Prépare les valeurs pour les deux modes
    const languesValues = Object.values(languesData).map(d => d.langues);
    const minLangues = Math.min(...languesValues);
    const maxLangues = Math.max(...languesValues);
    const ratioValues = Object.values(languesData).map(d => d.ratio);
    const minRatio = Math.min(...ratioValues);
    const maxRatio = Math.max(...ratioValues);

    // Classes fixes personnalisées pour le mode "langues"
    function getColorByLangues(n) {
        if (n < 5) return '#cccccc';           // gris
        if (n >= 5 && n <= 9) return '#999999'; // gris foncé
        if (n >= 10 && n <= 19) return '#fff7b2'; // jaune clair
        if (n >= 20 && n <= 49) return '#b7e4b3'; // vert pâle
        if (n >= 50 && n <= 199) return '#2ecc40'; // vert vif
        if (n >= 200) return '#145c18';         // vert foncé
        return '#ccc';
    }

    // Classes fixes pour le mode "ratio"
    function getColorByRatio(val) {
        if (val < 0.00002) return '#cccccc';           // gris
        if (val >= 0.00002 && val < 0.00005) return '#b3d1e7'; // bleu très pâle
        if (val >= 0.00005 && val < 0.0001) return '#7dc4e7';   // bleu clair
        if (val >= 0.0001 && val < 0.0002) return '#40b4e7';    // bleu
        if (val >= 0.0002 && val < 0.0005) return '#1e7cc7';    // bleu moyen
        if (val >= 0.0005) return '#1d3557';                    // bleu foncé
        return '#ccc';
    }

    // Fonction centrale de coloration et de légende
    function updateMap(mode) {
        // Nettoie les anciens groupes SVG
        svg.querySelectorAll('g.country-group').forEach(g => g.remove());
        const countries = svg.querySelectorAll('.country');
        countries.forEach(country => {
            const code = country.id;
            const data = languesData[code];
            if (!data) {
                country.style.fill = '#eee';
                return;
            }
            // Création d'un groupe pour chaque pays
            const bbox = country.getBBox();
            const cx = bbox.x + bbox.width/2;
            const cy = bbox.y + bbox.height/2;
            // Création du groupe
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('country-group');
            group.setAttribute('data-id', code);
            // Clone le path du pays
            const countryClone = country.cloneNode(true);
            // Applique la couleur
            if (mode === 'langues') {
                countryClone.style.fill = getColorByLangues(data.langues);
            } else {
                countryClone.style.fill = getColorByRatio(data.ratio);
            }
            // Ajoute la classe .country si perdue
            countryClone.classList.add('country');
            // Crée le label texte
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', cx);
            text.setAttribute('y', cy);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('alignment-baseline', 'middle');
            text.setAttribute('font-size', Math.max(12, bbox.width/7));
            text.setAttribute('fill', '#fff');
            text.setAttribute('pointer-events', 'none');
            text.setAttribute('font-weight', 'bold');
            text.textContent = code;
            // Ajoute le path et le label au groupe
            group.appendChild(countryClone);
            group.appendChild(text);
            svg.appendChild(group);
        });
        // Légende dynamique
        if (legendDiv) {
            if (mode === 'langues') {
                legendDiv.innerHTML = `
                    <div class=\"titre-legende\">Nombre de langues vivantes par pays</div>
                    <div class=\"labels\" style=\"display: flex; flex-direction: column; gap: 2px; align-items: flex-start; font-size:0.97em;\">
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#cccccc;margin-right:8px;border-radius:3px;\"></span> moins de 5 langues</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#999999;margin-right:8px;border-radius:3px;\"></span> 5 à 9 langues</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#fff7b2;margin-right:8px;border-radius:3px;\"></span> 10 à 19 langues</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#b7e4b3;margin-right:8px;border-radius:3px;\"></span> 20 à 49 langues</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#2ecc40;margin-right:8px;border-radius:3px;\"></span> 50 à 199 langues</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#145c18;margin-right:8px;border-radius:3px;\"></span> 200 langues ou plus</span>
                    </div>
                `;
            } else {
                legendDiv.innerHTML = `
                    <div class=\"titre-legende\">Ratio langues/superficie</div>
                    <div class=\"labels\" style=\"display: flex; flex-direction: column; gap: 2px; align-items: flex-start; font-size:0.97em;\">
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#cccccc;margin-right:8px;border-radius:3px;\"></span> &lt; 0.00002</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#b3d1e7;margin-right:8px;border-radius:3px;\"></span> 0.00002 – 0.00005</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#7dc4e7;margin-right:8px;border-radius:3px;\"></span> 0.00005 – 0.0001</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#40b4e7;margin-right:8px;border-radius:3px;\"></span> 0.0001 – 0.0002</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#1e7cc7;margin-right:8px;border-radius:3px;\"></span> 0.0002 – 0.0005</span>
                        <span><span style=\"display:inline-block;width:18px;height:14px;background:#1d3557;margin-right:8px;border-radius:3px;\"></span> ≥ 0.0005</span>
                    </div>
                `;
            }
        }
        // Ajoute listeners sur les groupes
        svg.querySelectorAll('g.country-group').forEach(group => {
            const code = group.getAttribute('data-id');
            const data = languesData[code];
            group.addEventListener('mousemove', (e) => {
                const nom = group.querySelector('.country').getAttribute('data-name') || code;
                let info = nom;
                if (modeLangues.checked) {
                    if (data && typeof data.langues !== 'undefined') {
                        info += `\n${data.langues} langue${data.langues > 1 ? 's' : ''}`;
                    } else {
                        info += `\n? langue(s)`;
                    }
                } else {
                    if (data && typeof data.ratio !== 'undefined') {
                        info += `\nRatio : ${data.ratio}`;
                    } else {
                        info += `\nRatio : ?`;
                    }
                }
                tooltip.textContent = info;
                tooltip.classList.remove('hidden');
                const rect = document.getElementById('carte-container').getBoundingClientRect();
                tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
                tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
                // Place le groupe en dernier pour l'effet z-index
                if (group.parentNode && group.parentNode.lastChild !== group) {
                    group.parentNode.appendChild(group);
                }
            });
            group.addEventListener('mouseleave', () => {
                tooltip.classList.add('hidden');
            });
        });
    }

    // Gestion du switch
    modeLangues.addEventListener('change', () => updateMap('langues'));
    modeRatio.addEventListener('change', () => updateMap('ratio'));

    // Initialisation
    updateMap('langues');
});
