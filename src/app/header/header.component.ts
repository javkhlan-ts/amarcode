import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    collapsed = true;
    catalogItems = ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'SASS', 'Python'];
    
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;

    constructor(private authService: AuthService){}

    ngOnInit(){
        this.authListenerSubs = this.authService.getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    onLogout(){
        this.authService.logout();
    }

    ngOnDestroy(){
        this.authListenerSubs.unsubscribe();
    }

}