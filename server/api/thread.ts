import { type Post } from "~/defs/forum";
import { Client } from "pg";

export default defineEventHandler(async (event): Promise<Post[]> => {
    const client = new Client({
        host: "localhost",
        port: 5432,
        database: "treebbs",
    });
    await client.connect();
    const query = getQuery(event);
    const posts = await client.query(`
        SELECT id, parent_id, author, body, created_at
        FROM posts
        WHERE parent_id = ${query.id}
        ORDER BY created_at DESC`);
    await client.end();
    return posts.rows.map((row) => ({
        id: row.id,
        author: row.author,
        body: row.body,
        createdAt: row.created_at,
        parentId: row.parent_id,
    }));
});
