import { Component, EventEmitter, Injectable, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})

@Injectable()
export class FooterComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;

    constructor(private authService: AuthService){}

    ngOnInit(){
        this.authListenerSubs = this.authService.getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    @Output() footerSelected = new EventEmitter<string>();
    onSelect(footerClicked: string){
        this.footerSelected.emit(footerClicked);
    }

    ngOnDestroy(){
        this.authListenerSubs.unsubscribe();
    }
}