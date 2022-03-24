import { Component } from "@angular/core";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent{
    intro = [
        {
            icon: 'favorite_border',
            desc: 'Completely Free Tutorials'
        },
        {
            icon: 'sentiment_satisfied_alt',
            desc: 'Fun Exercises and Solutions'
        },
        {
            icon: 'check_circle_outline',
            desc: 'Freaking Awesome Explanations'
        }
    ]
}