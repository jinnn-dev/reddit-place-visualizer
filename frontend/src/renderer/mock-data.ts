import type {PixelData} from "@/model/pixelData";


export function generateData(amount: number = 1000): PixelData[] {
    let data: PixelData[] = []
    console.log("Hello")
    for (let x = 0; x < amount; x++) {

        for (let y = 0; y < amount; y++) {
            data.push({
                user_id: '1234',
                pixel_color: "#000000".replace(/0/g, function () {
                    return (~~(Math.random() * 16)).toString(16);
                }),
                // pixel_color: '#FF0000',
                x,
                y
            })
        }
    }
    return data
}

export function generateChangesTime(amount = 101): number[][] {
    const changes: number[][] = []
    for (let i = 0; i < amount; i++) {
        changes[i] = [];
        for (let j = 0; j < 1000 * i; j++) {
            changes[i].push(Math.floor(Math.random() * 2000 * 2000), Math.floor(Math.random() * 32))
        }
    }
    return changes;
}

export function generateChanges(amount: number): number[][] {
    const changes: number[][] = [];


    fetch('/xaa', {
        headers: {
            'content-type': 'text/csv;charset=UTF-8',
        }
    }).then(r => r.text()).then(data => console.log(data.length))
    // for (let i = 0; i < amount; i++) {
    //     // changes.push([Math.floor(Math.random() * 2000 * 2000), Math.floor(Math.random() * 2000 * 2000), Math.random() * 32])
    //     // changes.push([1, 1, 31])
    // }
    return changes;
}