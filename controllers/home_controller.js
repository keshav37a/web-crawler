module.exports.home = (req, res)=>{
    return res.status(200).json({
        message: 'Home in Home Controller called'
    });
}