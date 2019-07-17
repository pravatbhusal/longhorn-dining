# Author:
# Nikhil Kumar

# server imports
from flask import Flask, request
from flask_cors import CORS
server = Flask(__name__)
CORS(server)

# scraper import
from scraper import parse_meals, parse_locations, parse_menu

# import file io packages
import json

# read the scraper config file
scraper_json = json.load(open("../config/scraper.json", "r+"))
dining_url = scraper_json["url"]

# meal selection route
<<<<<<< Updated upstream
@server.route("/meal", methods=['POST'])
def meal():
    url = request.form.get('url')
    return parse_meals(url)
=======
@server.route("/meal", methods=['GET'])
def meal():
    return parse_meals(dining_url)
>>>>>>> Stashed changes

# locations route
@server.route("/meal/location", methods=['POST'])
def location():
<<<<<<< Updated upstream
    url = request.form.get('url')
=======
>>>>>>> Stashed changes
    return parse_locations(url)

# menu route
@server.route("/meal/location/menu", methods=['POST'])
def menu():
    url = request.form.get('url')
    return parse_menu(url)

if __name__ == "__main__":
    # read the server config file
    server_json = json.load(open("../config/server.json", "r+"))

    # parse the server config file
    host = server_json["host"]
    port = server_json["port"]

    # run the flask server
    server.run(host, port)
