import ms from "ms";
import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword, signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/auth.js";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";

const createTokens = async (user) => {
  const payload = { sub: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + ms(env.jwtRefreshExpiresIn))
    }
  });

  return { accessToken, refreshToken };
};

export const registerUser = async (data) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ApiError(409, "Bu e-posta zaten kayitli.");
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role
    }
  });

  return createTokens(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { trainerProfile: true }
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new ApiError(401, "E-posta veya şifre hatalı.");
  }

  const tokens = await createTokens(user);
  return { user, ...tokens };
};

export const refreshSession = async (token) => {
  const stored = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: { include: { trainerProfile: true } } }
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token gecersiz.");
  }

  const payload = verifyRefreshToken(token);
  const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
  return { accessToken, user: stored.user };
};

export const revokeRefreshToken = async (token) => {
  if (!token) return;

  await prisma.refreshToken.updateMany({
    where: { token, revokedAt: null },
    data: { revokedAt: new Date() }
  });
};
