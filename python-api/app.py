from __future__ import annotations

from flask import Flask, jsonify, request
from flask_cors import CORS

from src.model.inference import ArthaAIInference


app = Flask(__name__)
CORS(app)
inference = ArthaAIInference()


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/ai/dashboard")
def dashboard_insights():
    payload = request.get_json(silent=True) or {}
    income = float(payload.get("income", 0))
    expense = float(payload.get("expense", 0))
    active_goals = int(payload.get("active_goals", 0))
    total_goals = int(payload.get("total_goals", 0))
    expense_history = payload.get("expense_history", [])

    insights = inference.dashboard_insights(
        income=income,
        expense=expense,
        active_goals=active_goals,
        total_goals=total_goals,
        expense_history=expense_history,
    )

    prediction = inference.dashboard_prediction(expense_history)
    return jsonify(
        {
            "prediction": prediction.value,
            "prediction_message": prediction.message,
            "insights": insights,
        }
    )


@app.post("/api/ai/track")
def track_insights():
    payload = request.get_json(silent=True) or {}
    category_name = str(payload.get("category_name", "Kategori"))
    category_history = payload.get("category_history", [])

    trend = inference.category_trend(category_history, category_name)
    return jsonify(
        {
            "prediction": trend.value,
            "message": trend.message,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
