import json

from objects.users import User

users = User.get_all_users()

print("All users:")
print(json.dumps(users, indent=4, ensure_ascii=False))
