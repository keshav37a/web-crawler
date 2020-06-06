const axios = require('axios');
const cheerio = require('cheerio');
const sequelize = require('../config/sequelize');
const Author = sequelize.import('../models/Author');
const Article = sequelize.import('../models/Article');
const TagHistory = sequelize.import('../models/TagHistory');

module.exports.home = async (req, res) => {
    try{
        let url = req.body.link;
        let tagName = req.body.tag;
        
        let sTime = startTime();
    
        let articleHTML = await loadHtml(url);
        let $ = cheerio.load(articleHTML);
    
        let articleTitle = {};
        let titleText = $("h1").first().text();
        
        articleTitle['name'] = titleText;
        articleTitle['link'] = url;
    
        let articleAuthor = {};
        let authorUrl = $('meta[property="article:author"]').attr('content');
        let authorName = $('meta[name="author"]').attr('content');
        
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
    
        let responseHTML = await loadHtml(responseLink);
        let timeDiff = endTime(sTime);
    
        let returnedData = {};
        returnedData['title'] = articleTitle;
        returnedData['author'] = articleAuthor;
        returnedData['publishedTime'] = articlePublishedTime;
        returnedData['description'] = articleDescription;
        returnedData['timeElapsed'] = timeDiff;
    
        await dbOperations(returnedData, tagName);
    
        return res.status(200).json({
            data: returnedData,
            message: 'Home in Article Controller called'
        });
    }
    catch(err){
        console.log(`err->article_controller.home(): ${err}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

let loadHtml = async (url) => {
    try{
        let response = await axios.get(url, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9'
            }
        });
        let htmlResponse = response.data;
        return htmlResponse;
    }
    catch(err){
        console.log(`err->article_controller.loadHtml(): ${err}`);
        return "";
    }
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

let dbOperations = async (returnedData, tagName)=>{
    try{
        let authorName = returnedData.author.name;
        let authorLink = returnedData.author.link;
    
        let articleTitle = returnedData.title.name;
        let articleLink = returnedData.title.link;
        let articleDescription = returnedData.description;
        let publishedTime = returnedData.publishedTime;
        let authorId = "";
        let tagId = "";
    
        let authorObject = await Author.findOne({where:{author_name: authorName}});
        if(authorObject){
            console.log('found - no need to create');
        }
        else{
            console.log('Not found- creating new tag item');
            let newAuthorObject = await Author.create({author_name: authorName, author_link: authorLink});
            authorId = newAuthorObject.dataValues.id;
            console.log(newAuthorObject.dataValues);
            console.log(typeof(authorId));
        }
    
        //get tagId by name
        let tagObject = await TagHistory.findOne({where: {tag_name: tagName}});
        tagId = tagObject.dataValues.id;
        
        let articleObject = await Article.findOne({where: {article_title: articleTitle}});
        if(articleObject){
            console.log('found - no need to create');
        }
        else{
            console.log('Not found- creating new tag item');
            let newArticleObject = await Article.create({article_title: articleTitle, article_link: articleLink, article_description: articleDescription, published_at: publishedTime, authorId: authorId, tagId: tagId});
        }
    }
    catch(err){
        console.log(`err->article_controller.dbOperations(): ${err}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
    
}

module.exports.history = async (req, res)=>{
    try{
        let articles = await Article.findAll({raw: true, include: [Author, TagHistory]});
        return res.status(200).json({
            message: 'Successful',
            data: articles
        });
    }
    catch(err){
        console.log(`err->article_controller.history(): ${err}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}