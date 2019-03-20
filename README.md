# recipe-box
Collect and store your favorite recipes in this simple app. [Loading from Heroku may be slow]

# Let Us Lettuce

A simple app with the objective of showing the user what produce is in season for them, as well as pairing them with recipes which take advantage of this seasonality.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to install this program, you will need to install [node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/)

### Installing and Deploying

Follow these steps to get a dev environment running on your local machine

1. Clone the let-us-lettuce repository to your local machine

```
git clone https://github.com/saramagdits/let-us-lettuce.git
```

2. Install dependencies from the package.json

```
npm install
```

3. Create a config.js file in the root with the following. An app id and API key from the [Edamam API](https://developer.edamam.com/) are required to get recipe results.
```
module.exports = {
    port: process.env.PORT || <3000, OR YOUR PORT>,
        db: {
            uri: 'mongodb://localhost:<27017 OR YOUR PORT>/',
        },
        apiAppId: <YOUR API APP ID>,
        apiKey: <YOUR API KEY>
    };
```

4. Create a config.js file in the /src/ folder with the following. The url may be your localhost address, or another domain.
```
module.exports = {
	url: '<LOCALHOST URL OR EQUIVALENT>'
};
```

5. Compile with webpack
```
npm run build
```

6. Start the MongoDB server
```
sudo service mongod start
```

7. Before running for the first time, populate the database by uncommenting the populate database section in app-server.js.
```
// =======================
// Populate Database
// =======================
// Uncomment and run once when needed
 const produce = new Produce;
 produce.populateDB();
```

8. Start Node server. If running for the first time, be sure to comment out the populate database section after complete.
```
node app-server.js
```

9. Visit the app by visiting http://localhost:3000/ or the equivalent. The app will display produce that is in season according to the month provided by your browser.
Try selecting up to 4 vegetables and clicking 'search' to get recipes that make the best use of what produce you have!

## Built With

* [Node.js](https://nodejs.org/en/) - Used for the backend to serve files, as well as serve as an endpoint for produce and recipe requests.
* [Express](https://expressjs.com/) - Web application framework for Node.js
* [MongoDB](https://www.mongodb.com/) - NoSQL database used to build the Produce API
* [Mongoose](https://mongoosejs.com/) - Object modeling for MongoDB. Used to build the Produce API
* [Bootstrap](http://getbootstrap.com/) - CSS framework for simplified responsive design
