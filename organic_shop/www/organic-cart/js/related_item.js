$(document).ready(function () {
    console.log("document.location.href : "+window.location.host);
    console.log("document.location.pathname : "+document.location.pathname);
    var webhref_part = document.location.pathname.split('/')
    var item_group = webhref_part[1]
    var item = window.item_code = $('[itemscope] [itemprop="productID"]').text().trim();
    console.log(item_group)
    cart.list({
        "doctype":"Item",
        "filters":[{"show_in_website":1},{"item_group":item_group},{"is_sales_item":1},["name","!=",item]],
        "fields":["name","item_group","route","image"]
    }).then((res) =>{
        res.message.forEach(element => {
            var link = element.route.split("/")[2]
            console.log(element.route.split("/")[2])
            $( ".card-group" ).append( 
                `<div class="card item">
                <div class="card-img-box" ><img class="card-img-top" src="`+element.image+`" alt="Card image cap" /></div>
                <div class="card-body">
                  <h5 class="card-title"><a href="`+link+`">`+ element.name+`</a></h5>
                </div>
              </div>`
                );
        });
        
        console.log(res)
    });
})
