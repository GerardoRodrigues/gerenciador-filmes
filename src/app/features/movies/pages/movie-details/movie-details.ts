import { Component, inject, signal, input, linkedSignal, computed } from '@angular/core';
import { MoviesApi } from '../../services/movies-api/movies-api';
import { rxResource } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { tap } from 'rxjs';
import { FavoritesApi } from '../../../../shared/services/favorites-api/favorites-api';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-movie-details',
  imports: [DecimalPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {
  private readonly _moviesApi = inject(MoviesApi);
  private readonly _favoritesApi = inject(FavoritesApi);

  readonly BASE_URL = environment.baseUrl;

  id = input.required<string>();

  movieDetailsResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._moviesApi.getMovieDetails(+params),
  });

  movieDetails = linkedSignal(() => {
    const ERRO_ON_RESPONSE = !!this.movieDetailsResource.error();

    if (ERRO_ON_RESPONSE) return undefined;

    return this.movieDetailsResource.value();
  });

  currentRating = signal<number | undefined>(undefined);

  starsStatusFilled = computed(() => {
    const rating = this.currentRating() ?? 0;
    const boolArray = [0, 1, 2, 3, 4].map((index) => index < rating);
    return boolArray;
  });

  rateMovieResource = rxResource({
    params: () => {
      const rating = this.currentRating() ?? 0;

      if (rating > 0) {
        return {
          id: +this.id(),
          rating,
        };
      }

      return undefined;
    },
    stream: ({ params }) =>
      this._moviesApi.rateMovie(params.id, params.rating).pipe(
        tap((movieResponse) => {
          this.movieDetails.set(movieResponse);
        }),
      ),
  });

  isFavorite = linkedSignal(() => {
    const ERRO_ON_RESPONSE = !!this.favoriteResource.error();

    if (ERRO_ON_RESPONSE) return false;

    return this.favoriteResource.value() ?? false;
  });

  favoriteResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._favoritesApi.isMovieInFavorites(+params),
  });

  toggleFavoriteParams = signal<boolean | undefined>(undefined);

  toggleFavoriteResource = rxResource({
    params: () => {
      const status = this.toggleFavoriteParams();

      if (status === undefined) return undefined;

      return {
        movieID: +this.id(),
        isFavorite: status,
      };
    },
    stream: ({ params }) =>
      this._favoritesApi
        .toggleMovieInFavorites(params.movieID, params.isFavorite)
        .pipe(tap(() => this.isFavorite.update((cr) => !cr))),
  });

  toggleFavorite() {
    this.toggleFavoriteParams.set(this.isFavorite());
  }

  updateRating(rating: number) {
    if (rating === this.currentRating()) {
      this.currentRating.set(0);
    } else {
      this.currentRating.set(rating);
    }
  }
}
