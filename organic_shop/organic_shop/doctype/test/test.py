# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from organic_shop.organic_cart import update_cart,update_cart_custom

class Test(Document):
	def update_cart_test(self):
		self.get_items()
		
		# multi_result = update_cart_custom([],with_items=True)
		# result = update_cart(item_code="Apple",qty=0,with_items=True)
		# frappe.msgprint(str(multi_result))
	def get_items(self):
		result_items = []
		items = frappe.db.sql(""" select name,has_variants,item_group,website_warehouse,image from `tabItem` it where it.show_in_website = 1""",as_dict = 1)

		for item in items:
			if item.has_variants == 1:
				variant = frappe.db.sql("""select name,item_group,website_warehouse from `tabItem` it where it.variant_of = %s""",item.name,as_dict = 1)
				# frappe.throw(str(variant))
				variant_list = []
				in_stock = 0
				for var in variant:
					# frappe.msgprint(str(var))
					price = frappe.db.get_value("Item Price",{"item_code":var.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
					stock = frappe.db.get_value("Bin",{"item_code":var.name,"warehouse":var.website_warehouse},"actual_qty")
					if stock != None and stock != 0:
						in_stock=1
					
					variant_list.append({
						
						"variant":var.name,
						"stock":stock,
						"price":price,
						
					})
				result_items.append({
					"has_variant":item.has_variants,
					"item":item.name,
					"image":item.image,
					"variant":variant_list,
					"item_group":item.item_group,
					"in_stock":in_stock
				})
			else:
				in_stock = 0
				price = frappe.db.get_value("Item Price",{"item_code":item.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
				stock = frappe.db.get_value("Bin",{"item_code":item.name,"warehouse":item.website_warehouse},"actual_qty")
				if stock != None and stock != 0:
					in_stock=1
				result_items.append({
					"has_variant":item.has_variants,
					"item":item.name,
					"image":item.image,
					"variant":None,
					"stock":stock,
					"price":price,
					"item_group":item.item_group,
					"in_stock":in_stock
				})

		
		return result_items


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

