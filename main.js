import dotenv from "dotenv";

dotenv.config();

let locationInput = document.querySelector("#location-search");
let searchButton = document.querySelector("#search-button");
const resultsContainer = document.getElementById('result-container');
let searchAddress = document.querySelector("#search-address");
const locationButton = document.querySelector("#locator");
const baseURL = "http://localhost:3000";



const searchResults = () => {
  locationInput.addEventListener("keypress", () => {
    let locationEntered = locationInput.value;
    const locationUrl = `${baseURL}/geocode?address=${encodeURIComponent(locationEntered)}`;

    const getUserLocation = () => {
      fetch(locationUrl)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log(data.results[0].formatted_address);

          const fullAddress = data.results[0].formatted_address;
          let lat = data.results[0].geometry.location.lat;
          let lng = data.results[0].geometry.location.lng;

          console.log(data.results[0].geometry.location.lat);
          console.log(data.results[0].geometry.location.lng);
          searchAddress.textContent = "Ready to fetch the list of petrol station in " + fullAddress + " please click the Search Button to display results";

          searchButton.addEventListener("click", () => {
            const requiredApiURL = `${baseURL}/nearby?lat=${lat}&lng=${lng}`;

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

locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;

      const requiredApiURL = `${baseURL}/nearby?lat=${lat}&lng=${lng}`;

      // Haversine formula function
      function haversineDistance(lat1, lon1, lat2, lon2) {
        const toRad = (x) => (x * Math.PI) / 180;

        const R = 6371; // Radius of Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // distance in km
      }

      const userCoord = () => {
        fetch(requiredApiURL)
          .then(response2 => response2.json())
          .then(realData => {
            let html = "";
            // console.log(realData)
            if (realData.results) {
              realData.results.forEach(result => {
                let businessName = result.name;
                let existence = result.business_status;
                let userRating = result.rating;
                let businessAddress = result.vicinity;

                // calculate distance
                let gasLat = result.geometry.location.lat;
                let gasLng = result.geometry.location.lng;
                let distance = haversineDistance(lat, lng, gasLat, gasLng).toFixed(2);

                // Google Maps directions link
                let directionsURL = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${gasLat},${gasLng}`;

                html += `
                  <div id="result-container">
                    <div id="result-box">  
                      <img id="logo" src="petrol-station.png">
                    </div>  
                    <div>
                      <p id="name-of-business">${businessName}</p><br>
                      <p id="address-of-business">${businessAddress}</p><br>
                      <p id="business-rating">Rating: ${userRating || "N/A"}/5</p><br>
                      <p id="business-status">Business Status: ${existence}</p>
                      <p id="business-distance">This petrol station is ${distance} km away from your location</p>
                      <a href="${directionsURL}" target="_blank">
                        <button style="margin-top:5px;padding-top:6px;paddng-bottom:6px;border:none;background-color:blue;color:#fff;border-radius:6px;cursor:pointer;">
                          Get Directions
                        </button>
                      </a>
                    </div>
                  </div>
                `;
              });
            } else {
              html = "We couldn't find any nearest filling station in the location you supplied. It seems like you'll have to walk or trek 😅";
            }
            resultsContainer.innerHTML = html;
          })
          .catch(error => {
            console.log(error);
          });
      };
      userCoord();
    });
  }
});

};

searchResults();
