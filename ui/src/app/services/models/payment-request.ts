/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { UserResponse } from '../models/user-response';
export interface PaymentRequest {
  amount?: number;
  customer?: UserResponse;
  orderId?: number;
  orderReference?: string;
  paymentId?: number;
  paymentMethod?: 'MPESA' | 'BANK' | 'BITCOIN' | 'VISA';
}
