import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MoviesListResponse } from '../../../../shared/types/movies-list-response';
import { IMovieSuccessResponse } from '../../../../shared/models/movie-success-response';

@Injectable({
  providedIn: 'root',
})
export class MoviesApi {
  private readonly URL = 'http://localhost:3000';
  private readonly _httpClient = inject(HttpClient);

  getMovies() {
    return this._httpClient.get<MoviesListResponse>(`${this.URL}/movies`);
  }

  getMovieDetails(movieId: number) {
    return this._httpClient.get<IMovieSuccessResponse>(`${this.URL}/movies/${movieId}`);
  }

  rateMovie(movieId: number, rating: number) {
    return this._httpClient.post<IMovieSuccessResponse>(`${this.URL}/movies/${movieId}/rate`, {
      rating,
    });
  }

  createMovie(movieData: FormData) {
    return this._httpClient.post<IMovieSuccessResponse>(`${this.URL}/movies`, movieData);
  }
}
