import requests

class Admin:
    API_URL = "http://localhost:3000/adminRoute"

    def __init__(self, AdminID=None, DayofBirth=None, rowguid=None):
        self.AdminID = AdminID
        self.DayofBirth = DayofBirth
        self.rowguid = rowguid

    def save_to_api(self):
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Admin created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_admin_by_id(AdminID):
        response = requests.get(f"{Admin.API_URL}/{AdminID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_admin(AdminID, updated_data):
        response = requests.put(f"{Admin.API_URL}/{AdminID}", json=updated_data)
        if response.status_code == 200:
            print("Admin updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_admin(AdminID):
        response = requests.delete(f"{Admin.API_URL}/{AdminID}")
        if response.status_code == 200:
            print("Admin deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_admins():
        response = requests.get(Admin.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_admin_from_input(self):
        AdminID = input("AdminID: ")
        DayofBirth = input("Day of Birth (YYYY-MM-DD): ")
        rowguid = input("rowguid: ")
        admin = Admin(AdminID, DayofBirth, rowguid)
        admin.save_to_api()

    def update_admin_from_input(AdminID):
        updated_data = {}
        updated_data['DayofBirth'] = input("Day of Birth (YYYY-MM-DD): ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        Admin.update_admin(AdminID, updated_data)
