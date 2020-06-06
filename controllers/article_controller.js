const axios = require('axios');
const cheerio = require('cheerio');
const sequelize = require('../config/sequelize');
const Author = sequelize.import('../models/Author');

module.exports.home = async (req, res) => {
    let url = req.body.link;
    
    let sTime = startTime();

    let articleHTML = await loadHtml(url);
    let $ = cheerio.load(articleHTML);

    let articleTitle = {};
    let titleText = $("h1").first().text();
    // console.log(`title: `, titleText);
    articleTitle['name'] = titleText;
    articleTitle['link'] = url;

    // let articleObj = $('article').html();
    // console.log('article: ', articleObj);

    let articleAuthor = {};
    let authorUrl = $('meta[property="article:author"]').attr('content');
    let authorName = $('meta[name="author"]').attr('content');
    // console.log(authorUrl);
    articleAuthor['link'] = authorUrl;
    articleAuthor['name'] = authorName;

    let articlePublishedTime = $('meta[property="article:published_time"]').attr('content');

    let articleDescription = $('meta[name="description"]').attr('content');

    //to get response url;
    let allUrls = [];
    $('a').each(function (index, element) {
        allUrls.push($(element).attr('href'));
    });

    let responseLink = "";
    let responsePartialUrl = 'https://medium.com/p/';

    for (let i = 0; i < allUrls.length; i++) {
        let url = allUrls[i];
        if (url.includes(responsePartialUrl)) {
            responseLink = url
        }
    }
    // console.log(responseLink);
    //For responses for each article
    let responseHTML = await loadHtml(responseLink);
    // $ = cheerio.load(responseHTML);
    // let pTags = $('.streamItem.streamItem--postPreview.js-streamItem').each((index, element)=>{

    // })
    // console.log('pTags: ', pTags);
    // console.log(`site-main: ${pTags}`);

    let timeDiff = endTime(sTime);

    let returnedData = {};
    returnedData['title'] = articleTitle;
    returnedData['author'] = articleAuthor;
    returnedData['publishedTime'] = articlePublishedTime;
    returnedData['description'] = articleDescription;
    returnedData['timeElapsed'] = timeDiff;

    dbOperations(returnedData);

    return res.status(200).json({
        data: returnedData,
        message: 'Home in Article Controller called'
    });
}

let loadHtml = async (url) => {
    let response = await axios.get(url, {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9'
        }
    });

    let htmlResponse = response.data;
    // console.log('-----------------------------------------------------------------------');
    // console.log(`htmlResponse: ${htmlResponse}`);
    return htmlResponse;
}

let startTime = ()=> {
    return new Date();
};

let endTime = (startTime)=> {
    let newTime = new Date();
    let timeDiff = newTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff);
    return seconds;
}

let dbOperations = async (returnedData)=>{
    console.log('dbOperations called');
    let authorName = returnedData.author.name;
    let authorLink = returnedData.author.link;

    let authorObject = await Author.findOne({where:{author_name: authorName}});
    if(authorObject){
        console.log('found - no need to create');
    }
    else{
        console.log('Not found- creating new tag item');
        let newAuthorObject = await Author.create({author_name: authorName, author_link: authorLink});
        console.log(newAuthorObject.dataValues);
    }
}