import re

# Fichiers à traiter
svg_file = "africa.svg"
html_file = "index.html"

# Lire le SVG
with open(svg_file, "r", encoding="utf-8") as f:
    svg_content = f.read()

# Extraire tous les <path ...> (chaque pays)
paths = re.findall(r'(<path[^>]+>)', svg_content)

# Ajouter la classe country si besoin
def ensure_country_class(path):
    if 'class=' in path:
        return re.sub(r'class="([^"]*)"', lambda m: f'class="{m.group(1)} country"' if 'country' not in m.group(1) else m.group(0), path)
    else:
        return path.replace('<path', '<path class="country"', 1)

paths = [ensure_country_class(p) for p in paths]

# Lire l’HTML
with open(html_file, "r", encoding="utf-8") as f:
    html = f.read()

# Remplacer le contenu du <g>...</g> par tous les paths
new_g = "<g>\n" + "\n".join(paths) + "\n</g>"
html = re.sub(r"<g>.*?</g>", new_g, html, flags=re.DOTALL)

# Sauvegarder
with open(html_file, "w", encoding="utf-8") as f:
    f.write(html)

print("Carte interactive complète intégrée dans index.html !")
