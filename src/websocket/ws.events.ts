// export enum WS_EVENTS {
//   JOIN_ROOM = "JOIN_ROOM",
//   LEAVE_ROOM = "LEAVE_ROOM",
//   SEND_MESSAGE = "SEND_MESSAGE",
//   NEW_MESSAGE = "NEW_MESSAGE",
//   USER_JOINED = "USER_JOINED",
//   USER_LEFT = "USER_LEFT",
//   ERROR = "ERROR",
// }

export const WS_EVENTS = {
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",
  SEND_MESSAGE: "SEND_MESSAGE",
  NEW_MESSAGE: "NEW_MESSAGE",
  USER_JOINED: "USER_JOINED",
  USER_LEFT: "USER_LEFT",
  ERROR: "ERROR",
} as const;

// Convert object key in a type
export type WS_EVENTS_TYPE = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];
