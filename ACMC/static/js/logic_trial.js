// Create a map object.
let myMap = L.map("map", {
    center: [40.7128, -74.0060],
    zoom: 12
  });
  
// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

/*
// Function to calculate average 
function calculateAverageNeighborhoodPrice(data, criteria) {
    // Filter the data based on the criteria
    const filteredData = data.filter(item => item.neighbourhoodGroup === criteria);
    // Calculate the sum of the filtered data
    const sum = filteredData.reduce((acc, item) => acc + item.price, 0);
    // Calculate the average
    const average = filteredData.length > 0 ? sum / filteredData.length : 0;
    return average;
}
*/

// Fetch data.
d3.csv("../Resources/Airbnb_cleaned.csv").then(function(data) {
    console.log(data);
    // Convert CSV data to GeoJSON format
    const geoJSONFeatures = data.map(row => {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [parseFloat(row.long), parseFloat(row.lat)]
            },
            properties: {
                id: row["id"],
                name: row["NAME"],
                hostId: row["host id"],
                hostIdentityVerified: row["host_identity_verified"],
                neighbourhoodGroup: row["neighbourhood group"],
                neighbourhood: row["neighbourhood"],
                lat: row["lat"],
                long: row["long"],
                instantBookable: row["instant_bookable"],
                cancellationPolicy: row["cancellation_policy"],
                roomType: row["room type"],
                constructionYear: row["Construction year"],
                price: row["price"],
                serviceFee: row["service fee"],
                minimumNights: row["minimum nights"],
                numberOfReviews: row["number of reviews"],
                reviewsPerMonth: row["reviews per month"],
                reviewRateNumber: row["review rate number"],
                calculatedHostListingsCount: row["calculated host listings count"],
                availability365: row["availability 365"]
            }
        };
    });
    const geoJSONData  ={
        type: "FeatureCollection",
        features: geoJSONFeatures
    };
    console.log(geoJSONData);

    // Heat Map
    features = geoJSONData.features;

    let heatArray = [];

    for (let i = 0; i < features.length; i++) {
        let location = features[i].geometry;
        if (location) {
          //console.log(location);
          heatArray.push([location.coordinates[1], location.coordinates[0]]);
          //console.log(heatArray);
        }
      }  
      let heat = L.heatLayer(heatArray, {
        radius: 20,
        blur: 35
      }).addTo(myMap);
})  















// Use this link to get the GeoJSON data.
let link = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/nyc.geojson";
let csvLink = "../Resources/avg.csv";

// Function to merge CSV data into GeoJSON
function mergeData(geoJsonData, csvData) {
  // Create a lookup table from the CSV data
  const csvLookup = {};
  csvData.forEach(row => {
      const neighborhood = row.neighborhood; // Assumed column in CSV
      const price = row.price; // Assumed column in CSV
      csvLookup[neighborhood] = price;
  });

  // Attach CSV data to GeoJSON features
  geoJsonData.features.forEach(feature => {
      const neigh = feature.properties.neighborhood; // Assumed property in GeoJSON
      if (csvLookup[neigh]) {
          feature.properties.price = csvLookup[neigh]; // Add the value from CSV
      }
  });
}

// The function that will determine the color of a neighborhood based on the borough that it belongs to
function chooseColor(borough) {
  if (borough == "Brooklyn") return "yellow";
  else if (borough == "Bronx") return "red";
  else if (borough == "Manhattan") return "orange";
  else if (borough == "Queens") return "green";
  else if (borough == "Staten Island") return "purple";
  else return "black";
}

// Getting our GeoJSON data
d3.json(link).then(function(geoJsData) {
  console.log(geoJsData);
  
  // Load CSV data
  d3.csv(csvLink).then(function(csvData) {
      console.log(csvData);
      
      // Merge the GeoJSON and CSV data
      mergeData(geoJsData, csvData);
      
      // Creating a GeoJSON layer with the retrieved data
      L.geoJson(geoJsData, {
          style: function(feature) {
              return {
                  color: "white",
                  fillColor: chooseColor(feature.properties.borough),
                  fillOpacity: 0.5,
                  weight: 1.5
              };
          },
          onEachFeature: function(feature, layer) {
              // Bind a tooltip or popup showing the CSV data
              if (feature.properties.price) {
                  layer.bindPopup(`Neighborhood: ${feature.properties.neighborhood}<br>Price: ${feature.properties.price}`);
              }
          }
      }).addTo(myMap);
  });
});
