const express = require('express');
const mongoose = require('mongoose');
const { google } = require('googleapis');
const  DB_URL = "mongodb+srv://farmsell:farmsell@cluster0.mh36s.mongodb.net/BlogAI"
const app = express();
app.use(express.json());
const {SearchRoute} =  require('./routes/search.route');
const {AuthRoute} = require('./routes/auth.route');
const {BlogRoute} = require('./routes/blog.route');

app.use(SearchRoute);
app.use(AuthRoute);
app.use(BlogRoute);



const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/blogger'],
});

// app.get('/oauthcallback', authenticate);


const server = app.listen(3000,async()=>{
    console.log('sever started on port: http://localhost:3000');
    // console.log(`Authorize this app by visiting: ${authUrl}`);
    try {
        await  mongoose.connect(DB_URL)
            console.log('Connected To mongoDB');
            const io = require("./socket").init(server);
            io.on("connection", (socket) => {
                console.log("Connected a User");
            socket.on("disconnect", () => {
                console.log("User Disconnected");
                });
            });
    } catch (error) {
        console.log(error);
    }

})