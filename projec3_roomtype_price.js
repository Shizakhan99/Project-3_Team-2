// Load and process CSV data
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQalzVutLSF7FltNs6etajsIv_0tJ0qCYg8ZNHe--21qvqMW5XRwao7VGUhOdDwmvwhJ-eLGRU2_3ZI/pub?gid=819559969&single=true&output=csv").then(data => {
    // Prepare the data by parsing necessary fields
    data.forEach(row => {
        row.price = +row.price || 0;
        row["neighbourhood group"] = row["neighbourhood group"];
        row["room type"] = row["room type"];
    });

    // Filter out entries with invalid prices and gather unique neighborhood groups
    const filteredData = data.filter(row => row.price > 0);
    const neighbourhoodGroups = Array.from(new Set(filteredData.map(d => d["neighbourhood group"])));

    // Populate the dropdown menu with neighborhood groups
    const dropdown = document.getElementById('neighbourhoodDropdown');
    neighbourhoodGroups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        dropdown.appendChild(option);
    });

    // Initial plot with the first neighborhood group
    buildCharts(neighbourhoodGroups[0], filteredData);

    // Event listener for dropdown changes
    dropdown.addEventListener('change', (event) => {
        optionChanged(event.target.value, filteredData);
    });
});

// Function for event listener to update the chart based on neighborhood selection
function optionChanged(newSample, data) {
    buildCharts(newSample, data);
}

// Function to build the bubble chart based on the selected neighborhood group
function buildCharts(neighbourhoodGroup, data) {
    // Filter data by the selected neighborhood group
    const filteredData = data.filter(d => d["neighbourhood group"] === neighbourhoodGroup);

    // Calculate count and average price for each room type
    const roomTypeData = d3.rollup(
        filteredData,
        v => ({
            count: v.length,
            avgPrice: d3.mean(v, d => d.price)
        }),
        d => d["room type"]
    );

    // Convert to array format for easier plotting
    const bubbleData = Array.from(roomTypeData, ([roomType, values]) => ({
        roomType: roomType,
        count: values.count,
        avgPrice: Math.max(300, Math.min(values.avgPrice, 1000))
    }));

    // Create traces for Plotly
    const trace = {
        x: bubbleData.map(d => d.roomType),
        y: bubbleData.map(d => d.count),
        text: bubbleData.map(d => `${d.roomType}: ${d.avgPrice.toFixed(2)} USD`),
        mode: 'markers',
        marker: {
            size: bubbleData.map(d => d.count * 2),  // Bubble size based on count
            color: bubbleData.map(d => d.avgPrice),
            colorscale: [[0, '#00FF00'], [0.5, '#FFFF00'], [1, '#FF0000']],  // Green to Yellow to Red
            showscale: true,
            colorbar: {
                title: 'Average Price (USD)'
            }
        }
    };

    const layout = {
        title: `Room Types in ${neighbourhoodGroup} (Listings Count vs. Average Price)`,
        xaxis: {
            title: 'Room Type'
        },
        yaxis: {
            title: 'Number of Listings'
        },
        showlegend: false,
        height: 500,
        width: 800
    };

    // Render the chart using Plotly
    Plotly.newPlot('chart', [trace], layout);
}
