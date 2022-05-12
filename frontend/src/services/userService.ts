import type {UserData} from "@/model/userData";
import {request} from "@/services/request";
import type {UserRank} from "@/model/userRank";
const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL;

export class UserService {
    private static basePath = '/user/'

    public static async getRandomUser(): Promise<UserData> {
        const data = await request<UserData>(`${IMAGE_API_URL}${UserService.basePath}random`);
        return data
    }

    public static async getUserRanking(from: number, to: number): Promise<UserRank[]> {
        return request<UserRank[]>(`${IMAGE_API_URL}${UserService.basePath}ranking/${from}/${to}`)
    }
}