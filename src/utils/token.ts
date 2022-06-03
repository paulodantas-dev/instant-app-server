import jwt from 'jsonwebtoken';

export const createAccessToken = (payload: string | object | Buffer) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

export const createRefreshToken = (payload: string | object | Buffer) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};
