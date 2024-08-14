const express = require('express');
const route = express.Router();
const DataController = require('../controller/blogController');



route.post('/create-post',DataController.PostBlog);

route.get('/get/blogger/All-blog',DataController.getBlogFromBlogger);

route.put('/update/blogger/post',DataController.UpdateBlog);

route.delete('/delete/blogger/post',DataController.DeleteBlog);

module.exports = {BlogRoute:route}