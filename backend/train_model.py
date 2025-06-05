import pickle
import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# IT Role Mapping
it_role_mapping = {
    0: "Application Support Engineer", 1: "API Specialist",
    2: "Cyber Security Specialist", 3: "Database Administrator",
    4: "Business Analyst", 5: "Customer Service Executive",
    6: "Hardware Engineer", 7: "Information Security Specialist",
    8: "Data Scientist", 9: "Networking Engineer",
    10: "Helpdesk Engineer", 11: "Project Manager",
    12: "Graphics Designer", 13: "Software Tester",
    14: "Software Developer", 15: "AI ML Specialist",
    16: "Technical Writer"
}

# Training data (Dummy Data, replace with real dataset)
X_train = np.random.randint(0, 7, (200, 17))  # 200 samples, 17 skills (0-6 scale)
y_train = np.random.randint(0, 17, 200)  # 17 roles

# Model pipeline with feature scaling
model = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", SVC(kernel="linear"))
])

model.fit(X_train, y_train)

# Save model and role mapping
with open("backend/model.pkl", "wb") as f:
    pickle.dump((model, it_role_mapping), f)

print("Model trained and saved successfully!")
