import express from "express";
import { z } from "zod";
import { ROLES } from "@pinpon/shared";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { authenticate, authorize, authorizeTrainerOrAdmin } from "../middleware/authMiddleware.js";
import { buildTrainerAvailability } from "../services/availabilityService.js";
import { loginUser, refreshSession, registerUser, revokeRefreshToken } from "../services/authService.js";
import { comparePassword, hashPassword } from "../utils/auth.js";
import dayjs from "dayjs";

const router = express.Router();

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).optional().or(z.literal("")),
  password: z.string().min(8),
  role: z.nativeEnum(ROLES).default(ROLES.CUSTOMER)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const packageSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  sessionCount: z.number().int().positive(),
  durationMinutes: z.number().int().positive(),
  price: z.number().positive(),
  featured: z.boolean().optional()
});

const blockSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/)
});

const bookingSchema = z.object({
  trainerId: z.string(),
  purchaseId: z.string(),
  startAt: z.string().datetime(),
  notes: z.string().max(400).optional().or(z.literal(""))
});

const customAvailabilitySchema = z.object({
  date: z.string().datetime(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  label: z.string().max(100).optional().or(z.literal(""))
});

const unavailableSchema = z.object({
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  reason: z.string().max(150).optional().or(z.literal(""))
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});

const createTrainerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).optional().or(z.literal("")),
  password: z.string().min(8),
  headline: z.string().min(5),
  bio: z.string().min(20),
  specialties: z.string().min(3),
  yearsExperience: z.number().int().min(0).max(60),
  imageUrl: z.string().url()
});

const sendAuthPayload = async (res, user, accessToken, refreshToken = null) => {
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    trainerProfile: user.trainerProfile || null
  };

  res.json({ user: safeUser, accessToken });
};

router.get("/health", (req, res) => {
  res.json({ ok: true });
});

router.get("/auth/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const result = await registerUser({ ...data, role: ROLES.CUSTOMER });
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    await sendAuthPayload(res, user, result.accessToken, result.refreshToken);
  })
);

router.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);
    await sendAuthPayload(res, result.user, result.accessToken, result.refreshToken);
  })
);

router.post(
  "/auth/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401, "Refresh token bulunamadi.");
    const result = await refreshSession(token);
    await sendAuthPayload(res, result.user, result.accessToken);
  })
);

router.post(
  "/auth/logout",
  asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    await revokeRefreshToken(token);
    res.clearCookie("refreshToken");
    res.json({ message: "Cikis yapildi." });
  })
);

router.post(
  "/auth/change-password",
  authenticate,
  asyncHandler(async (req, res) => {
    const data = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isValid = await comparePassword(data.currentPassword, user.passwordHash);
    if (!isValid) throw new ApiError(400, "Mevcut şifre hatalı.");

    const passwordHash = await hashPassword(data.newPassword);
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        passwordHash,
        mustChangePassword: false
      },
      include: { trainerProfile: true }
    });

    await prisma.auditLog.create({
      data: {
        actorUserId: req.user.id,
        targetUserId: req.user.id,
        action: "PASSWORD_CHANGED",
        metadata: "User completed password rotation"
      }
    });

    await sendAuthPayload(res, updated, req.headers.authorization?.slice(7) || "");
  })
);

router.get(
  "/auth/me",
  authenticate,
  asyncHandler(async (req, res) => {
    await sendAuthPayload(res, req.user, req.headers.authorization?.slice(7) || "");
  })
);

router.get(
  "/public/home",
  asyncHandler(async (req, res) => {
    const [trainers, packages] = await Promise.all([
      prisma.trainerProfile.findMany({
        where: { isActive: true },
        include: { user: true },
        take: 3
      }),
      prisma.trainingPackage.findMany({
        orderBy: { price: "asc" }
      })
    ]);

    res.json({
      hero: {
        title: "Nil Spin ile oyununuzu profesyonel seviyeye taşıyın",
        subtitle: "Lisanslı antrenörler, akıllı rezervasyon ve veri destekli gelişim takibi."
      },
      stats: [
        { label: "Aktif sporcu", value: "240+" },
        { label: "Haftalık seans", value: "180" },
        { label: "Turnuva hazırlık programı", value: "12" }
      ],
      trainers,
      packages
    });
  })
);

router.get(
  "/public/trainers",
  asyncHandler(async (req, res) => {
    const trainers = await prisma.trainerProfile.findMany({
      where: { isActive: true },
      include: { user: true, trainerBookings: true, blockAssignments: { include: { block: true } } }
    });
    res.json(trainers);
  })
);

router.get(
  "/public/packages",
  asyncHandler(async (req, res) => {
    const packages = await prisma.trainingPackage.findMany({ orderBy: { price: "asc" } });
    res.json(packages);
  })
);

router.get(
  "/public/availability",
  asyncHandler(async (req, res) => {
    const trainerId = String(req.query.trainerId || "");
    const from = new Date(String(req.query.from));
    const to = new Date(String(req.query.to));
    if (!trainerId || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new ApiError(400, "Geçerli trainerId, from ve to parametreleri gerekli.");
    }

    const slots = await buildTrainerAvailability(trainerId, from, to);
    res.json(slots);
  })
);

