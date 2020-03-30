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
