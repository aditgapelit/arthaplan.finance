
import numpy as np
import tensorflow as tf
import joblib
import pandas as pd

class ArthaGoalPredictor:
    def __init__(self, model_path='goal_prediction_model.keras', scaler_path='goal_scaler.pkl'):
        self.model = tf.keras.models.load_model(model_path)
        self.scaler = joblib.load(scaler_path)
        self.features = ['Income', 'Age', 'Dependents', 'Rent', 'Loan_Repayment',
                        'Insurance', 'Groceries', 'Transport', 'Eating_Out',
                        'Entertainment', 'Utilities', 'Healthcare', 'Education',
                        'Miscellaneous']

    def predict(self, data_list):
        df_input = pd.DataFrame([data_list], columns=self.features)
        input_scaled = self.scaler.transform(df_input)
        prediction = self.model.predict(input_scaled, verbose=0)
        return float(prediction[0][0])

# Test
if __name__ == '__main__':
    predictor = ArthaGoalPredictor()
    sample = [45000, 35, 1, 10000, 0, 2000, 5000, 2000, 500, 200, 500, 100, 0, 100]
    result = predictor.predict(sample)
    print(f'Prediksi Desired Savings: Rp {result:,.2f}')
