import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieDetailDTO } from '../auth/models/movie-detail.dto';
import { CreateMovieDTO } from '../auth/models/create-movie.dto';
import { UpdateMovieDTO } from '../auth/models/update-movie.dto';

@Injectable({
    providedIn: 'root'
})
export class MovieService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.baseUrl}movies`;

    getMovies(): Observable<MovieDetailDTO[]> {
        return this.http
            .get<{ result: MovieDetailDTO[] }>(this.apiUrl)
            .pipe(
                map(response => response.result)
            );
    }

    deleteMovie(title: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/by-title/${title}`);
    }

    createMovie(movie: CreateMovieDTO): Observable<any> {
        return this.http.post(this.apiUrl, movie);
    }

    updateMovie(title: string, updateMovieDTO: UpdateMovieDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}/by-title/${title}`, updateMovieDTO);
    }

    getMovieByTitle(title: string): Observable<MovieDetailDTO> {
        return this.http
            .get<{ result: MovieDetailDTO }>(`${this.apiUrl}/by-title/${title}`)
            .pipe(map(response => response.result));
    }
}