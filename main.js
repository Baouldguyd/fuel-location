let locationInput = document.querySelector("#location-search");
let searchButton = document.querySelector("#search-button");
const resultsContainer = document.getElementById('result-container');
let searchAddress = document.querySelector("#search-address");

const searchResults = () => {
  locationInput.addEventListener("keypress", () => {
    let apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    let locationEntered = locationInput.value;
    let apiKey = "&key=AIzaSyBtY2pXpzQiitsfeXeiKTqvIjH3vzd7ACE";
    let locationUrl = apiUrl + locationEntered + apiKey;

    const getUserLocation = () => {
      fetch(locationUrl)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log(data.results[0].formatted_address);

          var fullAddress = data.results[0].formatted_address;
          let lat = data.results[0].geometry.location.lat;
          let lng = data.results[0].geometry.location.lng;

          console.log(data.results[0].geometry.location.lat);
          console.log(data.results[0].geometry.location.lng);
          searchAddress.textContent = "Ready to fetch the list of petrol station in " + fullAddress + " please click the Search Button to display results";

          searchButton.addEventListener("click", () => {
            const requiredApiURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat +"," + lng +"&radius=5000&types=gas_station&rankBy=distance&sensor=true&key=AIzaSyBtY2pXpzQiitsfeXeiKTqvIjH3vzd7ACE";

            const userCoord = () => {
              fetch(requiredApiURL)
                .then(response2 => response2.json())
                .then(realData => {
                  let html = "";
                  if (realData.results) {
                    realData.results.forEach(result => {
                      console.log(result);
                      let businessName = result.name;
                      let existence = result.business_status;
                      let userRating = result.rating;
                      let businessAddress = result.vicinity;
            
                      html += `
                        <div id="result-container">
                        <div id="result-box">  
                        <img id = "logo" src="petrol-station.png">
                        </div>  
                        <div>
                            <p id="name-of-business">${businessName}</p><br>
                            <p id="address-of-business">${businessAddress}</p><br>
                            <p id="business-rating">Rating: ${userRating}/5</p><br>
                            <p id="business-status">Business Status: ${existence}</p>
                          </div>
                        </div>
                      `;
                    });
                  } else {
                    html = "We couldn't find any nearest filling station in the location you supplied. It seems like you'll have to walk or trek";
                  }
                  resultsContainer.innerHTML = html;
                })
                .catch(error => {
                  
                  console.log(error);
                });
            };
            
            userCoord();
            

           
          });
        });
    };
    getUserLocation();
  });
};

searchResults();
