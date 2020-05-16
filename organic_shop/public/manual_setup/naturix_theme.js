$(document).ready(function () {	
	$('.product_cart .up_count').click(function (e) {
		$(this).parent().find('.counter').val(parseInt($(this).parent().find('.counter').val()) + 1);
	});
	$('.product_cart .down_count').click(function (e) {
		$(this).parent().find('.counter').val(parseInt($(this).parent().find('.counter').val()) - 1);
	});
	if($('li.shopping-cart').height()){
	   var cartnumber =  $('li.shopping-cart > a >span').html();
	   $('li.shopping-cart > a ').html('<i class="icon fa fa-shopping-basket"></i><span class="badge badge-primary" id="cart-count">'+ cartnumber +'</span>');
	   console.log(cartnumber);
	}
	
});	
