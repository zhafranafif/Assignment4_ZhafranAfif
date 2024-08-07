const express = require('express');
const CommonHelper = require('./CommonHelper');

const app = express();
const createTestServer = (path, plugin) => {
  // Middleware
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true
    })
  );

  app.use((req, res, next) => {
    const oldSend = res.send;
    res.send = async (data) => {
      res.send = oldSend; // set function back to avoid the 'double-send'
      const response = await CommonHelper.unifyResponse(req, res, data);

      // Log Transaction
      const logData = CommonHelper.logRequest(req, response);

      CommonHelper.log(['API Request', 'info'], logData);
      return res.status(response.statusCode).send(response.bodyResponse); // just call as normal with data
    };

    next();
  });

  app.use(path, plugin);

  return app.listen(null, () => {});
};

module.exports = { createTestServer };
