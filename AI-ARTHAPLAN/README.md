## `ArthaPlanner (Goal Prediction)` 

## `## Deskripsi` 

```
Model Deep Learning untuk memprediksi `Desired Savings` dan estimasi waktu
pencapaian target keuangan pengguna.
```

## `## File Utama` 

- ``notebooks/ArthaGoal_Prediction_Model.ipynb` → Notebook training lengkap` 

- ``models/goal_prediction_model.keras` → Model TensorFlow (.keras)` 

- ``models/goal_scaler.pkl` → Scaler untuk preprocessing` 

- ``scripts/inference.py` → Script inference siap produksi` 

```
## Teknologi yang Digunakan
```

- `TensorFlow Functional API` 

- `Custom Callback (`GoalPredictionCallback`)` 

- `TensorBoard untuk monitoring training` 

- `StandardScaler dari scikit-learn` 

```
## Cara Menggunakan (Inference)
```

```
```python
```

```
from scripts.inference import ArthaGoalPredictor
```

```
predictor = ArthaGoalPredictor()
```

```
# Contoh input (14 fitur)
```

```
data = [45000, 35, 1, 10000, 0, 2000, 5000, 2000, 500, 200, 500, 100, 0, 100]
```

```
result = predictor.predict(data)
print(f"Prediksi Desired Savings: Rp {result:,.2f}")
```

