# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from organic_shop.organic_cart import update_cart,update_cart_custom
from itertools import groupby

class Test(Document):
	def update_cart_test(self):
		self.get_items()


	def get_items(self):
		object = self.check_customer_or_supplier()
		warehouse = None
		if object[1]:
			warehouse = frappe.db.get_value("Customer",str(object[1]),"nearest_company_warehouse_cf")
		if warehouse == None:
			warehouse = frappe.db.get_value("Organic Cart Settings",None,"default_warehouse")

		result_items = []
		items = frappe.db.sql(""" select name,stock_uom,item_name,route,has_variants,item_group,website_warehouse,image from `tabItem` it where it.show_in_website = 1 and it.is_sales_item = 1 and it.variant_of is null """,as_dict = 1)

		for item in items:
			if item.has_variants == 1:
				variant = frappe.db.sql("""select name,item_name,item_group,website_warehouse from `tabItem` it where it.variant_of = %s and it.show_variant_in_website = 1""",item.name,as_dict = 1)
				variant_list = []
				in_stock = 0
				for var in variant:
					price = frappe.db.get_value("Item Price",{"item_code":var.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
					stock = frappe.db.get_value("Bin",{"item_code":var.name,"warehouse":warehouse},"projected_qty")
					if stock != None and stock > 0:
						in_stock=1
					
					variant_list.append({
						"variant_name":var.item_name,
						"variant":var.name,
						"stock":stock,
						"price":price,
						
					})
				result_items.append({
					
					"route":item.route,
					"has_variant":item.has_variants,
					"item":item.name,
					"item_name":item.item_name,
					"image":item.image,
					"variant":variant_list,
					"item_group":item.item_group,
					"in_stock":in_stock,
					"item_group_route":frappe.db.get_value("Item Group",item.item_group,"route"),
					"warehouse":warehouse
				})
			else:
				in_stock = 0
				price = frappe.db.get_value("Item Price",{"item_code":item.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
				stock = frappe.db.get_value("Bin",{"item_code":item.name,"warehouse":warehouse},"projected_qty")
				if stock != None and stock > 0:
					in_stock=1
				result_items.append({
					"uom":item.stock_uom,
					"route":item.route,
					"has_variant":item.has_variants,
					"item":item.name,
					"item_name":item.item_name,
					"image":item.image,
					"variant":None,
					"stock":stock,
					"price":price,
					"item_group":item.item_group,
					"in_stock":in_stock,
					"item_group_route":frappe.db.get_value("Item Group",item.item_group,"route"),
					"warehouse":warehouse
				})
		frappe.throw(str(result_items))

		return result_items
		
		# multi_result = update_cart_custom([],with_items=True)
		# result = update_cart(item_code="Apple",qty=0,with_items=True)
		# frappe.msgprint(str(multi_result))
	# def get_items(self):
	# 	object = self.check_customer_or_supplier()
	# 	warehouse = None
	# 	if object[1]:
	# 		warehouse = frappe.db.get_value("Customer",str(object[1]),"nearest_company_warehouse_cf")
	# 	if warehouse == None:
	# 		warehouse = frappe.db.get_value("Organic Cart Settings",None,"default_warehouse")
	# 	# frappe.throw(str(warehouse))

	# 	result_items = []
	# 	# variant = []
	# 	# items = frappe.db.sql(""" select 
	# 	# it.name,
	# 	# it.stock_uom,
	# 	# it.item_name,
	# 	# it.route,
	# 	# it.has_variants,
	# 	# it.variant_of,
	# 	# it.item_group,
	# 	# it.website_warehouse,
	# 	# it.image,
	# 	# bn.warehouse,
	# 	# bn.projected_qty as stock,
	# 	# ip.price_list_rate as price
	# 	# from `tabItem` it inner join `tabBin` bn on it.name = bn.item_code inner join `tabItem Price` ip on it.name = ip.item_code 
	# 	# where (it.show_in_website = 1 or it.show_variant_in_website = 1) and it.is_sales_item = 1 and ip.price_list = %s and ip.selling = 1 and bn.warehouse = %s""",(frappe.db.get_value("Shopping Cart Settings",None,"price_list"),warehouse),as_dict = 1)

	# 	# for it in items:
	# 	# 	if it.variant_of == None:
	# 	# 		result_items.append({
	# 	# 		"uom":it.stock_uom,
    #     #         "route":it.route,
    #     #         "has_variant":it.has_variants,
    #     #         "item":it.name,
    #     #         "item_name":it.item_name,
    #     #         "image":it.image,
    #     #         "variant":None,
    #     #         "stock":it.stock,
    #     #         "price":it.price,
    #     #         "item_group":it.item_group,
    #     #         "in_stock":1 if it.stock > 0 else 0,
    #     #         "item_group_route":frappe.db.get_value("Item Group",it.item_group,"route")
	# 	# 		})
	# 	# 	else:
	# 	# 		variant.append(it)

	# 	# result_items = result_items + self.group_by_key(variant,'variant_of')

	# 	# frappe.throw(str(result_items))
				
		
				
	# 	# frappe.throw(str(result_items)) 

	# 	# return items
	# 	for item in items:
	# 		if item.has_variants == 1:
	# 			variant = frappe.db.sql("""select name,item_group,website_warehouse from `tabItem` it where it.variant_of = %s""",item.name,as_dict = 1)
	# 			# frappe.throw(str(variant))
	# 			variant_list = []
	# 			in_stock = 0
	# 			for var in variant:
	# 				# frappe.msgprint(str(var))
	# 				price = frappe.db.get_value("Item Price",{"item_code":var.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
	# 				stock = frappe.db.get_value("Bin",{"item_code":var.name,"warehouse":var.website_warehouse},"actual_qty")
	# 				if stock != None and stock != 0:
	# 					in_stock=1
					
	# 				variant_list.append({
						
	# 					"variant":var.name,
	# 					"stock":stock,
	# 					"price":price,
						
	# 				})
	# 			result_items.append({
	# 				"has_variant":item.has_variants,
	# 				"item":item.name,
	# 				"image":item.image,
	# 				"variant":variant_list,
	# 				"item_group":item.item_group,
	# 				"in_stock":in_stock
	# 			})
	# 		else:
	# 			in_stock = 0
	# 			price = frappe.db.get_value("Item Price",{"item_code":item.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
	# 			stock = frappe.db.get_value("Bin",{"item_code":item.name,"warehouse":item.website_warehouse},"actual_qty")
	# 			if stock != None and stock != 0:
	# 				in_stock=1
	# 			result_items.append({
	# 				"has_variant":item.has_variants,
	# 				"item":item.name,
	# 				"image":item.image,
	# 				"variant":None,
	# 				"stock":stock,
	# 				"price":price,
	# 				"item_group":item.item_group,
	# 				"in_stock":in_stock
	# 			})

		
	# 	return result_items
	def group_by_key(self,list_name,key):
		result = []
		for k,v in groupby(list_name,key=lambda x:x[key]):
			# print(k)
			if not any(d[key] == k for d in result):
				result.append({
					key:k,
					"uom":frappe.db.get_value("Item",k,"stock_uom"),
					"item_name":frappe.db.get_value("Item",k,"item_name"),
					"image":frappe.db.get_value("Item",k,"image"),
					"item_group":frappe.db.get_value("Item",k,"item_group"),
					"item_group_route":frappe.db.get_value("Item Group",frappe.db.get_value("Item",k,"item_group"),"route"),
					"route":frappe.db.get_value("Item",k,"route"),
					"variants":list(v)
				})
			else:
				for res in result:
					if res[key] == k:
						res['variants'].append(list(v))
		return result

	def check_customer_or_supplier(self):
		if frappe.session.user:
			contact_name = frappe.get_value("Contact", {"email_id": frappe.session.user})
			if contact_name:
				contact = frappe.get_doc('Contact', contact_name)
				for link in contact.links:
					if link.link_doctype in ('Customer', 'Supplier'):
						return link.link_doctype, link.link_name

			return 'Customer', None
# def check_stock(items):
# 	stock = []
# 	for item in items:
# 		# frappe.msgprint(str(item))
# 		if item['has_variant'] == 1:
# 			instock = 0
# 			for var in item['variant']:
# 				if var['stock'] != None and float(var['stock']) != 0.00:
# 					instock = 1
# 			stock.append({
# 				item['item']:instock
# 			})		
# 		else:
# 			if item['stock'] != None and float(item['stock']) != 0.00:
# 				stock.append({
# 					item['item']:1
# 				})
# 			else:
# 				stock.append({
# 					item['item']:0
# 				})

# 	return stock

