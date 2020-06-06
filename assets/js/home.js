console.log('Home script called');
let currentData = [];
let allHistoryData = [];
let tags = [];
let isAscending = true;
let isSortPresent = false;

let domCreation = new DomCreation();

let searchTags = () => {
    let searchTag = $('#input-tag').val();
    networkCallForArticles(searchTag);
    showFirstPage();
    isSortPresent = false;
}

let showHistory = () => {
    console.log('showHistory called');
    $.ajax({
        type: "GET",
        url: `/article/history`,
        success: function (response) {
            if (response.data.length > 0) {
                currentData = response.data;
                allHistoryData = response.data;
                tags = [];
                console.log('allData: ', currentData);
                showSecondPage();
                for (let i = 0; i < currentData.length; i++) {
                    let historyItem = currentData[i];
                    let singleTag = historyItem['tag_history.tag_name'];
                    historyItem.updatedAt = dateFormatFn(historyItem.updatedAt);
                    domCreation.createHistoryitemDom(historyItem, i);
                    if($.inArray( singleTag, tags)==-1)
                        tags.push(singleTag);
                }
                console.log(tags);
                isSortPresent =domCreation.addFilterAndSortDom(isSortPresent, tags);
            }
            else {
                alert('No items in History');
            }
        }
    });
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

let tagClick = ()=>{
    $('.tag-link-forward').click((event)=>{
        console.log('clicked');
        let tagName = event.target.text;
        $('#input-tag').val(tagName);
        showFirstPage();
        networkCallForArticles(tagName);
    })
}

let createSearchHistoryContainer = ()=>{
    console.log('createSearchHistoryContainer called');
    console.log(currentData);
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
        currentData = allHistoryData;
    else{
        currentData = [];
        for(let i=0; i<allHistoryData.length; i++){
            let item = allHistoryData[i];
            if(item['tag_history.tag_name']==selectedTag)
                currentData.push(item);
        }
    }
    console.log(currentData);
    createSearchHistoryContainer();
}

let goBackToSearch =()=>{
    showFirstPage();
    isSortPresent = false;
}

let showFirstPage = ()=>{
    $('#input-container').empty();
    $('#search-history-container').hide();
    $('#search-results-container').show();
    domCreation.createInputContainerDom();
    console.log(isSortPresent);
}

let showSecondPage = ()=>{
    $('#search-history-container').empty();
    $('#search-history-container').show();
    $('#search-results-container').hide();
}

let searchItemsInHistory = ()=>{
    let text = $('#searchHistoryInput').val().toLowerCase();;
    currentData = [];
    allHistoryData.forEach((object)=>{
        let isContains = false;
        Object.entries(object).forEach(([key, value])=>{
            console.log(value);
            if(value.toString().includes(text)){
                isContains = true;
            }
        })
        if(isContains){
            currentData.push(object);
        }
    });
    createSearchHistoryContainer();
}