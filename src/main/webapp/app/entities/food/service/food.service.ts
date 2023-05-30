import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFood, NewFood } from '../food.model';

export type PartialUpdateFood = Partial<IFood> & Pick<IFood, 'id'>;

export type EntityResponseType = HttpResponse<IFood>;
export type EntityArrayResponseType = HttpResponse<IFood[]>;

@Injectable({ providedIn: 'root' })
export class FoodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/foods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(food: NewFood): Observable<EntityResponseType> {
    return this.http.post<IFood>(this.resourceUrl, food, { observe: 'response' });
  }

  update(food: IFood): Observable<EntityResponseType> {
    return this.http.put<IFood>(`${this.resourceUrl}/${this.getFoodIdentifier(food)}`, food, { observe: 'response' });
  }

  partialUpdate(food: PartialUpdateFood): Observable<EntityResponseType> {
    return this.http.patch<IFood>(`${this.resourceUrl}/${this.getFoodIdentifier(food)}`, food, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFood>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFood[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFoodIdentifier(food: Pick<IFood, 'id'>): number {
    return food.id;
  }

  compareFood(o1: Pick<IFood, 'id'> | null, o2: Pick<IFood, 'id'> | null): boolean {
    return o1 && o2 ? this.getFoodIdentifier(o1) === this.getFoodIdentifier(o2) : o1 === o2;
  }

  addFoodToCollectionIfMissing<Type extends Pick<IFood, 'id'>>(
    foodCollection: Type[],
    ...foodsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const foods: Type[] = foodsToCheck.filter(isPresent);
    if (foods.length > 0) {
      const foodCollectionIdentifiers = foodCollection.map(foodItem => this.getFoodIdentifier(foodItem)!);
      const foodsToAdd = foods.filter(foodItem => {
        const foodIdentifier = this.getFoodIdentifier(foodItem);
        if (foodCollectionIdentifiers.includes(foodIdentifier)) {
          return false;
        }
        foodCollectionIdentifiers.push(foodIdentifier);
        return true;
      });
      return [...foodsToAdd, ...foodCollection];
    }
    return foodCollection;
  }
}
