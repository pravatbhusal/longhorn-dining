import urllib.request
from urllib.parse import urlparse, parse_qs
import json
from bs4 import BeautifulSoup

def parse_meals(url):
    # receive the domain of the URL
    parsed_url = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)

    # Dictionary to store the meals
    meals = {}
    
    # Makes a request to the given URL and stores the response
    response = urllib.request.urlopen(url)

    # Reads in the response and creates a variable out of it to be used as a parser
    html_doc = response.read()
    soup = BeautifulSoup(html_doc, 'html.parser')
    for text in soup.find_all('div', {"class": "jumbotron"}):
        # map each meal's URL into the meals dictionary
        meal = str(text.h1.strong.text)
        meals[meal] = domain + "location?meal=" + meal

    return meals

def parse_locations(url):
    # receive the domain of the URL
    parsed_url = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)

    # parse the meal from the URL
    meal = parse_qs(parsed_url.query)['meal'][0]

    # Dictionary to store the locations
    locations = {}

    # Makes a request to the given URL and stores the response
    response = urllib.request.urlopen(url)

    # Reads in the response and creates a variable out of it to be used as a parser
    html_doc = response.read()
    soup = BeautifulSoup(html_doc, 'html.parser')
    for text in soup.find_all('div', {"class": "jumbotron"}):
        # map each location URL into the locations dictionary
        location = str(text.h1.strong.text).replace(" ", "%20")
        locations[location] = domain + "select?meal=" + meal + "&loc=" + location

    return locations

# parse a URL menu
def parse_menu(url):
    # Makes a request to the given URL and stores the response
    response = urllib.request.urlopen(url)

    # Reads in the response and creates a variable out of it to be used as a parser
    html_doc = response.read()
    soup = BeautifulSoup(html_doc, 'html.parser')

    # Process line function
    def process_line(line, start_char, end_char, start_shift, end_shift):
        start = line.find(start_char)
        end = line.find(end_char)
        result = line[start + start_shift : end - end_shift]
        return result

    # Dictionary to store the food names as keys and a list of their dietary icon url's as values
    categories_to_names_and_images = dict()

    # Finds all the td tags in the HTML text
    for text in soup.find_all('td'):  
        # Splits the HTML text into separate lines of text
        lines = str(text).split('\n')

        # Parses the HTML table line by line
        for line in lines:
            if line.startswith('<td class="name lead station'):
                category = process_line(line, ';', '</td>', 3, 0)
                categories_to_names_and_images[category] = dict()
            if line.startswith('<span>') and 'Calories' not in line:
                food_name = process_line(line, '>', '</', 1, 0)
                categories_to_names_and_images[category][food_name] = list()
            if line.startswith('<img alt='):
                img_url = process_line(line, 'src=', 'width', 5, 2)
                categories_to_names_and_images[category][food_name].append(img_url)

    # Converts the dictionary created by the program into a json format
    app_json = json.dumps(categories_to_names_and_images)
    return app_json
