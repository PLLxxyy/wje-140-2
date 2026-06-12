export type Role = 'Admin' | 'FleetManager' | 'Dispatcher' | 'Driver' | 'Mechanic';
export interface AuthUser { id: number; role: Role; name: string; }
export interface ApiResult<T> { data: T; message: string; }

export const FUEL_COST_DIFF_THRESHOLD_PERCENT = 15;

export interface FuelCostDifference {
  dispatchOrderId: number;
  orderNo: string;
  estimatedFuelCost: number;
  actualFuelCost: number;
  difference: number;
  differencePercent: number;
  isAbnormal: boolean;
  fuelRecords: any[];
}

export interface FuelCostDifferenceSummary {
  totalOrders: number;
  abnormalOrders: number;
  totalEstimated: number;
  totalActual: number;
  totalDifference: number;
  avgDifferencePercent: number;
  items: FuelCostDifference[];
}
