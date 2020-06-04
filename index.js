const port = 8000;
const express = require('express');
const app = new express();

app.use('/', require('./routes/index'));

app.listen(port, (err)=>{
    if(err){console.log(`error: ${err}`); }

    console.log(`app up and running on port ${port}`);
})



//tags related to the search
// $('.tags')

//author name
//$('.postMetaInline>a').text for author name

//title-link
// $('.postArticle-content').parentElement.href

//title-text
// $('.graf--h3').textContent

//details-reading-time
//$('.readingTime').title

//details time
// $('time').textContent

//$('h3').text for title article