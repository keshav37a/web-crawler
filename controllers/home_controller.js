const axios = require('axios');
const cheerio = require('cheerio');
const sequelize = require('../config/sequelize');
const TagHistory = sequelize.import('../models/TagHistory');

module.exports.home = (req, res) => {
    return res.render('home.ejs');
}

module.exports.getSearchResults = async (req, res) => {
    try {
        let tag = req.params.tag;
        let tagLink = `https://medium.com/tag/${tag}`;
        let response = await axios.get(tagLink, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
            }
        });

        let htmlResponse = response.data;
        const $ = cheerio.load(htmlResponse);

        let tagsList = [];
        $('.tags--postTags').children().each((index, element)=>{
            let childText = $(element).text();
            let childLink = $(element).children().attr('href');
            let obj = {};
            obj['name'] = childText;
            obj['value'] = childLink;
            tagsList.push(obj);
        })
    
        let articleLinkslist = [];
        $('body').find('.postArticle-content').each(function (index, element) {
            articleLinkslist.push($(element).parent().attr('href').toString());
        });
        let data = {tags: tagsList, links: articleLinkslist};

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

let dbOperations = async (tag, tagLink)=>{
    console.log('dbOperations called');
    
    let tagHistory = await TagHistory.findOne({where:{tag_name: tag}});
    if(tagHistory){
        console.log('found - updating time');
        await tagHistory.set('tag_name', tag+"y");
        tagHistory.save();
        await tagHistory.set('tag_name', tag);
        console.log(tagHistory.dataValues);
    }
    else{
        console.log('Not found- creating new tag item');
        let newTagItem = await TagHistory.create({tag_name: tag, tag_link: tagLink});
        console.log(newTagItem.dataValues);
    }
}