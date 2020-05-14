### ![](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Project 3 - Swell

## Overview

For our third project on the General Assembly Software Engineering Bootcamp, we were tasked with building a (MERN) full-stack application, using our own front-end and back-end. This was a group project and we had 7 days to deliver our application. The application can be launched [here](https://project-3-mongods-swell.herokuapp.com/).

By [Charlotte Thomas](https://github.com/Charlotte-Thomas), [Awal Yusuf](https://github.com/awalyusuf) and [Abi James](https://github.com/ajames14).

### The Final Product 

We decided to create a surfing website, "Swell", focused on providing information and advice on the best places to surf globally. We wanted to create a "TripAdvisor" for surfing and make our website a social network, as well as informational. 

Swell gives users the ability to:
 
- Search for surf destinations around the world, filtering by country, difficulty, user rating or by selecting pins on a world map.
- Find out essential information on each surf spot, such as location, a description, the type of wave, difficulty, the weather and surf conditions and the average user rating. Each surf spot also has a comments section where registered users can leave comments and advice for other surfers. 
- Create a profile. Once a user has registered, they can add surf spots to their favourites list, comment on surf destinations, and even upload new surf spots to the database (with approval - see below). They can view their favourites and pending uploads via their profile page, where they can also upload or change their profile picture. 
- Lastly, a registered user can upload a surf spot to share with other surfers, however, to control the quality of these, the administrators of the site (us!) have to approve these before they are added to the database and displayed. We can see these when we login as the admin, and have a button to approve. 


## Brief 

The project brief:

- Work in a team, using git to code collaboratively.
- Build a full-stack application by making your own backend and your own front-end.
- Use an Express API to serve your data from a Mongo database.
- Consume your API with a separate front-end built with React.
- Be a complete product which most likely means multiple relationships and CRUD functionality for at least a couple of models.
- Implement thoughtful user stories/wireframes that are significant enough to help you know which features are core MVP and which you can cut.
- Have a visually impressive design.
- Be deployed online so it's publicly accessible.

## Technologies Used

**Front End**: 

- HTML5
- SCSS
- React.js
- Axios
- Bulma
- ReactRouter
- Reach Lazy Hero
- Moment
- Mapbox
- Stormglass

**Back End**

- Node.js
- Express
- Bcrypt
- JsonWebToken
- MongoDB
- Mongoose
- Insomnia


## Approach Taken 

### Building the Back-End

Once we had decided on the features and theme of our website, we started by building the back-end together. We did this as a team so that all members could gain experience using mongo and express and have a full understanding of how the back-end was programmed, to make it easier when building the front-end. 

Firstly, we created seeds for our database with 50+ surf spots and an admin user and built the schemas. We had 4 schemas in total:

- User Schema: for registration, login and user favourites.
- Spot Schema: for displaying and creating new surf spots.
- Comment Schema: for user comments.
- Rating Schema: for user ratings.

We set up our routing logic, controller functions and body parser middleware to better handle the body of API requests and responses. We also set up a secure route function using JsonWebToken, so that only registered and logged in users can post/put/delete. 

Within our User model, we also used Bcrypt to encrypt a user's password before the user is saved to the database, increasing the security of our API:

```
userSchema
  .pre('save',  function hashPassword(next) { 
    if (this.isModified('password')) { 
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8)) 
    }
    next() 
  })
```

### The Front-End

For the front-end, we split the functionality logic amongst ourselves, each choosing different components to work on. Despite splitting the work, we still helped each other whenever a team member needed a fresh perspective or was struggling on a piece of logic. It was a combination of solo, group and paired programming.

I was responsible for creating the:

1. Login page
2. Charting Surf spot conditions
3. Country search functionality
4. Surf spots filter functionality 
5. Register new user page
6. Map features

**Homepage**

![Homepage](/frontend/src/images/readme-images/Homepage.png)

The homepage has two sections, a hero page with a "Start Searching" button linking to the second section, the search page, which has a search bar and a map with markers and popups for the different spots in our database. The search bar allows you to search destination by country, linking to the country's page, and each popup links you to the individual destination spots. 

Here we used MapBox for the maps and Lazy Hero for the hero styling. 

![Map](/frontend/src/images/readme-images/Map.png)

**Spots By Country**

Once the user has clicked on a country they are interested in, the country page provides an overview of the spots in the country and allows the user to filter by level, user rating and provides a general search bar.

![Country Page](https://i.imgur.com/54wlnCy.png)

**Single Surf Spot Page**

Each surfing destination has its own page where we pull key information from our seed data to display on the page. In order to do this, we made use of React Hooks, fetching the data to be rendered using 'use effect': 

```
  useEffect(() => {
    fetch(`/api/spots/${props.match.params.id}`)
    .then(resp => resp.json())
    .then(resp =>
  ​    setData(resp)  )
    .then(createRating())
    .then(axios.get('/api/profile', {
  ​    headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
  ​    .then((resp) => {
  ​     setName(resp.data.username)
  ​    }))
    return () => console.log('Unmounting component')
  }, [rating])
  let response = {}
```

We display a mini surf map which we created as a component in our app and embedded it to be rendered into our single page. The map takes in longitude and latitude which was seeded in our data to display the markers on our map. 

Another component displayed is our weather forecast chart which also takes in longitude and latitude from our seeded data. We use the Stormglass API for our chart and chose a single source for our data. We use hooks in our components so we can pass a longitude and latitude when rendering in our single page. 

This page also included the comments section where registered users can post comments and delete their previous comments. A user also rates the spot here and can see the average user rating displayed by the wave images. 

**Forecast Charts**

The Stormglass API provides marine weather data from several different sources, to display a single measurement to the user I decided to calculate an average from the different sources and display them using the react library, [react-circular-progressbar](https://www.npmjs.com/package/react-circular-progressbar).

![Forecast-chart](https://i.imgur.com/amI89zz.gif)

```
  const averageSwellPeriod = (forecastData.swellPeriod.map(x => x.value)).reduce((a, b) => a + b, 0) / forecastData.swellPeriod.length
```

```
  <CircularProgressbar className='progress-bar' value={averageSwellPeriod} minValue={0} maxValue={30} text={`${averageSwellPeriod.toFixed(2)}s`} />
```

**Share A Spot**

Here, registered users are allowed to upload a new surfing spot they might have discovered and is not yet on our website. This helps increase the number of destinations on our website and make users feel part of the building process of the website. 

Once a new spot is submitted, it first has to be approved by an admin in order for it to be published on the website for other users to view.


![Upload-spot](https://i.imgur.com/PXlI95R.png)


**Profile Page**

We also have a profile page where users can upload a photo, see all their favourite surfing spots, view surf spots they have created, and those still pending approval.

![Profile-1](https://i.imgur.com/HYieyOa.png)

**Map**

To chart all the spots in our database onto the map we used the following function. The function maps through the array of surf spots and creates ```Marker``` instances for each surf spot.  Using thier corresponding lattitude and longittude coordinates.

```
function loadSurfMarkers() {
    return spotdata.map((spot, i) => {
      return (
        <Marker
          key={'marker' + i}
          latitude={Number(spot.lat)}
          longitude={Number(spot.long)}
        >
        ...
```

**Bugs**

- Mobile compatibility: some features to be tweaked to be made mobile friendly.
- Photo uploads: currently the front-end registration form requires a user to provide a photo when they sign up. This is not required on the back end and from a UX point of view should not be the case.


## Challenges

- Mapbox: Working with Mapbox posed a bit of a challenge due to data conversion. Mapbox is data strict and fetching our data from our api required a lot of refactoring in order to suit the data format especially for the longitude and latitude. Next time, we would rather use a GeoJson file and insert our data into it rather than fetching directly from our API. 

## Wins

- Rating and Comments: Calculating and displaying the ratings for the individual surf spots was a big win. Creating the logic for the comments section, including setting up authorization for posting and deleting posts.
- Mapbox: getting the surf spots to display on the large and small maps using our seed data. 
- Weather Conditions: Using the Stormglass API and displaying the data using circular charts was also an achievement. 


## Future Features

We were happy with the overall functionality of our website, however, there were a few things that we would have added. In particular:

- When a user adds a new spot, provide functionality so that they can upload a beach/spot name to identify the location, rather than the longitude and latitude (as this is a bit cumbersome for users). 
- Mobile design.
- Improve the visual design and functionality of the map feature.
- We would have expanded the seed database to include more spots around the world. 
- Add the ability for users to edit the spots they've created, where the edits must also be approved by admin before updating the spot on the site.



