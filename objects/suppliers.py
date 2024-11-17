import requests

class Supplier:
    API_URL = "http://localhost:3000/supplier"

    def __init__(self, SupplierID=None, SupplierName=None, ContactName=None, ContactEmail=None, PhoneNumber=None,
                 Address=None, City=None, District=None, Ward=None, rowguid=None):
        self.SupplierID = SupplierID
        self.SupplierName = SupplierName
        self.ContactName = ContactName
        self.ContactEmail = ContactEmail
        self.PhoneNumber = PhoneNumber
        self.Address = Address
        self.City = City
        self.District = District
        self.Ward = Ward
        self.rowguid = rowguid

    def save_to_api(self):
        """Lưu supplier vào API."""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Supplier created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_supplier_by_id(SupplierID):
        """Lấy thông tin supplier từ API bằng SupplierID."""
        response = requests.get(f"{Supplier.API_URL}/{SupplierID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_supplier(SupplierID, updated_data):
        """Cập nhật thông tin supplier."""
        response = requests.put(f"{Supplier.API_URL}/{SupplierID}", json=updated_data)
        if response.status_code == 200:
            print("Supplier updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_supplier(SupplierID):
        """Xóa supplier khỏi hệ thống."""
        response = requests.delete(f"{Supplier.API_URL}/{SupplierID}")
        if response.status_code == 200:
            print("Supplier deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_suppliers():
        """Lấy tất cả các supplier từ API."""
        response = requests.get(Supplier.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_supplier_from_input(self):
        """Tạo một supplier mới từ dữ liệu nhập."""
        SupplierID = input("SupplierID: ")
        SupplierName = input("Supplier Name: ")
        ContactName = input("Contact Name: ")
        ContactEmail = input("Contact Email: ")
        PhoneNumber = input("Phone Number: ")
        Address = input("Address: ")
        City = input("City: ")
        District = input("District: ")
        Ward = input("Ward: ")
        rowguid = input("rowguid: ")
        supplier = Supplier(SupplierID, SupplierName, ContactName, ContactEmail, PhoneNumber, Address, City, District, Ward, rowguid)
        supplier.save_to_api()

    def update_supplier_from_input(SupplierID):
        """Cập nhật thông tin supplier từ dữ liệu nhập."""
        updated_data = {}
        updated_data['SupplierName'] = input("Supplier Name: ") or None
        updated_data['ContactName'] = input("Contact Name: ") or None
        updated_data['ContactEmail'] = input("Contact Email: ") or None
        updated_data['PhoneNumber'] = input("Phone Number: ") or None
        updated_data['Address'] = input("Address: ") or None
        updated_data['City'] = input("City: ") or None
        updated_data['District'] = input("District: ") or None
        updated_data['Ward'] = input("Ward: ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        Supplier.update_supplier(SupplierID, updated_data)
