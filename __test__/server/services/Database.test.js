const MySQL = require('mysql2/promise');
const bcrypt = require('bcrypt');
const {
  getListLaptop,
  addLaptop,
  deleteLaptop,
  editLaptop,
  Login,
  Register
} = require('../../../server/services/Database');

jest.mock('mysql2/promise', () => {
  const queryMock = jest.fn();
  const releaseMock = jest.fn();
  return {
    createPool: () => ({
      getConnection: () => ({
        query: queryMock,
        release: releaseMock
      })
    })
  };
});

describe('Laptop CRUD operations', () => {
  let queryMock;
  let releaseMock;

  beforeEach(() => {
    queryMock = MySQL.createPool().getConnection().query;
    releaseMock = MySQL.createPool().getConnection().release;
    jest.clearAllMocks();
  });

  describe('getListLaptop', () => {
    it('should return laptop list', async () => {
      const mockQuery = [
        { id: 1, name: 'Titan 18 HX A14VX', price: 3000000, stock: 10, brand_id: 1 },
        { id: 2, name: 'MSI Bravo 15', price: 9000000, stock: 20, brand_id: 1 }
      ];
      queryMock.mockResolvedValue([mockQuery]);
      const result = await getListLaptop();
      expect(result).toEqual(mockQuery);
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(getListLaptop()).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });

  describe('addLaptop', () => {
    it('should successfully add laptop entry', async () => {
      const mockQuery = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 11,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0
      };
      queryMock.mockResolvedValue([mockQuery]);
      await addLaptop('MSI Bravo 15', 3000000, 10, 1);
      expect(queryMock).toHaveBeenCalled();
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(addLaptop('MSI Bravo 15', 3000000, 10, 1)).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });

  describe('editLaptop', () => {
    it('should return true when editing laptop entry', async () => {
      const mockQuery = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 11,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0
      };
      queryMock.mockResolvedValue([mockQuery]);
      await editLaptop(1, 'MSI Bravo 15', 3000000, 10, 1);
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(editLaptop(1, 'MSI Bravo 15', 3000000, 10, 1)).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });

  describe('deleteLaptop', () => {
    it('should return true when deleting laptop entry', async () => {
      const mockQuery = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 11,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0
      };
      queryMock.mockResolvedValue([mockQuery]);
      await deleteLaptop(1);
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(deleteLaptop(1)).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });
  describe('Login', () => {
    it('should return user data', async () => {
      const mockQuery = [
        {
          username: 'testing',
          password: bcrypt.hashSync('testingpassword', 10)
        }
      ];
      queryMock.mockResolvedValue([mockQuery]);
      const result = await Login('testing');
      expect(result).toEqual(mockQuery[0]);
      expect(releaseMock).toHaveBeenCalled();
    });
  });
  describe('Register', () => {
    it('should return user register', async () => {
      const mockQuery = {
        username: 'testing',
        password: bcrypt.hashSync('testingpassword', 10)
      };
      queryMock.mockResolvedValue([mockQuery]);
      await Register('testing', bcrypt.hashSync('testingpassword', 10));
      expect(releaseMock).toHaveBeenCalled();
    });
  });
});
