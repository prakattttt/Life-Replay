export const NOTIFICATION_TIMES = [
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "20:00", label: "8:00 PM" },
] as const;

export type NotificationTime = string;

export type Profile = {
  name: string;
  email: string;
  imageUrl: string | null;
  createdAt: Date;
  momentCount: number;
  firstMomentOn: string | null;
};

export type Settings = {
  notifications: {
    onThisDay: boolean;
    onThisDayTime: NotificationTime;
    weeklyRecap: boolean;
  };
  privacy: {
    blurPhotos: boolean;
    discreetEmails: boolean;
  };
};

export type ProfileData = {
  profile: Profile;
  settings: Settings;
};

export type ActionResult =
  | { ok: true; message?: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<string, string>>;
    };

export type ExportFormat = "json" | "csv";

export const GENERIC_ERROR = "Something went wrong. Please try again in a moment.";