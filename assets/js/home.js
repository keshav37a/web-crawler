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

            let tagLinkContainer = $('#tag-link-container');
            tagLinkContainer.empty();
            for (let tag of relatedTags) {
                let tagString = createTagDom(tag);
                tagLinkContainer.append(tagString);
            }
            scrappingTopArticlesLink(links);
        }
    });
}

let createTagDom = (tag) => {
    return str =
        `<div class="tag-link-item">
        <a class="tag-link-text" href="${tag.value}">${tag.name}</a>
    </div>`;
};

let createCrawlingPendingDom = (crawlingOrPending, i) => {
    let str =
        `<div class="single-article-container" id="article-${i}">
        ${crawlingOrPending}
    </div>`;
    $('#article-list-container').append(str);
}

let scrappingTopArticlesLink = (links) => {
    for (let i = 0; i < links.length; i++) {
        createCrawlingPendingDom('pending', i);
    }
    for (let i = 0; i < links.length; i++) {
        $(`#article-${i}`).text('crawling');
        //For getting the article details
        $.ajax({
            type: "POST",
            url: `/article`,
            data: {link: links[i]},
            success: function (response) {
                console.log(response);
            }
        });
    }
}