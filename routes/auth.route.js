const express = require('express');
const route = express.Router();
const authController = require('../controller/auth.controller');



route.get('/oauthcallback',authController.authenticate);

route.get('/request-for-authentication',authController.generateAuthUrl);

// route.get('/get/Data/:topicID/:blogID',DataController.getDataById);

// route.post('/create-post/:topicID/:blogID',DataController.PostBlog);


module.exports = {AuthRoute:route}