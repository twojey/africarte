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
                // Replace le groupe juste avant le calque des empires pour qu'il repasse sous l'ellipse
                const empiresLayer = svg.querySelector('g#empires');
                if (empiresLayer && group.parentNode) {
                    group.parentNode.insertBefore(group, empiresLayer);
                }
            });
        });
        // === Replace le calque des empires en dernier pour qu'il reste au-dessus ===
        const empiresLayer = svg.querySelector('g#empires');
        if (empiresLayer && empiresLayer.parentNode.lastChild !== empiresLayer) {
            empiresLayer.parentNode.appendChild(empiresLayer);
        }
    }

    // Gestion du switch
    modeLangues.addEventListener('change', () => updateMap('langues'));
    modeRatio.addEventListener('change', () => updateMap('ratio'));

    // Bouton pour afficher/masquer les empires
    const toggleEmpiresBtn = document.getElementById('toggle-empires');
    let empiresVisible = true;
    if (toggleEmpiresBtn) {
        toggleEmpiresBtn.addEventListener('click', () => {
            const empiresLayer = svg.querySelector('g#empires');
            if (empiresLayer) {
                empiresVisible = !empiresVisible;
                empiresLayer.style.display = empiresVisible ? '' : 'none';
                toggleEmpiresBtn.textContent = empiresVisible ? 'Masquer les empires' : 'Afficher les empires';
            }
        });
        // Met à jour le texte initial du bouton
        toggleEmpiresBtn.textContent = 'Masquer les empires';
    }

    // Initialisation
    updateMap('langues');

    // === Calque dynamique des empires africains ===
    // Ajoute un groupe SVG pour les empires
    const empiresLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
    empiresLayer.id = 'empires';
    // Empire Songhaï (corrigé, ouest Mali)
    const ellipseSonghai = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
    ellipseSonghai.setAttribute('cx', 210); // Ouest Mali
    ellipseSonghai.setAttribute('cy', 320);
    ellipseSonghai.setAttribute('rx', 95);
    ellipseSonghai.setAttribute('ry', 60);
    ellipseSonghai.setAttribute('fill', 'rgba(200,0,0,0.18)');
    ellipseSonghai.setAttribute('stroke', 'crimson');
    ellipseSonghai.setAttribute('stroke-width', '2');
    ellipseSonghai.setAttribute('pointer-events', 'none');
    ellipseSonghai.setAttribute('id', 'empire-songhai');
    empiresLayer.appendChild(ellipseSonghai);
    // === Repères géographiques pour le calage ===
    // R1 : croisement Tchad (TD), Soudan (SD), Centrafrique (CF)
    const repereR1 = document.createElementNS('http://www.w3.org/2000/svg','circle');
    repereR1.setAttribute('cx', 570); // Correction: plus à l'est et au sud
    repereR1.setAttribute('cy', 360);
    repereR1.setAttribute('r', 7);
    repereR1.setAttribute('fill', 'red');
    repereR1.setAttribute('stroke', '#fff');
    repereR1.setAttribute('stroke-width', '2');
    repereR1.setAttribute('id', 'repere-R1');
    empiresLayer.appendChild(repereR1);
    // Label R1
    const labelR1 = document.createElementNS('http://www.w3.org/2000/svg','text');
    labelR1.setAttribute('x', 540);
    labelR1.setAttribute('y', 328);
    labelR1.setAttribute('text-anchor', 'middle');
    labelR1.setAttribute('font-size', '15');
    labelR1.setAttribute('font-weight', 'bold');
    labelR1.setAttribute('fill', '#c00');
    labelR1.textContent = 'R1';
    empiresLayer.appendChild(labelR1);
    // R2 : sud Soudan (SD), nord Ouganda (UG), nord RDC (CD)
    const repereR2 = document.createElementNS('http://www.w3.org/2000/svg','circle');
    repereR2.setAttribute('cx', 620); // Correction: plus à l'est et au sud
    repereR2.setAttribute('cy', 440);
    repereR2.setAttribute('r', 7);
    repereR2.setAttribute('fill', 'blue');
    repereR2.setAttribute('stroke', '#fff');
    repereR2.setAttribute('stroke-width', '2');
    repereR2.setAttribute('id', 'repere-R2');
    empiresLayer.appendChild(repereR2);
    // Label R2
    const labelR2 = document.createElementNS('http://www.w3.org/2000/svg','text');
    labelR2.setAttribute('x', 650);
    labelR2.setAttribute('y', 468);
    labelR2.setAttribute('text-anchor', 'middle');
    labelR2.setAttribute('font-size', '15');
    labelR2.setAttribute('font-weight', 'bold');
    labelR2.setAttribute('fill', 'blue');
    labelR2.textContent = 'R2';
    empiresLayer.appendChild(labelR2);
    // R3 : Côte d'Ivoire, Ghana, Burkina Faso
    const repereR3 = document.createElementNS('http://www.w3.org/2000/svg','circle');
    repereR3.setAttribute('cx', 295);
    repereR3.setAttribute('cy', 362);
    repereR3.setAttribute('r', 7);
    repereR3.setAttribute('fill', 'green');
    repereR3.setAttribute('stroke', '#fff');
    repereR3.setAttribute('stroke-width', '2');
    repereR3.setAttribute('id', 'repere-R3');
    empiresLayer.appendChild(repereR3);
    // Label R3
    const labelR3 = document.createElementNS('http://www.w3.org/2000/svg','text');
    labelR3.setAttribute('x', 265);
    labelR3.setAttribute('y', 330);
    labelR3.setAttribute('text-anchor', 'middle');
    labelR3.setAttribute('font-size', '15');
    labelR3.setAttribute('font-weight', 'bold');
    labelR3.setAttribute('fill', 'green');
    labelR3.textContent = 'R3';
    empiresLayer.appendChild(labelR3);

    // Définition des repères pour la conversion barycentrique
    const R1 = {lat: 10.93028779796739, lng: 22.878274206724846, cx: 570, cy: 360};
    const R2 = {lat: 5.01785640568839, lng: 27.449291861375077, cx: 620, cy: 440};
    const R3 = {lat: 9.486059137064844, lng: -2.705004491144971, cx: 295, cy: 362};

    // Conversion latitude/longitude vers coordonnées SVG (barycentrique)
    // Utilise trois repères (lat, lng, cx, cy)
    function geoToScreenBary(lat, lng, R1, R2, R3) {
        // R1, R2, R3 = {lat, lng, cx, cy}
        // Calcul des barycentres
        const det = (R2.lat - R3.lat)*(R1.lng - R3.lng) + (R3.lng - R2.lng)*(R1.lat - R3.lat);
        const l1 = ((R2.lat - R3.lat)*(lng - R3.lng) + (R3.lng - R2.lng)*(lat - R3.lat)) / det;
        const l2 = ((R3.lat - R1.lat)*(lng - R3.lng) + (R1.lng - R3.lng)*(lat - R3.lat)) / det;
        const l3 = 1 - l1 - l2;
        const cx = l1*R1.cx + l2*R2.cx + l3*R3.cx;
        const cy = l1*R1.cy + l2*R2.cy + l3*R3.cy;
        return {cx, cy};
    }

    // === Empires historiques : ellipses ===
    // Nouvelle liste basée sur la demande utilisateur (top 10, positions approximatives et surfaces proportionnelles)
    // Surfaces historiques estimées (en km²) + ratio personnalisé pour chaque empire
    const empireData = [
      { name: "Égypte ancienne", lat: 26.5, lng: 31.5, area: 1000000, color: "rgba(255, 215, 0, 0.3)", ratio: 3 }, // très allongé nord-sud
      { name: "Carthage", lat: 36.8, lng: 10.2, area: 300000, color: "rgba(255, 87, 34, 0.3)", ratio: 0.5 }, // horizontal (2:1)
      { name: "Nubie/Koush", lat: 18.5, lng: 31.7, area: 1500000, color: "rgba(255, 0, 0, 0.3)", ratio: 2 }, // vertical
      { name: "Empire du Ghana", lat: 14.5, lng: -2.0, area: 500000, color: "rgba(0, 140, 255, 0.3)", ratio: 0.5 }, // horizontal
      { name: "Empire du Mali", lat: 13.5, lng: -4.0, area: 1100000, color: "rgba(255, 165, 0, 0.3)", ratio: 0.7 }, // horizontal
      { name: "Empire Songhaï", lat: 16.0, lng: 0.0, area: 1400000, color: "rgba(0, 200, 83, 0.3)", ratio: 0.5 }, // horizontal
      { name: "Kanem-Bornou", lat: 13.0, lng: 15.5, area: 800000, color: "rgba(156, 39, 176, 0.3)", ratio: 1 }, // rond
      { name: "Grand Zimbabwe", lat: -20.3, lng: 30.0, area: 350000, color: "rgba(33, 150, 243, 0.3)", ratio: 1 }, // rond
      { name: "Royaume du Bénin", lat: 6.5, lng: 5.6, area: 150000, color: "rgba(255, 99, 71, 0.3)", ratio: 2 }, // vertical
      { name: "Aksoum", lat: 14.1, lng: 38.7, area: 1200000, color: "rgba(0, 188, 212, 0.3)", ratio: 1.5 } // vertical
    ];
    // Conversion km² en degrés (approximation sphérique)
    // 1° latitude ≈ 111 km, 1° longitude ≈ 111 km × cos(lat)
    function getEllipseDegrees(area_km2, lat_centre, ratio) {
        // ratio = ry/rx (vertical/horizontal)
        // pi*rx*ry = area_geo_deg2
        // ry = ratio*rx
        // pi*rx*ratio*rx = area_geo_deg2 => rx = sqrt(area_geo_deg2/(pi*ratio)), ry = ratio*rx
        const cosLat = Math.cos(lat_centre * Math.PI / 180);
        const area_geo_deg2 = area_km2 / (111*111 * cosLat);
        const rx = Math.sqrt(area_geo_deg2 / (Math.PI * ratio));
        const ry = ratio * rx;
        return { dlat: ry, dlng: rx };
    }
    const empires = empireData.map(e => {
        // Calcule les demi-axes en degrés, ratio personnalisé
        const { dlat, dlng } = getEllipseDegrees(e.area, e.lat, e.ratio);
        // Centre
        const { cx, cy } = geoToScreenBary(e.lat, e.lng, R1, R2, R3);
        // Point nord (lat+dlat)
        const { cy: cyN } = geoToScreenBary(e.lat + dlat, e.lng, R1, R2, R3);
        // Point sud (lat-dlat)
        const { cy: cyS } = geoToScreenBary(e.lat - dlat, e.lng, R1, R2, R3);
        // Point est (lng+dlng)
        const { cx: cxE } = geoToScreenBary(e.lat, e.lng + dlng, R1, R2, R3);
        // Point ouest (lng-dlng)
        const { cx: cxW } = geoToScreenBary(e.lat, e.lng - dlng, R1, R2, R3);
        // rx = (cxE - cxW)/2 ; ry = (cyN - cyS)/2
        const rx = Math.abs(cxE - cxW) / 2;
        const ry = Math.abs(cyN - cyS) / 2;
        return {
            name: e.name,
            lat: e.lat,
            lng: e.lng,
            rx: rx,
            ry: ry,
            color: e.color
        };
    });
    empires.forEach(empire => {
        const {cx, cy} = geoToScreenBary(empire.lat, empire.lng, R1, R2, R3);
        const ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
        ellipse.setAttribute('cx', cx);
        ellipse.setAttribute('cy', cy);
        ellipse.setAttribute('rx', empire.rx);
        ellipse.setAttribute('ry', empire.ry);
        ellipse.setAttribute('fill', empire.color);
        ellipse.setAttribute('stroke', '#333');
        ellipse.setAttribute('stroke-width', '1');
        ellipse.setAttribute('pointer-events', 'none');
        ellipse.setAttribute('id', 'empire-'+empire.name.replace(/[^a-z0-9]/gi,'-').toLowerCase());
        empiresLayer.appendChild(ellipse);
        // Label texte au centre
        const label = document.createElementNS('http://www.w3.org/2000/svg','text');
        label.setAttribute('x', cx);
        label.setAttribute('y', cy+5);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '13');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('fill', '#333');
        label.setAttribute('pointer-events', 'none');
        label.textContent = empire.name;
        empiresLayer.appendChild(label);
    });

    // Exemple d'utilisation :
    const result = geoToScreenBary(9.5, -2.7, R1, R2, R3);
    console.log(result); // {cx: ..., cy: ...}

    svg.appendChild(empiresLayer);
});
