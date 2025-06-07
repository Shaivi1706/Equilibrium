from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_values = data.get("input", [])

        # Run your predict.py script and pass values as arguments
        cmd = ["python3", "predict.py"] + list(map(str, input_values))
        result = subprocess.check_output(cmd).decode("utf-8")

        return jsonify({"prediction": result.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return "Model API is running"