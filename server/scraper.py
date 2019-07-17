# Authors: Nikhil Kumar & Pravat Bhusal

import urllib.request
from urllib.parse import urlparse, parse_qs
import json
from bs4 import BeautifulSoup

# parse a meals URL
def parse_meals(url):
    # receive the domain of the URL
    parsed_url = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)

    # dictionary to store the meals
    meals = dict()
    
    # makes a request to the given URL and stores the response
    response = urllib.request.urlopen(url)

    # reads in the response and creates a variable out of it to be used as a parser
    html_doc = response.read()
    soup = BeautifulSoup(html_doc, 'html.parser')
    for source_text in soup.find_all('div', {"class": "jumbotron"}):
        # map each meal's URL into the meals dictionary
        meal = str(source_text.h1.strong.text)
        meals[meal] = domain + 'location?meal=' + meal

    # converts the meals dictionary into JSON
    meals_json = json.dumps(meals)
    return meals_json

# parse a location URL
def parse_locations(url):
    # receive the domain of the URL
    parsed_url = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)

    # parse the meal from the URL
    meal = parse_qs(parsed_url.query)['meal'][0]

    # dictionary to store the locations
    locations = dict()

    # makes a request to the given URL and stores the response
    response = urllib.request.urlopen(url)

    # reads in the response and creates a variable out of it to be used as a parser
    html_doc = response.read()
    soup = BeautifulSoup(html_doc, 'html.parser')
    for source_text in soup.find_all('div', {"class": "jumbotron"}):
        # map each location URL into the locations dictionary
        location = str(source_text.h1.strong.text).replace(' ', '%20')
        locations[location] = domain + 'select?meal=' + meal + '&loc=' + location

    # converts the locations dictionary into JSON
    locations_json = json.dumps(locations)
    return locations_json

# parse a URL menu
def parse_menu(url):
    # makes a request to the given URL and stores the response
    response = urllib.request.urlopen(url)

    # reads in the response and creates a variable out of it to be used as a parser
    html_doc = response.read()
    soup = BeautifulSoup(html_doc, 'html.parser')

    # process line function
    def process_line(line, start_char, end_char, start_shift, end_shift):
        start = line.find(start_char)
        end = line.find(end_char)
        result = line[start + start_shift : end - end_shift]
        return result

    # dictionary to store the food names as keys and a list of their dietary icon url's as values
    menu = dict()

    # finds all the td tags in the HTML text
    for source_text in soup.find_all('td'):  

        # splits the HTML text into separate lines of text
        lines = str(source_text).split('\n')

        # parses the HTML table line by line
        for line in lines:
            if line.startswith('<td class="name lead station'):
                category = process_line(line, ';', '</td>', 3, 0)
                menu[category] = dict()
            if line.startswith('<span>') and 'Calories' not in line:
                food_name = process_line(line, '>', '</', 1, 0)
                menu[category][food_name] = list()
            if line.startswith('<img alt='):
                img_url = process_line(line, 'src=', 'width', 5, 2)
                menu[category][food_name].append(img_url)

    # converts the menu dictionary into JSON
    menu_json = json.dumps(menu)
    return menu_json
