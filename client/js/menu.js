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

// variables to store the food information
var filters = undefined;
var menu = undefined;
var nutrition = undefined;

// current filters to the menu
var filterOuts = {};
var filterIns = {};

// food quantities added by the user
var foodQuantities = {};

// total amount of nutrition value of each food item added by the user
var totalNutrition = {"Calories": 0, "Calories from Fat": 0, "Total Fat": 0,
  "Saturated Fat": 0, "Trans Fat": 0, "Cholestrol": 0, "Sodium": 0,
  "Total Carbohydrate": 0, "Dietary Fiber": 0, "Sugars": 0, "Protein": 0};

// send an HTTP request to receive the items
fetch(serverURL + "/meal/location/menu", {
  method: "POST",
  body: JSON.stringify({
    meal: meal,
    location: loc
  })
}).then((data) => {
  data.json().then((json) => {
    // parse then store the food information
    filters = json["Filters"];
    menu = json["Menu"];
    nutrition = json["Nutrition"];

    // view the food information
    addFilterButtons(filters, menu);
    updateMenuItems();
  }).catch((error) => {
    alert("Failed to receive information from UT. Check back later!");
  });
}).catch((error) => {
  alert("Failed to receive the information from the server.");
});

// add the filter buttons onto the content's HTML
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
      <div id="filter-container" data-filter="${filter}"
        onclick="toggleFilter('${filter}')">
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

// toggle a filter on the menu's HTML
function toggleFilter(filter) {
  // the food icon to the filter
  const foodIcon = filters[filter];

  // determine what type of filtering this filter goes to
  let filterObj = filterOuts;
  if(filter == "Veggie" || filter == "Vegan" || filter == "Healthy" || filter == "Gluten") {
    // set the filter object to filter in (whitelist) these foods
    filterObj = filterIns;
  }

  // receive the div button for the filter
  const filterDiv = document.querySelector(`[data-filter='${filter}']`);

  if(!filterObj[foodIcon]) {
    // this filter has not been added, so add it into the current filters
    filterObj[foodIcon] = filter;
    filterDiv.style.opacity = 0.7;
  } else {
    // this filter has been added, so remove it from the current filters
    delete filterObj[foodIcon];
    filterDiv.style.opacity = 1;
  }

  // update the menu items with the new filters
  updateMenuItems();
}

// update the search menu's HTML
function updateSearchMenu() {
  var search = document.getElementById("search-input-text").value;
  updateMenuItems(search);
}

// update the menu items onto the menu's HTML
function updateMenuItems(search) {
  // get the menu items table, then clear all of its children
  const itemsTable = document.getElementById("items-table");
  while(itemsTable.firstChild) {
    itemsTable.removeChild(itemsTable.firstChild);
  }

  // loop through each item from the JSON data
  Object.keys(menu).forEach((category) => {
    // append the category
    let itemRow = `
      <tr><td><b>-- ${category} --</b></td></tr>
      <tr><td></td></tr>
    `;

    // append the items of the category
    itemRow += getCategoryItems(itemRow, category, search);

    // append the spaces
    itemRow += `<tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>`;

    // append the html to add the category of items
    itemsTable.innerHTML += itemRow;
  });
}

// get the category's items formatted as HTML
function getCategoryItems(itemRow, category, search) {
  let categoryItems = "";

  // determine if the whitelist (filter ins) is on
  const whiteListCount = Object.keys(filterIns).length;
  const whiteListOn = whiteListCount != 0;

  // loop through each category and append its items
  const items = menu[category];
  Object.keys(items).forEach((item) => {
    // this food item's icons (filters)
    const foodIcons = items[item];

    // determine whether to filter out or in this food item
    let filterOut = false;
    let filterInCount = 0;
    let foodIconIndex = 0;

    // if search is enabled and the item is not searched, then filter it out
    let itemLowerCase = item.toString().toLowerCase();
    let searchLowerCase = search ? search.toString().toLowerCase() : undefined;
    if(search && itemLowerCase.indexOf(searchLowerCase) == -1) {
      filterOut = true;
    } else {
      while(foodIconIndex < foodIcons.length) {
        // get the food icon
        let foodIcon = foodIcons[foodIconIndex];

        if(whiteListOn && filterIns[foodIcon]) {
          // this item is whitelisted (filter in)
          filterInCount++;
        }
        if(filterOuts[foodIcon]) {
          // this item is blacklisted (filter out)
          filterOut = true;
        }
        foodIconIndex++;
      }
    }

    if((whiteListOn && filterInCount == whiteListCount && !filterOut)
      || (!whiteListOn && !filterOut)) {
      // append the item because it obeys the filters
      categoryItems += formatCategoryItem(items[item], item);
    }
  });
  return categoryItems;
}

// format the category item's HTML
function formatCategoryItem(foodIcons, item) {
  let filterImages = "";

  // loop through each food icon (filter)
  let foodIconIndex = 0;
  while(foodIconIndex < foodIcons.length) {
    // get the food icon, then append it as an image
    let foodIcon = foodIcons[foodIconIndex];
    filterImages += `<img id="item-image" src="${foodIcon}">`;
    foodIconIndex++;
  }

  // the quantity of this item if the user added a quantity
  let quantity = foodQuantities[item] ? foodQuantities[item] : 0;
  return `
  <tr>
    <td id="item-row">
      <span id="item-text" onclick="updateNutritionItem('${item}')">
        ${item}
      </span>
      ${filterImages}
      <div id="item-step-container">
        <button onclick="addFoodItem('${item}', -1)" id="standard-btn">-</button>
        <span data-quantity="${item}" id="item-quantity-text">${quantity}</span>
        <button onclick="addFoodItem('${item}', 1)" id="standard-btn">+</button>
      </div>
    </td>
  </tr>
  `;
}

