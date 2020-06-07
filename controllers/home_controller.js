const axios = require('axios');
const cheerio = require('cheerio');
const sequelize = require('../config/sequelize');
const TagHistory = sequelize.import('../models/TagHistory');

//For rendering the home page
module.exports.home = (req, res) => {
    return res.render('home.ejs');
}

//For searching through the medium site and retrieving articles based on the tag
module.exports.getSearchResults = async (req, res) => {
    try {
        let tag = req.params.tag;
        let tagLink = `https://medium.com/tag/${tag}`;

        //Using axios to make the network call
        let response = await axios.get(tagLink, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
            }
        });

        let htmlResponse = response.data;
        //Loading data into cheerio
        const $ = cheerio.load(htmlResponse);

        //Retrieving related tags - names and links - for that particular tag
        let tagsList = [];
        $('.tags--postTags').children().each((index, element)=>{
            let childText = $(element).text();
            let childLink = $(element).children().attr('href');
            let obj = {};
            obj['name'] = childText;
            obj['value'] = childLink;
            tagsList.push(obj);
        })
    
        //Retriving top 10 article titles and links
        let articleLinkslist = [];
        $('body').find('.postArticle-content').each(function (index, element) {
            articleLinkslist.push($(element).parent().attr('href').toString());
        });
        let data = {tags: tagsList, links: articleLinkslist};

        //Adding searched tag in the database
        dbOperations(tag, tagLink);
    
        return res.status(200).json({
            data: data,
            message: 'Success'
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

//Adding searched tag in the database
let dbOperations = async (tag, tagLink)=>{    
    try{
        let tagHistory = await TagHistory.findOne({where:{tag_name: tag}});
        if(tagHistory){
            console.log('found - updating time');
            await tagHistory.set('tag_name', tag+"y");
            tagHistory.save();
            await tagHistory.set('tag_name', tag);
        }
        else{
            console.log('Not found- creating new tag item');
            await TagHistory.create({tag_name: tag, tag_link: tagLink});
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }   
}