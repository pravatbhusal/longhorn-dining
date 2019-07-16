# Author: 
# Nikhil Kumar

# server imports
from flask import Flask, request
server = Flask(__name__)

# scraper import
from scraper import parse_meals, parse_locations, parse_menu

# landing route (to be removed)
@server.route("/")
def landing():
    return "<h1>Landing Page of server.</h1>"

# meal selection route
@server.route("/meals")
def meals():
    return parse_meals

# locations route
@server.route("/meals/locations")
def locations():
    return parse_locations

# menu route
@server.route("/meals/locations/menu")
def menu():
    return parse_menu

if __name__ == "__main__":
    server.run("localhost", 8080)
