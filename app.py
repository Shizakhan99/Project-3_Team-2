from flask import Flask, render_template_string
import pandas as pd

app = Flask(__name__)

# Sample DataFrame
data = {
    'price': [50, 150, 250, 350, 450, 600],
    'review rate number': [5, 4, 3, 5, 2, 4]
}
df = pd.DataFrame(data)

# Create price ranges
price_bins = [0, 100, 200, 300, 400, 500, 1000]
df['price_range'] = pd.cut(df['price'], bins=price_bins)

# Print the DataFrame to check its structure
print("Initial DataFrame:")
print(df)

# Grouping data
try:
    grouped_data = df.groupby(['price_range', 'review rate number'], observed=False).size().unstack(fill_value=0)
    print("Grouped data:")
    print(grouped_data)
    
    # Convert the grouped data to JSON
    json_data = grouped_data.to_json(orient='split')
    print("JSON data created successfully.")
except Exception as e:
    print("Error during grouping or JSON conversion:", e)
    exit(1)  # Exit if there's an error

@app.route('/')
def index():
    # Render the chart using Chart.js
    return render_template_string(f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stacked Bar Chart - Airbnb</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <canvas id="myChart" width="600" height="400"></canvas>
        <script>
        // Parse the data passed from Python (JSON)
        const chartData = {json_data};  

        // Extract labels and datasets
        const labels = chartData.index;  
        const dataset_1 = chartData.data.map(row => row[1]);  // Rating 1
        const dataset_2 = chartData.data.map(row => row[2]);  // Rating 2
        const dataset_3 = chartData.data.map(row => row[3]);  // Rating 3
        const dataset_4 = chartData.data.map(row => row[4]);  // Rating 4
        const dataset_5 = chartData.data.map(row => row[5]);  // Rating 5

        // Prepare Chart.js datasets
        const data = {{
            labels: labels,
            datasets: [
                {{ label: 'Rating 1', data: dataset_1, backgroundColor: '#FF5733' }},
                {{ label: 'Rating 2', data: dataset_2, backgroundColor: '#33FF57' }},
                {{ label: 'Rating 3', data: dataset_3, backgroundColor: '#3357FF' }},
                {{ label: 'Rating 4', data: dataset_4, backgroundColor: '#FFC300' }},
                {{ label: 'Rating 5', data: dataset_5, backgroundColor: '#DAF7A6' }}
            ]
        }};

        // Chart.js configuration
        const config = {{
            type: 'bar',
            data: data,
            options: {{
                responsive: true,
                plugins: {{
                    legend: {{ position: 'top' }},
                    title: {{ display: true, text: 'Airbnb Listings: Price Range vs Rating' }}
                }},
                scales: {{
                    x: {{ stacked: true }},
                    y: {{ stacked: true }}
                }}
            }}
        }};

        // Render the Chart
        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
        </script>
    </body>
    </html>
    ''')

if __name__ == '__main__':
    app.run(debug=True)  # Enable debug mode for better error messages



