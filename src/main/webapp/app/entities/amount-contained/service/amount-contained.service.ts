import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAmountContained, NewAmountContained } from '../amount-contained.model';

export type PartialUpdateAmountContained = Partial<IAmountContained> & Pick<IAmountContained, 'id'>;

export type EntityResponseType = HttpResponse<IAmountContained>;
export type EntityArrayResponseType = HttpResponse<IAmountContained[]>;

@Injectable({ providedIn: 'root' })
export class AmountContainedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/amount-containeds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(amountContained: NewAmountContained): Observable<EntityResponseType> {
    return this.http.post<IAmountContained>(this.resourceUrl, amountContained, { observe: 'response' });
  }

  update(amountContained: IAmountContained): Observable<EntityResponseType> {
    return this.http.put<IAmountContained>(`${this.resourceUrl}/${this.getAmountContainedIdentifier(amountContained)}`, amountContained, {
      observe: 'response',
    });
  }

  partialUpdate(amountContained: PartialUpdateAmountContained): Observable<EntityResponseType> {
    return this.http.patch<IAmountContained>(`${this.resourceUrl}/${this.getAmountContainedIdentifier(amountContained)}`, amountContained, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAmountContained>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAmountContained[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAmountContainedIdentifier(amountContained: Pick<IAmountContained, 'id'>): number {
    return amountContained.id;
  }

  compareAmountContained(o1: Pick<IAmountContained, 'id'> | null, o2: Pick<IAmountContained, 'id'> | null): boolean {
    return o1 && o2 ? this.getAmountContainedIdentifier(o1) === this.getAmountContainedIdentifier(o2) : o1 === o2;
  }

  addAmountContainedToCollectionIfMissing<Type extends Pick<IAmountContained, 'id'>>(
    amountContainedCollection: Type[],
    ...amountContainedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const amountContaineds: Type[] = amountContainedsToCheck.filter(isPresent);
    if (amountContaineds.length > 0) {
      const amountContainedCollectionIdentifiers = amountContainedCollection.map(
        amountContainedItem => this.getAmountContainedIdentifier(amountContainedItem)!
      );
      const amountContainedsToAdd = amountContaineds.filter(amountContainedItem => {
        const amountContainedIdentifier = this.getAmountContainedIdentifier(amountContainedItem);
        if (amountContainedCollectionIdentifiers.includes(amountContainedIdentifier)) {
          return false;
        }
        amountContainedCollectionIdentifiers.push(amountContainedIdentifier);
        return true;
      });
      return [...amountContainedsToAdd, ...amountContainedCollection];
    }
    return amountContainedCollection;
  }
}
