$(document).ready(function () {
/* Session Function */
var cart = [];
var session_cart = sessionStorage.getItem("cart");
var total = sessionStorage.getItem("total");
var cart_count = frappe.get_cookie("cart_count");

if(cart_count) {
    $('#view_cart').removeAttr('hidden');
    set_cart()
}

console.log(total)
console.log(session_cart)
if(session_cart){
    
    $("#total").text(parseFloat(total))
    cart = JSON.parse(session_cart)
    JSON.parse(session_cart).forEach(element => {
        console.log(element)
        $("#"+element.id).prop('checked', true)
        $("#"+element.id).closest('tr').find('.qty').val(element.qty)
    });
}



/* Session Function */
    console.log(frappe)
    /* Item group Filter */

    
    // console.log(frappe.session.user)
    
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
        var set_cart = 0
        var existing_stock = $('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('stock');
        
        if(parseFloat(parseFloat($(this).parent().find('.counter').val()) + 1) > parseFloat(existing_stock)){
            alert("This item has only "+ existing_stock +" stock")
        }else{
            $(this).parent().find('.counter').val(parseFloat($(this).parent().find('.counter').val()) + 1);
            set_cart = 1;
        }
        
        const item_code = $(this).closest('tr').find('.select_option').find("select.option").val()
        const qty =$(this).parent().find('.counter').val()
        const price = parseFloat($('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('price'));
        
        if($(this).closest('tr').find('input.checkmark')[0].checked && set_cart){
            
                cart = update_local_cart(3,cart,{"item":item_code,"notes":"no notes","qty":qty,"price":price,"id":$(this).closest('tr').find('input.checkmark').attr("id")})
                console.log(cart)

        }
	});
	$('.vigieCart-tab .down_count').click(function (e) {
        var existing_stock = $('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('stock');
        const price = parseFloat($('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('price'));
        if(parseFloat(parseFloat($(this).parent().find('.counter').val()) - 1) > parseFloat(existing_stock)){
            alert("This item has only stock")
        }else{
            $(this).parent().find('.counter').val(parseFloat($(this).parent().find('.counter').val()) - 1);
            set_cart = 1;
        }
        
        const item_code = $(this).closest('tr').find('.select_option').find("select.option").val()
        const qty =$(this).parent().find('.counter').val()
        
        if($(this).closest('tr').find('input.checkmark')[0].checked && set_cart){
            
                cart = update_local_cart(3,cart,{"item":item_code,"notes":"no notes","qty":qty,"price":price,"id":$(this).closest('tr').find('input.checkmark').attr("id")})
                console.log(cart)

        }
    });

    /* Qty up down counter */
    
    
    /* On change of option change price in table */
    
    $(".option").on("change", function() {
        const price = parseFloat($('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('price'));   
        $(this).closest('tr').find('.price').html(price) 
    })

    /* On change of option change price in table */


     /* On change of qty */

    // $(".qty").on("change", function() {
    //     const item_code = $(this).closest('tr').find('.select_option').find("select.option").val()
    //     const qty = $(this).val();
    //     /*console.log( $(this).closest('tr').find('.select_option').find("select.option"))*/
    //     var existing_stock = $('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('stock');
    //     /*console.log($(this).val())
    //     console.log(existing_stock)*/
    //     if(parseFloat($(this).val()) > parseFloat(existing_stock)){
    //         alert("This item has only stock")
    //     }

    //     if($(this).closest('tr').find('input.checkmark')[0].checked){

    //         cart = update_local_cart(3,cart,{"item":item_code,"notes":"no notes","qty":qty})
    //         console.log(cart)
    
    //     }
        
    // })

    /* On change of qty */


    /* On change of checkbox */

    $("input[type='checkbox']").change(function() {
        // console.log(frappe.user)
        if(frappe.user == "Guest") {
            alert("Please Login First!")
            if(localStorage) {
                localStorage.setItem("last_visited", window.location.pathname);
            }
            window.location.href = "/login";
        }
        console.log($(this).closest('tr').find('.select_option').find("select.option").val())
        var item_code = $(this).closest('tr').find('.select_option').find("select.option").val()
        var additional_notes ="no notes"
        var qty = parseFloat($(this).closest('tr').find('.qty').val());
        var price = parseFloat($('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('price'));
        var cart_total = parseFloat($("#total").text())
        if(this.checked) {
           
            $(this).closest('tr').find('.select_option').find("select.option").prop('disabled', 'disabled');

            cart = update_local_cart(1,cart,{"item":item_code,"notes":additional_notes,"qty":qty,"price":price,"id":$(this).attr("id")})
            console.log(cart)

        }else{
            console.log("unchecked")
            
            $(this).closest('tr').find('.option').prop('disabled', false);
            
            cart = update_local_cart(2,cart,{"item":item_code,"notes":additional_notes,"qty":qty,"price":price,"id":$(this).attr("id")})
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
    
    var total = 0
    cart.forEach(element => {
        total = total + (parseFloat(element.price)*parseFloat(element.qty))
    });
    $("#total").text(parseFloat(total))

    // cart.forEach(opts => {
    //     shopping_cart_update (opts)        
    // });
    sessionStorage.setItem("cart",JSON.stringify(cart));
    sessionStorage.setItem("total", total);

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
