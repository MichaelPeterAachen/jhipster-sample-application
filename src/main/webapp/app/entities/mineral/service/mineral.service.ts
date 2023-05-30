import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMineral, NewMineral } from '../mineral.model';

export type PartialUpdateMineral = Partial<IMineral> & Pick<IMineral, 'id'>;

export type EntityResponseType = HttpResponse<IMineral>;
export type EntityArrayResponseType = HttpResponse<IMineral[]>;

@Injectable({ providedIn: 'root' })
export class MineralService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/minerals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mineral: NewMineral): Observable<EntityResponseType> {
    return this.http.post<IMineral>(this.resourceUrl, mineral, { observe: 'response' });
  }

  update(mineral: IMineral): Observable<EntityResponseType> {
    return this.http.put<IMineral>(`${this.resourceUrl}/${this.getMineralIdentifier(mineral)}`, mineral, { observe: 'response' });
  }

  partialUpdate(mineral: PartialUpdateMineral): Observable<EntityResponseType> {
    return this.http.patch<IMineral>(`${this.resourceUrl}/${this.getMineralIdentifier(mineral)}`, mineral, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMineral>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMineral[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMineralIdentifier(mineral: Pick<IMineral, 'id'>): number {
    return mineral.id;
  }

  compareMineral(o1: Pick<IMineral, 'id'> | null, o2: Pick<IMineral, 'id'> | null): boolean {
    return o1 && o2 ? this.getMineralIdentifier(o1) === this.getMineralIdentifier(o2) : o1 === o2;
  }

  addMineralToCollectionIfMissing<Type extends Pick<IMineral, 'id'>>(
    mineralCollection: Type[],
    ...mineralsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const minerals: Type[] = mineralsToCheck.filter(isPresent);
    if (minerals.length > 0) {
      const mineralCollectionIdentifiers = mineralCollection.map(mineralItem => this.getMineralIdentifier(mineralItem)!);
      const mineralsToAdd = minerals.filter(mineralItem => {
        const mineralIdentifier = this.getMineralIdentifier(mineralItem);
        if (mineralCollectionIdentifiers.includes(mineralIdentifier)) {
          return false;
        }
        mineralCollectionIdentifiers.push(mineralIdentifier);
        return true;
      });
      return [...mineralsToAdd, ...mineralCollection];
    }
    return mineralCollection;
  }
}
