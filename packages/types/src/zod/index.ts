import z from "zod";

export const PlayerMove = z.enum(["rock", "paper", "scissors"]);