router.get(
  "/dashboard",
  authenticate,
  asyncHandler(async (req, res) => {
    if (req.user.role === ROLES.ADMIN) {
      const [userCount, trainerCount, bookingCount, revenueAgg] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: ROLES.TRAINER } }),
        prisma.booking.count(),
        prisma.purchase.aggregate({ _sum: { amount: true } })
      ]);
      return res.json({
        role: ROLES.ADMIN,
        metrics: [
          { label: "Toplam kullanıcı", value: userCount },
          { label: "Aktif antrenör", value: trainerCount },
          { label: "Toplam rezervasyon", value: bookingCount },
          { label: "Gelir", value: `${revenueAgg._sum.amount || 0} TL` }
        ]
      });
    }

    if (req.user.role === ROLES.TRAINER) {
      const trainerId = req.user.trainerProfile?.id;
      const [upcoming, unavailable, assignments] = await Promise.all([
        prisma.booking.findMany({
          where: { trainerId, startAt: { gte: new Date() }, status: "BOOKED" },
          include: { customer: true },
          orderBy: { startAt: "asc" }
        }),
        prisma.trainerUnavailableSlot.findMany({
          where: { trainerId, startAt: { gte: dayjs().startOf("day").toDate() } },
          orderBy: { startAt: "asc" }
        }),
        prisma.trainerBlockAssignment.findMany({
          where: { trainerId },
          include: { block: true }
        })
      ]);
      return res.json({ role: ROLES.TRAINER, upcoming, unavailable, assignments });
    }

    const [purchases, bookings] = await Promise.all([
      prisma.purchase.findMany({
        where: { customerId: req.user.id },
        include: { trainingPackage: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.booking.findMany({
        where: { customerId: req.user.id },
        include: { trainer: { include: { user: true } } },
        orderBy: { startAt: "desc" }
      })
    ]);
    return res.json({ role: ROLES.CUSTOMER, purchases, bookings });
  })
);

router.post(
  "/packages/purchase/:packageId",
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const trainingPackage = await prisma.trainingPackage.findUnique({ where: { id: req.params.packageId } });
    if (!trainingPackage) throw new ApiError(404, "Paket bulunamadı.");

    const purchase = await prisma.purchase.create({
      data: {
        customerId: req.user.id,
        packageId: trainingPackage.id,
        totalSessions: trainingPackage.sessionCount,
        remainingSessions: trainingPackage.sessionCount,
        amount: trainingPackage.price,
        paymentStatus: "PAID",
        paymentReference: `MOCK-${Date.now()}`
      },
      include: { trainingPackage: true }
    });

    res.status(201).json(purchase);
  })
);

router.get(
  "/bookings",
  authenticate,
  asyncHandler(async (req, res) => {
    let bookings = [];
    if (req.user.role === ROLES.TRAINER) {
      bookings = await prisma.booking.findMany({
        where: { trainerId: req.user.trainerProfile.id },
        include: { customer: true, purchase: { include: { trainingPackage: true } } },
        orderBy: { startAt: "desc" }
      });
    } else if (req.user.role === ROLES.ADMIN) {
      bookings = await prisma.booking.findMany({
        include: {
          customer: true,
          trainer: { include: { user: true } },
          purchase: { include: { trainingPackage: true } }
        },
        orderBy: { startAt: "desc" }
      });
    } else {
      bookings = await prisma.booking.findMany({
        where: { customerId: req.user.id },
        include: { trainer: { include: { user: true } }, purchase: { include: { trainingPackage: true } } },
        orderBy: { startAt: "desc" }
      });
    }

    res.json(bookings);
  })
);

router.post(
  "/bookings",
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const data = bookingSchema.parse(req.body);
    const purchase = await prisma.purchase.findFirst({
      where: {
        id: data.purchaseId,
        customerId: req.user.id,
        remainingSessions: { gt: 0 },
        paymentStatus: "PAID"
      }
    });

    if (!purchase) throw new ApiError(400, "Gecerli ve kalan seansli bir paket bulunamadi.");

    const startAt = new Date(data.startAt);
    const endAt = dayjs(startAt).add(60, "minute").toDate();
    const slots = await buildTrainerAvailability(data.trainerId, startAt, endAt);
    const slotFound = slots.some((slot) => slot.startAt.getTime() === startAt.getTime());
    if (!slotFound) throw new ApiError(409, "Seçilen saat artık müsait değil.");

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          trainerId: data.trainerId,
          customerId: req.user.id,
          purchaseId: purchase.id,
          startAt,
          endAt,
          notes: data.notes
        },
        include: { trainer: { include: { user: true } }, purchase: true }
      });

      await tx.purchase.update({
        where: { id: purchase.id },
        data: { remainingSessions: { decrement: 1 } }
      });

      return created;
    });

    res.status(201).json(booking);
  })
);

