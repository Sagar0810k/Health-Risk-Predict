from flask import Flask, render_template, request
import numpy as np
from model_loader import load_model

app = Flask(__name__)
model = load_model()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_features = [
            1,
            float(request.form['age']),
            float(request.form['height']),
            float(request.form['weight']),
            float(request.form['ap_hi']),
            float(request.form['ap_lo']),
            float(request.form['cholesterol']),
            float(request.form['gluc']),
            float(request.form['smoke']),
            float(request.form['alco']),
            float(request.form['gender']),  
            float(request.form['active']), 
        ]
        input_array = np.array([input_features])
        prediction = model.predict(input_array)[0][0]
        result = "Health Risk Detected ⚠️" if prediction > 0.5 else "No Risk Detected✅"
        return render_template('result.html', prediction=result)
    except Exception as e:
        return f"Error occurred: {e}"

if __name__ == '__main__':
    app.run(debug=True)
