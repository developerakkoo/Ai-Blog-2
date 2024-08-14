const express = require('express');
const route = express.Router();
const SearchController = require('../controller/search.controller');
const DataController = require('../controller/htmlExtractor');
const {searchPhoto} = require('../controller/Photo.controller');

route.post('/search',SearchController.searchData);

route.get('/getAll/Data',DataController.getAllData);

route.get('/get/Data/:topicID/:blogID',DataController.getDataById);

route.post('/search/images',searchPhoto);


module.exports = {SearchRoute:route}