import { Component, signal, input, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MoviesApi } from '../../services/movies-api/movies-api';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';
import { tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-movie',
  imports: [FormsModule, RouterLink],
  templateUrl: './create-movie.html',
  styleUrl: './create-movie.css',
})
export class CreateMovie {
  private readonly _moviesApi = inject(MoviesApi);
  private readonly _router = inject(Router);

  title = signal<string>('');
  year = signal<number | undefined>(undefined);
  category = signal<string>('');
  description = signal<string>('');

  imagePreview = signal<string | undefined>(undefined);
  selectedFile = signal<File | undefined>(undefined);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);

      if (this.imagePreview()) {
        URL.revokeObjectURL(this.imagePreview()!);
      }

      const urlObject = URL.createObjectURL(file);
      this.imagePreview.set(urlObject);
    }
  }

  createMovieResource = rxResource({
    params: () => this.createMovieData(),
    stream: ({ params }) =>
      this._moviesApi.createMovie(params).pipe(
        tap(() => {
          setTimeout(() => {
            this._router.navigate(['/explore']);
          }, 700);
        }),
      ),
  });

  createMovieData = signal<FormData | undefined>(undefined);

  errorMessage = computed(() => setErrorMessage(this.createMovieResource.error()));
  succesMessage = computed(() => {
    const SUCCESS = this.createMovieResource.hasValue();

    return SUCCESS ? 'Filme criado com sucesso!' : undefined;
  });

  salvar() {
    const formData = new FormData();

    formData.append('titulo', this.title());
    formData.append('anoLancamento', this.year()!.toString());
    formData.append('genero', this.category());
    formData.append('descricao', this.description());
    formData.append('image', this.selectedFile()!);

    this.createMovieData.set(formData);
  }
}
