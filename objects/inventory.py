import requests

class Inventory:
    API_URL = "http://localhost:3000/inventory"

    def __init__(self, InventoryID=None, ProductID=None, Quantity=None, Supplier=None, ReceivedDate=None, Remarks=None, rowguid=None):
        self.InventoryID = InventoryID
        self.ProductID = ProductID
        self.Quantity = Quantity
        self.Supplier = Supplier
        self.ReceivedDate = ReceivedDate
        self.Remarks = Remarks
        self.rowguid = rowguid

    def save_to_api(self):
        """Lưu inventory vào API."""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Inventory created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_inventory_by_id(InventoryID):
        """Lấy inventory từ API bằng InventoryID."""
        response = requests.get(f"{Inventory.API_URL}/{InventoryID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_inventory(InventoryID, updated_data):
        """Cập nhật thông tin inventory."""
        response = requests.put(f"{Inventory.API_URL}/{InventoryID}", json=updated_data)
        if response.status_code == 200:
            print("Inventory updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_inventory(InventoryID):
        """Xóa inventory khỏi hệ thống."""
        response = requests.delete(f"{Inventory.API_URL}/{InventoryID}")
        if response.status_code == 200:
            print("Inventory deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_inventory():
        """Lấy tất cả inventory từ API."""
        response = requests.get(Inventory.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_inventory_from_input(self):
        """Tạo inventory mới từ dữ liệu nhập."""
        InventoryID = input("InventoryID: ")
        ProductID = input("ProductID: ")
        Quantity = input("Quantity: ")
        Supplier = input("Supplier: ")
        ReceivedDate = input("ReceivedDate (YYYY-MM-DD): ")
        Remarks = input("Remarks: ")
        rowguid = input("rowguid: ")
        inventory = Inventory(InventoryID, ProductID, Quantity, Supplier, ReceivedDate, Remarks, rowguid)
        inventory.save_to_api()

    def update_inventory_from_input(InventoryID):
        """Cập nhật thông tin inventory từ dữ liệu nhập."""
        updated_data = {}
        updated_data['ProductID'] = input("ProductID: ") or None
        updated_data['Quantity'] = input("Quantity: ") or None
        updated_data['Supplier'] = input("Supplier: ") or None
        updated_data['ReceivedDate'] = input("ReceivedDate (YYYY-MM-DD): ") or None
        updated_data['Remarks'] = input("Remarks: ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        Inventory.update_inventory(InventoryID, updated_data)
