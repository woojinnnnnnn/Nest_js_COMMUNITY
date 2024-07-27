import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repositories/reports.repository';

@Injectable()
export class ReportsService {
  constructor(private readonly reportRepository: ReportRepository) {}
}
