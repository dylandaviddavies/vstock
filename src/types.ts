export interface IStock {
  symbol: string;
  buyPrice?: number;
}
export class Stock {
  symbol?: string;
  buyPrice?: number;
  constructor(params: IStock) {
    Object.assign(this, params);
  }
}

export enum StyleState {
  Default,
  RedAlert
}

export interface IUser {
  name?: string;
  img?: string;
}
export class User {
  name?: string;
  img?: string;
  constructor(params: IUser) {
    Object.assign(this, params);
  }
}