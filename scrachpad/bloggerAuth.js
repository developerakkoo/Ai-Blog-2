const { google } = require('googleapis');
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const content = "I am sakib devlekar <b>exciting to announce that i am successfully able to post blog using nodejs </b> content..."
let Token 

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/blogger'],
});

app.get('/oauthcallback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  // Token = tokens
  console.log("Token",tokens);
  postBlog(tokens.access_token,content)
  oauth2Client.setCredentials(tokens);
  res.send('Authentication successful!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Authorize this app by visiting: ${authUrl}`);
});


function postBlog(Token,content){
try {
  console.log(Token,content);
let data = JSON.stringify({
  "kind": "blogger#post",
  "blog": {
    "id": "4156110872592329874"
  },
  "title": "A new post",
  "content": content
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://www.googleapis.com/blogger/v3/blogs/4156110872592329874/posts/?key=AIzaSyAsPvY5CaO2-G4tofKcvVLrPE5iDCa9FF0',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${Token}`
  },
  data : data
};

axios.request(config)
.then((response) => {
  const Data = response.data
  console.log(`Post_Id:${Data.id},status:${Data.status},Blog_Link:${Data.url},PublishedAt:${Data.published}`);
})
.catch((error) => {
  console.log(error.message);
});

} catch (error) {
  console.log(error);
}
}