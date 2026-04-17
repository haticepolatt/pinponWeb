import { SESSION_DURATION_MINUTES } from "@pinpon/shared";
import dayjs from "dayjs";
import { prisma } from "../lib/prisma.js";
import { eachDay, overlap, toDateTime } from "../utils/date.js";

const parseDays = (daysOfWeek) => JSON.parse(daysOfWeek);

export const buildTrainerAvailability = async (trainerId, from, to) => {
  const [assignments, customSlots, unavailableSlots, bookings] = await Promise.all([
    prisma.trainerBlockAssignment.findMany({
      where: {
        trainerId,
        effectiveFrom: { lte: to },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: from } }]
      },
      include: { block: true }
    }),
    prisma.trainerCustomAvailability.findMany({
      where: { trainerId, date: { gte: dayjs(from).startOf("day").toDate(), lte: dayjs(to).endOf("day").toDate() } }
    }),
    prisma.trainerUnavailableSlot.findMany({
      where: {
        trainerId,
        startAt: { lte: to },
        endAt: { gte: from }
      }
    }),
    prisma.booking.findMany({
      where: {
        trainerId,
        status: "BOOKED",
        startAt: { lte: to },
        endAt: { gte: from }
      }
    })
  ]);

  const days = eachDay(from, to);
  const slots = [];

  days.forEach((day) => {
    const weekday = dayjs(day).day();

    assignments.forEach((assignment) => {
      const blockDays = parseDays(assignment.block.daysOfWeek);
      const isInWindow =
        !dayjs(day).startOf("day").isBefore(dayjs(assignment.effectiveFrom).startOf("day")) &&
        (!assignment.effectiveTo || !dayjs(day).startOf("day").isAfter(dayjs(assignment.effectiveTo).startOf("day")));

      if (!isInWindow || !blockDays.includes(weekday)) {
        return;
      }

      const startAt = toDateTime(day, assignment.block.startTime);
      const endAt = toDateTime(day, assignment.block.endTime);
      let cursor = dayjs(startAt);

      while (cursor.add(SESSION_DURATION_MINUTES, "minute").isSameOrBefore(endAt)) {
        const slotStart = cursor.toDate();
        const slotEnd = cursor.add(SESSION_DURATION_MINUTES, "minute").toDate();
        slots.push({
          source: "block",
          startAt: slotStart,
          endAt: slotEnd
        });
        cursor = cursor.add(SESSION_DURATION_MINUTES, "minute");
      }
    });

    customSlots
      .filter((item) => dayjs(item.date).isSame(day, "day"))
      .forEach((item) => {
        let cursor = dayjs(toDateTime(day, item.startTime));
        const endAt = dayjs(toDateTime(day, item.endTime));

        while (cursor.add(SESSION_DURATION_MINUTES, "minute").isSameOrBefore(endAt)) {
          slots.push({
            source: "custom",
            startAt: cursor.toDate(),
            endAt: cursor.add(SESSION_DURATION_MINUTES, "minute").toDate(),
            label: item.label
          });
          cursor = cursor.add(SESSION_DURATION_MINUTES, "minute");
        }
      });
  });

  return slots.filter((slot) => {
    const blocked = unavailableSlots.some((item) =>
      overlap(slot.startAt, slot.endAt, item.startAt, item.endAt)
    );
    const booked = bookings.some((item) => overlap(slot.startAt, slot.endAt, item.startAt, item.endAt));
    return !blocked && !booked;
  });
};
