import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { NotFound } from './shared/components/not-found/not-found';
import { RoleList } from './features/dashboard/components/role-list/role-list';
import { AddRole } from './features/dashboard/components/add-role/add-role';
import { UserList } from './features/dashboard/components/user-list/user-list';
import { AddUser } from './features/dashboard/components/add-user/add-user';
import { MovieList } from './features/dashboard/components/movie-list/movie-list';
import { AddMovie } from './features/dashboard/components/add-movie/add-movie';
import { ChangePassword } from './features/dashboard/components/change-password/change-password';
import { Home } from './features/dashboard/components/home/home';
import { authGuard } from './core/guards/auth-guard';
import { EditUser } from './features/dashboard/components/edit-user/edit-user';
import { EditMovie } from './features/dashboard/components/edit-movie/edit-movie';


export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth/login', component: Login },
    {
        path: 'dashboard', component: Dashboard, canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home },
            { path: 'roles', component: RoleList },
            { path: 'add-role', component: AddRole },
            { path: 'users', component: UserList },
            { path: 'add-user', component: AddUser },
            { path: 'edit-user/:email', component: EditUser },
            { path: 'movies', component: MovieList },
            { path: 'add-movie', component: AddMovie },
            { path: 'edit-movie/:title', component: EditMovie },
            { path: 'change-password', component: ChangePassword },
        ]
    },
    { path: '**', component: NotFound },
];
