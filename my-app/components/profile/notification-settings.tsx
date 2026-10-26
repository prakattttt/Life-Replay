// "use client";

// import { useId } from "react";
// import { updateSettings } from "@/features/profile/profile-api";
// import {
//   NOTIFICATION_TIMES,
//   type NotificationTime,
//   type Settings,
// } from "@/features/profile/types";
// import { ToggleRow } from "./toggle-row";
// import { useAutoSave } from "./use-auto-save";

// type NotificationSettingsProps = {
//   initial: Settings["notifications"];
//   email: string;
// };

// /** Switches save the moment they change; a failed save puts the switch back. */
// export function NotificationSettings({ initial, email }: NotificationSettingsProps) {
//   const { values, change, isPending } = useAutoSave(initial, (patch) =>
//     updateSettings({ notifications: patch }),
//   );
//   const timeId = useId();

//   return (
//     <div>
//       <div className="divide-y divide-border-subtle">
//         <ToggleRow
//           id="on-this-day"
//           label="On This Day reminder"
//           description="An email when a past year has a moment from today."
//           checked={values.onThisDay}
//           disabled={isPending}
//           onChange={(onThisDay) => change({ onThisDay })}
//         />

//         {values.onThisDay && (
//           <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
//             <label htmlFor={timeId} className="text-sm font-semibold text-foreground">
//               Send it at
//             </label>
//             <select
//               id={timeId}
//               value={values.onThisDayTime}
//               disabled={isPending}
//               onChange={(event) => change({ onThisDayTime: event.target.value as NotificationTime })}
//               className="min-h-11 rounded-xl border border-border bg-surface px-3 text-base text-foreground transition-colors hover:border-border-strong focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 sm:w-44"
//             >
//               {NOTIFICATION_TIMES.map((time) => (
//                 <option key={time.value} value={time.value}>
//                   {time.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <ToggleRow
//           id="weekly-recap"
//           label="Weekly recap"
//           description="A quiet look back at what you saved this week."
//           checked={values.weeklyRecap}
//           disabled={isPending}
//           onChange={(weeklyRecap) => change({ weeklyRecap })}
//         />
//       </div>

//       <p className="mt-2 text-sm text-foreground-muted">Emails go to {email}.</p>
//     </div>
//   );
// }
