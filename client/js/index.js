// send an HTTP request to receive the meals
fetch(serverURL + "/meal").then((data) => {
  data.json().then((json) => {
    if(Object.keys(json).length != 0) {
      // loop through each meal from the JSON data
      Object.keys(json).forEach((meal) => {
        addButton(meal, json[meal]);
      });
    } else {
      alert("Failed to receive information from UT. Check back later!");
    }
  });
}).catch((error) => {
  alert("Failed to receive the information from the server.");
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
