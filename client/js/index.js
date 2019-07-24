// send an HTTP request to receive the meals
fetch(serverURL + "/meal").then((data) => {
  data.json().then((json) => {
    if(Object.keys(json).length != 0) {
      // loop through each meal from the JSON data
      Object.keys(json).forEach((meal) => {
        addButton(meal, json[meal]);
      });
    } else {
      alert("UT's menu is down right now, it'll be back in a few hours!");
      window.location.href = "index.html";
    }
  });
}).catch((error) => {
  alert("Could not connect to the server, redirecting back!");
  window.location.href = "index.html";
});

// go to a meal page
function goToMeal(meal) {
  window.location.href = "meal.html?meal=" + meal;
}

// add a new button row into the main tag
function addButton(meal, url) {
  // create a button div
  const buttonDiv = document.createElement("div");
  buttonDiv.id = "button";

  // the inner html to the button div
  const upperCaseMeal = meal.toUpperCase();
  buttonDiv.innerHTML = `
    <div id="button-container" onclick="goToMeal('${meal}')">
      <h3 id="button-text">${upperCaseMeal}</h3>
    </div>
  `;

  // append the button div into the main tag
  document.getElementsByTagName("main")[0].appendChild(buttonDiv);
}
