import json
import re
from datetime import datetime

# Charger le fichier JSON
with open('./server/vintedSales.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Fonction pour extraire le numéro à 5 chiffres du titre
def extract_five_digit_number(title):
    match = re.search(r'\b\d{5}\b', title)
    return match.group(0) if match else None

# Fonction pour convertir la date au format souhaité
def convert_date_format(date_str):
    # Convertir la chaîne de date en objet datetime
    date_obj = datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %Z")
    # Retourner la date au format "YYYY-MM-DD"
    return date_obj.strftime("%Y-%m-%d")

# Filtrer et mettre à jour les entrées
filtered_data = {}
for key, items in data.items():
    updated_items = []
    for item in items:
        five_digit_number = extract_five_digit_number(item['title'])
        if five_digit_number:
            # Ajouter le numéro à 5 chiffres dans une nouvelle variable 'id'
            item['id'] = five_digit_number
            # Convertir la date
            item['published'] = convert_date_format(item['published'])
            updated_items.append(item)
    if updated_items:
        filtered_data[key] = updated_items

# Enregistrer les modifications dans un nouveau fichier JSON
if filtered_data:
    with open('./server/vintedSales_updated.json', 'w', encoding='utf-8') as file:
        json.dump(filtered_data, file, ensure_ascii=False, indent=4)
    print("Le fichier a été mis à jour avec succès.")
else:
    print("Aucune entrée valide n'a été trouvée.")