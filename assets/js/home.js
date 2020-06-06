console.log('Home script called');
let searchTags = () => {
    let searchTag = $('#input-tag').val();
    console.log(searchTag);

    //For getting the list of search results and their links
    $.ajax({
        type: "GET",
        url: `/list/${searchTag}`,
        success: function (response) {
            console.log(response);

            let links = response.data.links;
            let relatedTags = response.data.tags;

            $('#tag-link-container').remove();
            $('#article-list-container').remove();

            addHeadingTags();
            for (let tag of relatedTags) {
                createTagDom(tag);
            }
            addHeadingArticles();
            scrappingTopArticlesLink(links, searchTag);
        }
    });
}

let addHeadingTags = () => {
    let str = `
    <div id="tag-link-container" class="flex-row-start">
        <h3 class="heading">Related Tags</h3>
    </div >`;
    $('#search-results-container').append(str);
}

let addHeadingArticles = ()=>{
    let str = `
    <div id="article-list-container" class="flex-col-start">
        <h3 class="heading">Articles</h3>
    </div>`;
    $('#search-results-container').append(str);
}


let createTagDom = (tag) => {
    let str =
        `<div class="tag-link-item">
        <a class="tag-link-text" href="${tag.value}">${tag.name}</a>
    </div>`;
    $('#tag-link-container').append(str);
};

let createCrawlingPendingDom = (crawlingOrPending, i) => {
    let str =
        `<div class="single-article-container" id="article-${i}">
        ${crawlingOrPending}
    </div>`;
    $('#article-list-container').append(str);
}

let createArticleDetailsDom = (data, i) => {
    $(`#article-${i}`).text('');
    let str =
        `<div class="article-title-link">
            <a class="tag-link-text" href="${data.title.link}">${data.title.name}</a>
        </div>
        <div class="article-author">
            <a class="tag-link-text" href="${data.author.link}">${data.author.name}</a>
        </div>
        <div class="article-published-at">
            <p>${data.publishedTime}</p>
        </div>
        <div class="article-description">
            <p>${data.description}</p>
        </div>
        <div class="time-elapsed">
            <p>Time Elapsed: ${data.timeElapsed} Seconds</p>
        </div>`;


    $(`#article-${i}`).append(str);
}

let scrappingTopArticlesLink = (links, searchTag) => {
    for (let i = 0; i < links.length; i++) {
        createCrawlingPendingDom('pending', i);
    }
    for (let i = 0; i < links.length; i++) {
        $(`#article-${i}`).text('crawling');

        //For getting the article details
        $.ajax({
            type: "POST",
            url: `/article`,
            data: { link: links[i], tag: searchTag },
            success: function (response) {
                console.log(response);
                response.data.publishedTime = dateFormatFn(response.data.publishedTime);
                createArticleDetailsDom(response.data, i);
            }
        });
    }
}

let dateFormatFn = function (dateString) {
    console.log('DateFormat fn called');
    let formattedDate = moment(dateString).format('MMMM DD, hh:mm A');
    return formattedDate;
}