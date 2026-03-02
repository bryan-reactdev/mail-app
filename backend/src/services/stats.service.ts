import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { LoginLog } from '../entities/LoginLog';

export interface LoginStatsByMonth {
  month: string;
  monthLabel: string;
  count: number;
}

export interface LoginStatsResponse {
  byMonth: LoginStatsByMonth[];
  total: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export class StatsService {
  private loginLogRepository: Repository<LoginLog>;

  constructor() {
    this.loginLogRepository = AppDataSource.getRepository(LoginLog);
  }

  async getLoginStats(): Promise<LoginStatsResponse> {
    const total = await this.loginLogRepository.count();

    const months: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthKey);
    }

    const byMonth: LoginStatsByMonth[] = [];
    for (const monthKey of months) {
      const [year, monthNum] = monthKey.split('-');
      const start = new Date(parseInt(year, 10), parseInt(monthNum, 10) - 1, 1);
      const end = new Date(parseInt(year, 10), parseInt(monthNum, 10), 0, 23, 59, 59, 999);

      const count = await this.loginLogRepository
        .createQueryBuilder('log')
        .where('log.created_at >= :start', { start })
        .andWhere('log.created_at <= :end', { end })
        .getCount();

      byMonth.push({
        month: monthKey,
        monthLabel: MONTH_LABELS[parseInt(monthNum, 10) - 1],
        count,
      });
    }

    return { byMonth, total };
  }
}
