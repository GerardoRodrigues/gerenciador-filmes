import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MoviesListResponse } from '../../types/movies-list-response';
import { IMovieToFavoriteSuccessResponse } from '../../models/movie-to-favorite-success-response';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesApi {
  private readonly URL = 'http://localhost:3000';
  private readonly _httpClient = inject(HttpClient);

  getFavorites() {
    return this._httpClient.get<MoviesListResponse>(`${this.URL}/favorites`);
  }

  addMovieToFavorites(movieID: number) {
    return this._httpClient.post<IMovieToFavoriteSuccessResponse>(
      `${this.URL}/favorites/${movieID}`,
      {},
    );
  }

  removeMovieFromFavorites(movieID: number) {
    return this._httpClient.delete<void>(`${this.URL}/favorites/${movieID}`);
  }

  isMovieInFavorites(movieID: number) {
    const movieList = this.getFavorites();
    return movieList.pipe(
      map((movies) => (movies.find((movie) => movie.id === movieID) ? true : false)),
    );
  }

  toggleMovieInFavorites(
    movieID: number,
    isFavorite: boolean,
  ): Observable<void | IMovieToFavoriteSuccessResponse> {
    const remove = isFavorite;

    if (remove) {
      return this.removeMovieFromFavorites(movieID);
    } else {
      return this.addMovieToFavorites(movieID);
    }
  }
}
