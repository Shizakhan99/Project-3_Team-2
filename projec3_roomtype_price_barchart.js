// Load and process CSV data
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQalzVutLSF7FltNs6etajsIv_0tJ0qCYg8ZNHe--21qvqMW5XRwao7VGUhOdDwmvwhJ-eLGRU2_3ZI/pub?gid=819559969&single=true&output=csv").then(data => {
    // Parse necessary fields
    data.forEach(row => {
        row["neighbourhood group"] = row["neighbourhood group"];
        row["room type"] = row["room type"];
    });

    // Aggregate data: count occurrences of each room type in each neighborhood
    const groupedData = d3.rollups(
        data,
        v => v.length,
        d => d["neighbourhood group"],
        d => d["room type"]
    );

    // Convert aggregated data to a flat array format for easier plotting
    const chartData = [];
    groupedData.forEach(([neighbourhood, roomTypes]) => {
        roomTypes.forEach(([roomType, count]) => {
            chartData.push({ neighbourhood, roomType, count });
        });
    });

    // Draw bar chart
    drawBarChart(chartData);
});

function drawBarChart(data) {
    // Extract room types, neighbourhoods, and counts for plotting
    const roomTypes = ["Entire home/apt", "Private room", "Shared room"];
    const neighbourhoods = [...new Set(data.map(d => d.neighbourhood))];
    
    const traces = roomTypes.map(roomType => {
        const yValues = neighbourhoods.map(neighbourhood => {
            const roomData = data.find(d => d.neighbourhood === neighbourhood && d.roomType === roomType);
            return roomData ? roomData.count : 0;
        });
        
        return {
            x: neighbourhoods,
            y: yValues,
            name: roomType,
            type: 'bar'
        };
    });

    // Layout configuration
    const layout = {
        barmode: 'group',
        title: 'Room Types vs Neighbourhoods (Count of Listings)',
        xaxis: {
            title: 'Neighbourhood Group',
            tickangle: -45
        },
        yaxis: {
            title: 'Number of Listings'
        }
    };

    // Render the chart using Plotly
    Plotly.newPlot('chart', traces, layout);
}

// Function to save the Plotly chart as an image (e.g., PNG)
function savePlotlyChart() {
    Plotly.downloadImage(document.getElementById('chart'), {
        format: 'png',  // Can be 'png', 'jpeg', 'webp', 'svg', etc.
        filename: 'room_type_vs_neighbourhood_chart', // Name of the downloaded file
        width: 800,     // Specify width of the image
        height: 600     // Specify height of the image
    });
}
