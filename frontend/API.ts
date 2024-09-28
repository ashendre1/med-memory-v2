const BASE_URL = 'http://localhost:9090';

interface ApiCallData {
    [key: string]: any; // Adjust this type according to your data structure
}

const apiCall = async <T>(
    endpoint: string,
    method: 'GET' | 'POST',
    data?: ApiCallData
): Promise<T> => {
    let url = `${BASE_URL}${endpoint}`;

    if (method === 'GET' && data) {
        const queryParams = new URLSearchParams(data).toString();
        url += `?${queryParams}`;
    }
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: method !== 'GET' ? JSON.stringify(data) : null
        });

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const signupUser = (data: ApiCallData): Promise<any> => apiCall('/register/addUser', 'POST', data);
export const loginUser = (data: ApiCallData): Promise<any> => apiCall('/register/authenticate', 'GET', data);
export const checkSession = (): Promise<any> => apiCall('/userSession/check-session', 'GET');
export const uploadPrescription = (data: ApiCallData): Promise<any> => apiCall('/prescription/upload', 'POST', data);
