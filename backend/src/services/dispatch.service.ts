import { Injectable } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { DispatchStatus } from '../types/enums';
import { FUEL_COST_DIFF_THRESHOLD_PERCENT, FuelCostDifference, FuelCostDifferenceSummary } from '../types/interfaces';
@Injectable()
export class DispatchService {
  constructor(private readonly fuelService: FuelService) {}
  private rows = [
    { id: 1, orderNo: 'DSP-20260612-0001', vehicleId: 1, driverId: 1, origin: '上海青浦仓', destination: '杭州萧山仓', planDepartAt: '2026-06-12 09:00', planArriveAt: '2026-06-12 13:30', actualDepartAt: '2026-06-12 08:55', actualArriveAt: '2026-06-12 13:40', cargo: '冷链食品', weight: 8200, volume: 42, freight: 7200, estimatedFuelCost: 1500, estimatedTollCost: 420, status: 'Completed', profit: 4180 },
    { id: 2, orderNo: 'DSP-20260612-0002', vehicleId: 2, driverId: 2, origin: '南京江宁仓', destination: '苏州工业园仓', planDepartAt: '2026-06-12 07:00', planArriveAt: '2026-06-12 10:00', actualDepartAt: '2026-06-12 07:10', actualArriveAt: '2026-06-12 10:05', cargo: '电子配件', weight: 3500, volume: 18, freight: 3800, estimatedFuelCost: 800, estimatedTollCost: 180, status: 'Completed', profit: 2120 },
    { id: 3, orderNo: 'DSP-20260612-0003', vehicleId: 3, driverId: 3, origin: '广州白云仓', destination: '深圳龙岗仓', planDepartAt: '2026-06-12 14:00', planArriveAt: '2026-06-12 16:30', cargo: '服装鞋帽', weight: 5200, volume: 30, freight: 4600, estimatedFuelCost: 650, estimatedTollCost: 120, status: 'InProgress', profit: 3000 }
  ];
  findAll() { return this.rows; }
  findOne(id: number) { return this.rows.find((item: any) => item.id === id); }
  create(payload: any) { const row = { ...payload, id: this.rows.length + 1 }; this.rows.push(row); return row; }

  private calcDifference(order: any): FuelCostDifference {
    const estimated = order.estimatedFuelCost || 0;
    const actual = this.fuelService.sumByDispatchOrderId(order.id);
    const difference = Number((actual - estimated).toFixed(2));
    const differencePercent = estimated > 0 ? Number(((difference / estimated) * 100).toFixed(2)) : 0;
    const isAbnormal = Math.abs(differencePercent) > FUEL_COST_DIFF_THRESHOLD_PERCENT;
    const fuelRecords = this.fuelService.findByDispatchOrderId(order.id);
    return {
      dispatchOrderId: order.id,
      orderNo: order.orderNo,
      estimatedFuelCost: estimated,
      actualFuelCost: Number(actual.toFixed(2)),
      difference,
      differencePercent,
      isAbnormal,
      fuelRecords
    };
  }

  getFuelCostDifference(id: number): FuelCostDifference | null {
    const order = this.findOne(id);
    if (!order) return null;
    return this.calcDifference(order);
  }

  getFuelCostDifferences(status?: string): FuelCostDifferenceSummary {
    let orders = this.rows;
    if (status) {
      orders = orders.filter((o: any) => o.status === status);
    } else {
      orders = orders.filter((o: any) => o.status === DispatchStatus.Completed);
    }
    const items = orders.map((o: any) => this.calcDifference(o));
    const totalOrders = items.length;
    const abnormalOrders = items.filter((i) => i.isAbnormal).length;
    const totalEstimated = Number(items.reduce((s, i) => s + i.estimatedFuelCost, 0).toFixed(2));
    const totalActual = Number(items.reduce((s, i) => s + i.actualFuelCost, 0).toFixed(2));
    const totalDifference = Number(items.reduce((s, i) => s + i.difference, 0).toFixed(2));
    const avgDifferencePercent = totalOrders > 0
      ? Number((items.reduce((s, i) => s + i.differencePercent, 0) / totalOrders).toFixed(2))
      : 0;
    return { totalOrders, abnormalOrders, totalEstimated, totalActual, totalDifference, avgDifferencePercent, items };
  }
}
