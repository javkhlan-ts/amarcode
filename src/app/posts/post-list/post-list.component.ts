import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { PostService } from "../post.service";
import { Post } from "../post.model";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postsSubscription: Subscription;

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.postService.getPosts();
        this.postsSubscription = this.postService.getPostsSubjectListener()
            .subscribe((postsEmitted: Post[]) => {
                this.posts = postsEmitted;
            });
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
    }

    onDelete(postId: string) {
        this.postService.deletePost(postId);
    }
}

