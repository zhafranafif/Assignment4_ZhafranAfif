const express = require('express');
const dotenv = require('dotenv');
const Boom = require('boom');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const CommonHelper = require('./server/helpers/CommonHelper');

const app = express();
const port = process.env.PORT || 8080;

// Import Route
const anime = require('./server/api/anime');
const phonebook = require('./server/api/phonebook');
const phonebookV2 = require('./server/api/phonebookV2');
const laptop = require('./server/api/laptop');
// Middleware
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = async (data) => {
    res.send = oldSend; // set function back to avoid the 'double-send'
    const response = CommonHelper.unifyResponse(req, res, data);

    // Log Transaction
    const logData = CommonHelper.logRequest(req, response);

    CommonHelper.log(['API Request', 'info'], logData);
    return res.status(response.statusCode).send(response.bodyResponse); // just call as normal with data
  };

  next();
});

// Route middlewares
app.use('/api/v1/anime', anime);
app.use('/api/v1/phonebook', phonebook);
app.use('/api/v2/phonebook', phonebookV2);
app.use('/api', laptop);

app.get('/sys/ping', (req, res) => {
  req.startTime = process.hrtime();
  res.send('ok');
});

app.all('*', (req, res) => {
  res.status(404).send(Boom.notFound('No route matched with those values', {}));
});

app.listen(port, () => {
  CommonHelper.log(['Info'], `Server started on port ${port}`);
});
