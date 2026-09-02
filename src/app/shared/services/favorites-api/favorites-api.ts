import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MoviesListResponse } from '../../types/movies-list-response';

@Injectable({
  providedIn: 'root',
})
export class FavoritesApi {
  private readonly URL = 'http://localhost:3000';
  private readonly _httpClient = inject(HttpClient);

  getFavorites() {
    return this._httpClient.get<MoviesListResponse>(`${this.URL}/favorites`);
  }

  addMovieToFavorites() {}

  removeMovieFromFavorites() {}
}
