# models.py
import requests


class User:
    API_URL = "http://localhost:3000/users"
    def __init__(self, UserID, Username, Password, Email, FullName=None, PhoneNumber=None, Ward=None, District=None, City=None, Role='customer', CreatedAt=None):
        # Đảm bảo các tên thuộc tính trùng khớp với cột trong bảng USERS
        self.UserID = UserID
        self.Username = Username
        self.Password = Password
        self.Email = Email
        self.FullName = FullName
        self.PhoneNumber = PhoneNumber
        self.Ward = Ward
        self.District = District
        self.City = City
        self.Role = Role
        self.CreatedAt = CreatedAt

    def save_to_api(self):
        """Gửi yêu cầu POST để tạo người dùng mới thông qua API"""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("User created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_user_by_id(UserID):
        """Lấy thông tin người dùng qua API"""
        response = requests.get(f"{User.API_URL}/{UserID}")
        if response.status_code == 200:
            # Giả sử API trả về một đối tượng người dùng dưới dạng từ điển
            user_data = response.json()
            return User(**user_data)  # Tạo đối tượng User từ dữ liệu trả về
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_user(UserID, updated_data):
        """Cập nhật thông tin người dùng qua API"""
        response = requests.put(f"{User.API_URL}/{UserID}", json=updated_data)
        if response.status_code == 200:
            print("User updated successfully!")
            return response.json()  # Trả về thông tin người dùng đã cập nhật
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_user(UserID):
        """Xóa người dùng qua API"""
        response = requests.delete(f"{User.API_URL}/{UserID}")
        if response.status_code == 200:
            print("User deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_users():
        """Lấy tất cả người dùng từ API"""
        response = requests.get(User.API_URL)
        if response.status_code == 200:
            users_data = response.json()
            return users_data
        else:
            print(f"Error: {response.status_code}")
            return []
