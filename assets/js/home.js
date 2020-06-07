let currentData = [];   //Changes for each search, sort, filter
let allHistoryData = [];    //Stays the same throughout
let tags = [];  
let isAscending = true; //For toggling increasing, decreasing sort
let isSortPresent = false;  //For prevention of duplicate dom items being created

let domCreation = new DomCreation();

//Search the tag value from the input
let searchTags = () => {
    let searchTag = $('#input-tag').val();
    networkCallForArticles(searchTag);
    showFirstPage();
    isSortPresent = false;
}

//Network Call for article history stored in the db
let showHistory = () => {
    $.ajax({
        type: "GET",
        url: `/article/history`,
        success: function (response) {
            if (response.data.length > 0) {
                currentData = response.data;
                allHistoryData = response.data;
                tags = [];
                showSecondPage();   //Removes visibility of search-container and empty the history-container
                for (let i = 0; i < currentData.length; i++) {
                    let historyItem = currentData[i];
                    let singleTag = historyItem['tag_history.tag_name'];
                    historyItem.updatedAt = dateFormatFn(historyItem.updatedAt);
                    domCreation.createHistoryitemDom(historyItem, i);   //Add single history item to the DOM
                    if($.inArray( singleTag, tags)==-1)
                        tags.push(singleTag);
                }
                isSortPresent =domCreation.addFilterAndSortDom(isSortPresent, tags);
            }
            else {
                alert('No items in History');
            }
        }
    });
}

//Make network call for retrieving articles
let networkCallForArticles = (searchTag)=>{
    $.ajax({
        type: "GET",
        url: `/list/${searchTag}`,
        success: function (response) {
            let links = response.data.links;
            let relatedTags = response.data.tags;

            domCreation.addHeadingTags();
            for (let tag of relatedTags) {
                domCreation.createTagDom(tag);
            }
            domCreation.addHeadingArticles();
            tagClick(); //Clcik on the related tag simulates the search for that tag and retrieves its articles
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
                response.data.publishedTime = dateFormatFn(response.data.publishedTime);
                domCreation.createArticleDetailsDom(response.data, i);
            }
        });
    }
}

let dateFormatFn = function (dateString) {
    let formattedDate = moment(dateString).format('MMMM DD, hh:mm A');
    return formattedDate;
}

let tagClick = ()=>{
    $('.tag-link-forward').click((event)=>{
        let tagName = event.target.text;
        $('#input-tag').val(tagName);
        showFirstPage();
        networkCallForArticles(tagName);
    })
}

//This is called after each search, filter, sort action to uodate the DOM based on the currentData
let createSearchHistoryContainer = ()=>{
    console.log('createSearchHistoryContainer called');
    $('#search-history-container').empty();
    for(let i=0; i<currentData.length; i++){
        domCreation.createHistoryitemDom(currentData[i], i);
    }
}

//Sort the arry by date in both ascending and descending order
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

//Filter function that gets executed when delete button is pressed to get the list of all checked items to be deleted from the history
let filterFunction = ()=>{
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
    createSearchHistoryContainer(); //After deletion recreate the history page
}

//Back button to go from history to search
let goBackToSearch =()=>{
    showFirstPage();
    isSortPresent = false;
}

let showFirstPage = ()=>{
    $('#input-container').empty();
    $('#search-history-container').hide();
    $('#search-results-container').show();
    domCreation.createInputContainerDom();
}

let showSecondPage = ()=>{
    $('#search-history-container').empty();
    $('#search-history-container').show();
    $('#search-results-container').hide();
}

//Searches item in the array by all fields. Updates dom on each change in the input
let searchItemsInHistory = ()=>{
    let text = $('#searchHistoryInput').val().toLowerCase();;
    currentData = [];
    allHistoryData.forEach((object)=>{
        let isContains = false;
        Object.entries(object).forEach(([key, value])=>{
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

//Network call to delete items. Frontend an backend calls
let deleteHistoryItems = ()=>{
    let selected = [];
    $(':checked').each(function() {
        let idStr = $(this).attr('id');
        if(idStr!==undefined){
            let id = idStr.substring(11);
            console.log(id);
            let obj = {};
            obj['id'] = id-1;
            obj['title'] = allHistoryData[id-1]['article_title'];
            selected.push(obj);
        }
    });
    $.ajax({
        type: "delete",
        url: `/article/delete`,
        data: { titles: selected},
        success: function (response) {
            console.log(response);
            if(response.data==selected.length){
                for(let i=0; i<selected.length; i++){
                    let obj = selected[i];
                    console.log(obj);
                    for(let i=0; i<allHistoryData.length; i++){
                        let item = allHistoryData[i];
                        if(item['article_title']==obj.title){
                            allHistoryData.splice(i, 1);

                        }
                        if(i<currentData.length && currentData[i]['article_title']==obj.title){
                            currentData.splice(i, 1);
                        }
                    }
                    createSearchHistoryContainer();
                }
                currentData = allHistoryData;
            }
        }
    });
}