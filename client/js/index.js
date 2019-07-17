// the host of the server
const host = "http://localhost";

// the port of the server
const port = 5000;

// the URL of the server
const serverURL = host + ":" + port;

// send an HTTP request to receive the meals
fetch(serverURL + "/meal").then((data) => {
  data.json().then((json) => {
    // loop through each meal from the JSON data
    Object.keys(json).forEach((meal) => {
      addButton(meal.toUpperCase(), json[meal]);
    });
  });
}).catch((error) => {
  // an error occurred when fetching the data
  console.log(error);
});

// add a new button row into the main tag
function addButton(text, url) {
  // create a button div
  const buttonDiv = document.createElement("div");
  buttonDiv.id = "button";

  // the inner html to the button div
  buttonDiv.innerHTML = `
    <div id="button-container">
      <h3 id="button-text">${text}</h3>
    </div>
  `;

  // append the button div into the main tag
  document.getElementsByTagName("main")[0].appendChild(buttonDiv);
}
