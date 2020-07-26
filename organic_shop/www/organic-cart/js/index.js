$(document).ready(async function () {
    console.log("not here")
    console.log(frappe)
    let exist_warehouse = await warehouse_selection()
    console.log(exist_warehouse.message)
    if(exist_warehouse.message == '0' && frappe.user != "Guest"){
        get_warehouse_detail()
    }
    /* Session Function */
    var cart = [];
    // var session_cart = sessionStorage.getItem("cart");
    // // var total = sessionStorage.getItem("total");
    var cart_count = frappe.get_cookie("cart_count");
    // console.log(cart_count)
    
    if(cart_count != 0) {
        $('#view_cart').removeAttr('hidden');
        set_cart()
    }
    
    // console.log(session_cart)
    // if(session_cart){
    //     // $("#total").text(parseFloat(total))
    //     cart = JSON.parse(session_cart)
    //     // JSON.parse(session_cart).forEach(element => {
    //     //     console.log(element)
    //     //     $("#"+element.id).prop('checked', true)
    //     //     $("#"+element.id).closest('tr').find('.qty').val(element.qty)
    //     // });
    // }
    
    
    
    /* Session Function */
        
        /* Item group Filter */
    
      $("tr").filter(".item."+$($("#item_group tr")[0]).find('.vigieCart-anchor').attr("route")).css("display", "table-row") ;   
      $("tr").filter(".item:not(."+$($("#item_group tr")[0]).find('.vigieCart-anchor').attr("route")+")").css("display", "none") ;
      $($("#item_group tr")[0]).find('.vigieCart-anchor').addClass("active");
      $("#item_group").on("click", "td", function() {
    
        $("#item_group a").removeClass("active"); 
        if($( this ).text() != "All"){
            $("tr").filter(".item."+$( this ).find('.vigieCart-anchor').attr("route")).css("display", "table-row") ;   
            $("tr").filter(".item:not(."+$( this ).find('.vigieCart-anchor').attr("route")+")").css("display", "none") ;
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
    
        $(".qty").keyup(function (e) { 
            var me = this
            if($(this).val() % 1 != 0){
                if(countDecimals($(this).val()) > 3){
                    alert("Decimal Value allowed till 3 points")
                    $(this).val(parseFloat($(me).val()).toFixed(3))
                }
                
            }
            
        });
    
        $(".qty").on("change", async function() {
            // console.log(fetch_item_details(this))
            if($(this).val() == NaN || $(this).val() <= 0){
                alert("Quantity can not be Empty or Zero or Minus!")
                $(this).val(1)
                return 0
            }
            if($(this).val() % 1 === 0){
               //do nothing
             } else{
               // console.log($(this).closest('tr').find('.select_option').text().trim())
               
                let must_whole = await fetch_uom_property($(this).closest('tr').find('.select_option').text().trim())
                var me = this
               
                if(must_whole.message.must_be_whole_number){
                   //alert("Quantity must be whole number")
                   if(isNaN(parseInt($(me).val())) || parseInt($(me).val()) == 0)
                   {
                      $(this).val(1)
                   }
                   else 
                   {
                    $(this).val(parseInt($(me).val()))
                   }
                   alert("Quantity must be whole number")
                }
                
                 
             }
            
            if(parseFloat($(this).val()) > fetch_item_details(this).stock){
                alert("This item has only "+ fetch_item_details(this).stock +" stock")
                $(this).val(fetch_item_details(this).stock)
                return 0
            }
    
            if($(this).closest('tr').find('input.checkmark')[0].checked){
    
                cart = update_local_cart(3,cart,{"item":fetch_item_details(this).item_code,"notes":"no notes","qty":$(this).val(),"price":fetch_item_details(this).price,"id":$(this).closest('tr').find('input.checkmark').attr("id")})
                console.log(cart)
        
            }
            
        })
    
        /* On change of qty */
    
    
        /* On change of checkbox */
    
        $("input[type='checkbox']").change(function() {
            // console.log(fetch_item_details(this))
            // console.log(frappe.user)
            if(frappe.user == "Guest") {
                alert("Please Login First!")
                if(localStorage) {
                    localStorage.setItem("last_visited", window.location.pathname);
                }
                window.location.href = "/login";
                return 0
            }
            if(fetch_item_details(this).qty == NaN || fetch_item_details(this).qty <= 0){
                alert("Quantity can not be Empty or Zero or Minus!")
                $(this).val(1)
                
            }
            console.log(fetch_item_details(this).qty)
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
    
            if (cart.length > 0){
    
                cart.forEach(element => {
                
                    cart_item.push({"item_code":element.item,"qty":element.qty});
                });
                shopping_cart_update(cart_item)
                cart = [];
                $('.option').prop('disabled', false);
    
            }else{
    
                alert("Please Select Item To Add into Cart")
    
    
            }
    
            // cart.forEach(element => {
                
            //     cart_item.push({"item_code":element.item,"qty":element.qty});
            // });
            // shopping_cart_update(cart_item)
            
            // window.location.href = "/cart";
        })
    
        /* Add to cart click event */

        $("#warehouse").change(async function(){
            
            if(frappe.get_cookie("cart_count") != 0){
                $('#warehouse-popup').remove();
                $('#storechangepopup').subscribeBetter({
                    trigger: "onloaded",
                    animation: "fade",
                    delay: 0, 
                    showOnce: true, 
                    autoClose: false, 
                    scrollableModal: false
            });
            }else{
                let set_val = await set_warehouse($(this).val())
                if(set_val.message.nearest_company_warehouse_cf == $(this).val()){
                    location.reload();
                }
            }

            
    
        })
        $("#set_warehouse").click(async function(){
            console.log("here")
            let set_val = await set_warehouse($('#sel_ware_pop').val())
            console.log(set_val)
            if(set_val.message.nearest_company_warehouse_cf == $('#sel_ware_pop').val()){
                location.reload();
            }  
        })
        $("#change_store_yes").click(async function(){
            $(this).parent().parent().find('.sb-close-btn').trigger('click');
			let empty = await empty_cart();
            let set_val = await set_warehouse($("#warehouse").val())
            if(set_val.message.nearest_company_warehouse_cf == $("#warehouse").val()){
                location.reload();
            }
        })
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
    
    function fetch_uom_property(uom){
        return new Promise(function (resolve, reject) {
            try {
                frappe.call({
                    "method":"frappe.client.get_value",
                    "args":{
                        "doctype":"UOM",
                        "filters":{"name":uom},
                        "fieldname":["must_be_whole_number"]
                    },
                    callback:resolve
                    
                })
            } catch (e) { reject(e); }
        });
    }
    
    function countDecimals (value) {
        if(Math.floor(value) === value) return 0;
        return value.toString().split(".")[1].length || 0; 
    }


    async function empty_cart(){
        return new Promise(function (resolve, reject) {
            try {
                frappe.call({
                    "method":"organic_shop.organic_cart.del_quotation",
                    "args":{
                        
                    },
                    callback:resolve
                    
                })
            } catch (e) { reject(e); }
        });
        
    }

    async function warehouse_selection(){
        return new Promise(function (resolve, reject) {
            try {
                frappe.call({
                    "method":"organic_shop.api.check_warehouse",
                    "args":{
                        "user":frappe.user
                    },
                    callback:resolve
                    
                })
            } catch (e) { reject(e); }
        });
        
    }

    async function set_warehouse(warehouse){
        return new Promise(function (resolve, reject) {
            try {
                frappe.call({
                    "method":"organic_shop.api.set_warehouse",
                    "args":{
                        "user":frappe.user,
                        "value":warehouse
                    },
                    callback:resolve
                    
                })
            } catch (e) { reject(e); }
        });
        
    }
    
    function get_warehouse_detail(){
        var subscribe_popups = $('#warehouse-popup');
    
        $('#warehouse-popup').subscribeBetter({
            trigger: "onload", // You can choose which kind of trigger you want for the subscription modal to appear. Available triggers are "atendpage" which will display when the user scrolls to the bottom of the page, "onload" which will display once the page is loaded, and "onidle" which will display after you've scrolled.
            animation: "flyInDown", // You can set the entrance animation here. Available options are "fade", "flyInRight", "flyInLeft", "flyInUp", and "flyInDown". The default value is "fade".
            delay: 0, // You can set the delay between the trigger and the appearance of the modal window. This works on all triggers. The value should be in milliseconds. The default value is 0.
            showOnce: true, // Toggle this to false if you hate your users. :)
            autoClose: false, // Toggle this to true to automatically close the modal window when the user continue to scroll to make it less intrusive. The default value is false.
            scrollableModal: false      //  If the modal window is long and you need the ability for the form to be scrollable, toggle this to true. The default value is false.
        });
    
    }
    