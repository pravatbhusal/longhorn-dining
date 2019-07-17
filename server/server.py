# Author:
# Nikhil Kumar

# server imports
from flask import Flask, request
server = Flask(__name__)

# scraper import
from scraper import parse_meals, parse_locations, parse_menu

# import file io packages
import json

# meal selection route
@server.route("/meal", methods=['POST'])
def meal():
    url = request.form.get('url')
    return parse_meals(url)

# locations route
@server.route("/meal/location", methods=['POST'])
def location():
    url = request.form.get('url')
    return parse_locations(url)

# menu route
@server.route("/meal/location/menu", methods=['POST'])
def menu():
    url = request.form.get('url')
    return parse_menu(url)

if __name__ == "__main__":
    # read the server config file
    server_config = open("../config//server.json", "r+")

    # parse the server config file
    server_json = json.load(server_config)
    host = server_json["host"]
    port = server_json["port"]

    # run the flask server
    server.run(host, port)
