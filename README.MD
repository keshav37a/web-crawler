# Web Crawler

## Introduction

A nodejs app which can crawl medium.com for any searched tag and extract the top 10 articles data for the tag.

## Dependencies needed to install

To install any dependency required, Navigate to the project directory, open the terminal and run the command `npm install <dependency_name>`.\
For example `npm install express`

The following dependencies need to be installed before running the project

* axios
* cheerio
* ejs
* express
* express-ejs-layouts
* mysql2
* node-sass-middleware
* nodemon
* sequelize

## Setting up the database

You will have to configure the environment.js file in `./config/environment.js`  for setting up the database before you can run the project. After adding the relevant credentials you will need to run an extra command in the mysql cli - `CREATE DATABASE webcrawler_db;`. After these steps you are good to go.

## Running the project

To run the project open the terminal and run the command `npm start`

## Testing the project

This project has the following features-

* Search for articles for any tag
* Crawl the tags and its articles
* Extract relevant information and store it in the database
* A history page that shows the history of all the tags searched
* Search, sort, filter the history data
* Delete the history data
