import { createClient } from 'redis';

const client = createClient();

try {
    await client.connect();

} catch(err) {
    console.log("client could not connect", err)
    process.exit()
}


export { client }