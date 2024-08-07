const { PrismaClient } = require('@prisma/client');
const { getListLaptopV2, addLaptopV2, deleteLaptopV2, editLaptopV2 } = require('../../../server/services/Prisma');

jest.mock('@prisma/client', () => {
  const findManyMock = jest.fn();
  const createMock = jest.fn();
  const updateMock = jest.fn();
  const deleteMock = jest.fn();
  class PrismaClientMock {
    constructor() {
      this.laptop = {
        findMany: findManyMock,
        create: createMock,
        update: updateMock,
        delete: deleteMock
      };
      this.$disconnect = () => {};
    }
  }
  return {
    PrismaClient: PrismaClientMock
  };
});
describe('Prisma-based Laptop CRUD operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getListLaptop', () => {
    it('should return laptop list', async () => {
      const mockData = [
        { id: 1, name: 'Titan 18 HX A14VX', price: 3000000, stock: 10, brand_id: 1 },
        { id: 2, name: 'MSI Bravo 15', price: 9000000, stock: 20, brand_id: 1 }
      ];

      const prismaMock = new PrismaClient();
      prismaMock.laptop.findMany.mockResolvedValue(mockData);

      const result = await getListLaptopV2();

      expect(result).toEqual(mockData);
      expect(prismaMock.laptop.findMany).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      const prismaMock = new PrismaClient();
      prismaMock.laptop.findMany.mockRejectedValue(mockError);

      await expect(getListLaptopV2()).rejects.toThrow(mockError);
      expect(prismaMock.laptop.findMany).toHaveBeenCalled();
    });
  });

  describe('addLaptop', () => {
    it('should successfully add laptop entry', async () => {
      const prismaMock = new PrismaClient();
      prismaMock.laptop.create.mockResolvedValue('success');
      await addLaptopV2('MSI Bravo 15', 3000000, 10, 1);
      expect(prismaMock.laptop.create).toHaveBeenCalled();
    });
    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      const prismaMock = new PrismaClient();
      prismaMock.laptop.create.mockRejectedValue(mockError);
      await expect(addLaptopV2('MSI Bravo 15', 3000000, 10, 1)).rejects.toThrow(mockError);
      expect(prismaMock.laptop.create).toHaveBeenCalled();
    });
  });

  describe('editLaptop', () => {
    it('should successfully edit laptop entry', async () => {
      const prismaMock = new PrismaClient();
      prismaMock.laptop.update.mockResolvedValue({
        id: 1,
        name: 'MSI Bravo 15',
        price: 3000000,
        stock: 10,
        brand_id: 1
      });
      await editLaptopV2(1, 'MSI Bravo 15', 3000000, 10, 1);
      expect(prismaMock.laptop.update).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = { code: 'P2025' };
      const prismaMock = new PrismaClient();
      prismaMock.laptop.update.mockRejectedValue(mockError);
      const result = await editLaptopV2(1, 'MSI Bravo 15', 3000000, 10, 1);
      expect(result).toBe(false);
      expect(prismaMock.laptop.update).toHaveBeenCalled();
    });
    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      const prismaMock = new PrismaClient();
      prismaMock.laptop.update.mockRejectedValue(mockError);
      await expect(editLaptopV2(1, 'MSI Bravo 15', 3000000, 10, 1)).rejects.toThrow(mockError);
      expect(prismaMock.laptop.update).toHaveBeenCalled();
    });
  });

  describe('deleteLaptop', () => {
    it('should successfully delete laptop entry', async () => {
      const prismaMock = new PrismaClient();
      prismaMock.laptop.delete.mockResolvedValue({
        id: 1,
        name: 'MSI Bravo 15',
        price: 3000000,
        stock: 10,
        brand_id: 1
      });
      await deleteLaptopV2(1);
      expect(prismaMock.laptop.delete).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = { code: 'P2025' };
      const prismaMock = new PrismaClient();
      prismaMock.laptop.delete.mockRejectedValue(mockError);
      const result = await deleteLaptopV2(1);
      expect(result).toBe(false);
      expect(prismaMock.laptop.delete).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      const prismaMock = new PrismaClient();
      prismaMock.laptop.delete.mockRejectedValue(mockError);
      await expect(deleteLaptopV2(1)).rejects.toThrow(mockError);
      expect(prismaMock.laptop.delete).toHaveBeenCalled();
    });
  });
});
