import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, loginGuard } from './guards.guard';
import { FeedComponent } from './pages/feed/feed.component';
import { FriendRequestsComponent } from './pages/friend-requests/friend-requests.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'account/login',
        pathMatch: 'full'
    },
    {
        path: 'account/login',
        component: LoginComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'cb', 
        component:LayoutComponent,
        children: [
            {
                path: 'cb',
                redirectTo: 'feed',
                pathMatch: 'full'
            },
            {
                path: 'feed',
                component: FeedComponent,
                canActivate: [authGuard]
            },
            {
                path: 'friend-requests',
                component: FriendRequestsComponent,
                canActivate: [authGuard]
            },
            {
                path: 'messages',
                component: MessagesComponent,
                canActivate: [authGuard]
            },
            {
                path: 'messages/:id',
                component: MessagesComponent,
                canActivate: [authGuard]
            },
            {
                path: 'profile/:username',
                component: ProfileComponent,
                canActivate: [authGuard]
            }
        ]
    }
];
