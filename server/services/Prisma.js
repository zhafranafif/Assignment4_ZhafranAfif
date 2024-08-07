const { PrismaClient } = require('@prisma/client');

const CommonHelper = require('../helpers/CommonHelper');

const prisma = new PrismaClient();

const getListLaptopV2 = async () => {
  try {
    const timeStart = process.hrtime();
    const data = await prisma.laptop.findMany();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', 'getListLaptopV2', 'INFO'], {
      message: { timeTaken },
      data
    });
    await prisma.$disconnect();
    return data;
  } catch (error) {
    CommonHelper.log(['Database', 'getListLaptopV2', 'ERROR'], {
      message: `${error}`
    });
    await prisma.$disconnect();
    throw error;
  }
};

const addLaptopV2 = async (name, price, stock, brandId) => {
  try {
    const timeStart = process.hrtime();
    const data = await prisma.laptop.create({
      data: {
        name,
        price,
        stock,
        brand_id: brandId
      }
    });
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', 'addLaptopV2', 'INFO'], {
      message: { timeTaken },
      data
    });
  } catch (error) {
    CommonHelper.log(['Prisma', 'addLaptopV2', 'ERROR'], {
      message: `${error}`
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const editLaptopV2 = async (id, name, price, stock, brandId) => {
  try {
    const timeStart = process.hrtime();
    const data = await prisma.laptop.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        price,
        stock,
        brand_id: brandId
      }
    });
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', 'editLaptopV2', 'INFO'], {
      message: { timeTaken },
      data
    });
    await prisma.$disconnect();
    return true;
  } catch (error) {
    await prisma.$disconnect();
    if (error?.code === 'P2025') {
      // Handle the case where the record is not found
      CommonHelper.log(['Prisma', 'editLaptopV2', 'WARN'], {
        message: `No laptop entry found with id ${id}`
      });
      return false;
    }

    // Log other errors
    CommonHelper.log(['Prisma', 'editLaptop', 'ERROR'], {
      message: `${error}`
    });
    throw error;
  }
};

const deleteLaptopV2 = async (id) => {
  try {
    const timeStart = process.hrtime();
    const data = await prisma.laptop.delete({
      where: {
        id: Number(id)
      }
    });
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', 'deleteLaptop', 'INFO'], {
      message: { timeTaken },
      data
    });
    await prisma.$disconnect();
    return true;
  } catch (error) {
    await prisma.$disconnect();
    if (error?.code === 'P2025') {
      // Handle the case where the record is not found
      CommonHelper.log(['Prisma', 'deleteLaptopV2', 'WARN'], {
        message: `No laptop entry found with id ${id}`
      });
      return false;
    }

    // Log other errors
    CommonHelper.log(['Prisma', 'deleteLaptopV2', 'ERROR'], {
      message: `${error}`
    });
    throw error;
  }
};

module.exports = {
  getListLaptopV2,
  addLaptopV2,
  editLaptopV2,
  deleteLaptopV2
};
