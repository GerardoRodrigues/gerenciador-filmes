import { Component, computed, inject } from '@angular/core';
import { MoviesList } from '../../../../shared/components/movies-list/movies-list';
import { FavoritesApi } from '../../../../shared/services/favorites-api/favorites-api';
import { rxResource } from '@angular/core/rxjs-interop';
import { Spinner } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-favorite-movies',
  imports: [MoviesList, Spinner],
  templateUrl: './favorite-movies.html',
  styleUrl: './favorite-movies.css',
})
export class FavoriteMovies {
  private readonly _favoritesApi = inject(FavoritesApi);

  favoritesResource = rxResource({
    params: () => true,
    stream: () => this._favoritesApi.getFavorites(),
  });

  favoritesList = computed(() => {
    const HAS_ERRO_ON_RESPONSE = !!this.favoritesResource.error();

    if (HAS_ERRO_ON_RESPONSE) return [];

    return this.favoritesResource.value() ?? [];
  });
}
