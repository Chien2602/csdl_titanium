import requests

class User:
    API_URL = "http://localhost:3000/users"

    def __init__(self, UserID=None, Username=None, Password=None, Email=None, FullName=None, PhoneNumber=None,
                 Ward=None, District=None, City=None, Role='customer', CreatedAt=None):
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
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("User created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_user_by_id(UserID):
        response = requests.get(f"{User.API_URL}/{UserID}")
        if response.status_code == 200:
            user_data = response.json()
            return  user_data
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_user(UserID, updated_data):
        response = requests.put(f"{User.API_URL}/{UserID}", json=updated_data)
        if response.status_code == 200:
            print("User updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_user(UserID):
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
        response = requests.get(User.API_URL)
        if response.status_code == 200:
            users_data = response.json()
            return users_data
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_user_from_input(self):
        UserID = input("UserID: ")
        Username = input("Username: ")
        Password = input("Password: ")
        Email = input("Email: ")
        FullName = input("Full Name: ")
        PhoneNumber = input("Phone Number: ")
        Ward = input("Ward: ")
        District = input("District: ")
        City = input("City: ")
        Role = input("Role (default: customer): ") or 'customer'
        user = User(UserID, Username, Password, Email, FullName, PhoneNumber, Ward, District, City, Role)
        user.save_to_api()

    def update_user_from_input(UserID):
        updated_data = {}
        updated_data['Username'] = input("Username: ") or None
        updated_data['Password'] = input("Password: ") or None
        updated_data['Email'] = input("Email: ") or None
        updated_data['FullName'] = input("Full Name: ") or None
        updated_data['PhoneNumber'] = input("Phone Number: ") or None
        updated_data['Ward'] = input("Ward: ") or None
        updated_data['District'] = input("District: ") or None
        updated_data['City'] = input("City: ") or None
        updated_data['Role'] = input("Role: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        User.update_user(UserID, updated_data)