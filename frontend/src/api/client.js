import axios from 'axios';
import { clearSession, getAccessToken, setSession } from '../auth/tokenStorage';

const api = axios.create({ baseURL: '/api', withCredentials: true });
const authApi = axios.create({ baseURL: '/api', withCredentials: true });

api.interceptors.request.use(config => {
	const token = getAccessToken();
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config || {};
		const requestUrl = originalRequest.url || '';

		if (
			error.response?.status !== 401 ||
			originalRequest._retry ||
			requestUrl.includes('/auth/login') ||
			requestUrl.includes('/auth/refresh') ||
			requestUrl.includes('/auth/logout')
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		try {
			const { data } = await authApi.post('/auth/refresh');
			setSession({ accessToken: data.accessToken, user: data.user });
			originalRequest.headers = originalRequest.headers || {};
			originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
			return api(originalRequest);
		} catch (refreshError) {
			clearSession();
			return Promise.reject(refreshError);
		}
	}
);

export default api;
export { authApi };
