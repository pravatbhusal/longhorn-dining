// the host of the server
const host = "http://localhost";

// the port of the server
const port = 5000;

// the URL of the server
const serverURL = host + ":" + port;

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

// send an HTTP request to receive the items
fetch(serverURL + "/meal/location/menu", {
  method: "POST",
  body: JSON.stringify({
    meal: meal,
    location: loc
  })
}).then((data) => {
  data.json().then((json) => {
    // receive each individual items
    console.log(json)
  });
}).catch((error) => {
  // an error occurred when fetching the data
  console.log(error);
});
