import json
import re

# Charger le fichier JSON
with open('./server/vintedSales.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Fonction pour extraire le numéro à 5 chiffres du titre
def extract_five_digit_number(title):
    match = re.search(r'\b\d{5}\b', title)
    return match.group(0) if match else None

# Filtrer et mettre à jour les entrées
filtered_data = {}
for key, items in data.items():
    updated_items = []
    for item in items:
        five_digit_number = extract_five_digit_number(item['title'])
        if five_digit_number:
            item['uuid'] = five_digit_number
            updated_items.append(item)
    if updated_items:
        filtered_data[key] = updated_items

# Enregistrer les modifications dans un nouveau fichier JSON
if filtered_data:
    with open('vintedSales_updated.json', 'w', encoding='utf-8') as file:
        json.dump(filtered_data, file, ensure_ascii=False, indent=4)
    print("Le fichier a été mis à jour avec succès.")
else:
    print("Aucune entrée valide n'a été trouvée.")