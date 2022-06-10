import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

export function request<T>(resource: string, config: AxiosRequestConfig = {}): Promise<T> {
  return axios.get<T>(resource, config).then((res) => res.data);
}
