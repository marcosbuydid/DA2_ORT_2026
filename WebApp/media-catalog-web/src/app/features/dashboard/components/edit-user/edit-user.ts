import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../users/user.service';
import { RoleService } from '../../../roles/role.service';
import { RoleDetailDTO } from '../../../auth/models/role-detail.dto';
import { SessionService } from '../../../../core/services/session.service';
import { filter, take, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.html',
})
export class EditUser implements OnInit {
  editUserForm: FormGroup;
  submitted = false;
  errorMessage = '';
  submitSuccess = false;
  roles: RoleDetailDTO[] = [];
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.editUserForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      roleId: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email') ?? '';

    this.sessionService.session$.pipe(
      filter(s => s !== null),
      take(1),
      switchMap(() => this.roleService.getRoles())
    ).subscribe({
      next: roles => {
        this.roles = roles;
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });

    this.sessionService.session$.pipe(
      filter(s => s !== null),
      take(1),
      switchMap(() => this.userService.getUserByEmail(this.email))
    ).subscribe({
      next: user => {
        this.editUserForm.patchValue({
          name: user.name,
          lastName: user.lastName,
          roleId: user.roleId,
        });
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.editUserForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editUserForm.invalid) return;

    this.sessionService.session$.pipe(
      filter(s => s !== null),
      take(1),
      switchMap(() => this.userService.updateUser(this.email, this.editUserForm.value))
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
    this.router.navigate(['/dashboard/users']);
  }
}
