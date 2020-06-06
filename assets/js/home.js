console.log('Home script called');
let currentData = [];
let allData = [];
let isAscending = true;
let isSortPresent = false;

let domCreation = new DomCreation();

let searchTags = () => {
    let searchTag = $('#input-tag').val();
    console.log(searchTag);
    networkCallForArticles(searchTag);
    $('#sortButton').remove();
    $('#tag-link-container').remove();
    $('#article-list-container').remove();
    $('#search-history-container').hide();
    $('#search-results-container').show();
    isSortPresent = false;
}

let networkCallForArticles = (searchTag)=>{
    $.ajax({
        type: "GET",
        url: `/list/${searchTag}`,
        success: function (response) {
            console.log(response);
            let links = response.data.links;
            let relatedTags = response.data.tags;

            domCreation.addHeadingTags();
            for (let tag of relatedTags) {
                domCreation.createTagDom(tag);
            }
            domCreation.addHeadingArticles();
            tagClick();
            scrappingTopArticlesLink(links, searchTag);
        }
    });
}

let scrappingTopArticlesLink = (links, searchTag) => {
    for (let i = 0; i < links.length; i++) {
        domCreation.createCrawlingPendingDom('pending', i);
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
                domCreation.createArticleDetailsDom(response.data, i);
            }
        });
    }
}

let dateFormatFn = function (dateString) {
    console.log('DateFormat fn called');
    let formattedDate = moment(dateString).format('MMMM DD, hh:mm A');
    return formattedDate;
}

let showHistory = () => {
    console.log('showHistory called');
    $.ajax({
        type: "GET",
        url: `/article/history`,
        success: function (response) {
            console.log(response);
            if (response.data.length > 0) {
                $('#search-history-container').empty();
                $('#search-history-container').show();
                $('#search-results-container').hide();
                isSortPresent = domCreation.addSortDom(isSortPresent);
                // createHistoryHeaderDom();
                let historyArr = response.data;
                currentData = response.data;
                allData = response.data;
                let tags = [];
                for (let i = 0; i < historyArr.length; i++) {
                    let historyItem = historyArr[i];
                    let singleTag = historyItem['tag_history.tag_name'].toLowerCase();
                    historyItem.updatedAt = dateFormatFn(historyItem.updatedAt);
                    domCreation.createHistoryitemDom(historyItem, i);
                    if($.inArray( singleTag, tags)==-1)
                        tags.push(singleTag);
                }
                console.log(tags);
                domCreation.addFilterDom(tags);
            }
            else {
                alert('No items in History');
            }
        }
    });
}

let tagClick = ()=>{
    $('.tag-link-forward').click((event)=>{
        console.log('clicked');
        let tagName = event.target.text;
        $('#input-tag').val(tagName);
        networkCallForArticles(tagName);
    })
}

let createSearchHistoryContainer = ()=>{
    $('#search-history-container').empty();
    for(let i=0; i<currentData.length; i++){
        domCreation.createHistoryitemDom(currentData[i], i);
    }
}

let sortByDate = ()=>{
    console.log(currentData);
    currentData.sort((a, b)=>{
        if(isAscending){
            if(a['createdAt']>b['createdAt'])
                return 1;
            else
                return -1;
        }
        else{
            if(a['createdAt']>b['createdAt'])
                return -1;
            else
                return 1;
        }
    });
    isAscending = !isAscending;
    console.log(currentData);
    createSearchHistoryContainer();
}

let filterFunction = ()=>{
    console.log('change called')
    let selectedTag = $('#filter-tags').find(":selected").text();
    if(selectedTag=="No Filter")
        currentData = allData;
    else{
        currentData = [];
        for(let i=0; i<allData.length; i++){
            let item = allData[i];
            if(item['tag_history.tag_name']==selectedTag)
                currentData.push(item);
        }
    }
    console.log(currentData);
    createSearchHistoryContainer();
}