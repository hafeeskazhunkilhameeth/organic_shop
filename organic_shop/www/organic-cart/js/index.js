$(document).ready(function () {
  $("#item_group").on("click", "td", function() {
    // cart.list({
    //     "doctype":"Item",
    //     "filters":{"show_in_website":1},
    //     "fields":["name","item_group"]
    // }).then((res) =>{
    //     console.log(res)
    // });
      
    if($( this ).text() != "All"){
        $("tr").filter(".item."+$( this ).text()).css("display", "block") ;   
        $("tr").filter(".item:not(."+$( this ).text()+")").css("display", "none") ;
    }else{
        $("tr").filter(".item").css("display", "block") ; 
    }
    
    });

    $(".option").on("change", function() {
        console.log($($(this)[0].selectedOptions[0]).attr('price'))
        console.log($($(this)[0].selectedOptions[0]).attr('stock'))
        console.log($(this).closest('tr').find('.price'))
        
        $(this).closest('tr').find('.price').html($($(this)[0].selectedOptions[0]).attr('price')) 
    })

    $(".qty").on("change", function() {
        const item_code = $(this).closest('tr').find('.select_option').find("select.option").val()
        const additional_notes ="no notes"
        const qty = $(this).val();
        
        console.log( $(this).closest('tr').find('.select_option').find("select.option"))
        var existing_stock = $('option:selected', $(this).closest('tr').find('.select_option').find("select.option")).attr('stock')
        console.log($(this).val())
        console.log(existing_stock)
        if(parseInt($(this).val()) > parseInt(existing_stock)){
            alert("This item has only {0} stock".format(existing_stock))
        }
        if($(this).closest('tr').find('input.checkmark')[0].checked){
            erpnext.shopping_cart.update_cart({
                item_code,
                additional_notes,
                qty
            });
        }
        
    })
    $("input[type='checkbox']").change(function() {
        console.log($(this).closest('tr').find('.select_option').find("select.option").val())
        const item_code = $(this).closest('tr').find('.select_option').find("select.option").val()
        const additional_notes ="no notes"
        const qty = parseInt($(this).closest('tr').find('.qty').val());
        var cart_total = parseInt($("#total").text())
        if(this.checked) {
            console.log("checked")
            console.log(parseInt($(this).closest('tr').find('.price').text()))
            $("#total").text(cart_total + parseInt($(this).closest('tr').find('.price').text()))
            $(this).closest('tr').find('.select_option').find("select.option").prop('disabled', 'disabled');

            // console.log($(this).closest('tr').find('.qty').val());
            // console.log($(this).closest('tr').find('.option').val());

            

            erpnext.shopping_cart.update_cart({
                item_code,
                additional_notes,
                qty
            });

        }else{
            console.log("unchecked")
            $("#total").text(cart_total - parseInt($(this).closest('tr').find('.price').text()))
            $(this).closest('tr').find('.option').prop('disabled', false);
            erpnext.shopping_cart.update_cart({
                item_code,
                qty:0,
                with_items:1
            });
        }
    });
    
});
