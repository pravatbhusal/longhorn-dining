# server imports
from flask import Flask, request
server = Flask(__name__)

# scraper import


# landing route
@server.route("/")
def landing():
    return "<h1>Landing Page of server.</h1>"

if __name__ == "__main__":
    server.run("localhost", 8080)
