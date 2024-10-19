// Load and process CSV data
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQalzVutLSF7FltNs6etajsIv_0tJ0qCYg8ZNHe--21qvqMW5XRwao7VGUhOdDwmvwhJ-eLGRU2_3ZI/pub?gid=819559969&single=true&output=csv").then(data => {
    console.log("Data loaded:", data);

    // Check if the 'neighbourhood group' field is correctly read
    if (data.length > 0) {
        console.log("Column names in data:", Object.keys(data[0])); // Display all column names
        console.log("Sample data row:", data[0]); // Display the first row of data to verify field names
    } else {
        console.error("Data is empty or not loaded.");
    }

    // Convert relevant columns to numbers and ensure columns are correctly read
    data.forEach(row => {
        row["Construction_year"] = +row["Construction_year"];
        row["review_rate_number"] = +row["review_rate_number"];
        row["neighbourhood group"] = row["neighbourhood group"];
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

    // Populate the dropdown
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
        buildCharts(neighbourhoodGroups[0], data);
    } else {
        console.error("No neighbourhood groups found to populate the dropdown.");
    }

    // Event listener for dropdown changes
    dropdown.addEventListener('change', (event) => {
        console.log("Dropdown selection changed to:", event.target.value);
        buildCharts(event.target.value, data);
    });
}

// Function to build Construction Year vs. Review Rate chart filtered by neighbourhood group
function buildCharts(selectedGroup, data) {
    console.log("Building chart for neighbourhood group:", selectedGroup);

    // Filter data by selected neighbourhood group and remove data before 2000
    const filteredData = data.filter(row => row["Construction_year"] >= 2000 && row["neighbourhood group"] === selectedGroup);

    // Get unique years from 2000 onward and set up data structure
    const uniqueYears = Array.from(new Set(filteredData.map(d => d["Construction_year"]))).sort((a, b) => a - b);

    // Prepare the data structure for individual bars by review rate within each year
    const traces = [];
    const reviewRatings = [1, 2, 3, 4, 5]; // Review ratings from 1 to 5
    const colors = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 165, 0, 0.7)', 'rgba(255, 255, 0, 0.7)', 'rgba(144, 238, 144, 0.7)', 'rgba(0, 128, 0, 0.7)'];

    reviewRatings.forEach((rating, i) => {
        // For each construction year, count the number of listings with the current review rating
        const counts = uniqueYears.map(year => {
            return filteredData.filter(row => row["Construction_year"] === year && row["review_rate_number"] === rating).length;
        });

        // Prepare the trace for the current review rating
        traces.push({
            x: uniqueYears.map(year => year.toString()), // Construction years as x-axis labels
            y: counts,
            type: 'bar',
            name: `Review Rating ${rating}`,
            marker: { color: colors[i] }
        });
    });

    // Define the layout of the chart
    const layout = {
        title: `Construction Year vs. Review Rating for ${selectedGroup}`,
        barmode: 'group',
        xaxis: {
            title: 'Construction Year'
        },
        yaxis: {
            title: 'Count of Listings'
        }
    };

    // Render the chart using Plotly
    Plotly.newPlot('myPlotlyChart', traces, layout);
}
