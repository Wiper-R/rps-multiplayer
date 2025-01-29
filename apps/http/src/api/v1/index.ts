import { Router } from "express";
import db from "../../lib/db";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";

export const router = Router();

router.get("/profile", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session?.user) {
    res.sendStatus(401);
    return;
  }

  const [wins, losses, draws] = await Promise.all([
    db.gameHistory.count({
      where: {
        winnerId: session.user.id,
      },
    }),
    db.gameHistory.count({
      where: {
        AND: [
          { winnerId: { not: session.user.id } },
          { winnerId: { not: null } },
          { playerIds: { has: session.user.id } },
        ],
      },
    }),
    db.gameHistory.count({
      where: {
        winnerId: null,
        playerIds: { has: session.user.id },
      },
    }),
  ]);

  res.json({ wins, losses, draws });
});

router.get("/leaderboard", async (req, res) => {
  // Fetch top 5 players by wins
  const leaderboard = await db.gameHistory.groupBy({
    by: ["winnerId"],
    where: { winnerId: { not: null } },
    _count: { winnerId: true },
    orderBy: { _count: { winnerId: "desc" } },
    take: 5,
  });
  const users = await db.user.findMany({
    where: {
      id: { in: leaderboard.map((entry) => entry.winnerId!) },
    },
    select: { id: true, name: true, image: true },
  });

  const data = leaderboard.map((entry) => {
    return {
      user: users.find((user) => user.id === entry.winnerId)!,
      wins: entry._count.winnerId,
    };
  });
  res.json(data);
});
