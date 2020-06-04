const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request-promise');

module.exports.home = (req, res) => {
    return res.render('home.ejs');
}

module.exports.getSearchResults = async (req, res) => {
    try {
        let tag = req.params.tag;

        let response = await axios.get(`https://medium.com/tag/${tag}`, {
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
            tagsList.push(childText);
        })
        console.log(tagsList);
    
        let articleLinkslist = [];
        $('body').find('.postArticle-content').each(function (index, element) {
            articleLinkslist.push($(element).parent().attr('href').toString());
        });
        console.log(articleLinkslist);
        let data = {tags: tagsList, links: articleLinkslist};
    
        return res.status(200).json({
            data: data,
            message: 'getSearchResults in Home Controller called'
        });
    }
    catch (err) {
        console.log(err);
    }

}