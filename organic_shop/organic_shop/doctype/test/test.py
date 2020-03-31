# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from organic_shop.organic_cart import update_cart,update_cart_custom

class Test(Document):
	def update_cart_test(self):
		multi_result = update_cart_custom([],with_items=True)
		# result = update_cart(item_code="Apple",qty=0,with_items=True)
		frappe.msgprint(str(multi_result))
	def get_items(self):
		result_items = []
		items = frappe.db.sql(""" select name,has_variants,item_group,website_warehouse,image from `tabItem` it where it.show_in_website = 1""",as_dict = 1)

		for item in items:
			if item.has_variants == 1:
				variant = frappe.db.sql("""select name,item_group,website_warehouse from `tabItem` it where it.variant_of = %s""",item.name,as_dict = 1)
				# frappe.throw(str(variant))
				variant_list = []
				for var in variant:
					# frappe.msgprint(str(var))
					price = frappe.db.get_value("Item Price",{"item_code":var.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
					stock = frappe.db.get_value("Bin",{"item_code":var.name,"warehouse":var.website_warehouse},"actual_qty")
					
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
					"item_group":item.item_group
				})
			else:
				price = frappe.db.get_value("Item Price",{"item_code":item.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
				stock = frappe.db.get_value("Bin",{"item_code":item.name,"warehouse":item.website_warehouse},"actual_qty")
				result_items.append({
					"has_variant":item.has_variants,
					"item":item.name,
					"image":item.image,
					"variant":None,
					"stock":stock,
					"price":price,
					"item_group":item.item_group
				})
		frappe.throw(str(result_items))


