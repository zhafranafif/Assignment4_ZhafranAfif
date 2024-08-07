const Redis = require('ioredis');
const { getKey, setKey, setWithExpire } = require('../../../server/services/Redis');

jest.mock('ioredis', () => {
  const connectMock = jest.fn();
  const disconnectMock = jest.fn();
  const getMock = jest.fn();
  const setMock = jest.fn();

  class RedisMock {
    constructor() {
      this.connect = connectMock;
      this.disconnect = disconnectMock;
      this.get = getMock;
      this.set = setMock;
      this.on = (event, callback) => {
        callback();
      };
    }
  }
  return RedisMock;
});

describe('Redis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getKey', () => {
    it('should return key value', async () => {
      const redisMock = new Redis();
      redisMock.get.mockResolvedValue('sampleValue');
      const result = await getKey('sampleKey');
      expect(result).toEqual('sampleValue');
      expect(redisMock.get).toHaveBeenCalledWith('sampleKey');
    });

    it('should return null on error', async () => {
      const redisMock = new Redis();
      redisMock.get.mockRejectedValue(new Error('Mock error'));
      const result = await getKey('sampleKey');
      expect(result).toEqual(null);
      expect(redisMock.get).toHaveBeenCalledWith('sampleKey');
    });
  });

  describe('setKey', () => {
    it('should set key value', async () => {
      const redisMock = new Redis();
      redisMock.set.mockResolvedValue('sampleValue');
      const result = await setKey('sampleKey', 'sampleValue');
      expect(result).toEqual('sampleValue');
      expect(redisMock.set).toHaveBeenCalledWith('sampleKey', 'sampleValue');
    });

    it('should return null on error', async () => {
      const redisMock = new Redis();
      redisMock.set.mockRejectedValue(new Error('Mock error'));
      const result = await setKey('sampleKey', 'sampleValue');
      expect(result).toEqual(null);
      expect(redisMock.set).toHaveBeenCalledWith('sampleKey', 'sampleValue');
    });
  });

  describe('setWithExpire', () => {
    it('should set key with expire', async () => {
      const redisMock = new Redis();
      redisMock.set.mockResolvedValue('sampleValue');
      const result = await setWithExpire('sampleKey', 'sampleValue', 10);
      expect(result).toEqual('sampleValue');
      expect(redisMock.set).toHaveBeenCalledWith('sampleKey', 'sampleValue', 'EX', 10);
    });

    it('should return null on error', async () => {
      const redisMock = new Redis();
      redisMock.set.mockRejectedValue(new Error('Mock error'));
      const result = await setWithExpire('sampleKey', 'sampleValue', 10);
      expect(result).toEqual(null);
      expect(redisMock.set).toHaveBeenCalledWith('sampleKey', 'sampleValue', 'EX', 10);
    });
  });
});
