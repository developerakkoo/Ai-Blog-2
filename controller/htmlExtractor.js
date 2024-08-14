const axios = require('axios');
const {saveToFile} = require('../util/saveFile');
const searchLinks = require('../Data/searchResult.json');
const {clearFile} = require('../util/clearFile');
const Data = require('../model/Data');
const dataArray = [];
const IO = require('../socket');

exports.dataExtractor = async(result,topic) => {  
  let count = 0
    // clearFile('./Data/extractorResult.json')
  for(element of result){
    // console.log(element.Link);
  const axios = require('axios');
  const options = {
    method: 'POST',
    url: 'https://magicapi-article-extraction.p.rapidapi.com/extract',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'ed6f15389fmsh08bd43fe39a7e74p1d124cjsnd2cfd7d29dd3',
      'X-RapidAPI-Host': 'magicapi-article-extraction.p.rapidapi.com'
    },
    data: {
      url: element.Link
    }
  };
  try {
    const response = await axios.request(options);
    let data = {
      ID: `D${Math.floor(100000000 + Math.random() * 90000000)}`,
      siteName:response.data.siteName,
      searchTitle:element.Title,
      searchURL:response.data.url,
      title:response.data.title,
      topImage:response.data.topImage,
      description:response.data.description,
      text:response.data.text,
      summary:response.data.summary,
      html:response.data.html
      
    }
    dataArray.push(data);
    let msg = `Total Links Count:${result.length}, Link data extracted ${count+=1}, Please wait...`
    IO.getIO().emit('get:Search', msg);
    console.log(msg);
  } catch (error) {
    console.error(error.response.data,error.response.status);
  }
  }
  insertData(dataArray,topic)
  // saveToFile(dataArray)
  console.log('Process Completed!');
}

// dataExtractor();

async function insertData(data,topic){
  try {
      // console.log(data);
      const dataObj ={
        SearchTopic:topic,
        SearchResult:data
      }
      const savedData = await Data.create(dataObj);
      IO.getIO().emit('get:SearchData', savedData);
      console.log('Data Inserted To MongoDB');
  } catch (error) {
      console.log(error);
  }
}


exports.getAllData = async(req,res)=>{
  try {
      const savedData = await Data.find();
      if (savedData.length == 0) {
      res.status(404).json({message:"Data Not Found",statusCode:404});
      }
      res.status(200).json({message:"All Data Fetched Successfully",Data:savedData});
  } catch (error) {
      res.status(500).json({statusCode:500,status:'ERROR',message: error.message});
  }
}

exports.getDataById = async(req,res)=>{
  try {
      const savedData = await Data.findOne({_id : req.params.topicID});
      if (!savedData) {
          return res.status(404).json({message:"Data Not Found",statusCode:404});
          }
          const dataIndex = savedData.SearchResult.findIndex((data)=> data.ID === req.params.blogID);
      res.status(200).json({message:"Blog Data Fetched Successfully",statusCode:200,Data:savedData.SearchResult[dataIndex]});
  } catch (error) {
      res.status(500).json({statusCode:500,status:'ERROR',message: error.message});
  }
}
