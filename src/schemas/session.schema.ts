import { z } from 'zod';

export const revokeSessionParamsSchema = z.object({
  id: z.string().uuid(),
});

export type RevokeSessionParams = z.infer<typeof revokeSessionParamsSchema>;
