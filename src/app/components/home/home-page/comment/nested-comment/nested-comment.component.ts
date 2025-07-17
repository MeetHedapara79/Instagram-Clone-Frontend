import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentSchema } from '../comment.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nested-comment',
  imports: [CommonModule],
  templateUrl: './nested-comment.component.html',
  styleUrl: './nested-comment.component.css'
})
export class NestedCommentComponent {
  @Input() comment!: CommentSchema;
  @Input() defaultImage!: string;
  @Output() replyClicked = new EventEmitter<CommentSchema>();
  showReplies = false;

  onReplyClick() {
    this.replyClicked.emit(this.comment);
  }

  toggleReplies() {
    this.showReplies = !this.showReplies;
  }
}