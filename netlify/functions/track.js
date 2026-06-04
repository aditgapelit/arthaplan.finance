const { categoryTrend } = require('./_ai');

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
    const categoryName = String(payload.category_name || 'Kategori');
    const categoryHistory = Array.isArray(payload.category_history) ? payload.category_history : [];

    const trend = categoryTrend(categoryHistory, categoryName);

    return jsonResponse(200, {
      prediction: trend.value,
      message: trend.message,
    });
  } catch (error) {
    return jsonResponse(500, { error: 'Failed to generate track insights' });
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
