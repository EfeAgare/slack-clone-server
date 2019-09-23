import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';



// verify the user that wants to LOGIN
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



// create token
export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign({ user: _.pick(user, ['id', "username"]) }, secret, {
    expiresIn: '2d'
  });

  const createRefreshToken = jwt.sign({ user: _.pick(user, ['id', "username"]) }, secret2, {
    expiresIn: '7d'
  });

  return [createToken, createRefreshToken];
};


// Refresh user token

export const refreshTokens = async (refreshToken, models, secret) => {
  let userId = 0;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }
  const user = await models.User.findOne({ where: { id: userId } });

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + secret;


  const [newToken, newRefreshToken] = await createTokens(user, secret, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};



// get required user
export const getUser = async (token, refreshToken, secret, models, res) => {
  let userId;
  if (token) {
    try {
      const { user } = jwt.verify(token, secret);
      userId = user;
    } catch (error) {
      const newTokens = await refreshTokens(refreshToken, models, secret);
      if (newTokens.token && newTokens.refreshToken && res) {
        res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      userId = newTokens.user;
    }
  }
  return userId;
};