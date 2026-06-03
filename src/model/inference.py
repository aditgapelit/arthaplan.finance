from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Sequence

import numpy as np


@dataclass
class TrendPrediction:
    value: float | None
    message: str


class ArthaAIInference:
    """
    Backend-friendly inference helper that mirrors the lightweight frontend
    TensorFlow logic used in Dashboard and ArthaTrack.

    This does not load a persisted ML model. Instead, it fits a simple linear
    trend on the latest 3 observations and predicts the next point, matching
    the current UI behavior closely while keeping the implementation in Python.
    """

    def __init__(self) -> None:
        self._x = np.array([1.0, 2.0, 3.0], dtype=float)

    def predict_next_value(self, history: Sequence[float]) -> float | None:
        values = [float(item) for item in history if item is not None]
        if len(values) < 3:
            return None

        y = np.array(values[-3:], dtype=float)
        x = self._x

        x_mean = float(np.mean(x))
        y_mean = float(np.mean(y))
        denominator = float(np.sum((x - x_mean) ** 2))

        if denominator == 0:
            return None

        slope = float(np.sum((x - x_mean) * (y - y_mean)) / denominator)
        intercept = y_mean - slope * x_mean
        return float(slope * 4.0 + intercept)

    def dashboard_prediction(self, expenses: Sequence[float]) -> TrendPrediction:
        prediction = self.predict_next_value(expenses)
        if prediction is None:
            return TrendPrediction(None, "Belum cukup data untuk prediksi pengeluaran.")
        return TrendPrediction(prediction, f"Prediksi pengeluaran bulan depan: Rp {round(prediction):,}")

    def category_trend(self, category_history: Sequence[float], category_name: str) -> TrendPrediction:
        prediction = self.predict_next_value(category_history)
        if prediction is None:
            return TrendPrediction(None, f"Mulai catat pengeluaran agar tren {category_name} bisa dianalisis.")

        current = float(category_history[-1])
        if prediction > current * 1.1:
            message = f"Tren kenaikan pengeluaran terdeteksi pada {category_name}."
        else:
            message = f"Tren pengeluaran pada {category_name} saat ini relatif stabil."
        return TrendPrediction(prediction, message)

    def dashboard_insights(
        self,
        income: float,
        expense: float,
        active_goals: int,
        total_goals: int,
        expense_history: Sequence[float],
    ) -> List[str]:
        insights: List[str] = []
        prediction = self.predict_next_value(expense_history)

        if prediction is not None and prediction > income:
            insights.append(
                f"Prediksi pengeluaran bulan depan tinggi: Rp {round(prediction):,}."
            )

        if total_goals == 0:
            insights.append("Kamu belum punya target keuangan. Mulai buat satu!")
        elif active_goals == 0:
            insights.append("Semua target keuanganmu sudah tercapai!")
        else:
            insights.append(f"Kamu sedang mengejar {active_goals} target keuangan.")

        if income > 0:
            ratio = expense / income
            if ratio > 0.8:
                insights.append("Pengeluaranmu cukup tinggi (Boros).")
            elif ratio < 0.4:
                insights.append("Pengeluaranmu sangat hemat!")
            else:
                insights.append("Pengeluaranmu dalam kondisi stabil.")

        return insights


def _format_currency(value: float) -> str:
    return f"Rp {round(value):,}"


if __name__ == "__main__":
    inference = ArthaAIInference()

    dashboard = inference.dashboard_prediction([800000, 900000, 1000000])
    print(dashboard.message if dashboard.value is not None else dashboard.message)

    trend = inference.category_trend([350000, 420000, 500000], "Makanan")
    print(trend.message)

    insights = inference.dashboard_insights(
        income=5000000,
        expense=3200000,
        active_goals=2,
        total_goals=3,
        expense_history=[2500000, 2900000, 3200000],
    )
    for item in insights:
        print(item)
