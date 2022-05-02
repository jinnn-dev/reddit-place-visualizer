
export async function getDataBetweenTimestamps(start: number = 1, stop: number = 2) {
    const result = await fetch(`http://localhost:5000/dataBetweenTimestamps?start=${start}&stop=${stop}`)

    return await result.json();
}
