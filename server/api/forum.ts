import type { Post, PostId, PostCreate } from "~/defs/forum";

export default defineEventHandler(async (event) => {
    if (event.method == 'POST') {
        const body = await readBody(event);
        addPost(body);
    } else if (event.method == 'GET') {
        let query = getQuery(event);
        if (query.which == 'post') {
            return getPost(Number(query.id));
        } else if (query.which == 'replies') {
            return getReplies(query.id === '' ? null : Number(query.id));
        } else {
            throw new Error("Invalid request");
        }
    }
    throw new Error("Invalid request");
})

const forum: Post[] = [
    { 
        id: 0,
        parentId: null,
        author: "Admin",
        text: "Welcome to TreeBBS. No illegal content by US standards. Have fun :)",
        createdAt: new Date(),
     },
    { 
        id: 1,
        parentId: 0,
        author: "Admin",
        text: "This is a more serious thread.",
        createdAt: new Date(),
     },
    { 
        id: 2,
        parentId: 0,
        author: "Admin",
        text: "This is a less serious thread.",
        createdAt: new Date(),
     },
    { 
        id: 4,
        parentId: 1,
        author: "Admin",
        text: "POLITICS!!!!",
        createdAt: new Date(),
     },
    { 
        id: 5,
        parentId: 2,
        author: "Admin",
        text: "MEMES!!!!",
        createdAt: new Date(),
     },
]

function getPost(targetId: PostId): Post {
    const post = forum.find(({id}) => targetId == id);
    if (!post) {
        throw new Error("Post not found");
    }
    return post;
}

function getReplies(targetId: Post['parentId']): Post[] {
    const reply = forum.filter(({parentId}) => parentId == targetId);
    return reply;
}

function addPost(post: PostCreate): PostId {
    const postOut: Post = {
        id: generatePostId(),
        createdAt: new Date(),
        ...post,
    };
    forum.push(postOut);
    return postOut.id;
}

function generatePostId(): PostId {
    return Math.floor(Math.random() * (2 ** 48));
}