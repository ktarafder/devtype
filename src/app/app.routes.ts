import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,

    },
    {
        path: 'signup',
        component: SignUpComponent,
    },
    {
        path: 'game',
        component: GameComponent,
    },
];
