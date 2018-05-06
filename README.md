# CUshare Resource Sharing Platform

## (My) Dev Platform

* Ubuntu 16.04 LTS 64-bit

## Dependencies:

* Node.js v8.11.1
* MongoDB v3.6

## Usage

1. npm install
2. Open MongoDB server (mongod)
3. node app.js
4. Check the website in your browser: localhost:3000

### Import data

```
mongoimport --db test1 --collection items [--drop] --file ./views/images/import/import.json
```

## Details

/app.js: the script to turn on the whole website

/common: store some common used files

/common/dbHelper.js: helper program for the usage of the database

/common/models.js: set up the attributes of some modules

/routes: store the route files

/views: store the html template files, ejs files

/public: store static resources, like css, javascript and images
