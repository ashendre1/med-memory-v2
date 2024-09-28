const BASE_URL = 'http://localhost:9090';

const apiCall = async (endpoint, method, data) => {
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

export const registerUser = (data) => apiCall('/register/addUser', 'POST', data);
export const loginUser = (data) => apiCall('/register/authenticate', 'GET', data);
export const checkSession = () => apiCall('/userSession/check-session', 'GET');
export const uploadPrescription = (data) => apiCall('/prescription/upload', 'POST', data);
export const getPatientDetails = () => apiCall('/register/getPatients', 'GET');