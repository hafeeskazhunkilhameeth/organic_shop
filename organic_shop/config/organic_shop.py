# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
    config = [
        {
            "label": _("Organic cart Settings"),
            "items": [
                {
                    "type": "doctype",
                    "name": "Organic Cart Settings",
                    "description": _("Organic Cart Settings."),
                    "onboard": 1,
                }
            ]
        }
    ]

    return config
