import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
    selector: 'app-post-content',
    templateUrl: './post-content.component.html',
    styleUrls: ['./post-content.component.css']
})
export class PostContentComponent implements OnInit{
    post: Post;
    private postId: string;

    constructor(private postService: PostService, private route: ActivatedRoute){}

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap)=>{
            if(paramMap.has('postId')){
                this.postId = paramMap.get('postId');
                this.post = this.postService.getPost(this.postId);
            }
        });
    }
}