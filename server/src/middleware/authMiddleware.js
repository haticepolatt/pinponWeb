import { ROLES } from "@pinpon/shared";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../utils/auth.js";

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Yetkilendirme gerekli."));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { trainerProfile: true }
    });

    if (!user) {
      return next(new ApiError(401, "Kullanici bulunamadi."));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, "Oturum gecersiz veya suresi dolmus."));
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "Bu islem icin yetkiniz yok."));
  }

  next();
};

export const authorizeTrainerOrAdmin = (req, res, next) => {
  if (req.user?.role === ROLES.ADMIN || req.user?.role === ROLES.TRAINER) {
    return next();
  }

  next(new ApiError(403, "Bu işlem sadece yönetici veya antrenör içindir."));
};
