import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { UserDetailDTO } from '../../../auth/models/user-detail.dto';
import { filter, map, Observable, of, switchMap, take } from 'rxjs';
import { SessionService } from '../../../../core/services/session.service';
import { UserService } from '../../../users/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  items = Array.from({ length: 50 });
  users: UserDetailDTO[] = [];
  loading = false;
  isAdmin$: Observable<boolean> = of(false);
  loggedUserEmail: string | null = null;
  deleteUserAlertVisible = false;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef
  ) {
    this.isAdmin$ = this.sessionService.session$.pipe(
      map(session => session?.loggedUserRoleName === 'Administrator')
    );
    this.sessionService.session$.pipe(
      filter(s => s !== null),
      take(1)
    ).subscribe(session => {
      this.loggedUserEmail = session!.loggedUser.email;
    });
    this.users = [];
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading = true;
    this.sessionService.session$
      .pipe(
        filter(session => session !== null),
        take(1),
        switchMap(() => this.userService.getUsers())
      )
      .subscribe({
        next: response => {
          this.users = response;
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

  deleteUser(email: string): void {
    if (email === this.loggedUserEmail) {
      this.deleteUserAlertVisible = true;
      this.cdr.detectChanges();
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(email).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.email !== email);
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  closedeleteUserAlert(): void {
    this.deleteUserAlertVisible = false;
  }
}
