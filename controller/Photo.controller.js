const axios = require('axios');


exports.searchPhoto = async(req,res)=>{
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.unsplash.com/search/photos/?query=${req.body.topic}&client_id=iN4y-C-Z7ehoHi4lyp33dEXys2Dy46PFVGm0QCgE7JA`,
            headers: { }
        };
        
        axios.request(config)
        .then((response) => {
            const metaData = []
            const Data = response.data.results
            // console.log(Data);
            Data.forEach(element => {
                metaData.push({id:element.id,ImageDescription:element.alt_description,URLs:element.urls,Links:element.links});
            });
            res.status(200).json({message:"Images Searched Successfully",statusCode:200,Data:metaData});
            })
        .catch((error) => {
            console.log(error);
            res.status(400).json({message:error.message,statusCode:400,status:'ERROR'});
            });
    } catch (error) {
        res.status(500).json({message:error.message,statusCode:500,status:'ERROR'});
    }
}
