import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(process.env.PUSHER_APP_KEY || "", {
  cluster: "eu",
});
