import frappe
import json
from erpnext.shopping_cart.cart import get_cart_quotation
from itertools import groupby

# def get_context(context):
# 	context.update(get_cart_quotation())


def get_context(context):
    # if frappe.session.user == 'Guest':
    #     frappe.local.flags.redirect_location = '/'
    #     raise frappe.Redirect

    context.session = frappe.session
    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.item_group = frappe.get_all('Item Group', filters={"show_in_website":1,"is_group":0}, fields=["name","weightage","route"], order_by='weightage desc')
    context.warehouse = frappe.get_all("Warehouse",filters={"show_in_website":1,"is_group":0},fields = ["name","warehouse_name"])
    context.cust_def_warehouse = check_warehouse()
    context.default_warehouse = frappe.db.get_value("Organic Cart Settings",None,"default_warehouse")
    
    # context.item = frappe.get_all("Item",filters={"show_in_website":1},fields=["name","image","item_group"])
    context.item_result = get_items()
    context.update(get_cart_quotation())
    context.no_cache = 1
    

    return context


def get_items():
    default_warehouse = ""
    if frappe.session.user == 'Guest':
        default_warehouse = frappe.db.get_value("Organic Cart Settings",None,"default_warehouse")
    else:
        warehouse = check_warehouse()
        default_warehouse = warehouse[0]

    warehouse = check_warehouse()
    result_items = []
    if default_warehouse != 2:
        items = frappe.db.sql(""" select name,stock_uom,item_name,route,has_variants,item_group,website_warehouse,image from `tabItem` it where it.show_in_website = 1 and it.is_sales_item = 1 and it.variant_of is null """,as_dict = 1)

        for item in items:
            if item.has_variants == 1:
                variant = frappe.db.sql("""select name,item_name,item_group,website_warehouse from `tabItem` it where it.variant_of = %s and it.show_variant_in_website = 1""",item.name,as_dict = 1)
                variant_list = []
                in_stock = 0
                for var in variant:
                    price = frappe.db.get_value("Item Price",{"item_code":var.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
                    stock = frappe.db.get_value("Bin",{"item_code":var.name,"warehouse":default_warehouse},"projected_qty")
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
                stock = frappe.db.get_value("Bin",{"item_code":item.name,"warehouse":default_warehouse},"projected_qty")
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
        # frappe.throw(str(result_items))

    return result_items

def check_warehouse():
    object = check_customer_or_supplier()
    if object[1]:
        customer_doc = frappe.get_doc("Customer",str(object[1]))
        warehouse = customer_doc.nearest_company_warehouse_cf
        # warehouse = frappe.db.get_value("Customer",str(object[1]),"nearest_company_warehouse_cf")
        if warehouse:
            return warehouse, frappe.db.get_value("Warehouse",warehouse,"warehouse_name")
        else:
            return 2,"Warehouse not Found"
    else:
        return 2,"Customer Not Found"


# def get_items():
#     object = check_customer_or_supplier()
#     warehouse = None
#     if object[1]:
#         warehouse = frappe.db.get_value("Customer",str(object[1]),"nearest_company_warehouse_cf")
#     if warehouse == None:
#         warehouse = frappe.db.get_value("Organic Cart Settings",None,"default_warehouse")
#     # frappe.throw(str(warehouse))

#     result_items = []
#     variant = []
#     items = frappe.db.sql(""" select 
#     it.name,
#     it.stock_uom,
#     it.item_name,
#     it.route,
#     it.has_variants,
#     it.variant_of,
#     it.item_group,
#     it.website_warehouse,
#     it.image,
#     bn.warehouse,
#     bn.projected_qty as stock,
#     ip.price_list_rate as price
#     from `tabItem` it inner join `tabBin` bn on it.name = bn.item_code inner join `tabItem Price` ip on it.name = ip.item_code 
#     where (it.show_in_website = 1 or it.show_variant_in_website = 1) and it.is_sales_item = 1 and ip.price_list = %s and ip.selling = 1 and bn.warehouse = %s""",(frappe.db.get_value("Shopping Cart Settings",None,"price_list"),warehouse),as_dict = 1)

#     for it in items:
#         if it.variant_of == None:
#             result_items.append({
#             "uom":it.stock_uom,
#             "route":it.route,
#             "has_variant":it.has_variants,
#             "item":it.name,
#             "item_name":it.item_name,
#             "image":it.image,
#             "variant":None,
#             "stock":it.stock,
#             "price":it.price,
#             "item_group":it.item_group,
#             "in_stock":1 if it.stock > 0 else 0,
#             "item_group_route":frappe.db.get_value("Item Group",it.item_group,"route")
#             })
#         else:
#             variant.append(it)

#     result_items = result_items + group_by_key(variant,'variant_of')
#     return result_items
	
    # def group_by_key(list_name,key):
    #     result = []
    #     for k,v in groupby(list_name,key=lambda x:x[key]):
    #         # print(k)
    #         if not any(d[key] == k for d in result):
    #             result.append({
    #                 key:k,
    #                 "has_variant":1,
    #                 "uom":frappe.db.get_value("Item",k,"stock_uom"),
    #                 "item_name":frappe.db.get_value("Item",k,"item_name"),
    #                 "image":frappe.db.get_value("Item",k,"image"),
    #                 "item_group":frappe.db.get_value("Item",k,"item_group"),
    #                 "item_group_route":frappe.db.get_value("Item Group",frappe.db.get_value("Item",k,"item_group"),"route"),
    #                 "route":frappe.db.get_value("Item",k,"route"),
    #                 "variants":list(v)
    #             })
    #         else:
    #             for res in result:
    #                 if res[key] == k:
    #                     res['variants'].append(list(v))
    #     return result

def check_customer_or_supplier():
    if frappe.session.user:
        contact_name = frappe.get_value("Contact", {"email_id": frappe.session.user})
        if contact_name:
            contact = frappe.get_doc('Contact', contact_name)
            for link in contact.links:
                if link.link_doctype in ('Customer', 'Supplier'):
                    return link.link_doctype, link.link_name

        return 'Customer', None

# def get_items(warehouse=None):
#     result_items = []
#     items = frappe.db.sql(""" select 
#     it.name,
#     it.stock_uom,
#     it.item_name,
#     it.route,
#     it.has_variants,
#     it.item_group,
#     it.website_warehouse,
#     it.image,
#     bn.warehouse,
#     bn.projected_qty,
#     ip.price_list_rate 
#     from `tabItem` it inner join `tabBin` bn on it.name = bn.item_code inner join `tabItem Price` ip on it.name = ip.item_code 
#     where it.show_in_website = 1 and it.is_sales_item = 1 and it.variant_of is null  and ip.price_list = %s and ip.selling = 1""",(frappe.db.get_value("Shopping Cart Settings",None,"price_list")),as_dict = 1)

#     for item in items:
#         if item.has_variants == 1:
#             variant = frappe.db.sql("""select name,item_name,item_group,website_warehouse from `tabItem` it where it.variant_of = %s and it.show_variant_in_website = 1""",item.name,as_dict = 1)
#             variant_list = []
#             in_stock = 0
#             for var in variant:
#                 price = frappe.db.get_value("Item Price",{"item_code":var.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
#                 stock = frappe.db.get_value("Bin",{"item_code":var.name,"warehouse":var.website_warehouse},"projected_qty")
#                 if stock != None and stock > 0:
#                     in_stock=1
                
#                 variant_list.append({
#                     "variant_name":var.item_name,
#                     "variant":var.name,
#                     "stock":stock,
#                     "price":price,
                    
#                 })
#             result_items.append({
                
#                 "route":item.route,
#                 "has_variant":item.has_variants,
#                 "item":item.name,
#                 "item_name":item.item_name,
#                 "image":item.image,
#                 "variant":variant_list,
#                 "item_group":item.item_group,
#                 "in_stock":in_stock,
#                 "item_group_route":frappe.db.get_value("Item Group",item.item_group,"route")
#             })
#         else:
#             in_stock = 0
#             price = frappe.db.get_value("Item Price",{"item_code":item.name,"price_list":frappe.db.get_value("Shopping Cart Settings",None,"price_list"),"selling":1},"price_list_rate")
#             stock = frappe.db.get_value("Bin",{"item_code":item.name,"warehouse":item.website_warehouse},"projected_qty")
#             if stock != None and stock > 0:
#                 in_stock=1
#             result_items.append({
#                 "uom":item.stock_uom,
#                 "route":item.route,
#                 "has_variant":item.has_variants,
#                 "item":item.name,
#                 "item_name":item.item_name,
#                 "image":item.image,
#                 "variant":None,
#                 "stock":stock,
#                 "price":price,
#                 "item_group":item.item_group,
#                 "in_stock":in_stock,
#                 "item_group_route":frappe.db.get_value("Item Group",item.item_group,"route")
#             })

#     return result_items




