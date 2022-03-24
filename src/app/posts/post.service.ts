import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsSubject = new Subject<Post[]>();

    constructor (private http: HttpClient, private router: Router) {}

    getPosts() {
        this.http
            .get<{message: string, posts: any}>("http://localhost:3000/api/posts")
            .pipe(map(postsFromMongoDB => {
                return postsFromMongoDB.posts.map(post => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        imagePath: post.imagePath,
                        videoPath: post.videoPath
                    };
                });
            }))
            .subscribe(pipedPosts => {
                this.posts =  pipedPosts;
                this.postsSubject.next([...this.posts]);
            });
    }
    getPost(id: string){
        return {...this.posts.find(p => p.id === id)};
    }

    getPostsSubjectListener() {
        return this.postsSubject.asObservable();
    }

    addPost(title: string, content: string, image: File, video: File) {
        const postData = new FormData(); //text + blob
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        postData.append("video", video, title);

        this.http.post<{message: string, post: Post}>
            ("http://localhost:3000/api/posts", postData)
            .subscribe(res => {
                const post: Post = {
                    id: res.post.id, 
                    title: title, 
                    content: content,
                    imagePath: res.post.imagePath, 
                    videoPath: res.post.videoPath};
                post.id = res.post.id;
                this.posts.push(post);
                this.postsSubject.next([...this.posts]);
                this.router.navigate(['/myuploads']);
            },
            errorRespose => {
                console.log(errorRespose);
            });
    }

    deletePost(postId: string) {
        this.http
            .delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsSubject.next([...this.posts]);
            });
    }
}

