import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../../movies/movie.service';
import { SessionService } from '../../../../core/services/session.service';
import { filter, take, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-movie',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-movie.html',
})
export class AddMovie {
  addMovieForm: FormGroup;
  submitted = false;
  errorMessage = '';
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private sessionService: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.addMovieForm = this.fb.group({
      title:       ['', Validators.required],
      director:    ['', Validators.required],
      releaseDate: ['', Validators.required],
      budget:      [null, [Validators.required, Validators.min(0)]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addMovieForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addMovieForm.invalid) return;

    this.sessionService.session$.pipe(
      filter(s => s !== null),
      take(1),
      switchMap(() => this.movieService.createMovie(this.addMovieForm.value))
    ).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.submitted = false;
        this.addMovieForm.reset();
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
    this.router.navigate(['/dashboard/home']);
  }
}
