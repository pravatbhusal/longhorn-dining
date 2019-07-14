import urllib.request
import json
from bs4 import BeautifulSoup

# Makes a request to the given URL and stores the response
response = urllib.request.urlopen('http://hf-foodapp.austin.utexas.edu/select?meal=Dinner&loc=Jester%202nd%20Floor%20Dining')
# Reads in the response and creates a variable out of it to be used as a parser
html_doc = response.read()
soup = BeautifulSoup(html_doc, 'html.parser')

def process_line(line, start_char, end_char, start_shift, end_shift) :
    start = line.find(start_char)
    end = line.find(end_char)
    result = line[start + start_shift : end - end_shift]
    return result

# Dictionary to store the food names as keys and a list of their dietary icon url's as values
categories_to_names_and_images = dict()
# Finds all the td tags in the HTML text
for text in soup.find_all('td') :
    # Splits the HTML text into separate lines of text
    lines = str(text).split('\n')
    # Parses the HTML line by line
    for line in lines :
        # Extracts the categories representing the different food lines for each dining hall
        if line.startswith('<td class="name lead station') :
            start = line.find(';')
            end = line.find('</td>')
            category = line[start + 3 : end]
            categories_to_names_and_images[category] = dict()
        # Extracts every food name from its unique span tag and puts it in the dictionary
        if line.startswith('<span>') and 'Calories' not in line :
            start = line.find('>')
            end = line.find('</')
            food_name = line[start + 1 : end]
            categories_to_names_and_images[category][food_name] = list()
        # Extracts each food name's dietary icon url's
        if line.startswith('<img alt=') :
            start = line.find('src=')
            end = line.find('width')
            img_url = line[start + 5 : end - 2]
            # Adds each image url to a list of url's associated with each food item
            categories_to_names_and_images[category][food_name].append(img_url)
# Converts the dictionary created by the program into a json format
app_json = json.dumps(categories_to_names_and_images)
print(app_json)
