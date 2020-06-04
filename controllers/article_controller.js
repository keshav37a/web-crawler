const axios = require('axios');
const cheerio = require('cheerio');

module.exports.home = async (req, res) => {
    let url = req.body.link;
    console.log(url);

    let response = await axios.get(url, {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
        }
    });

    let htmlResponse = response.data;
    const $ = cheerio.load(htmlResponse);

    let heading = $("h1").first().text();
    console.log(`heading: `, heading);

    return res.status(200).json({
        data: {heading},
        message: 'Home in Article Controller called'
    });
}