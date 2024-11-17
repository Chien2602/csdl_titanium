import requests

class OrderItem:
    API_URL = "http://localhost:3000/orderItem"

    def __init__(self, OrderItemID=None, OrderID=None, ProductID=None, Quantity=None, Price=None, Discount=None,
                 TotalPrice=None, AddedAt=None, Notes=None, rowguid=None):
        self.OrderItemID = OrderItemID
        self.OrderID = OrderID
        self.ProductID = ProductID
        self.Quantity = Quantity
        self.Price = Price
        self.Discount = Discount
        self.TotalPrice = TotalPrice
        self.AddedAt = AddedAt
        self.Notes = Notes
        self.rowguid = rowguid

    def save_to_api(self):
        """Lưu item vào API."""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Order item created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_order_item_by_id(OrderItemID):
        """Lấy thông tin item từ API bằng OrderItemID."""
        response = requests.get(f"{OrderItem.API_URL}/{OrderItemID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_order_item(OrderItemID, updated_data):
        """Cập nhật thông tin item."""
        response = requests.put(f"{OrderItem.API_URL}/{OrderItemID}", json=updated_data)
        if response.status_code == 200:
            print("Order item updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_order_item(OrderItemID):
        """Xóa item khỏi hệ thống."""
        response = requests.delete(f"{OrderItem.API_URL}/{OrderItemID}")
        if response.status_code == 200:
            print("Order item deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_order_items():
        """Lấy tất cả các items từ API."""
        response = requests.get(OrderItem.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_order_item_from_input(self):
        """Tạo một item mới từ dữ liệu nhập."""
        OrderItemID = input("OrderItemID: ")
        OrderID = input("OrderID: ")
        ProductID = input("ProductID: ")
        Quantity = input("Quantity: ")
        Price = input("Price: ")
        Discount = input("Discount: ")
        TotalPrice = input("TotalPrice: ")
        AddedAt = input("AddedAt (YYYY-MM-DD): ")
        Notes = input("Notes: ")
        rowguid = input("rowguid: ")
        order_item = OrderItem(OrderItemID, OrderID, ProductID, Quantity, Price, Discount, TotalPrice, AddedAt, Notes, rowguid)
        order_item.save_to_api()

    def update_order_item_from_input(OrderItemID):
        """Cập nhật thông tin item từ dữ liệu nhập."""
        updated_data = {}
        updated_data['OrderID'] = input("OrderID: ") or None
        updated_data['ProductID'] = input("ProductID: ") or None
        updated_data['Quantity'] = input("Quantity: ") or None
        updated_data['Price'] = input("Price: ") or None
        updated_data['Discount'] = input("Discount: ") or None
        updated_data['TotalPrice'] = input("TotalPrice: ") or None
        updated_data['AddedAt'] = input("AddedAt (YYYY-MM-DD): ") or None
        updated_data['Notes'] = input("Notes: ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        OrderItem.update_order_item(OrderItemID, updated_data)
