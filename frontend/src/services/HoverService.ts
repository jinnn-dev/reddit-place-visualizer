import {request} from "@/services/request";
const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL;

export class HoverService {
    private static basePath = '/pixel/'

    public static async getPixelData({x,y}: {x: number, y: number}): Promise<any> {
        const data = await request<any>(`${IMAGE_API_URL}${HoverService.basePath}${x}_${y}`);
        return data
    }
}