# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Test(Document):
	def get_items(self):
		result_items = []
		items = frappe.db.sql(""" select name,has_variants,item_group,website_warehouse,image from `tabItem` it where it.show_in_website = 1""",as_dict = 1)

		for item in items:
			if item.has_variants == 1:
				variant = frappe.db.sql("""select name,item_group,website_warehouse from `tabItem` it where it.variant_of = %s""",item.name,as_dict = 1)
				for var in variant:
					price = frappe.db.get_value("Item Price",{"item_code":var.name,"price_list":"Standard","selling":1},"price_list_rate")
					stock = frappe.db.get_value("Bin",{"item_code":var.name,"warehouse":var.website_warehouse},"actual_qty")
					result_items.append({
						"item":item.name,
						"image":item.image,
						"variant":var.name,
						"stock":stock,
						"price":price
					})
			else:
				price = frappe.db.get_value("Item Price",{"item_code":item.name,"price_list":"Standard","selling":1},"price_list_rate")
				stock = frappe.db.get_value("Bin",{"item_code":item.name,"warehouse":item.website_warehouse},"actual_qty")
				result_items.append({
					"item":item.name,
					"image":item.image,
					"variant":None,
					"stock":stock,
					"price":price
				})
		frappe.throw(str(result_items))
		return result_items

	pass
