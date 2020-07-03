import frappe
def get_context(context):
    # if frappe.session.user == 'Guest':
    #     frappe.local.flags.redirect_location = '/'
    #     raise frappe.Redirect

    context.session = frappe.session
    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    # context.item_group = frappe.get_all('Item Group', filters={"show_in_website":1,"is_group":0}, fields=["name","weightage","route"], order_by='weightage desc')
    # context.warehouse = frappe.get_all("Warehouse",filters={"show_in_website":1,"is_group":0},fields = ["name","warehouse_name"])
    # context.cust_def_warehouse = check_warehouse()
    
    # # context.item = frappe.get_all("Item",filters={"show_in_website":1},fields=["name","image","item_group"])
    # context.item_result = get_items()
    # context.update(get_cart_quotation())
    # context.no_cache = 1

    return context