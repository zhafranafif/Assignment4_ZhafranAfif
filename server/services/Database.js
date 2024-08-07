const MySQL = require('mysql2/promise');
const bcrypt = require('bcrypt');
const CommonHelper = require('../helpers/CommonHelper');

const connectionPool = MySQL.createPool({
  host: process.env.MYSQL_CONFIG_HOST || 'localhost',
  user: process.env.MYSQL_CONFIG_USER || 'root',
  password: process.env.MYSQL_CONFIG_PASSWORD || 'password',
  database: process.env.MYSQL_CONFIG_DATABASE || 'laptop_inventory',
  port: Number(process.env.MYSQL_PORT) || 3306,
  connectionLimit: Number(process.env.MYSQL_CONN_LIMIT) || 0
});

const laptopTable = process.env.LAPTOP_TABLE || 'laptop';
const userTable = process.env.USER_TABLE || 'user';

const executeQuery = async (query, values = []) => {
  let connection = null;
  try {
    connection = await connectionPool.getConnection();
    const timeStart = process.hrtime();
    const [result] = await connection.query(query, values);
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Database', 'Operation', 'INFO'], {
      message: { query, timeTaken }
    });
    if (connection) connection.release();
    return result;
  } catch (error) {
    CommonHelper.log(['Database', 'Operation', 'ERROR'], {
      message: `${error}`
    });
    if (connection) connection.release();
    throw error;
  }
};
const getListLaptop = async () => {
  const query = `SELECT * FROM ${laptopTable}`;
  const rawResult = await executeQuery(query);
  return Object.values(JSON.parse(JSON.stringify(rawResult)));
};

const addLaptop = async (name, price, stock, brandId) => {
  const query = `INSERT INTO ${laptopTable} (name, price, stock, brand_id) VALUES (?,?,?,?)`;
  await executeQuery(query, [name, price, stock, brandId]);
};

const editLaptop = async (id, name, price, stock, brandId) => {
  const query = `UPDATE ${laptopTable} SET name = ?, price = ?, stock = ?, brand_id = ? WHERE id = ?`;
  const result = await executeQuery(query, [name, price, stock, brandId, id]);
  return result?.affectedRows > 0;
};

const deleteLaptop = async (id) => {
  const query = `DELETE FROM ${laptopTable} WHERE id = ?`;
  const result = await executeQuery(query, [id]);
  return result?.affectedRows > 0;
};
const Login = async (username) => {
  const query = `SELECT * FROM ${userTable} WHERE username = ?`;
  const result = await executeQuery(query, [username]);
  return Object.values(JSON.parse(JSON.stringify(result)))[0];
};
const Register = async (username, password) => {
  const query = `INSERT INTO ${userTable} (username, password) VALUES (?,?)`;
  await executeQuery(query, [username, bcrypt.hashSync(password, 10)]);
};

module.exports = {
  getListLaptop,
  addLaptop,
  deleteLaptop,
  editLaptop,
  Login,
  Register
};
