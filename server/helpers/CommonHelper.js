const Boom = require('boom');
const Fs = require('fs');
const Moment = require('moment');
const _ = require('lodash');
const Pino = require('pino')({
  level: process.env.LOG_LEVEL || 'info',
  base: null,
  formatters: {
    level: (label) => ({ level: label })
  },
  enabled: process.env.NODE_ENV !== 'test',
  redact: false
});

const log = (tags, data) => {
  const logs = { tags };
  if (data) {
    Object.assign(logs, { data });
  }
  if (!_.isEmpty(process.env.DISABLE_LOG)) {
    // eslint-disable-next-line no-console
    console.log(logs);
  } else {
    Pino.info(logs);
  }
};

const logRequest = (req, res) => {
  const timeDiff = process.hrtime(req.startTime);
  const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

  const logData = {
    _id: req.headers.transactionid,
    method: req.method,
    url: req.originalUrl || req.url,
    status: res.statusCode,
    timeTaken,
    transactionid: req?.headers?.transactionid,
    endpoint: req?.headers?.endpoint
  };

  return logData;
};

const unifyResponse = (request, response, body) => {
  try {
    const statusCode = body?.output?.statusCode || response.statusCode;
    const transactionId = request.headers.transactionid;

    const newResponse = {
      status: '00000',
      message: 'Success',
      data: body
    };

    // * Get error state from boom
    if (body.isBoom) {
      newResponse.status = body.output.statusCode;
      newResponse.message = body.output.payload.message;
      newResponse.error = body.output.payload.error;
      delete newResponse.data;
    }

    // add transaction id
    newResponse.transaction_id = transactionId;

    return {
      statusCode,
      bodyResponse: newResponse
    };
  } catch (err) {
    return {
      statusCode: 500,
      bodyResponse: 'Something went wrong'
    };
  }
};

const errorResponse = (error) => {
  if (error && error.output && error.output.payload && error.output.payload.statusCode) {
    const data = error.data && typeof error.data === 'string' ? error.data : null;

    if (error.data && typeof error.data === 'object') {
      switch (error.output.payload.statusCode) {
        case 400:
          return error;
        default:
          return Boom.badImplementation();
      }
    }

    switch (error.output.payload.statusCode) {
      case 422:
        return Boom.badData(error.output.payload.message, data);
      case 404:
        return Boom.notFound(error.output.payload.message, data);
      case 400:
        return Boom.badRequest(error.output.payload.message, data);
      case 401:
        return Boom.unauthorized(error.output.payload.message, data);
      default:
        return Boom.badImplementation();
    }
  }

  return Boom.badImplementation();
};

const __createTransactionId = () => {
  const appId = 'A302';
  const timeStamp = Moment().format('YYMMDDHHmmssSSS');
  const changeableDigit = '0';

  return [appId, timeStamp, changeableDigit].join('');
};

const preHandler = async (request, reply, next) => {
  request.startTime = process.hrtime();
  if (_.isEmpty(request.headers.transactionid)) {
    request.headers.transactionid = __createTransactionId();
  }

  next();
};

const readFromFile = (file, raw = false) =>
  new Promise((resolve, reject) => {
    Fs.readFile(file, (err, content) => {
      if (err) {
        return reject(err);
      }

      if (raw === false) {
        return resolve(JSON.parse(content));
      }

      return resolve(content);
    });
  });

module.exports = { log, logRequest, unifyResponse, errorResponse, preHandler, readFromFile };
