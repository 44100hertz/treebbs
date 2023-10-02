
export type PostId = number;

export type Post = {
  id: PostId,
  parentId: PostId,
  author: string,
  body: string,
  createdAt: Date,
  replyCount: number,
}

export type PostCreate = Pick<Post, 'author' | 'body' | 'parentId'> & { parentId: PostId };