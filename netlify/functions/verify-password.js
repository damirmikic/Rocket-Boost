exports.handler = async (event, context) => {
  // Allow only POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { password } = JSON.parse(event.body);
    const correctPassword = process.env.ACCESS_PASSWORD || 'rocketboost2026';

    if (password === correctPassword) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: true, token: 'authenticated-session-token' })
      };
    } else {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: false, error: 'Incorrect password' })
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: 'Bad Request'
    };
  }
};
