$(document).ready(function () {
/* Session Function */
var cart = [];
var session_cart = sessionStorage.getItem("cart");
// var total = sessionStorage.getItem("total");
var cart_count = frappe.get_cookie("cart_count");
console.log(cart_count)

if(cart_count != 0) {
    $('#view_cart').removeAttr('hidden');
    set_cart()
}

console.log(session_cart)
if(session_cart){
    // $("#total").text(parseFloat(total))
    cart = JSON.parse(session_cart)
    // JSON.parse(session_cart).forEach(element => {
    //     console.log(element)
    //     $("#"+element.id).prop('checked', true)
    //     $("#"+element.id).closest('tr').find('.qty').val(element.qty)
    // });
}



/* Session Function */
    
    /* Item group Filter */

  $("tr").filter(".item."+$($("#item_group tr")[0]).find('.vigieCart-anchor').text()).css("display", "table-row") ;   
  $("tr").filter(".item:not(."+$($("#item_group tr")[0]).find('.vigieCart-anchor').text()+")").css("display", "none") ;
  $($("#item_group tr")[0]).find('.vigieCart-anchor').addClass("active");
  $("#item_group").on("click", "td", function() {

    $("#item_group a").removeClass("active"); 
    if($( this ).text() != "All"){
        $("tr").filter(".item."+$( this ).text()).css("display", "table-row") ;   
        $("tr").filter(".item:not(."+$( this ).text()+")").css("display", "none") ;
    }else{
        $("tr").filter(".item").css("display", "table-row") ; 
    }
    });

    /* Item group Filter */
    
    /* Qty up down counter */
	$('.vigieCart-tab .up_count').click(function (e) {
        console.log(fetch_item_details(this))
        var set_cart = 0
        
        if(parseFloat(parseFloat($(this).parent().find('.counter').val()) + 1) > fetch_item_details(this).stock){
            alert("This item has only "+ fetch_item_details(this).stock +" stock")
            return 0
        }else{
            $(this).parent().find('.counter').val(parseFloat($(this).parent().find('.counter').val()) + 1);
            set_cart = 1;
        }
        
        
        
        if($(this).closest('tr').find('input.checkmark')[0].checked && set_cart){
            
                cart = update_local_cart(3,cart,{"item":fetch_item_details(this).item_code,"notes":"no notes","qty":fetch_item_details(this).qty,"price":fetch_item_details(this).price,"id":$(this).closest('tr').find('input.checkmark').attr("id")})
                console.log(cart)

        }
	});
	$('.vigieCart-tab .down_count').click(function (e) {
        console.log(fetch_item_details(this))
       
        if(parseFloat(parseFloat($(this).parent().find('.counter').val()) - 1) < 1){
            alert("Minimum Quantity Should be 1")
            return 0
        }else{
            $(this).parent().find('.counter').val(parseFloat($(this).parent().find('.counter').val()) - 1);
            set_cart = 1;
        }
        
        
        
        if($(this).closest('tr').find('input.checkmark')[0].checked && set_cart){
            
            cart = update_local_cart(3,cart,{"item":fetch_item_details(this).item_code,"notes":"no notes","qty":fetch_item_details(this).qty,"price":fetch_item_details(this).price,"id":$(this).closest('tr').find('input.checkmark').attr("id")})
                console.log(cart)

        }
    });

    /* Qty up down counter */
    
    
    /* On change of option change price in table */
    
    $(".option").on("change", function() {
        const price = parseFloat($('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('price'));   
        console.log(price)
        $(this).closest('tr').find('.price').html(price.toFixed(1)) 
    })

    /* On change of option change price in table */


     /* On change of qty */

    $(".qty").on("change", function() {
        console.log(fetch_item_details(this))
        if($(this).val() % 1 === 0){
           //do nothing
         } else{
            console.log($(this).closest('tr').find('.select_option').text().trim())
            var me = this
            frappe.call({
                "method":"frappe.client.get_value",
                "args":{
                    "doctype":"UOM",
                    "filters":{"name":$(this).closest('tr').find('.select_option').text().trim()},
                    "fieldname":["must_be_whole_number"]
                },
                callback:function(r){
                    if(r.message.must_be_whole_number){
                        alert("You cannot enter Fraction QTY for this Item")
                        $(me).val(parseInt($(me).val()))
                    }
                }
            })
             
         }
        
        if(parseFloat($(this).val()) > fetch_item_details(this).stock){
            alert("This item has only "+ fetch_item_details(this).stock +" stock")
            return 0
        }

        if($(this).closest('tr').find('input.checkmark')[0].checked){

            cart = update_local_cart(3,cart,{"item":fetch_item_details(this).item_code,"notes":"no notes","qty":fetch_item_details(this).qty,"price":fetch_item_details(this).price,"id":$(this).closest('tr').find('input.checkmark').attr("id")})
            console.log(cart)
    
        }
        
    })

    /* On change of qty */


    /* On change of checkbox */

    $("input[type='checkbox']").change(function() {
        console.log(fetch_item_details(this))
        // console.log(frappe.user)
        if(frappe.user == "Guest") {
            alert("Please Login First!")
            if(localStorage) {
                localStorage.setItem("last_visited", window.location.pathname);
            }
            window.location.href = "/login";
            return 0
        }
        console.log($(this).closest('tr').find('.select_option').find("select.option").val())
        var item_code = ""
        if($(this).closest('tr').find('.select_option').find("select.option").val()){
            item_code = $(this).closest('tr').find('.select_option').find("select.option").val()
        }else{
            item_code = $(this).closest('tr').find('.item_name').text()
        }
       
        // var cart_total = parseFloat($("#total").text())
        if(this.checked) {
           
            $(this).closest('tr').find('.select_option').find("select.option").prop('disabled', 'disabled');

            cart = update_local_cart(1,cart,{"item":fetch_item_details(this).item_code,"notes":"no notes","qty":fetch_item_details(this).qty,"price":fetch_item_details(this).price,"id":$(this).attr("id")})
            console.log(cart)

        }else{
            console.log("unchecked")
            
            $(this).closest('tr').find('.option').prop('disabled', false);
            
            cart = update_local_cart(2,cart,{"item":fetch_item_details(this).item_code,"notes":"no notes","qty":fetch_item_details(this).qty,"price":fetch_item_details(this).price,"id":$(this).attr("id")})
            console.log(cart)
           
        }
    });

    /* On change of checkbox */

    /* Add to cart click event */

    $("#add_to_cart").on("click", function() {
        
        var cart_item = []
        cart.forEach(element => {
            
            cart_item.push({"item_code":element.item,"qty":element.qty});
        });
        shopping_cart_update(cart_item)
        
        // window.location.href = "/cart";
    })

    /* Add to cart click event */
    
    });


/* Update local cart function */    

function update_local_cart(case_option,cart,ops=null){
    switch(case_option) {
        case 1:
            cart.push(ops)
            break;
        case 2:
            
            for (let i = 0; i < cart.length; i++) {
                const element = cart[i];
                if(element['item'] == ops.item){
                    cart.splice(i, 1);
                    // element['qty'] = 0
                }
            }
          break;
        case 3:
            for (let i = 0; i < cart.length; i++) {
                const element = cart[i];
                if(element['item']==ops.item){
                    element['qty'] = parseFloat(ops.qty)
                }
            }
          break;        
        default:
            
      }
    
    // var total = 0
    // cart.forEach(element => {
    //     total = total + (parseFloat(element.price)*parseFloat(element.qty))
    // });
    // $("#total").text(parseFloat(total))

    // cart.forEach(opts => {
    //     shopping_cart_update (opts)        
    // });
    sessionStorage.setItem("cart",JSON.stringify(cart));
    // sessionStorage.setItem("total", total);

    return cart

} 

/* Update local cart function */    



/* Update erpnext cart function */

async function shopping_cart_update (opts) {
    
    if(frappe.session.user ==="Guest") {
        if(localStorage) {
            localStorage.setItem("last_visited", window.location.pathname);
        }
        window.location.href = "/login";
    } else {
        console.log(opts)
        $("#add_to_cart").prop('disabled', true);
        frappe.freeze();
        return frappe.call({
            type: "POST",
            method: "organic_shop.organic_cart.update_cart_custom",
            args: {"items":opts,"with_items":1},
            btn: opts.btn,
            callback: function(r) {
               console.log(r.message)
               set_cart()
               frappe.unfreeze();
               $("#add_to_cart").prop('disabled',false);
               $('#view_cart').removeAttr('hidden');
               $("input.checkmark:checkbox").prop('checked', false)
               $("input.counter").val(1)
               
            }
        });
        // let result = await erpnext.shopping_cart.update_cart({
            
		// 	item_code:opts.item,
		// 	additional_notes:opts.additional_notes,
        //     qty: opts.qty
        // });
        
        // return result
    }


    
    
}

function set_cart() {
    var cart_count = frappe.get_cookie("cart_count");
    if(frappe.session.user==="Guest") {
        cart_count = 0;
    }

    if(cart_count) {
        $(".shopping-cart").toggleClass('hidden', false);
    }

    var $cart = $('.cart-icon');
    var $badge = $cart.find("#cart-count");

    if(parseInt(cart_count) === 0 || cart_count === undefined) {
        $cart.css("display", "none");
        $(".cart-items").html('Cart is Empty');
        $(".cart-tax-items").hide();
        $(".btn-place-order").hide();
        $(".cart-addresses").hide();
    }
    else {
        $cart.css("display", "inline");
    }

    if(cart_count) {
        $badge.html(cart_count);
    } else {
        $badge.remove();
    }
}

/* Update erpnext cart function */


function fetch_item_details(me){

    var item_code = ""
    if($(me).closest('tr').find('.select_option').find("select.option").val()){
        item_code = $(me).closest('tr').find('.select_option').find("select.option").val()
    }else{
        item_code = $(me).closest('tr').find('.item_name').text()
    }

    var qty = parseFloat($(me).closest('tr').find('.counter').val());

    var price = parseFloat($(me).closest('tr').find('.price').text());

    var stock  = 0.00
    if($('option:selected', $(me).closest('tr').find('.select_option').find("select.option")).attr('stock')){
        stock =parseFloat($('option:selected', $(me).closest('tr').find('.select_option').find("select.option")).attr('stock'))
    }else{
        stock  =  parseFloat($(me).closest('tr').find('.stock').text());
    }
   

    return{
        "item_code":item_code,
        "qty":qty,
        "price":price,
        "stock":stock
    }
}