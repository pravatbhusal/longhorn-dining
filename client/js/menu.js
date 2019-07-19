// receive the URL variables
function getURLParams() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => {
      vars[key] = value;
    });
    return vars;
}
const meal = getURLParams()["meal"];
const loc = getURLParams()["loc"];

// set the header text
headerText = document.getElementById("header-text");
headerText.textContent = loc.replace(new RegExp("%20", "g"), " ") + " - " + meal;

// send an HTTP request to receive the items
fetch(serverURL + "/meal/location/menu", {
  method: "POST",
  body: JSON.stringify({
    meal: meal,
    location: loc
  })
}).then((data) => {
  data.json().then((json) => {
    // parse the food information
    addFilterButtons(json["Filters"]);
    const menu = json["Menu"];
    const nutrition = json["Nutrition"];
  });
}).catch((error) => {
  // an error occurred when fetching the data
  console.log(error);
});

// add the filter buttons nto the content
function addFilterButtons(filters) {
  // loop through each filter from the JSON data
  Object.keys(filters).forEach((filter) => {
    // create a button div
    const filterDiv = document.createElement("div");
    filterDiv.id = "filter";

    // the inner html to the button div
    const upperCaseFilter = getFilterName(filter).toUpperCase();
    const filterImage = filters[filter];
    filterDiv.innerHTML = `
      <div id="filter-container">
        <img id="filter-image" src="${filterImage}">
        <p id="filter-text">${upperCaseFilter}</p>
      </div>
    `;

    // append the filter div into the filters tag
    document.getElementById("filters").appendChild(filterDiv);
  });
}

// return special cases for filters
function getFilterName(filter) {
  let filterName = filter;

  // determine the filter name from the cases
  if(filter != "Vegan" && filter != "Healthy") {
    if(filter == "Veggie") {
      // special case for vegetarian renaming
      filterName = "Vegetarian";
    } else {
      // special cases for plurals and renaming
      if(filter == "Milk") {
        filter = "Dairy";
      } else if(filter == "Nuts") {
        filter = "Nut";
      } else if(filter == "Eggs") {
        filter = "Egg";
      }
      filterName = filter + "-Free";
    }
  }
  return filterName;
}
