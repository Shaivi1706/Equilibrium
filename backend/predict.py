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
    input_values = list(map(float, sys.argv[1:]))  # Converting to float
    predicted_role = predict_role(input_values)
    print(json.dumps({"predicted_role": predicted_role}))