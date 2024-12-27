import requests

class Product:
    API_URL = "http://localhost:3000/productRoute"

    def __init__(self, ProductID=None, ProductName=None, Price=None, StockQuantity=None, rowguid=None):
        self.ProductID = ProductID
        self.ProductName = ProductName
        self.Price = Price
        self.StockQuantity = StockQuantity
        self.rowguid = rowguid

    def save_to_api(self):
        """Lưu product vào API."""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Product created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_product_by_id(ProductID):
        """Lấy product từ API bằng ProductID."""
        response = requests.get(f"{Product.API_URL}/{ProductID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_product(ProductID, updated_data):
        """Cập nhật thông tin product."""
        response = requests.put(f"{Product.API_URL}/{ProductID}", json=updated_data)
        if response.status_code == 200:
            print("Product updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_product(ProductID):
        """Xóa product khỏi hệ thống."""
        response = requests.delete(f"{Product.API_URL}/{ProductID}")
        if response.status_code == 200:
            print("Product deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_products():
        """Lấy tất cả product từ API."""
        response = requests.get(Product.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_product_from_input(self):
        """Tạo product mới từ dữ liệu nhập."""
        ProductID = input("ProductID: ")
        ProductName = input("ProductName: ")
        Price = input("Price: ")
        StockQuantity = input("StockQuantity: ")
        rowguid = input("rowguid: ")
        product = Product(ProductID, ProductName, Price, StockQuantity, rowguid)
        product.save_to_api()

    def update_product_from_input(ProductID):
        """Cập nhật thông tin product từ dữ liệu nhập."""
        updated_data = {}
        updated_data['ProductName'] = input("ProductName: ") or None
        updated_data['Price'] = input("Price: ") or None
        updated_data['StockQuantity'] = input("StockQuantity: ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        Product.update_product(ProductID, updated_data)
