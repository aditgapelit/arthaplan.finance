const { dashboardPrediction, dashboardInsights } = require('./_ai');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    const income = Number(payload.income || 0);
    const expense = Number(payload.expense || 0);
    const activeGoals = Number(payload.active_goals || 0);
    const totalGoals = Number(payload.total_goals || 0);
    const expenseHistory = Array.isArray(payload.expense_history) ? payload.expense_history : [];

    const prediction = dashboardPrediction(expenseHistory);
    const insights = dashboardInsights({
      income,
      expense,
      activeGoals,
      totalGoals,
      expenseHistory,
    });

    return jsonResponse(200, {
      prediction: prediction.value,
      prediction_message: prediction.message,
      insights,
    });
  } catch (error) {
    return jsonResponse(500, { error: 'Failed to generate dashboard insights' });
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}
