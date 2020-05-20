$(document).ready(function () {
    //console.log("document.location.href : "+window.location.host);
    //console.log("document.location.pathname : "+document.location.pathname);
    var webhref_part = document.location.pathname.split('/')
    var item_group = webhref_part[1]
    var item = window.item_code = $('[itemscope] [itemprop="productID"]').text().trim();
    //console.log(item_group)
    cart.list({
        "doctype":"Item",
        "filters":[{"show_in_website":1},{"item_group":item_group},{"is_sales_item":1},["name","!=",item]],
        "fields":["item_name","item_group","route","image"],
        "limit_page_length":6
    }).then((res) =>{
        res.message.forEach(element => {
            // var link = element.route.split("/")[2]
            var link  = "/"+ element.route
            //console.log(element.route.split("/")[2])
            $( ".card-group" ).append( 
                `<div class="card item">
                <div class="card-img-box" > <a href="`+link+`" target="_blank"><img class="card-img-top" src="`+element.image+`" alt="`+element.item_name+`"/></a></div>
                <div class="card-body">
                  <h5 class="card-title"><a href="`+link+`">`+ element.item_name+`</a></h5>
                </div>
              </div>`
                );
        });
        
       // console.log(res)
    });
})
