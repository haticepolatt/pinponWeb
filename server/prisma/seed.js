import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const password = (raw) => bcrypt.hash(raw, 12);

async function main() {
  await prisma.booking.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.trainerUnavailableSlot.deleteMany();
  await prisma.trainerCustomAvailability.deleteMany();
  await prisma.trainerBlockAssignment.deleteMany();
  await prisma.timeBlock.deleteMany();
  await prisma.trainingPackage.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const [adminPassword, trainerPassword, customerPassword] = await Promise.all([
    password("Admin123!"),
    password("Trainer123!"),
    password("Student123!")
  ]);

  const admin = await prisma.user.create({
    data: {
      firstName: "Deniz",
      lastName: "Yıldız",
      email: "admin@pinponakademi.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "05550000000"
    }
  });

  const trainerOne = await prisma.user.create({
    data: {
      firstName: "Selim",
      lastName: "Acar",
      email: "selim@pinponakademi.com",
      passwordHash: trainerPassword,
      role: "TRAINER",
      phone: "05551112233",
      trainerProfile: {
        create: {
          headline: "Performans ve turnuva hazırlık uzmanı",
          bio: "Ulusal lig tecrübesi bulunan antrenör. Ayak oyunu ve servis varyasyonu üzerine yoğunlaşır.",
          specialties: "Performans, teknik analiz, servis",
          yearsExperience: 11,
          imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80"
        }
      }
    },
    include: { trainerProfile: true }
  });

  const trainerTwo = await prisma.user.create({
    data: {
      firstName: "Ece",
      lastName: "Kaya",
      email: "ece@pinponakademi.com",
      passwordHash: trainerPassword,
      role: "TRAINER",
      phone: "05554443322",
      trainerProfile: {
        create: {
          headline: "Başlangıç ve genç sporcu gelişim koçu",
          bio: "Çocuk ve yetişkin sporcular için planlı ilerleme programları hazırlar.",
          specialties: "Temel teknik, ritim, mental hazırlık",
          yearsExperience: 8,
          imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80"
        }
      }
    },
    include: { trainerProfile: true }
  });

  const customer = await prisma.user.create({
    data: {
      firstName: "Mert",
      lastName: "Oyuncu",
      email: "oyuncu@pinponakademi.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      phone: "05556667788"
    }
  });

  const packages = await prisma.$transaction([
    prisma.trainingPackage.create({
      data: {
        title: "5 Seans Hız Paketi",
        description: "Teknik düzeltme ve servis ritmi kazanmak isteyen sporcular için hızlandırılmış program.",
        sessionCount: 5,
        durationMinutes: 60,
        price: 4500,
        featured: false
      }
    }),
    prisma.trainingPackage.create({
      data: {
        title: "10 Seans Gelişim Paketi",
        description: "Orta seviye oyuncular için video analiz ve saha içi takip destekli paket.",
        sessionCount: 10,
        durationMinutes: 60,
        price: 8200,
        featured: true
      }
    }),
    prisma.trainingPackage.create({
      data: {
        title: "Aylık Profesyonel Plan",
        description: "Haftalık 3 ders, turnuva planlaması ve gelişim raporu içeren premium program.",
        sessionCount: 12,
        durationMinutes: 60,
        price: 9600,
        featured: true
      }
    })
  ]);

  const eveningBlock = await prisma.timeBlock.create({
    data: {
      name: "Hafta İçi Akşam Bloğu",
      description: "Hafta içi 18:00-21:00 arası tekrar eden müsaitlik blogu",
      daysOfWeek: JSON.stringify([1, 2, 3, 4, 5]),
      startTime: "18:00",
      endTime: "21:00"
    }
  });

  const weekendBlock = await prisma.timeBlock.create({
    data: {
      name: "Hafta Sonu Sabah Bloğu",
      description: "Cumartesi ve pazar 10:00-14:00 arası blok",
      daysOfWeek: JSON.stringify([0, 6]),
      startTime: "10:00",
      endTime: "14:00"
    }
  });

  await prisma.trainerBlockAssignment.createMany({
    data: [
      {
        trainerId: trainerOne.trainerProfile.id,
        blockId: eveningBlock.id,
        effectiveFrom: new Date("2026-04-01T00:00:00.000Z")
      },
      {
        trainerId: trainerTwo.trainerProfile.id,
        blockId: weekendBlock.id,
        effectiveFrom: new Date("2026-04-01T00:00:00.000Z")
      }
    ]
  });

  const purchase = await prisma.purchase.create({
    data: {
      customerId: customer.id,
      packageId: packages[1].id,
      totalSessions: packages[1].sessionCount,
      remainingSessions: 8,
      amount: packages[1].price,
      paymentStatus: "PAID",
      paymentReference: "MOCK-SEED-001"
    }
  });

  await prisma.booking.create({
    data: {
      trainerId: trainerOne.trainerProfile.id,
      customerId: customer.id,
      purchaseId: purchase.id,
      startAt: new Date("2026-04-17T18:00:00.000Z"),
      endAt: new Date("2026-04-17T19:00:00.000Z"),
      status: "BOOKED",
      notes: "Forehand topspin tekrarı"
    }
  });

  await prisma.trainerUnavailableSlot.create({
    data: {
      trainerId: trainerOne.trainerProfile.id,
      startAt: new Date("2026-04-18T18:00:00.000Z"),
      endAt: new Date("2026-04-18T20:00:00.000Z"),
      reason: "Kulüp içi kamp"
    }
  });

  console.log({
    admin: admin.email,
    trainerOne: trainerOne.email,
    trainerTwo: trainerTwo.email,
    customer: customer.email
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
