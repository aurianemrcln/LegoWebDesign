import json
import re

# Charger le fichier JSON
with open('./server/dealabsDeals.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Fonction pour extraire le numéro à 5 chiffres du titre et le mettre dans "id"
def update_id_with_title_number(deal):
    # Utiliser une expression régulière pour trouver un numéro à 5 chiffres dans le titre
    match = re.search(r'\b\d{5}\b', deal['title'])
    if match:
        # Mettre à jour l'id avec le numéro trouvé
        deal['id'] = match.group(0)

# Appliquer la fonction à chaque élément de la liste (si c'est une liste)
if isinstance(data, list):
    for deal in data:
        update_id_with_title_number(deal)
else:
    # Si c'est un seul objet JSON
    update_id_with_title_number(data)

# Enregistrer les modifications dans un nouveau fichier JSON
with open('dealabsDeals_updated.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print("Le fichier a été mis à jour avec succès.")