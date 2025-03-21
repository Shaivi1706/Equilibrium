# # import pickle
# # import numpy as np
# # import sys

# # # Load the trained model and role mapping
# # with open("backend/model.pkl", "rb") as f:
# #     model, it_role_mapping = pickle.load(f)

# # def predict_role(input_values, allowed_roles=None):
# #     """
# #     Predicts job role based on input skills and filters.
    
# #     allowed_roles: List of roles the user wants (e.g., ["Data Scientist", "Software Developer"]).
# #     """
# #     input_array = np.array(input_values).reshape(1, -1)

# #     # Get the predicted role index
# #     predicted_role_index = model.predict(input_array)[0]
# #     predicted_role = it_role_mapping.get(predicted_role_index, "Unknown Role")

# #     # If filters are applied, check if predicted role is allowed
# #     if allowed_roles and predicted_role not in allowed_roles:
# #         return "No matching role found based on filters"

# #     return predicted_role

# # if __name__ == "__main__":
# #     input_values = list(map(float, sys.argv[1:-1]))  # Last argument is filters
# #     allowed_roles = sys.argv[-1].split(",") if sys.argv[-1] != "None" else None

# #     predicted_role = predict_role(input_values, allowed_roles)
# #     print(predicted_role)


# import pickle
# import numpy as np
# import json
# import sys

# # Load trained model and role mapping
# with open("backend/model.pkl", "rb") as f:
#     model, it_role_mapping = pickle.load(f)

# def predict_role(input_values):
#     input_array = np.array(input_values).reshape(1, -1)
#     predicted_role_index = model.predict(input_array)[0]
#     predicted_role = it_role_mapping.get(predicted_role_index, "Unknown Role")
#     return predicted_role

# if __name__ == "__main__":
#     input_values = list(map(float, sys.argv[1:-1]))  # Convert to float
#     allowed_roles = sys.argv[-1].split(",") if sys.argv[-1] != "None" else None
#     predicted_role = predict_role(input_values)
#     print(json.dumps({"predicted_role": predicted_role}))

import pickle
import numpy as np
import json
import sys

# Load trained model and role mapping
with open("backend/model.pkl", "rb") as f:
    model, it_role_mapping = pickle.load(f)

def predict_role(input_values):
    input_array = np.array(input_values).reshape(1, -1)
    predicted_role_index = model.predict(input_array)[0]
    predicted_role = it_role_mapping.get(predicted_role_index, "Unknown Role")
    return predicted_role

if __name__ == "__main__":
    input_values = list(map(float, sys.argv[1:]))  # Convert to float
    predicted_role = predict_role(input_values)
    print(json.dumps({"predicted_role": predicted_role}))