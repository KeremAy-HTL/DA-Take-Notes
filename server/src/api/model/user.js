import query from '../../db/index.js';

const signup = (firstName, lastName, email, createdAt, updatedAt, verified, hashedPassword) =>
  query(
    'INSERT INTO users (first_name, last_name, email, created_at, updated_at, verified, password) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *',
    [firstName, lastName, email, createdAt, updatedAt, verified, hashedPassword],
  );

const signin = (email) => query('SELECT * FROM users WHERE email = ?;', [email]);

const delAccount = (userId) => query('DELETE FROM users WHERE user_id = ?;', [userId]);

const updatePassword = (userId, hashedPassword) =>
  query('UPDATE users SET password = ? WHERE user_id = ? RETURNING *', [hashedPassword, userId]);

const emailExists = (email) => query('SELECT email FROM users WHERE email = ?', [email]);

const updateName = (userId, firstName, lastName) =>
  query('UPDATE users SET first_name = ?, last_name = ? WHERE user_id = ? RETURNING *', [
    firstName,
    lastName,
    userId,
  ]);

const getUserById = (userId) => query('SELECT * FROM users WHERE user_id = ?', [userId]);

const saveUserVerification = (userId, verificationToken, createdAt, expiresAt) =>
  query(
    'INSERT INTO user_verification (user_id, verification_token, created_at, expires_at) VALUES (?, ?, ?, ?) RETURNING *',
    [userId, verificationToken, createdAt, expiresAt],
  );

const getUserVerification = (userId) =>
  query('SELECT * FROM user_verification WHERE user_id = ?', [userId]);

const verifyUser = (userId) =>
  query('UPDATE users SET verified = true WHERE user_id = ? RETURNING *', [userId]);

const deleteUserVerification = (userId) =>
  query('DELETE FROM user_verification WHERE user_id = ?', [userId]);

export {
  signup,
  signin,
  updatePassword,
  updateName,
  emailExists,
  getUserById,
  saveUserVerification,
  getUserVerification,
  verifyUser,
  deleteUserVerification,
  delAccount,
};
