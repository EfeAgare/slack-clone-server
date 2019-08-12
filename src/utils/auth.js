import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

export const tryLogin = async (email, password, models, secret) => {
  const user = await models.User.findOne({ where: { email }, raw: true });

  if (!user) {
    return {
      ok: false,
      errors: [{ path: 'email', message: 'Wrong email' }]
    };
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return {
      ok: false,
      errors: [{ path: 'password', message: 'Wrong password' }]
    };
  }


  const refreshTokenSecret = user.password + secret
  const [token, refreshToken] = await createTokens(
    user,
    secret,
    refreshTokenSecret
  );

  return {
    ok: true,
    token,
    refreshToken
  };
};

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign({ user: _.pick(user, ['id']) }, secret, {
    expiresIn: '1h'
  });

  const createRefreshToken = jwt.sign({ user: _.pick(user, ['id']) }, secret2, {
    expiresIn: '7d'
  });

  return [createToken, createRefreshToken];
};