router.patch(
  "/bookings/:bookingId/cancel",
  authenticate,
  asyncHandler(async (req, res) => {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.bookingId } });
    if (!booking) throw new ApiError(404, "Rezervasyon bulunamadı.");

    const canCancel =
      req.user.role === ROLES.ADMIN ||
      booking.customerId === req.user.id ||
      (req.user.role === ROLES.TRAINER && booking.trainerId === req.user.trainerProfile?.id);
    if (!canCancel) throw new ApiError(403, "Bu rezervasyonu iptal edemezsiniz.");
    if (booking.status !== "BOOKED") throw new ApiError(400, "Rezervasyon zaten kapatıldı.");

    const updated = await prisma.$transaction(async (tx) => {
      const cancelled = await tx.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" }
      });
      await tx.purchase.update({
        where: { id: booking.purchaseId },
        data: { remainingSessions: { increment: 1 } }
      });
      return cancelled;
    });

    res.json(updated);
  })
);

router.get(
  "/admin/users",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      include: { trainerProfile: true, purchases: true, bookings: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(users);
  })
);

router.post(
  "/admin/trainers",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const data = createTrainerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError(409, "Bu e-posta ile kayıtlı bir kullanıcı zaten var.");

    const passwordHash = await hashPassword(data.password);

    const created = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: ROLES.TRAINER,
        trainerProfile: {
          create: {
            headline: data.headline,
            bio: data.bio,
            specialties: data.specialties,
            yearsExperience: data.yearsExperience,
            imageUrl: data.imageUrl,
            isActive: true
          }
        }
      },
      include: { trainerProfile: true }
    });

    await prisma.auditLog.create({
      data: {
        actorUserId: req.user.id,
        targetUserId: created.id,
        action: "TRAINER_CREATED",
        metadata: `Trainer created for ${created.email}`
      }
    });

    res.status(201).json({
      user: {
        id: created.id,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        phone: created.phone,
        role: created.role,
        trainerProfile: created.trainerProfile
      }
    });
  })
);

router.post(
  "/admin/packages",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const data = packageSchema.parse(req.body);
    const created = await prisma.trainingPackage.create({ data });
    res.status(201).json(created);
  })
);

router.get(
  "/admin/blocks",
  authenticate,
  authorizeTrainerOrAdmin,
  asyncHandler(async (req, res) => {
    const blocks = await prisma.timeBlock.findMany({ orderBy: { name: "asc" } });
    res.json(blocks);
  })
);

router.post(
  "/admin/blocks",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const data = blockSchema.parse(req.body);
    const block = await prisma.timeBlock.create({
      data: { ...data, daysOfWeek: JSON.stringify(data.daysOfWeek) }
    });
    res.status(201).json(block);
  })
);

router.post(
  "/admin/trainers/:trainerId/assign-block",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const schema = z.object({
      blockId: z.string(),
      effectiveFrom: z.string().datetime(),
      effectiveTo: z.string().datetime().optional().nullable()
    });
    const data = schema.parse(req.body);

    const assignment = await prisma.trainerBlockAssignment.create({
      data: {
        trainerId: req.params.trainerId,
        blockId: data.blockId,
        effectiveFrom: new Date(data.effectiveFrom),
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null
      },
      include: { block: true }
    });
    res.status(201).json(assignment);
  })
);

router.post(
  "/trainer/custom-availability",
  authenticate,
  authorize(ROLES.TRAINER, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const data = customAvailabilitySchema.parse(req.body);
    const trainerId = req.user.role === ROLES.TRAINER ? req.user.trainerProfile.id : String(req.body.trainerId || "");
    const created = await prisma.trainerCustomAvailability.create({
      data: {
        trainerId,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        label: data.label
      }
    });
    res.status(201).json(created);
  })
);

router.post(
  "/trainer/unavailable",
  authenticate,
  authorize(ROLES.TRAINER, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const data = unavailableSchema.parse(req.body);
    const trainerId = req.user.role === ROLES.TRAINER ? req.user.trainerProfile.id : String(req.body.trainerId || "");
    const created = await prisma.trainerUnavailableSlot.create({
      data: {
        trainerId,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        reason: data.reason
      }
    });
    res.status(201).json(created);
  })
);

router.get(
  "/trainer/schedule",
  authenticate,
  authorize(ROLES.TRAINER, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const trainerId = req.user.role === ROLES.TRAINER ? req.user.trainerProfile.id : String(req.query.trainerId || "");
    const from = new Date(String(req.query.from));
    const to = new Date(String(req.query.to));
    const [slots, bookings] = await Promise.all([
      buildTrainerAvailability(trainerId, from, to),
      prisma.booking.findMany({
        where: { trainerId, startAt: { gte: from }, endAt: { lte: to } },
        include: { customer: true },
        orderBy: { startAt: "asc" }
      })
    ]);

    res.json({ slots, bookings });
  })
);

router.get(
  "/contact",
  asyncHandler(async (req, res) => {
    res.json({
      address: "Yüzüncüyıl Mah. Tutku Cad. 1 Nilüfer / Bursa",
      phone: "+90 224 555 10 10",
      email: "iletisim@nilspinakademi.com",
      hours: "Hafta içi 09:00 - 22:00, Hafta sonu 10:00 - 20:00"
    });
  })
);

export default router;
