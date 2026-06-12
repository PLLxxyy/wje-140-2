import { Injectable } from '@nestjs/common';
@Injectable()
export class FuelService {
  private rows = [
    { id: 1, vehicleId: 1, driverId: 1, dispatchOrderId: 1, liters: 240, unitPrice: 7.4, totalAmount: 1776, mileage: 88120, station: '青浦服务区', paymentMethod: 'Company' },
    { id: 2, vehicleId: 1, driverId: 1, dispatchOrderId: 1, liters: 60, unitPrice: 7.5, totalAmount: 450, mileage: 88450, station: '萧山服务区', paymentMethod: 'Company' }
  ];
  findAll() { return this.rows; }
  findOne(id: number) { return this.rows.find((item: any) => item.id === id); }
  create(payload: any) { const row = { ...payload, id: this.rows.length + 1 }; this.rows.push(row); return row; }
  findByDispatchOrderId(dispatchOrderId: number) { return this.rows.filter((item: any) => item.dispatchOrderId === dispatchOrderId); }
  sumByDispatchOrderId(dispatchOrderId: number): number {
    return this.rows
      .filter((item: any) => item.dispatchOrderId === dispatchOrderId)
      .reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0);
  }
}
