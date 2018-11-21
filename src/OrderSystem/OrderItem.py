from OrderSystem.MenuItem import Menu_Item


class OrderItem:

    def __init__(self, menu_item: Menu_Item=None, quantity: int=0):
        self.Quantity = quantity
        self.ItemPrice = 0.00
        self.TotalPrice = 0.00
        self.MenuItem = None
        self.set_menu_item(menu_item)

    def calc_total(self):
        self.TotalPrice = self.ItemPrice * self.Quantity
        return self.TotalPrice

    def set_menu_item(self, menu_item: Menu_Item):
        if menu_item is None:
            print('Throw exception: Invalid argument menu_item')
            return
        self.MenuItem = menu_item
        self.ItemPrice = menu_item.price
        # self.ItemPrice = menu_item.Price
        self.calc_total()


def _test_order_item():
    expected_item_price = 4.99
    expected_item_id = 6
    expected_item_name = 'Herring'
    expected_item_desc = 'A kippered fish, goes well with nothing.'

    mi = Menu_Item(expected_item_id, expected_item_name, expected_item_desc, expected_item_price)
    # mi = Menu_Item(expected_item_id, expected_item_name, , expected_item_price)

    order_item = OrderItem(mi, 4)

    actual_item_price = order_item.ItemPrice
    if actual_item_price != order_item.ItemPrice:
        print('Unexpected order item price', actual_item_price, 'expected', expected_item_price)

    actual_quantity = order_item.Quantity
    if actual_quantity != 4:
        print('Unexpected quantity', actual_quantity, 'expected 4')

    expected_total = 19.96

    actual_value = order_item.TotalPrice
    if actual_value != expected_total:
        print('Unexpected TotalPrice set', actual_value, 'expected TotalPrice', expected_total)
    else:
        print('TotalPrice ok')

    actual_value = order_item.calc_total()
    if actual_value != expected_total:
        print('Unexpected response value', actual_value, 'expected response', expected_total)
    else:
        print('response ok')


if __name__ == '__main__':
    _test_order_item()
