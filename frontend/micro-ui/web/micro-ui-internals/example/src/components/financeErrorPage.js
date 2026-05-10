module.exports = function financeErrorPage(errorCode) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Finance Service Unavailable</title>
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0; padding: 0;
          font-family: "Segoe UI", Arial, sans-serif;
          background: linear-gradient(135deg, #F7F8FA 0%, #EEF1F5 100%);
          display: flex; align-items: center; justify-content: center;
          height: 100vh; overflow: hidden;
        }
        .background-blur {
          position: absolute; width: 500px; height: 500px;
          background: rgba(216, 27, 96, 0.08); border-radius: 50%; filter: blur(100px);
        }
        .container {
          position: relative; width: 100%; max-width: 540px;
          background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px;
          padding: 52px 48px; text-align: center; boxShadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .status-badge {
          display: inline-block; padding: 6px 14px; border-radius: 999px;
          background: rgba(216, 27, 96, 0.12); color: #AD1457;
          font-size: 12px; font-weight: 600; letter-spacing: 1px; margin-bottom: 28px;
        }
        .icon-wrapper { position: relative; width: 100px; height: 100px; margin: 0 auto 24px; }
        .pulse-ring { position: absolute; inset: 0; border-radius: 50%; background: rgba(216, 27, 96, 0.12); animation: pulse 2s infinite; }
        .icon {
          position: relative; width: 100px; height: 100px; border-radius: 50%;
          background: linear-gradient(135deg, #D81B60, #AD1457);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 42px; font-weight: bold;
          box-shadow: 0 10px 30px rgba(173, 20, 87, 0.25);
        }
        .title { font-size: 28px; font-weight: 700; color: #222; margin-bottom: 18px; }
        .message { color: #666; line-height: 1.8; font-size: 15px; max-width: 420px; margin: 0 auto; }
        .details { margin-top: 18px; font-size: 13px; color: #999; letter-spacing: 0.5px; }
        .button {
          margin-top: 32px; background: linear-gradient(135deg, #D81B60, #AD1457);
          color: white; border: none; border-radius: 10px; padding: 14px 28px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.2s ease; box-shadow: 0 8px 20px rgba(173, 20, 87, 0.25);
        }
        .button:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(173, 20, 87, 0.3); }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      </style>
    </head>
    <body class="finance-error-page">
      <div class="background-blur"></div>
      <div class="container">
        <div class="status-badge">FINANCE SERVICE</div>
        <div class="icon-wrapper">
          <div class="pulse-ring"></div>
          <div class="icon">&#9921;</div>
        </div>
        <div class="title">Service Temporarily Unavailable</div>
        <div class="message">The Finance application is currently unreachable or undergoing maintenance. Please wait a few moments and retry.</div>
        <div class="details">${errorCode || "SERVICE_UNAVAILABLE"}</div>
        <button class="button" onclick="window.location.reload()">Retry Connection</button>
      </div>
    </body>
    </html>
  `;
};