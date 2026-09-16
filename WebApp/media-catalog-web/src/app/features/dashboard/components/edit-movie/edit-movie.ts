import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../movies/movie.service';
import { SessionService } from '../../../../core/services/session.service';
import { filter, take, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-movie',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-movie.html',
})
export class EditMovie implements OnInit {
  editMovieForm: FormGroup;
  submitted = false;
  errorMessage = '';
  submitSuccess = false;
  movieTitle: string = '';

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.editMovieForm = this.fb.group({
      director: ['', Validators.required],
      releaseDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.movieTitle = this.route.snapshot.paramMap.get('title') ?? '';

    this.sessionService.session$.pipe(
      filter(s => s !== null),
      take(1),
      switchMap(() => this.movieService.getMovieByTitle(this.movieTitle))
    ).subscribe({
      next: movie => {
        this.editMovieForm.patchValue({
          director: movie.director,
          releaseDate: movie.releaseDate?.substring(0, 10),
        });
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.editMovieForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editMovieForm.invalid) return;

    this.sessionService.session$.pipe(
      filter(s => s !== null),
      take(1),
      switchMap(() => this.movieService.updateMovie(this.movieTitle, this.editMovieForm.value))
    ).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.submitted = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = err?.error?.message ?? 'An error occurred. Please try again.';
        console.log(this.errorMessage);
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/movies']);
  }

}