// update the nutrition fact's HTML based on an item
function updateNutritionItem(item) {
  let facts = nutrition[item];

  // set the food's name and serving size
  document.getElementById("nutrition-facts-title").innerHTML = item;
  let servingSizeText = document.getElementById("serving-size-text");
  servingSizeText.innerHTML = facts[0];

  // update the cholestrol, sodium, and protein facts
  document.getElementById("cholestrol-text").innerHTML = facts[7];
  document.getElementById("sodium-text").innerHTML = facts[8];
  document.getElementById("protein-text").innerHTML = facts[12];

  // update the calorie facts
  let caloriesText = document.getElementById("calories-text");
  let caloriesSubText = document.getElementById("calories-subtext");
  caloriesText.innerHTML = facts[2];
  caloriesSubText.innerHTML = facts[3];

  // update the fats facts
  let fatsText = document.getElementById("fats-text");
  let fatsSubtext = document.getElementById("fats-subtext");
  fatsText.innerHTML = facts[4];
  fatsSubtext.innerHTML = facts[5] + ", " + facts[5];

  // update the carbohydrate facts
  let carbsText = document.getElementById("carbs-text");
  let carbsSubtext = document.getElementById("carbs-subtext");
  carbsText.innerHTML = facts[6];
  carbsSubtext.innerHTML = facts[10] + ", " + facts[11];
}

// update the nutrition fact's HTML based on the total nutrition list
function updateNutritionList() {
  // set the food's name and serving size
  document.getElementById("nutrition-facts-title").innerHTML = "Nutrition Facts";
  let servingSizeText = document.getElementById("serving-size-text");
  servingSizeText.innerHTML = "";

  // update the cholestrol, sodium, and protein facts
  document.getElementById("cholestrol-text").innerHTML =
    "Cholestrol " + totalNutrition["Cholestrol"] + "mg";
  document.getElementById("sodium-text").innerHTML =
    "Sodium " + totalNutrition["Sodium"] + "mg";
  document.getElementById("protein-text").innerHTML =
    "Protein " + totalNutrition["Protein"] + "g";

  // update the calorie facts
  let caloriesText = document.getElementById("calories-text");
  let caloriesSubText = document.getElementById("calories-subtext");
  caloriesText.innerHTML = "Calories " + totalNutrition["Calories"];
  caloriesSubText.innerHTML = "Calories from Fat " + totalNutrition["Calories from Fat"];

  // update the fats facts
  let fatsText = document.getElementById("fats-text");
  let fatsSubtext = document.getElementById("fats-subtext");
  fatsText.innerHTML = "Total Fat " + totalNutrition["Total Fat"] + "g";
  fatsSubtext.innerHTML = "Saturated Fat " + totalNutrition["Saturated Fat"] +
    "g, Trans Fat " + totalNutrition["Trans Fat"] + "g";

  // update the carbohydrate facts
  let carbsText = document.getElementById("carbs-text");
  let carbsSubtext = document.getElementById("carbs-subtext");
  carbsText.innerHTML = "Total Carbohydrate " + totalNutrition["Total Carbohydrate"] + "g";
  carbsSubtext.innerHTML = "Dietary Fiber " + totalNutrition["Dietary Fiber"] +
    "g, " + "Sugars " + totalNutrition["Sugars"] + "g";
}

// add a food item to the total nutrition
function addFoodItem(item, quantity) {
  // receive quantity of the food item
  const quantityText = document.querySelector(`[data-quantity='${item}']`);
  let newQuantity = parseInt(quantityText.innerText) + quantity;

  // update the total nutritional facts
  if(newQuantity < 0) {
    // reset the quantities
    newQuantity = 0;
    quantity = 0;
  }
  updateTotalNutrition(item, quantity);

  // set the food quantity
  foodQuantities[item] = newQuantity;
  quantityText.innerHTML = newQuantity;
}

// update the total nutritional values based on a food item
function updateTotalNutrition(item, quantity) {
  let facts = nutrition[item];

  // return the quantified nutritional value from a nutrition string
  function getValue(fact) {
    return quantity * parseInt(fact.match(/[\d\.]+/));
  }

  // update the calories
  totalNutrition["Calories"] += getValue(facts[2]);
  totalNutrition["Calories from Fat"] += getValue(facts[3]);

  // update the fats
  totalNutrition["Total Fat"] += getValue(facts[4])
  totalNutrition["Saturated Fat"] += getValue(facts[5]);
  totalNutrition["Trans Fat"] += getValue(facts[6]);

  // update the cholestrol, sodium, and protein
  totalNutrition["Cholestrol"] += getValue(facts[7]);
  totalNutrition["Sodium"] += getValue(facts[8]);
  totalNutrition["Protein"] += getValue(facts[12]);

  // update the carbohydrates
  totalNutrition["Total Carbohydrate"] += getValue(facts[9]);
  totalNutrition["Dietary Fiber"] += getValue(facts[10]);
  totalNutrition["Sugars"] += getValue(facts[11]);
}

// reset the total nutrition values
function resetTotalNutrition() {
  // reset the food quantities and total nutrition
  foodQuantities = {};
  totalNutrition = {"Calories": 0, "Calories from Fat": 0, "Total Fat": 0,
    "Saturated Fat": 0, "Trans Fat": 0, "Cholestrol": 0, "Sodium": 0,
    "Total Carbohydrate": 0, "Dietary Fiber": 0, "Sugars": 0, "Protein": 0};
  updateNutritionList();

  // reset all the quantity texts
  let quantityTexts = document.querySelectorAll("[id=item-quantity-text]");
  for(let textIndex = 0; textIndex < quantityTexts.length; textIndex++) {
    quantityTexts[textIndex].innerHTML = 0;
  }
}
