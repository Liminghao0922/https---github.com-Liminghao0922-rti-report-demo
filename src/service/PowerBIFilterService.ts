/*
SPDX-FileCopyrightText: Copyright (c) 2024 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
SPDX-License-Identifier: MIT
*/

import { Report } from 'powerbi-client';
import { models } from 'powerbi-client';

export class PowerBIFilterService {
  private report: Report | null = null;

  setReportInstance(report: Report) {
    this.report = report;
  }

  /**
   * 应用区域过滤器 - 简单的单值过滤
   */
  async applyRegionFilter(region: string): Promise<void> {
    if (!this.report) {
      console.error('❌ Report instance not initialized');
      return;
    }

    try {
      const filter: models.IBasicFilter = {
        $schema: process.env.POWERBI_BASIC_FILTER_SCHEMA,
        target: {
          table: process.env.POWERBI_TABLE_NAME,
          column: process.env.POWERBI_TABLE_COLUMN_NAME,
        },
        operator: 'In',
        values: [region],
        filterType: models.FilterType.Basic,
      };

      await this.report.setFilters([filter]);
      console.log(`✅ Filter applied: ${process.env.POWERBI_TABLE_COLUMN_NAME} = ${region}`);
    } catch (error) {
      console.error('❌ Failed to apply filter:', error);
    }
  }

  /**
   * 清除所有过滤器
   */
  async clearFilters(): Promise<void> {
    if (!this.report) {
      console.error('❌ Report instance not initialized');
      return;
    }

    try {
      await this.report.setFilters([]);
      console.log('✅ All filters cleared');
    } catch (error) {
      console.error('❌ Failed to clear filters:', error);
    }
  }
}

export const powerBIFilterService = new PowerBIFilterService();
