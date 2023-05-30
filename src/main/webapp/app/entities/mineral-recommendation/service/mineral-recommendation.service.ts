import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMineralRecommendation, NewMineralRecommendation } from '../mineral-recommendation.model';

export type PartialUpdateMineralRecommendation = Partial<IMineralRecommendation> & Pick<IMineralRecommendation, 'id'>;

export type EntityResponseType = HttpResponse<IMineralRecommendation>;
export type EntityArrayResponseType = HttpResponse<IMineralRecommendation[]>;

@Injectable({ providedIn: 'root' })
export class MineralRecommendationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mineral-recommendations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mineralRecommendation: NewMineralRecommendation): Observable<EntityResponseType> {
    return this.http.post<IMineralRecommendation>(this.resourceUrl, mineralRecommendation, { observe: 'response' });
  }

  update(mineralRecommendation: IMineralRecommendation): Observable<EntityResponseType> {
    return this.http.put<IMineralRecommendation>(
      `${this.resourceUrl}/${this.getMineralRecommendationIdentifier(mineralRecommendation)}`,
      mineralRecommendation,
      { observe: 'response' }
    );
  }

  partialUpdate(mineralRecommendation: PartialUpdateMineralRecommendation): Observable<EntityResponseType> {
    return this.http.patch<IMineralRecommendation>(
      `${this.resourceUrl}/${this.getMineralRecommendationIdentifier(mineralRecommendation)}`,
      mineralRecommendation,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMineralRecommendation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMineralRecommendation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMineralRecommendationIdentifier(mineralRecommendation: Pick<IMineralRecommendation, 'id'>): number {
    return mineralRecommendation.id;
  }

  compareMineralRecommendation(o1: Pick<IMineralRecommendation, 'id'> | null, o2: Pick<IMineralRecommendation, 'id'> | null): boolean {
    return o1 && o2 ? this.getMineralRecommendationIdentifier(o1) === this.getMineralRecommendationIdentifier(o2) : o1 === o2;
  }

  addMineralRecommendationToCollectionIfMissing<Type extends Pick<IMineralRecommendation, 'id'>>(
    mineralRecommendationCollection: Type[],
    ...mineralRecommendationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mineralRecommendations: Type[] = mineralRecommendationsToCheck.filter(isPresent);
    if (mineralRecommendations.length > 0) {
      const mineralRecommendationCollectionIdentifiers = mineralRecommendationCollection.map(
        mineralRecommendationItem => this.getMineralRecommendationIdentifier(mineralRecommendationItem)!
      );
      const mineralRecommendationsToAdd = mineralRecommendations.filter(mineralRecommendationItem => {
        const mineralRecommendationIdentifier = this.getMineralRecommendationIdentifier(mineralRecommendationItem);
        if (mineralRecommendationCollectionIdentifiers.includes(mineralRecommendationIdentifier)) {
          return false;
        }
        mineralRecommendationCollectionIdentifiers.push(mineralRecommendationIdentifier);
        return true;
      });
      return [...mineralRecommendationsToAdd, ...mineralRecommendationCollection];
    }
    return mineralRecommendationCollection;
  }
}
