import frappe
import json


def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.item_group = frappe.get_all("Item Group",filters={"show_in_website":1,"is_group":0},fields=["name"])
    # context.item = frappe.get_all("Item",filters={"show_in_website":1},fields=["name","image","item_group"])
    context.item_result = get_items()

    return context

def get_items():
    result_items = []
    items = frappe.db.sql(""" select name,has_variants,item_group,website_warehouse,image from `tabItem` it where it.show_in_website = 1""",as_dict = 1)

    for item in items:
        if item.has_variants == 1:
            variant = frappe.db.sql("""select name,item_group,website_warehouse from `tabItem` it where it.variant_of = %s""",item.name,as_dict = 1)
            variant_list = []
            for var in variant:
                price = frappe.db.get_value("Item Price",{"item_code":var.name,"price_list":"Standard","selling":1},"price_list_rate")
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
            price = frappe.db.get_value("Item Price",{"item_code":item.name,"price_list":"Standard","selling":1},"price_list_rate")
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
    # frappe.throw(str(result_items))
    return result_items





