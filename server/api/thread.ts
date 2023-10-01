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

    const posts = await client.query(
        `
        SELECT A.id, A.parent_id, A.author, A.body, A.created_at, 
        (SELECT COUNT(B.id) 
            FROM posts B 
            WHERE B.parent_id = A.id) AS reply_count
        FROM posts A
        WHERE A.parent_id = $1
        ORDER BY A.created_at DESC`,
        [query.id]
    );

    await client.end();
    return posts.rows.map((row, i) => ({
        id: row.id,
        author: row.author,
        body: row.body,
        createdAt: row.created_at,
        parentId: row.parent_id,
        replyCount: row.reply_count,
    }));
});
