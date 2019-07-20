# UT Dining App
A UT dining web app that simplifies the filtering of food items.

This application web-scrapes the UT Nutrition webpage and displays the information on the website with filters.
- The URL that the web app scrapes from is [here](http://hf-foodapp.austin.utexas.edu/)

### Server
To setup the server, go to ```config/server.json``` and configure the server properties.

Once the server properties have been setup, start the server by running:
```console
cd server
python3 server.py
```

### Client
The client uses bare-bones HTML, CSS, and JavaScript.

To setup the client's connection to the server, go to ```client/js/server.js``` and
configure the server properties.

To initiate the client, copy and paste the files inside the ```client``` folder into your web-server's public HTML folder.
