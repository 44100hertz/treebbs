export const MAX_AUTHOR_LEN = 64;
export const MAX_TEXT_LEN = 4096;

export type PostId = number;

export type Post = {
  id: PostId,
  parentId: PostId | null,
  author: string,
  text: string,
  createdAt: Date,
}

export type PostCreate = Pick<Post, 'author' | 'text' | 'parentId'> & { parentId: PostId };