import requests

class ProductsInfo:
    API_URL = "http://localhost:3000/productInfoRoute"

    def __init__(self, ProductID=None, Description=None, Size=None, Category=None, Image=None, Brand=None, SupplierID=None, AddedAt=None, rowguid=None):
        self.ProductID = ProductID
        self.Description = Description
        self.Size = Size
        self.Category = Category
        self.Image = Image
        self.Brand = Brand
        self.SupplierID = SupplierID
        self.AddedAt = AddedAt
        self.rowguid = rowguid

    def save_to_api(self):
        """Lưu thông tin sản phẩm vào API."""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Product information created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_product_by_id(ProductID):
        """Lấy thông tin sản phẩm từ API bằng ProductID."""
        response = requests.get(f"{ProductsInfo.API_URL}/{ProductID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_product(ProductID, updated_data):
        """Cập nhật thông tin sản phẩm."""
        response = requests.put(f"{ProductsInfo.API_URL}/{ProductID}", json=updated_data)
        if response.status_code == 200:
            print("Product information updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_product(ProductID):
        """Xóa thông tin sản phẩm khỏi hệ thống."""
        response = requests.delete(f"{ProductsInfo.API_URL}/{ProductID}")
        if response.status_code == 200:
            print("Product information deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_products():
        """Lấy tất cả thông tin sản phẩm từ API."""
        response = requests.get(ProductsInfo.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_product_from_input(self):
        """Tạo thông tin sản phẩm mới từ dữ liệu nhập."""
        ProductID = input("ProductID: ")
        Description = input("Description: ")
        Size = input("Size: ")
        Category = input("Category: ")
        Image = input("Image URL: ")
        Brand = input("Brand: ")
        SupplierID = input("SupplierID: ")
        AddedAt = input("AddedAt (YYYY-MM-DD): ")
        rowguid = input("rowguid: ")
        product = ProductsInfo(ProductID, Description, Size, Category, Image, Brand, SupplierID, AddedAt, rowguid)
        product.save_to_api()

    def update_product_from_input(ProductID):
        """Cập nhật thông tin sản phẩm từ dữ liệu nhập."""
        updated_data = {}
        updated_data['Description'] = input("Description: ") or None
        updated_data['Size'] = input("Size: ") or None
        updated_data['Category'] = input("Category: ") or None
        updated_data['Image'] = input("Image URL: ") or None
        updated_data['Brand'] = input("Brand: ") or None
        updated_data['SupplierID'] = input("SupplierID: ") or None
        updated_data['AddedAt'] = input("AddedAt (YYYY-MM-DD): ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        ProductsInfo.update_product(ProductID, updated_data)
