

class OrderSystem:
    __instance = None

    _orders = {}

    @staticmethod
    def getInstance():
        """ Static access method. """
        if OrderSystem.__instance is None:
            OrderSystem()
        return OrderSystem.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if OrderSystem.__instance is not None:
            raise Exception("OrderSystem is a singleton. Use OrderSystem.getInstance() to get current instance.")
        else:
            OrderSystem.__instance = self

    def get_order(self, ID: int):
        if ID in OrderSystem._orders:
            return OrderSystem._orders[ID]
        else:
            return None

    def get_all_orders(self):
        return OrderSystem._orders.values()

    def get_active_orders(self):
        return [order for order in OrderSystem._orders.values() if order.is_active()]
