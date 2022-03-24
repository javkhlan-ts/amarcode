import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";

import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    form: FormGroup;
    imagePreview: string;

    constructor (private postService: PostService) {}

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null, {validators: [Validators.required]}), 
            image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
            video: new FormControl(null, {validators: [Validators.required]})
        });
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    onVideoPicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({video: file});
    }

    onAddPost(formDirective: FormGroupDirective){
        if(this.form.invalid) return;
        this.postService.addPost(
            this.form.value.title, 
            this.form.value.content, 
            this.form.value.image,
            this.form.value.video);
        formDirective.resetForm();
        this.form.reset();
    }
}

