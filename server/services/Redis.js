const Redis = require('ioredis');
const CommonHelper = require('../helpers/CommonHelper');

const redisServer = process.env.REDIS_SERVER || '127.0.0.1:6379';

const redisClient = new Redis(redisServer);

redisClient.on('connect', () => {
  CommonHelper.log(['Redis', 'Redis Session client', 'Connected', 'info']);
});

redisClient.on('error', (err) => {
  CommonHelper.log(['Redis', 'Redis Session client', 'error'], { message: `${err}` });
  redisClient.disconnect();
});

const getKey = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data;
  } catch (error) {
    CommonHelper.log(['Redis', 'getKey', 'ERROR'], { message: `${error}` });
    return null;
  }
};

const setKey = async (key, value) => {
  try {
    const data = await redisClient.set(key, value);
    return data;
  } catch (error) {
    CommonHelper.log(['Redis', 'setKey', 'ERROR'], { message: `${error}` });
    return null;
  }
};

const setWithExpire = async (key, value, expire) => {
  try {
    const data = await redisClient.set(key, value, 'EX', expire);
    return data;
  } catch (error) {
    CommonHelper.log(['Redis', 'setWithExpire', 'ERROR'], { message: `${error}` });
    return null;
  }
};

module.exports = {
  getKey,
  setKey,
  setWithExpire
};
