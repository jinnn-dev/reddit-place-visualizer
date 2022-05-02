import { createClient } from 'redis';

const client = createClient();

await client.connect();


await client.json.set("2022-04-04 00:53:51.577 UTC", "$", {
    userId: "ovTZk4GyTS1mDQnTbV+vDOCu1f+u6w+CkIZ6445vD4XN8alFy/6GtNkYp5MSic6Tjo/fBCCGe6oZKMAN3rEZHw==",
    timestamp: "2022-04-04 00:53:51.577 UTC",
    color: "#00CCC0",
    coordinate: {
        x: 826,
        y: 1048
    }
})

const value = await client.json.get('2022-04-04 00:53:51.577 UTC');


console.log("val: ", value)

await client.disconnect();