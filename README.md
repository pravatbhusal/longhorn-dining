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

# UT Menu Parsing Guide
Because this web-app relies on the UT Dining page's HTML, if the HTML code to the UT menu changes or the UT menu's website shuts down, then this guide will show you how to format the data from the server for the client to properly parse it.

### URL Changes to UT Menu
If the URL to the UT Menu page changes, change it in the ```config/scraper.json```.

### scraper.py Methods
##### 1. parse_meals(url)  
Returns the meals with the link to the meal's locations in JSON format.

Here is an example JSON data format the method should return:
```json
{
  "Breakfast": "http://hf-foodapp.austin.utexas.edu/location?meal=Breakfast",
  "Lunch": "http://hf-foodapp.austin.utexas.edu/location?meal=Lunch",
  "Dinner": "http://hf-foodapp.austin.utexas.edu/location?meal=Dinner"
}
```

##### 2. parse_locations(url)
Returns the locations with the link to the location's menu in JSON format.

Here is an example JSON data format the method should return:
```json
{
  "J2 FAST Line": "http://hf-foodapp.austin.utexas.edu/select?meal=Lunch&loc=J2 FAST Line",
  "Jester 2nd Floor Dining": "http://hf-foodapp.austin.utexas.edu/select?meal=Lunch&loc=Jester 2nd Floor Dining"
}
```

##### 3. parse_menu(url)
Returns the menu with information about each food item in JSON format.

Here is an example JSON data format the method should return:
```json
{  
   "Nutrition":{  
      "Al Fresco Mixed Fruit":[  
         "Serving Size 2 oz",
         "Amount Per Serving",
         "Calories 24",
         "Calories from Fat 0",
         "Total Fat 0g",
         "Saturated Fat 0g",
         "Trans Fat 0g",
         "Cholesterol 0mg",
         "Sodium 4.7mg",
         "Total Carbohydrate 6.6g",
         "Dietary Fiber 0.9g",
         "Sugars 6.1g",
         "Protein 0.5g"
      ],
      "Bacon Slices":[  
         "Serving Size 2 each",
         "Amount Per Serving",
         "Calories 103",
         "Calories from Fat 0",
         "Total Fat 9g",
         "Saturated Fat 3.2g",
         "Trans Fat 0g",
         "Cholesterol 19.2mg",
         "Sodium 294.7mg",
         "Total Carbohydrate 0g",
         "Dietary Fiber 0g",
         "Sugars 0g",
         "Protein 6.4g"
      ],
      "Gluten Free French Toast":[  
         "Serving Size 1 each",
         "Amount Per Serving",
         "Calories 185",
         "Calories from Fat 0",
         "Total Fat 3g",
         "Saturated Fat 0g",
         "Trans Fat 0g",
         "Cholesterol 0mg",
         "Sodium 242.3mg",
         "Total Carbohydrate 39.7g",
         "Dietary Fiber 1.4g",
         "Sugars 4.5g",
         "Protein 1.5g"
      ]
   },
   "Filters":{  
      "Vegan":"http://hf-food.austin.utexas.edu/foodpro/LegendImages/vegan.gif",
      "Gluten":"http://hf-food.austin.utexas.edu/foodpro/LegendImages/gluten.gif",
      "Healthy":"http://hf-food.austin.utexas.edu/foodpro/LegendImages/healthy.gif",
      "Pork":"http://hf-food.austin.utexas.edu/foodpro/LegendImages/pork.gif",
      "Veggie":"http://hf-food.austin.utexas.edu/foodpro/LegendImages/veggie.gif"
   },
   "Menu":{  
      "FAST Line":{  
         "Al Fresco Mixed Fruit":[  
            "http://hf-food.austin.utexas.edu/foodpro/LegendImages/vegan.gif",
            "http://hf-food.austin.utexas.edu/foodpro/LegendImages/gluten.gif",
            "http://hf-food.austin.utexas.edu/foodpro/LegendImages/healthy.gif"
         ],
         "Bacon Slices":[  
            "http://hf-food.austin.utexas.edu/foodpro/LegendImages/pork.gif",
            "http://hf-food.austin.utexas.edu/foodpro/LegendImages/gluten.gif"
         ],
         "Gluten Free French Toast":[  
            "http://hf-food.austin.utexas.edu/foodpro/LegendImages/veggie.gif",
            "http://hf-food.austin.utexas.edu/foodpro/LegendImages/gluten.gif"
         ]
      }
   }
}
```
