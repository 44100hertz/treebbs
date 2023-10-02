import { type PostCreate, type PostId } from "~/defs/forum";
import { validate } from "~/defs/validate";
import { Client } from "pg";

export default defineEventHandler(async (event) => {
    const body: PostCreate = await readBody(event);

    const error = validate(body.author, body.body);
    if (error) {
        throw new Error(error);
    }

    const client = new Client({
        host: "localhost",
        port: 5432,
        database: "treebbs",
    });
    const id = generatePostId();
    const createdAt = new Date();
    await client.connect();
    await client.query(
        `
    INSERT INTO posts (id, parent_id, author, body, created_at)
    VALUES ($1, $2, $3, $4, $5);
    `,
        [id, body.parentId, body.author, body.body, createdAt]
    );
    await client.end();
    return { id };
});

function generatePostId(): PostId {
    return Math.floor(Math.random() * 2 ** 31);
}
