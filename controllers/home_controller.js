const axios = require('axios');

module.exports.home = (req, res)=>{
    return res.render('home.ejs');
}

module.exports.getSearchResults = async (req, res)=>{
    console.log('getSearchResults called');
    let tag = req.params.tag;
    console.log(tag);

    let response = await axios.get(`https://medium.com/tag/${tag}`, {
        headers:{
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip'
        }
    });
    console.log(response.data);

    return res.status(200).json({
        data: response.data,
        message: 'getSearchResults in Home Controller called'
    });
}