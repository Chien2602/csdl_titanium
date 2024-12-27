# import json

# from objects.users import User

# users = User.get_all_users()
# users = User.get_user_by_id('A001')
# User.delete_user("A001")
# User.create_user_from_input()
# User.update_user_from_input('A001')


import pyodbc
from pymongo import MongoClient
from decimal import Decimal

# Cấu hình kết nối SQL Server
sql_conn_str = "Driver={SQL Server};Server=ADMIN\\ADMIN_SQLSERVER;Database=QUANLYCUAHANGQUANAO;UID=sa;PWD=12345;"

# Cấu hình kết nối MongoDB
mongo_conn_str = "mongodb://localhost:27017/"
mongo_db_name = "CUAHANGQUANAO"

# Danh sách các bảng cần đồng bộ
tables = {
    "USERS": "SELECT * FROM dbo.USERS",
}

# Kết nối và truy vấn SQL Server
def fetch_sql_data(query):
    conn = pyodbc.connect(sql_conn_str)
    cursor = conn.cursor()
    cursor.execute(query)
    columns = [column[0] for column in cursor.description]
    data = [dict(zip(columns, row)) for row in cursor.fetchall()]
    conn.close()
    return data

# Hàm chuyển đổi Decimal thành float
def convert_decimals(data):
    for item in data:
        for key, value in item.items():
            if isinstance(value, Decimal):
                item[key] = float(value)  # Chuyển đổi Decimal sang float
    return data

# Chèn dữ liệu vào MongoDB
def insert_data_to_mongo(data, collection_name):
    client = MongoClient(mongo_conn_str)
    db = client[mongo_db_name]
    collection = db[collection_name]
    if data:  # Chỉ chèn nếu có dữ liệu
        data = convert_decimals(data)  # Chuyển đổi Decimal trước khi chèn
        collection.insert_many(data)
        print(f"Inserted {len(data)} documents into MongoDB collection '{collection_name}'")
    else:
        print(f"No data found for collection: {collection_name}")

# Đồng bộ hóa từng bảng
def sync_table(table_name, query):
    print(f"Syncing table: {table_name}...")
    data = fetch_sql_data(query)
    insert_data_to_mongo(data, table_name)

# Thực hiện các bước
if __name__ == "__main__":
    for table_name, query in tables.items():
        sync_table(table_name, query)
    print("Data sync completed!")