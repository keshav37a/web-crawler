class DomCreation {

    //Add filter dropdown, sort, delete and back buttons in the history page
    addFilterAndSortDom = (isSortPresent, tags) => {
        if (isSortPresent == false) {
            $('#input-container').empty();
            let str = '<button class="input-el btn" id="sortButton" onclick="sortByDate()">Sort</button>';
            $('#input-container').append(str);
            isSortPresent = true;

            let strBeg = `<select class="input-el btn" id="filter-tags" onchange=filterFunction()>`;
            let none = '<option selected value="none">No Filter</option>';
            for (let i = 0; i < tags.length; i++) {
                let option = `<option value="${tags[i]}">${tags[i]}</option>`;
                strBeg += option;
            }
            let strEnd = `</select>`;
            $('#input-container').append(strBeg + none + strEnd);

            str = '<input class="input-el btn" placeholder="Search ...." id="searchHistoryInput" oninput="searchItemsInHistory()"></input>'
            $('#input-container').append(str);

            str = '<button class="input-el btn" id="deleteButton" onclick="deleteHistoryItems()">Delete</button>';
            $('#input-container').append(str);

            str = '<button class="input-el btn" id="backButton" onclick="goBackToSearch()">Back</button>';
            $('#input-container').append(str);

            isSortPresent = true;
            return isSortPresent;
        }
    }

    //Add headings - (Related Tags, Articles) in the home page
    addHeadingTags = () => {
        $('#tag-link-container').remove();
        let str = `
        <div id="tag-link-container" class="flex-row-start">
            <h3 class="heading">Related Tags</h3>
        </div >`;
        $('#search-results-container').append(str);
    }

    addHeadingArticles = () => {
        $('#article-list-container').remove();
        let str = `
        <div id="article-list-container" class="flex-col-start">
            <h3 class="heading">Articles</h3>
        </div>`;
        $('#search-results-container').append(str);
    }

    //Add tag links in the home page
    createTagDom = (tag) => {
        let str =
            `<div class="tag-link-item">
            <a class="tag-link-text tag-link-forward">${tag.name}</a>
        </div>`;
        $('#tag-link-container').append(str);
    };

    //Show article crawling or pending status
    createCrawlingPendingDom = (crawlingOrPending, i) => {
        let str =
            `<div class="single-article-container" id="article-${i}">
            ${crawlingOrPending}
        </div>`;
        $('#article-list-container').append(str);
    }

    //Show article details after crawling has finished
    createArticleDetailsDom = (data, i) => {
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

    //Create history item for the database for the values retireved from the database
    createHistoryitemDom = (item, i) => {
        let str =
        `<div id="history-item-${i + 1}" class="single-article-container flex-row-start">
            <div><input class="check-item" id="check-item-${i + 1}" type="checkbox"></input></div>
            <div class="item">${i + 1}</div>
            <div class="item"><a class="tag-link-text" href="${item['tag_history.tag_link']}">${item['tag_history.tag_name']}<a/></div>
            <div id="article-header-container" class="flex-col-start grow">
                <div class="item "><a class="tag-link-text" href="${item['article_link']}">${item['article_title']}<a></div>
                <div class="item"><a class="tag-link-text" href="${item['author.author_link']}">${item['author.author_name']}<a/></div>
            </div
            <div class="item">${item.updatedAt}</div>  
        </div > `;

        $('#search-history-container').append(str);
    }

    //Create input content
    createInputContainerDom = () => {
        let str = `
        <input id="input-tag" class="input-el" type="text" placeholder="Enter the tag...">
        <button class="input-el btn" onclick="searchTags()">SEARCH</button>
        <button class="input-el btn" onclick="showHistory()">HISTORY</button>`;
        $('#input-container').prepend(str);
    }
}