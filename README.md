# CUshare Resource Sharing Platform

CUshare is a resource sharing platform within the Chinese University of Hong Kong.

## Dependencies:

* Node.js v8.11.1
* MongoDB v3.6

## Deployment

1. Install package dependencies: ```npm install``` or ```npm i```
2. Open MongoDB server: ```mongod```
3. Import sample data: ```./import.sh```
3. Start the server: ```npm test``` when in development, ```npm start``` when in deployment
4. Check the website in your browser: http://localhost:3000/

## Details

./app.js: the script to turn on the whole website

./import.sh: the script to import sample data to the database

./common: store some common used files

./common/dbHelper.js: helper program for the usage of the database

./common/models.js: set up the attributes of some modules

./routes: store the route files

./views: store the html template files, ejs files

./public: store static resources, like css, javascript and images

./waste: stores obsolete files
