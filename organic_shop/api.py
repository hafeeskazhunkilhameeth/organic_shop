import frappe
import json

@frappe.whitelist(allow_guest = True)
def get_list_custom(doctype, fields=None, filters=None, order_by=None,
	limit_start=None, limit_page_length=20, parent=None):
	'''Returns a list of records by filters, fields, ordering and limit

	:param doctype: DocType of the data to be queried
	:param fields: fields to be returned. Default is `name`
	:param filters: filter list by this dict
	:param order_by: Order by this fieldname
	:param limit_start: Start at this index
	:param limit_page_length: Number of records to be returned (default 20)'''
	return frappe.db.get_all(doctype, fields=fields, filters=filters, order_by=order_by,
		limit_start=limit_start, limit_page_length=limit_page_length, ignore_permissions=True)

@frappe.whitelist(allow_guest = True)
def check_warehouse(user):
	contact_name = frappe.get_value("Contact", {"email_id": user})
	if contact_name:
		contact = frappe.get_doc('Contact', contact_name)
		for link in contact.links:
			if link.link_doctype == 'Customer':
				
				warehouse = frappe.db.get_value("Customer",link.link_name,"nearest_company_warehouse_cf")
				if warehouse:
					return 1
				else:
					return 0
			else:
				return 0
	else:
		return 0

@frappe.whitelist(allow_guest = True)
def set_warehouse(user,value):
	contact_name = frappe.get_value("Contact", {"email_id": user})
	if contact_name:
		contact = frappe.get_doc('Contact', contact_name)
		for link in contact.links:
			if link.link_doctype == 'Customer':
				customer_doc = frappe.get_doc("Customer",link.link_name)
				customer_doc.nearest_company_warehouse_cf = value
				res = customer_doc.save(ignore_permissions=True)
				return res
			else:
				return 0

	else:
		return 0
				
				# warehouse = frappe.db.set_value("Customer",link.link_name,"nearest_company_warehouse_cf",value)
				# return 1
	# 			if warehouse:
	# 				return 1
	# 			else:
	# 				return 0
	# 		else:
	# 			return 0
	# else:
	# 	return 0

@frappe.whitelist(allow_guest=True)
def get_value(doctype,name,field):
	return frappe.db.get_value(doctype,name,field)




