import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AccountDetailsComponent } from './account-details/account-details.component';

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
        path: 'signin',
        component: SignInComponent,

    },
    {
        path: 'game',
        component: GameComponent,
    },
    {
        path: 'leaderboard',
        component: LeaderboardComponent,
    },
    {
        path: 'account',
        component: AccountDetailsComponent,
    }
];
