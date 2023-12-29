import { z } from "zod";

/**
 * Event coming from the client
 */
export const ClientEventSchema = z.union([
  z.object({
    action: z.literal("move"),
    x: z.number(),
    y: z.number(),
  }),
  z.object({
    action: z.literal("connect"),
    name: z.string(),
  }),
]);

/**
 * Event coming from the server
 */

const GameSymbolSchema = z.union([z.literal("X"), z.literal("O")]);

const ServerStartEventSchema = z.object({
  action: z.literal("start"),
  symbol: GameSymbolSchema,
  opponent: z.string(),
});

export type ServerStartEventType = z.infer<typeof ServerStartEventSchema>;

export const ServerEventSchema = z.union([
  ServerStartEventSchema,
  z.object({
    action: z.literal("move"),
    x: z.number(),
    y: z.number(),
    symbol: GameSymbolSchema,
    turn: z.number(),
  }),
]);
