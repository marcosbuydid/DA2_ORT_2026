import { ChangeDetectorRef, Component } from '@angular/core';
import { MovieDetailDTO } from '../../../auth/models/movie-detail.dto';
import { filter, map, Observable, of, switchMap, take } from 'rxjs';
import { MovieService } from '../../../movies/movie.service';
import { SessionService } from '../../../../core/services/session.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
  items = Array.from({ length: 50 });
  movies: MovieDetailDTO[] = [];
  loading = false;
  isAdmin$: Observable<boolean> = of(false);

  constructor(
    private movieService: MovieService,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef
  ) {
    this.isAdmin$ = this.sessionService.session$.pipe(
      map(session => session?.loggedUserRoleName === 'Administrator')
    );
    this.movies = [];
    this.loadMovies();
  }

  private loadMovies(): void {
    this.loading = true;
    this.sessionService.session$
      .pipe(
        filter(session => session !== null),
        take(1),
        switchMap(() => this.movieService.getMovies())
      )
      .subscribe({
        next: response => {
          this.movies = response;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: error => {
          console.error(error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  deleteMovie(title: string): void {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    this.movieService.deleteMovie(title).subscribe({
      next: () => {
        this.movies = this.movies.filter(m => m.title !== title);
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }
}
