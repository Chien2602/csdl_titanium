import requests

class Employee:
    API_URL = "http://localhost:3000/employeeRoute"

    def __init__(self, EmployeeID=None, Salary=None, DayofBirth=None, rowguid=None):
        self.EmployeeID = EmployeeID
        self.Salary = Salary
        self.DayofBirth = DayofBirth
        self.rowguid = rowguid

    def save_to_api(self):
        """Lưu employee vào API."""
        response = requests.post(self.API_URL, json=self.__dict__)
        if response.status_code == 201:
            print("Employee created successfully!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

    @staticmethod
    def get_employee_by_id(EmployeeID):
        """Lấy employee từ API bằng EmployeeID."""
        response = requests.get(f"{Employee.API_URL}/{EmployeeID}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

    @staticmethod
    def update_employee(EmployeeID, updated_data):
        """Cập nhật thông tin employee."""
        response = requests.put(f"{Employee.API_URL}/{EmployeeID}", json=updated_data)
        if response.status_code == 200:
            print("Employee updated successfully!")
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None

    @staticmethod
    def delete_employee(EmployeeID):
        """Xóa employee khỏi hệ thống."""
        response = requests.delete(f"{Employee.API_URL}/{EmployeeID}")
        if response.status_code == 200:
            print("Employee deleted successfully!")
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

    @staticmethod
    def get_all_employees():
        """Lấy tất cả employee từ API."""
        response = requests.get(Employee.API_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return []

    def create_employee_from_input(self):
        """Tạo employee mới từ dữ liệu nhập."""
        EmployeeID = input("EmployeeID: ")
        Salary = input("Salary: ")
        DayofBirth = input("Day of Birth (YYYY-MM-DD): ")
        rowguid = input("rowguid: ")
        employee = Employee(EmployeeID, Salary, DayofBirth, rowguid)
        employee.save_to_api()

    def update_employee_from_input(EmployeeID):
        """Cập nhật thông tin employee từ dữ liệu nhập."""
        updated_data = {}
        updated_data['Salary'] = input("Salary: ") or None
        updated_data['DayofBirth'] = input("Day of Birth (YYYY-MM-DD): ") or None
        updated_data['rowguid'] = input("rowguid: ") or None
        updated_data = {k: v for k, v in updated_data.items() if v}
        Employee.update_employee(EmployeeID, updated_data)
