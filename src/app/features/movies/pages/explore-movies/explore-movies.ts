import { Component, inject, linkedSignal, signal } from '@angular/core';
import { MoviesList } from '../../../../shared/components/movies-list/movies-list';
import { Router } from '@angular/router';
import { MoviesFilter } from '../../components/movies-filter/movies-filter';
import { MoviesApi } from '../../services/movies-api/movies-api';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-explore-movies',
  imports: [MoviesList, MoviesFilter],
  templateUrl: './explore-movies.html',
  styleUrl: './explore-movies.css',
})
export class ExploreMovies {
  private readonly _router = inject(Router);
  private readonly _moviesApi = inject(MoviesApi);

  movieTitleSearch = signal('');
  movieCategorySearch = signal('');

  moviesResource = rxResource({
    params: () => true,
    stream: () => this._moviesApi.getMovies(),
  });

  moviesList = linkedSignal(() => {
    const moviesList = this.moviesResource.value() ?? [];
    const ERRO_ON_RESPONSE = !!this.moviesResource.error();

    if (ERRO_ON_RESPONSE) return [];

    const titleSearch = this.movieTitleSearch().toLocaleLowerCase().trim();
    const categorySearch = this.movieCategorySearch().toLocaleLowerCase().trim();

    if (!titleSearch && !categorySearch) return moviesList;

    return moviesList.filter((movie) => {
      const titleMatch = movie.titulo.toLowerCase().includes(titleSearch);
      const categoryMatch = movie.genero.toLowerCase().includes(categorySearch);
      return titleMatch && categoryMatch;
    });
  });

  adicionarFilme() {
    this._router.navigate(['create']);
  }

  limparFiltro() {
    this.movieTitleSearch.set('');
    this.movieCategorySearch.set('');
  }
}
