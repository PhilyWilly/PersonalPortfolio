# Copied this file here from another project of me to modify raw tiktok data
import random
import webbrowser
import json


data_path = r'data/december2025.json'
export_path = r'exports/december2025.json'
json_data = None
with open(data_path, 'r', encoding='utf-8') as file:
    json_text = file.read()
    json_data = json.loads(json_text)


print(json_data['Your Activity']['Like List']['ItemFavoriteList'][0].keys())



def open_random_tiktok():
    liked_tiktoks = [vid['link'] for vid in json_data['Your Activity']['Like List']['ItemFavoriteList']]
    print(len(liked_tiktoks))

    random_tiktok = liked_tiktoks[random.randint(0, int(len(liked_tiktoks)))]
    #random_tiktok = liked_tiktok[transformed_value]
    print(random_tiktok)

    #time.sleep(10)
    webbrowser.open(random_tiktok)

def print_all_comments():
    for comment in json_data['Comment']['Comments']['CommentsList']:
        print(comment['date'] + ": " + comment['comment'])

def save_all_liked_tiktoks():
    liked_tiktoks = [vid['link'] for vid in json_data['Your Activity']['Like List']['ItemFavoriteList']]

    with open(export_path, 'w', encoding='utf-8') as file:
        text = '[\n'
        for i, tt in enumerate(liked_tiktoks):
            text += '\t"' + tt
            # Ensures the last line doesnt have a comma
            if i != len(liked_tiktoks)-1:
                text += '",\n'
            else:
                text += '"\n'
        text += "]"
        file.write(text)


#open_random_tiktok()
# print_all_comments()
save_all_liked_tiktoks()