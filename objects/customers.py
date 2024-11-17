import requests

class Customer:
    API_URL = "http://localhost:3000/customer"

    def __init__(self, CustomerID=None, LoyaltyPoints=None, rowguid=None):
        self.CustomerID = CustomerID
        self.LoyaltyPoints = LoyaltyPoints
        self.rowguid = rowguid

    def save_to_api(self):
        """Lưu customer vào API."""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Customer created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_customer_by_id(CustomerID):
        """Lấy customer từ API bằng CustomerID."""
        response = requests.get(f"{Customer.API_URL}/{CustomerID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_customer(CustomerID, updated_data):
        """Cập nhật thông tin customer."""
        response = requests.put(f"{Customer.API_URL}/{CustomerID}", json=updated_data)
        if response.status_code == 200:
            print("Customer updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_customer(CustomerID):
        """Xóa customer khỏi hệ thống."""
        response = requests.delete(f"{Customer.API_URL}/{CustomerID}")
        if response.status_code == 200:
            print("Customer deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_customers():
        """Lấy tất cả customer từ API."""
        response = requests.get(Customer.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_customer_from_input(self):
        """Tạo customer mới từ dữ liệu nhập."""
        CustomerID = input("CustomerID: ")
        LoyaltyPoints = input("LoyaltyPoints: ")
        rowguid = input("rowguid: ")
        customer = Customer(CustomerID, LoyaltyPoints, rowguid)
        customer.save_to_api()

    def update_customer_from_input(CustomerID):
        """Cập nhật thông tin customer từ dữ liệu nhập."""
        updated_data = {}
        updated_data['LoyaltyPoints'] = input("LoyaltyPoints: ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        Customer.update_customer(CustomerID, updated_data)
