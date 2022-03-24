import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../posts/post.model";
import { PostService } from "../posts/post.service";

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
    cards: Post[] = [];
    private postsSubscription: Subscription;

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.postService.getPosts();
        this.postsSubscription = this.postService.getPostsSubjectListener()
            .subscribe((postsEmitted: Post[]) => {
                this.cards = postsEmitted;
            });
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
    }
}