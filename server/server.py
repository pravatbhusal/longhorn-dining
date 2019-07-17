# Author: 
# Nikhil Kumar

# server imports
from flask import Flask, request
server = Flask(__name__)

# scraper import
from scraper import parse_meals, parse_locations, parse_menu

# meal selection route
@server.route("/meal", methods=['POST'])
def meals():
    url = request.form.get('url')
    return parse_meals(url)

# locations route
@server.route("/meal/location", methods=['POST'])
def locations():
    url = request.form.get('url')
    return parse_locations(url)

# menu route
@server.route("/meal/location/menu", methods=['POST'])
def menu():
    url = request.form.get('url')
    return parse_menu(url)

if __name__ == "__main__":
    server.run("localhost", 8080)
