/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrderLineResponse } from '../../models/order-line-response';

export interface FindOrderById$Params {
  orderId: number;
}

export function findOrderById(http: HttpClient, rootUrl: string, params: FindOrderById$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderLineResponse>>> {
  const rb = new RequestBuilder(rootUrl, findOrderById.PATH, 'get');
  if (params) {
    rb.path('orderId', params.orderId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<OrderLineResponse>>;
    })
  );
}

findOrderById.PATH = '/api/orderline/order/{orderId}';
