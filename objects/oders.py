import requests

class Order:
    API_URL = "http://localhost:3000/order"

    def __init__(self, OrderID=None, CustomerID=None, OrderDate=None, TotalAmount=None, Status=None, rowguid=None):
        self.OrderID = OrderID
        self.CustomerID = CustomerID
        self.OrderDate = OrderDate
        self.TotalAmount = TotalAmount
        self.Status = Status
        self.rowguid = rowguid

    def save_to_api(self):
        """Lưu đơn hàng vào API."""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Order created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_order_by_id(OrderID):
        """Lấy thông tin đơn hàng từ API bằng OrderID."""
        response = requests.get(f"{Order.API_URL}/{OrderID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_order(OrderID, updated_data):
        """Cập nhật thông tin đơn hàng."""
        response = requests.put(f"{Order.API_URL}/{OrderID}", json=updated_data)
        if response.status_code == 200:
            print("Order updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_order(OrderID):
        """Xóa đơn hàng khỏi hệ thống."""
        response = requests.delete(f"{Order.API_URL}/{OrderID}")
        if response.status_code == 200:
            print("Order deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_orders():
        """Lấy tất cả đơn hàng từ API."""
        response = requests.get(Order.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_order_from_input(self):
        """Tạo đơn hàng mới từ dữ liệu nhập."""
        OrderID = input("OrderID: ")
        CustomerID = input("CustomerID: ")
        OrderDate = input("OrderDate (YYYY-MM-DD): ")
        TotalAmount = input("TotalAmount: ")
        Status = input("Status: ")
        rowguid = input("rowguid: ")
        order = Order(OrderID, CustomerID, OrderDate, TotalAmount, Status, rowguid)
        order.save_to_api()

    def update_order_from_input(OrderID):
        """Cập nhật thông tin đơn hàng từ dữ liệu nhập."""
        updated_data = {}
        updated_data['CustomerID'] = input("CustomerID: ") or None
        updated_data['OrderDate'] = input("OrderDate (YYYY-MM-DD): ") or None
        updated_data['TotalAmount'] = input("TotalAmount: ") or None
        updated_data['Status'] = input("Status: ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        Order.update_order(OrderID, updated_data)
