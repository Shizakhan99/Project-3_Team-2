// Load and process CSV data
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQalzVutLSF7FltNs6etajsIv_0tJ0qCYg8ZNHe--21qvqMW5XRwao7VGUhOdDwmvwhJ-eLGRU2_3ZI/pub?gid=819559969&single=true&output=csv").then(data => {
    console.log("Data loaded:", data);

    // Convert relevant columns to numbers and ensure columns are correctly read
    data.forEach(row => {
        row["review_rate_number"] = +row["review_rate_number"]; // Convert review rate to number
        row["room type"] = row["room type"];  // Room type as string
        row["neighbourhood group"] = row["neighbourhood group"];  // Neighbourhood group
    });

    // Initialize the dropdown menu for selecting neighbourhood group
    initNeighbourhoodDropdown(data);
});

// Function to initialize neighbourhood dropdown
function initNeighbourhoodDropdown(data) {
    // Get unique neighbourhood groups
    const neighbourhoodGroups = Array.from(new Set(data.map(d => d["neighbourhood group"])));
    console.log("Neighbourhood groups found:", neighbourhoodGroups);

    const dropdown = document.getElementById('neighbourhoodGroupSelect');

    // Populate the dropdown with neighbourhood groups
    neighbourhoodGroups.forEach(group => {
        if (group !== undefined) {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            dropdown.appendChild(option);
        }
    });

    // Initial chart rendering with the first neighbourhood group
    if (neighbourhoodGroups.length > 0) {
        buildCharts(neighbourhoodGroups[0], data); // Render the chart for the first neighbourhood group
    }

    // Event listener for dropdown changes
    dropdown.addEventListener('change', (event) => {
        console.log("Dropdown selection changed to:", event.target.value);
        buildCharts(event.target.value, data); // Rebuild the chart for the selected neighbourhood group
    });
}

// Function to build Room Type vs. Review Rate chart filtered by neighbourhood group
function buildCharts(selectedGroup, data) {
    console.log("Building chart for neighbourhood group:", selectedGroup);

    // Filter data by selected neighbourhood group
    const filteredData = data.filter(row => row["neighbourhood group"] === selectedGroup);

    // Define the four specific room types
    const roomTypes = ["Private room", "Entire home/apt", "Hotel room", "Shared room"];

    // Prepare the data structure for individual bars by review rate within each room type
    const traces = [];
    const reviewRatings = [1, 2, 3, 4, 5]; // Review ratings 1 to 5
    const colors = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 165, 0, 0.7)', 'rgba(255, 255, 0, 0.7)', 'rgba(144, 238, 144, 0.7)', 'rgba(0, 128, 0, 0.7)'];

    reviewRatings.forEach((rating, i) => {
        // For each room type, count the number of listings with the current review rating
        const counts = roomTypes.map(roomType => {
            return filteredData.filter(row => row["room type"] === roomType && row["review_rate_number"] === rating).length;
        });

        // Prepare the trace for the current review rating
        traces.push({
            x: roomTypes,
            y: counts,
            type: 'bar',
            name: `Review Rating ${rating}`,
            marker: { color: colors[i] }
        });
    });

    // Define the layout of the chart
    const layout = {
        title: `Room Type vs. Review Rating (Count of Listings) for ${selectedGroup}`,
        barmode: 'group',
        xaxis: {
            title: 'Room Type'
        },
        yaxis: {
            title: 'Count of Listings'
        }
    };

    // Render the chart using Plotly
    Plotly.newPlot('myPlotlyChart', traces, layout);
}
