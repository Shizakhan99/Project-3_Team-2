// Load and process CSV data
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQalzVutLSF7FltNs6etajsIv_0tJ0qCYg8ZNHe--21qvqMW5XRwao7VGUhOdDwmvwhJ-eLGRU2_3ZI/pub?gid=819559969&single=true&output=csv").then(data => {
    console.log("Data loaded:", data);

    // Convert relevant columns to numbers and ensure columns are correctly read
    data.forEach(row => {
        row["service fee"] = +row["service fee"];
        row["review_rate_number"] = +row["review_rate_number"];
        row["neighbourhood group"] = row["neighbourhood group"];
    });

    // Initialize the chart after data is loaded
    buildAverageServiceFeeChart(data);
});

// Function to build the chart with Average Service Fee per Review Rating for each Neighbourhood Group
function buildAverageServiceFeeChart(data) {
    // Get unique neighbourhood groups
    const neighbourhoodGroups = Array.from(new Set(data.map(d => d["neighbourhood group"])));

    // Prepare traces (datasets) for each neighbourhood group for Plotly
    const traces = neighbourhoodGroups.map(group => {
        // Filter data for the current neighbourhood group
        const groupData = data.filter(d => d["neighbourhood group"] === group);

        // Calculate the average service fee for each review rating (1 to 5)
        const averageFees = [];
        const ratings = [1, 2, 3, 4, 5];
        ratings.forEach(rating => {
            const ratingData = groupData.filter(d => d["review_rate_number"] === rating);
            const avgFee = d3.mean(ratingData, d => d["service fee"]) || 0; // Calculate the mean or 0 if no data
            averageFees.push(avgFee);
        });

        // Return the trace object for Plotly
        return {
            x: ratings, // Review ratings
            y: averageFees, // Average service fee for each rating
            type: 'bar',
            name: group // Neighbourhood group
        };
    });

    // Define the layout of the chart
    const layout = {
        title: 'Average Service Fee by Review Rating for Each Neighbourhood Group',
        xaxis: {
            title: 'Review Rating',
            tickvals: [1, 2, 3, 4, 5]
        },
        yaxis: {
            title: 'Average Service Fee ($)'
        },
        barmode: 'group'
    };

    // Render the chart using Plotly
    Plotly.newPlot('myPlotlyChart', traces, layout);
}
