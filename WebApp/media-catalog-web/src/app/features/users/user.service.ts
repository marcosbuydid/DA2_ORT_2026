import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDetailDTO } from '../auth/models/user-detail.dto';
import { ChangePasswordDTO } from '../auth/models/change-password.dto';
import { CreateUserDTO } from '../auth/models/create-user.dto';
import { UpdateUserDTO } from '../auth/models/update-user.dto';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.baseUrl}users`;

    getUsers(): Observable<UserDetailDTO[]> {
        return this.http
            .get<{ result: UserDetailDTO[] }>(this.apiUrl)
            .pipe(
                map(response => response.result)
            );
    }

    deleteUser(email: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/by-email/${email}`);
    }

    changePassword(email: string, changePasswordDTO: ChangePasswordDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}/by-email/${email}/password`, changePasswordDTO);
    }

    createUser(user: CreateUserDTO): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }

    updateUser(email: string, updateUserDTO: UpdateUserDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}/by-email/${email}`, updateUserDTO);
    }

    getUserByEmail(email: string): Observable<UserDetailDTO> {
        return this.http
            .get<{ result: UserDetailDTO }>(`${this.apiUrl}/by-email/${email}`)
            .pipe(map(response => response.result));
    }
}