import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import { StatsService } from '../services/stats.service';
import type { ApiResponse } from '../dtos/apiResponse.dto';
import type { LoginStatsResponse } from '../services/stats.service';

const statsService = new StatsService();

export default async function (server: FastifyInstance) {
  server.get<{
    Reply: ApiResponse<LoginStatsResponse>;
  }>(
    '/stats/logins',
    { preHandler: [authenticate] },
    async (request, reply) => {
      try {
        const data = await statsService.getLoginStats();
        const response: ApiResponse<LoginStatsResponse> = {
          message: 'OK',
          data,
        };
        return reply.send(response);
      } catch (error) {
        (request as any).log?.error(error);
        return reply.status(500).send({
          message: 'Error fetching login stats',
          data: null,
        });
      }
    }
  );
}
