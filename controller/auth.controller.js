const { google } = require('googleapis');
const User = require('../model/user');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);



exports.authenticate = async (req, res) => {
try{
    const { tokens } = await oauth2Client.getToken(req.query.code);
    // Token = tokens
    console.log("Token",tokens);
    const userObj = {
        email:"test@gmail.com",
        Token:tokens.access_token
    }
    const savedUser = await User.find();
    savedUser[0].Token = tokens.access_token != undefined 
    ? tokens.access_token
    : savedUser[0].Token;
    await savedUser[0].save()
    // postBlog(tokens.access_token,content)
    // oauth2Client.setCredentials(tokens);
    res.status(200).json({message:'Authentication successful!'});
    }catch(error){
        res.status(500).json({message:error.message,statusCode:500,status:'ERROR'});
    }
}

exports.generateAuthUrl = async (req,res) =>{
    try {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/blogger'],
        });
        res.status(200).json({message:'Link Generated Successfully', Auth_Url:authUrl});
    } catch (error) {
        res.status(500).json({message:error.message,statusCode:500,status:'ERROR'});
    }
}