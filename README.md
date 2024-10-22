An overview of the project and its purpose

We chose Airbnb data of New York city with around 20 columns along with the pricing, ratings, reviews, room type, neighborhood group, latitude and longitudes. We are trying to answer the question:

Which Airbnb Neighborhood is the most popular?

To find the answer to this question we performed various analyses and built different visualizations using python, seaborn, javascript using drop-down menus, leaflet, geojson etc. We tried to find correlations between pricing and ratings, ratings and neighborhood, reviews vs rating. We answered the following questions:

1. Neighborhood vs price:Neighborhood Trend Which [neighborhood](http://localhost:8000/index.html) has the highest cost?

Most neighborhoods' prices range from $600-$800. The highest priced airbnb listings which are above $800 are in Queens in “Little neck neighborhood” and Staten Island in “Chelsea”, “Arden Heights” and “Fort Wadsworth”. These 2 neighborhoods have a lower count of listings and are also expensive at the same time in comparison with Brooklyn and Manhattan.  The lowest priced airbnb listings are also in Staten Island in “Lighthouse Hill”.

2. Service Fee vs. Rating: Is there a significant correlation between Airbnb Service Fee and ratings?  Which service fee range has the highest number of 5-star ratings?

Service fees in Manhattan, Brooklyn, Queens, and the Bronx are quite uniform across different review ratings, suggesting a stable pricing strategy among hosts. The consistency of service fees across most neighborhoods suggests that hosts do not heavily adjust fees based on reviews. This implies that service fee policies may be independent of the quality of the stay as reflected in guest reviews.

3. Room Type vs. Rating: Is there a significant correlation between Room Type and ratings?   Which Room Type has the highest number of 5-star ratings?

Manhattan and Brooklyn: Both neighborhoods have a high count of listings for entire homes/apartments and private rooms, with very positive ratings for both types. These neighborhoods are dominant Airbnb markets with strong guest satisfaction.

Queens: Private rooms are the most popular option and receive high ratings. Entire homes/apartments are also well-regarded, though slightly less common.

The Bronx: Private rooms are more common, and entire homes/apartments, though fewer, receive strong ratings.

Staten Island: Shows the lowest count of listings and the most mixed ratings, especially for private rooms, indicating lower guest satisfaction and demand compared to other neighborhoods.

In summary, Manhattan and Brooklyn are the leading neighborhoods in terms of both the count and quality of Airbnb listings. Queens and The Bronx are strong contenders, especially for private rooms, while Staten Island lags behind both in market size and guest satisfaction.

4. [Construction Year vs. Rating](http://127.0.0.1:5500/Project-3_Team-2/project%203.html):Is there a significant correlation between the Construction Year of Airbnb and ratings? Which Construction Year of Airbnb has the highest number of 5-star ratings?

Across different construction years, the distribution of review ratings appears fairly consistent. Listings with ratings of 4 and 5 dominate, with 5-star ratings being the most frequent in nearly all years. Listings constructed after 2015 seem to have a higher proportion of 5-star reviews compared to earlier years. This could suggest that newer properties may be offering a better experience or higher quality, contributing to better guest satisfaction.

5. Room type Trend: Private rooms are particularly common in Queens and Bronx, catering to cost-conscious travelers. Shared rooms, though limited, are more available in Manhattan and Brooklyn, likely due to high demand for affordable options in these areas.
6. Price vs. Rating:  Is there a significant correlation between Airbnb prices and ratings? Which price range got the most 5-star rating?

We see an upward trend in the ratings that as the price increases more customers tend to rate it up until price $800. After $800 we see that customers' ratings are lowered in number and there is a drop. In the range $1000-$1200 the rating number increases after a mini drop in the price range $800-$1000. It can be observed that the price range $600-$800 received the most amount of ratings by the customer.

7. Number of reviews vs. Rating: Is there a significant correlation between the number of reviews of Airbnb and ratings?

Correlation between number of reviews and ratings: -0.019 which is a negative correlation. It tells us that there is no correlation between number of reviews and rating. It means that the number of reviews do not increase in number as the rating increases from 1-5. Hence, we know that even 5 star ratings do not receive the most reviews as compared to 1 star rating showing no correlation.

Conclusion:

We came down to 2 neighborhoods. Manhattan and Brooklyn neighborhoods have a high competition. It is harder to decide which one is the most popular. Brooklyn has a higher number of private room listings as compared to Manhattan while Manhattan has a higher number of entire home listings.The number of airbnb is higher in these 2 neighborhoods because Manhattan is home to the most iconic attractions like  Times Square, Central Park while Brooklyn has its own tourist attractions like the Statue of Liberty and Brooklyn Bridge. These 2 neighborhoods have a higher number of listings as compared to other Neighborhoods as well as affordable options ranging from $600-$800. As a result, these 2 neighborhoods received the most 5 star ratings and have the most popular airbnb listings.

Instructions on how to use and interact with the project

### Key Elements:

1. JavaScript: Used to write the core logic of the application.
2. D3.js: For importing and processing the CSV data from an external source.
3. Leaflet: Integrated for mapping listing data, enabling users to visualize the geographical distribution of listings and interact with map features for enhanced data exploration.
4. Plotly: For interactive chart generation and providing export functionality.
5. Interactivity: Dropdown menus and buttons that update the chart dynamically and allow for PNG export.
6. User Interface: Explanation of how users interact with the data.

Note: Due to Cross-Origin Resource Sharing (CORS) restrictions, directly opening HTML files in a browser can lead to issues with loading local resources. To avoid these problems, we need to run a local web server using the command python -m http.server 8000. This command starts a simple HTTP server that allows us to serve and view our HTML files at [http://localhost:8000/](http://localhost:8000/), ensuring that all resources are loaded correctly and mimicking a real web environment.

Database:

 **Database Type**: MongoDB -

 **Data Storage**: The data is stored in a MongoDB database. The database is set up locally and can be accessed via the MongoDB connection string: `mongodb://localhost:27017`.

**Database Name**: `airbnb_db`

**Collection Name**: `listings`

**Accessing the Database**: The MongoDB data is stored in JSON format and can be found in the Resources folder under the file name airbnb_db.listings.json.

At least one paragraph summarizing efforts for ethical considerations made in the project

The dataset used in this project was obtained from Kaggle, which offers a variety of publicly available datasets. However, even though these datasets are made publicly accessible, it's important to adhere to data usage policies and privacy standards. This project ensured that no personally identifiable information (PII) or sensitive data was included in the dataset. Additionally, proper attribution was given to the dataset's original source, respecting intellectual property rights and licensing terms. Any analysis or insights derived from the data were conducted in a responsible manner, ensuring that the findings do not reinforce harmful biases or unfair conclusions. Furthermore, care was taken to maintain transparency about the data’s origins, its limitations, and potential ethical risks in terms of its use or interpretation.

References for the data source(s)

[https://www.kaggle.com/datasets/arianazmoudeh/airbnbopendata/discussion/389857](https://www.kaggle.com/datasets/arianazmoudeh/airbnbopendata/discussion/389857)

**
