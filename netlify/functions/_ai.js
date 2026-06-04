function toNumber(value) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function linearPredictNext(history) {
  const values = Array.isArray(history)
    ? history.map(toNumber).filter((value) => Number.isFinite(value))
    : [];

  if (values.length < 3) {
    return null;
  }

  const y = values.slice(-3);
  const x = [1, 2, 3];

  const xMean = x.reduce((sum, value) => sum + value, 0) / x.length;
  const yMean = y.reduce((sum, value) => sum + value, 0) / y.length;

  const denominator = x.reduce((sum, value) => sum + (value - xMean) ** 2, 0);
  if (denominator === 0) {
    return null;
  }

  const slope = x.reduce((sum, value, index) => sum + (value - xMean) * (y[index] - yMean), 0) / denominator;
  const intercept = yMean - slope * xMean;
  return slope * 4 + intercept;
}

function formatCurrency(value) {
  return `Rp ${Math.round(toNumber(value)).toLocaleString('id-ID')}`;
}

function dashboardPrediction(expenseHistory) {
  const prediction = linearPredictNext(expenseHistory);
  if (prediction === null) {
    return {
      value: null,
      message: 'Belum cukup data untuk prediksi pengeluaran.',
    };
  }

  return {
    value: prediction,
    message: `Prediksi pengeluaran bulan depan: ${formatCurrency(prediction)}`,
  };
}

function dashboardInsights({ income, expense, activeGoals, totalGoals, expenseHistory }) {
  const insights = [];
  const prediction = linearPredictNext(expenseHistory);

  if (prediction !== null && prediction > income) {
    insights.push(`Prediksi pengeluaran bulan depan tinggi: ${formatCurrency(prediction)}.`);
  }

  if (totalGoals === 0) {
    insights.push('Kamu belum punya target keuangan. Mulai buat satu!');
  } else if (activeGoals === 0) {
    insights.push('Semua target keuanganmu sudah tercapai!');
  } else {
    insights.push(`Kamu sedang mengejar ${activeGoals} target keuangan.`);
  }

  if (income > 0) {
    const ratio = expense / income;
    if (ratio > 0.8) {
      insights.push('Pengeluaranmu cukup tinggi (Boros).');
    } else if (ratio < 0.4) {
      insights.push('Pengeluaranmu sangat hemat!');
    } else {
      insights.push('Pengeluaranmu dalam kondisi stabil.');
    }
  }

  return insights;
}

function categoryTrend(categoryHistory, categoryName) {
  const prediction = linearPredictNext(categoryHistory);

  if (prediction === null) {
    return {
      value: null,
      message: `Mulai catat pengeluaran agar tren ${categoryName} bisa dianalisis.`,
    };
  }

  const current = toNumber(categoryHistory?.[categoryHistory.length - 1]);
  const message = prediction > current * 1.1
    ? `Tren kenaikan pengeluaran terdeteksi pada ${categoryName}.`
    : `Tren pengeluaran pada ${categoryName} saat ini relatif stabil.`;

  return {
    value: prediction,
    message,
  };
}

module.exports = {
  dashboardPrediction,
  dashboardInsights,
  categoryTrend,
};
