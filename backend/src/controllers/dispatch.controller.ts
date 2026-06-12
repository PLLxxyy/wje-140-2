import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DispatchService } from '../services/dispatch.service';
import { FuelService } from '../services/fuel.service';
@Controller('dispatch-orders')
export class DispatchController {
  constructor(
    private readonly service: DispatchService,
    private readonly fuelService: FuelService
  ) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }
  @Post() create(@Body() payload: any) { return this.service.create(payload); }
  @Get('fuel-cost-differences')
  getFuelCostDifferences(@Query('status') status?: string) {
    return this.service.getFuelCostDifferences(status);
  }
  @Get(':id/fuel-cost-difference')
  getFuelCostDifference(@Param('id') id: string) {
    return this.service.getFuelCostDifference(Number(id));
  }
  @Get(':id/fuel-records')
  getFuelRecords(@Param('id') id: string) {
    return this.fuelService.findByDispatchOrderId(Number(id));
  }
}
