import type { Moment } from "@/types/moment";
import type { HomeData } from "./queries";

export type SerializedMoment = Omit<Moment, "occurredAt"> & {
  occurredAt: string;
};

type SerializedOnThisDay = Omit<NonNullable<HomeData["onThisDay"]>, "moment"> & {
  moment: SerializedMoment;
};

export type SerializedHomeData = Omit<HomeData, "today" | "recent" | "onThisDay"> & {
  today: SerializedMoment[];
  recent: SerializedMoment[];
  onThisDay: SerializedOnThisDay | null;
};

export type SerializedOnThisDayData = {
  moments: SerializedMoment[];
  timezone: string;
};

export function deserializeMoment(moment: SerializedMoment): Moment {
  return { ...moment, occurredAt: new Date(moment.occurredAt) };
}

export function deserializeHomeData(data: SerializedHomeData): HomeData {
  return {
    ...data,
    today: data.today.map(deserializeMoment),
    recent: data.recent.map(deserializeMoment),
    onThisDay: data.onThisDay
      ? { ...data.onThisDay, moment: deserializeMoment(data.onThisDay.moment) }
      : null,
  };
}