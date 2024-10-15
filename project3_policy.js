// Load and process CSV data
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQalzVutLSF7FltNs6etajsIv_0tJ0qCYg8ZNHe--21qvqMW5XRwao7VGUhOdDwmvwhJ-eLGRU2_3ZI/pub?gid=819559969&single=true&output=csv").then(data => {
    console.log("Data loaded:", data);

    // Check if the 'neighbourhood group' field is correctly read
    if (data.length > 0) {
        console.log("Column names in data:", Object.keys(data[0]));
        console.log("Sample data row:", data[0]);
    } else {
        console.error("Data is empty or not loaded.");
    }

    // Convert relevant columns to numbers and ensure columns are correctly read
    data.forEach(row => {
        row["Construction_year"] = +row["Construction_year"];
        row["review_rate_number"] = +row["review_rate_number"];
        row["cancellation_policy"] = row["cancellation_policy"];
        row["neighbourhood group"] = row["neighbourhood group"];
    });

    // Initialize the dropdown menu for selecting neighbourhood group
    initNeighbourhoodDropdown(data);
});

// Function to initialize neighbourhood dropdown and create the cancellation_policy vs. Review Rate chart
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
        optionChanged(event.target.value, data);
    });
}

// Function for event listener to update the chart based on neighbourhood selection
function optionChanged(newSample, data) {
    console.log("Option changed to:", newSample);
    buildCharts(newSample, data);
}

// Function to build cancellation_policy vs. Review Rate chart filtered by neighbourhood group
function buildCharts(selectedGroup, data) {
    console.log("Building chart for neighbourhood group:", selectedGroup);

    // Filter data by selected neighbourhood group
    const filteredData = data.filter(row => row["neighbourhood group"] === selectedGroup);

    // Get unique cancellation policies and set up data structure
    const cancellationPolicies = Array.from(new Set(filteredData.map(d => d["cancellation_policy"])));
    const groupedData = cancellationPolicies.map(policy => {
        const policyData = { policy: policy };
        for (let rate = 1; rate <= 5; rate++) {
            policyData[rate] = 0;
        }
        filteredData.forEach(row => {
            if (row["cancellation_policy"] === policy) {
                policyData[row["review_rate_number"]]++;
            }
        });
        return policyData;
    });

    const labels = groupedData.map(d => d.policy);
    const colors = [
        'rgba(255, 0, 0, 0.7)',    // Red for Review Rate 1
        'rgba(255, 165, 0, 0.7)',  // Orange for Review Rate 2
        'rgba(255, 255, 0, 0.7)',  // Yellow for Review Rate 3
        'rgba(144, 238, 144, 0.7)', // Light Green for Review Rate 4
        'rgba(0, 128, 0, 0.7)'      // Green for Review Rate 5
    ];

    const datasets = [];
    for (let rate = 1; rate <= 5; rate++) {
        datasets.push({
            label: `Review Rate ${rate}`,
            data: groupedData.map(d => d[rate]),
            backgroundColor: colors[rate - 1]
        });
    }

    const ctx = document.getElementById('myChart').getContext('2d');

    // Check if myChart exists and is an instance of Chart, then destroy it if necessary
    if (window.myChart && window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Create a new chart instance
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Cancellation Policy vs. Review Rate for ${selectedGroup}` }
            },
            scales: {
                x: { stacked: true, title: { display: true, text: 'Cancellation Policy' } },
                y: { stacked: true, title: { display: true, text: 'Count of Listings' } }
            }
        }
    });
}
