console.log('Home script called');
let searchTags = ()=>{
    let searchTag = $('#input-tag').val();
    console.log(searchTag);

    //For getting the list of search results and their links
    $.ajax({
        type: "GET",
        url: `/list/:${searchTag}`,
        success: function (response) {
            console.log(response);
        }
    });
}