import { Component, inject, signal } from '@angular/core';
import { MoviesList } from '../../../../shared/components/movies-list/movies-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-movies',
  imports: [MoviesList],
  templateUrl: './explore-movies.html',
  styleUrl: './explore-movies.css',
})
export class ExploreMovies {
  movies = signal([{}]);

  private readonly _router = inject(Router);

  adicionarFilme() {
    this._router.navigate(['create']);
  }
}
