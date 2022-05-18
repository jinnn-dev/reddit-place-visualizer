import chroma from "chroma-js"

export const COLOR_MAPPING: Map<number, number[]> = new Map([
    [0, [109, 0, 26]],
    [1, [109, 0, 57]],
    [2, [190, 0, 57]],
    [3, [255, 168, 0]],
    [4, [255, 214, 53]],
    [5, [255, 248, 184]],
    [6, [0, 163, 104]],
    [7, [0, 204, 120]],
    [8, [126, 237, 86]],
    [9, [0, 117, 111]],
    [10, [0, 158, 170]],
    [11, [0, 204, 192]],
    [12, [36, 80, 164]],
    [13, [54, 144, 234]],
    [14, [81, 233, 244]],
    [15, [73, 58, 193]],
    [16, [106, 92, 255]],
    [17, [148, 179, 255]],
    [18, [129, 30, 159]],
    [19, [180, 74, 192]],
    [20, [228, 171, 255]],
    [21, [222, 16, 127]],
    [22, [255, 56, 129]],
    [23, [255, 153, 170]],
    [24, [109, 72, 47]],
    [25, [156, 105, 38]],
    [26, [255, 180, 112]],
    [27, [0, 0, 0]],
    [28, [81, 82, 82]],
    [29, [137, 141, 144]],
    [30, [212, 215, 127]],
    [31, [255, 255, 255]]]
)


export function perc2color(perc: number) {
    var r, g, b = 0;
    if (perc == 100) {
        r = 0;
        g = 0;
    } else if (perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
    } else {
        g = 255;
        r = Math.round(510 - 5.10 * perc);
    }
    return [r, g, b]
}

const colors = [[255,222,115],[242,198,98],[227,174,82],[212,151,68],[197,128,55],[180,106,43],[163,84,33],[145,63,23],[127,41,15],[108,16,6],[96,0,0],[91,0,0],[86,0,0],[81,0,0],[76,0,0],[71,0,0],[67,0,0],[63,0,0],[60,0,0],[0,0,0]]
// export function rgbColors() {
//     const rgb = [];
//     for (const color of colors) {
//         const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
//         if (!result) return
//         const r = parseInt(result[1], 16)
//         const g = parseInt(result[2], 16)
//         const b = parseInt(result[3], 16)
//         rgb.push([r, g, b])
//     }
//     return rgb
// }

export function getHeatmapColor(percentage: number) {
    return colors[Math.round(percentage * (colors.length - 1))]
}

export const colorScale = chroma.scale(['#ffde73', '#630000', '#000000']).mode('lch').colors(20)