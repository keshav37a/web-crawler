console.log('Home script called');
let searchTags = ()=>{
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
            for(let tag of relatedTags){
                let tagString = createTagDom(tag);
                tagLinkContainer.append(tagString);
            }
        }
    });
}

let createTagDom =(tag)=>{
    return str = 
    `<div class="tag-link-item">
        <a class="tag-link-text" href="${tag.value}">${tag.name}</a>
    </div>`;
};