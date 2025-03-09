/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { approvePrescription } from '../fn/prescription-controller/approve-prescription';
import { ApprovePrescription$Params } from '../fn/prescription-controller/approve-prescription';
import { uploadPrescription } from '../fn/prescription-controller/upload-prescription';
import { UploadPrescription$Params } from '../fn/prescription-controller/upload-prescription';

@Injectable({ providedIn: 'root' })
export class PrescriptionControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `approvePrescription()` */
  static readonly ApprovePrescriptionPath = '/api/prescriptions/{id}/approve';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `approvePrescription()` instead.
   *
   * This method doesn't expect any request body.
   */
  approvePrescription$Response(params: ApprovePrescription$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return approvePrescription(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `approvePrescription$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  approvePrescription(params: ApprovePrescription$Params, context?: HttpContext): Observable<{
}> {
    return this.approvePrescription$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `uploadPrescription()` */
  static readonly UploadPrescriptionPath = '/api/prescriptions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadPrescription()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadPrescription$Response(params: UploadPrescription$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return uploadPrescription(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadPrescription$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadPrescription(params: UploadPrescription$Params, context?: HttpContext): Observable<{
}> {
    return this.uploadPrescription$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

}
