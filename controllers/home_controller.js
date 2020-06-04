module.exports.home = (req, res)=>{
    return res.render('home.ejs');
    // return res.status(200).json({
    //     message: 'Home in Home Controller called'
    // });
}