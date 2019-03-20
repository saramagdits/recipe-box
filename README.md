# Recipe Box
Collect and store your favorite recipes in this simple app. [Loading from Heroku may be slow].

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

In order to install this program, you will need to install [node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/)

### Installing and Deploying

Follow these steps to get a dev environment running on your local machine

1. Clone the recipe-box repository to your local machine

```
git clone https://github.com/saramagdits/recipe-box.git
```

2. Install dependencies from the package.json

```
npm install
```

3. Create a .env file in the root with the following. This is used by the [dotenv](https://www.npmjs.com/package/dotenv) dependency module.
```
DB_URL = mongodb://localhost/recipe_box_local
PORT = 3000
SESSION_SECRET = <ANY TEXT YOU WISH>
```

4. Start the mongoDB service
```
sudo service mongod start
```

5. Start the node server on port 3000
```
node app.js
```

6. Visit the app by visiting http://localhost:3000/ or the equivalent.
You can demo the app by entering the following credentials :
```
Username: test
Password: test
```
Test it out by creating a new recipe and then editing it.

## Built With

* [Node.js](https://nodejs.org/en/) - Used for the backend to serve files, as well as serve as an endpoint for recipe requests.
* [Express](https://expressjs.com/) - Web application framework for Node.js
* [MongoDB](https://www.mongodb.com/) - NoSQL database used to build the Recipe API
* [Mongoose](https://mongoosejs.com/) - Object modeling for MongoDB. Used to build the Recipe API
* [EJS](https://www.npmjs.com/package/ejs) - Embedded JavaScript Templates. Server side template rendering.
* [Bootstrap](http://getbootstrap.com/) - CSS framework for simplified responsive design
