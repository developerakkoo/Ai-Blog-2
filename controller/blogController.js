const { google } = require('googleapis');
const blogger = google.blogger('v3');
const Data = require('../model/Data');
const User = require('../model/user');
const axios = require('axios');
require('dotenv').config();


exports.PostBlog = async (req,res) => {
    try {
        const savedData = await Data.findOne({_id : req.body.topicID});
        if (!savedData) {
            return res.status(404).json({message:"Data Not Found",statusCode:404});
            }
            const savedUser = await User.find();
            const dataIndex = savedData.SearchResult.findIndex((data)=> data.ID === req.body.blogID);
            let data = JSON.stringify({
                "kind": "blogger#post",
                "blog": {
                "id": process.env.Blog_ID
                },
                "title": savedData.SearchResult[dataIndex].title,
                "content": savedData.SearchResult[dataIndex].html
            });
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://www.googleapis.com/blogger/v3/blogs/${process.env.Blog_ID}/posts/?key=${process.env.Api_key}`,
                headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${savedUser[0].Token}`
                },
                data : data
            };
            axios.request(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                const PostRes = {
                    Post_Id:response.data.id,
                    Status:response.data.status,
                    Title:response.data.title,
                    URL:response.data.url
                }
                return res.status(200).json({message:'Post published successfully',statusCode:200, Data: PostRes});
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response.status == 401) {
                
                    res.status(400).json({message:`Auth Token Expire Please Authenticate By Going To this`, URL: `http://localhost:3000/request-for-authentication`,statusCode:400,status:"ERROR"});
                }
            });            
    } catch (error) {
        res.status(500).json({statusCode:500,status:'ERROR',message: error.message});
    }
}


exports.getBlogFromBlogger = async (req,res)=>{
    try {
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://www.googleapis.com/blogger/v3/blogs/${process.env.Blog_ID}/posts/?key=${process.env.Api_key}`,
        headers: { }
        };
        axios.request(config)
        .then((response) => {
            let Data = []
            response.data.items.forEach(element => {
                Data.push({post_ID:element.id,title:element.title,Url:element.url})
            });
            return res.status(200).json({message:'All Post Fetched Successfully',statusCode:200,count:Data.length,Data:Data});
        })
        .catch((error) => {
            console.log(error.response);
            if (error.response.status == 404) {
                return res.status(404).json({message:`Post Not Found`,statusCode:404});
            }
            res.status(400).json({message:error.message,statusCode:400,status:"ERROR"});
        });
        } catch (error) {
            res.status(500).json({message:error.message,statusCode:500,status:"ERROR"});
        }
}

exports.UpdateBlog = async (req,res)=> {
    try {
        const savedUser = await User.find();
        let data = JSON.stringify({
            "content": req.body.content
        });
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `https://www.googleapis.com/blogger/v3/blogs/${process.env.Blog_ID}/posts/${req.body.post_ID}`,
            headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${savedUser[0].Token}`
        },
            data : data
        };
        axios.request(config)
        .then((response) => {
            // console.log(JSON.stringify(response.data));
            const PostRes = {
                Post_Id:response.data.id,
                Status:response.data.status,
                Title:response.data.title,
                URL:response.data.url
            }
            return res.status(200).json({message:"Post Updated Successfully",statusCode:200,Data:PostRes});
        })
        .catch((error) => {
            console.log(error.message);
            if (error.response.status == 404) {
                return res.status(404).json({message:`Post Not Found`,statusCode:404});
            }
            if (error.response.status == 401) {
                res.status(400).json({message:`Auth Token Expire Please Authenticate By Going To this`, URL: `http://localhost:3000/request-for-authentication`,statusCode:400,status:"ERROR"});
            }
        });
        } catch (error) {
            res.status(500).json({message:error.message,statusCode:500,status:"ERROR"});
        }
}

exports.DeleteBlog = async (req,res)=> {
    try {
        const savedUser = await User.find();
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `https://www.googleapis.com/blogger/v3/blogs/${process.env.Blog_ID}/posts/${req.body.post_ID}`,
            headers: { 
                'Authorization': `Bearer ${savedUser[0].Token}`
            }
        };
        axios.request(config)
        .then((response) => {
            return res.status(200).json({message:'Post deleted Successfully!',statusCode:200});
            // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error.message);
            if (error.response.status == 404) {
                
                return res.status(404).json({message:`Post Not Found`,statusCode:404});
            }
            if (error.response.status == 401) {
                
                res.status(400).json({message:`Auth Token Expire Please Authenticate By Going To this`, URL: `http://localhost:3000/request-for-authentication`,statusCode:400,status:"ERROR"});
            }
        });
    } catch (error) {
        res.status(500).json({message:error.message,statusCode:500,status:"ERROR"});
    }
}