import { MOVE_PAPER, MOVE_ROCK, MOVE_SCISSORS } from "@repo/constants/game";
export type PlayerMove =
  | typeof MOVE_ROCK
  | typeof MOVE_PAPER
  | typeof MOVE_SCISSORS;
