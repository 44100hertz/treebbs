export const MAX_AUTHOR_LEN = 64;
export const MAX_TEXT_LEN = 4096;

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