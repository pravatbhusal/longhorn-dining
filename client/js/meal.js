// receive the URL variables
function getURLParams() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => {
      vars[key] = value;
    });
    return vars;
}
const meal = getURLParams()["meal"];

// send an HTTP request to receive the locations
fetch(serverURL + "/meal/location", {
  method: "POST",
  body: JSON.stringify({
    meal: meal
  })
}).then((data) => {
  data.json().then((json) => {
    if(Object.keys(json).length != 0) {
      // loop through each location from the JSON data
      Object.keys(json).forEach((location) => {
        addButton(location, json[meal]);
      });
    } else {
      alert("Failed to receive information from UT. Check back later!");
      window.location.href = "index.html";
    }
  });
}).catch((error) => {
  alert("Failed to receive the information from the server.");
});

// go to a menu page
function goToMenu(location) {
  window.location.href = "menu.html?meal=" + meal + "&loc=" + location;
}

// add a new button row into the main tag
function addButton(location, url) {
  // create a button div
  const buttonDiv = document.createElement("div");
  buttonDiv.id = "button";

  // the inner html to the button div
  const upperCaseLocation = location.toUpperCase();
  buttonDiv.innerHTML = `
    <div id="button-container" onclick="goToMenu('${location}')">
      <h3 id="button-text">${upperCaseLocation}</h3>
    </div>
  `;

  // append the button div into the main tag
  document.getElementsByTagName("main")[0].appendChild(buttonDiv);
}
