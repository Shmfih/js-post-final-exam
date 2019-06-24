


const request = async(url, options) => {

    try {
        const requestOptions = {
            ...options,
            headers: {
            'Content-Type': 'application/json'
            },
        };
        
        
        
            const response = await fetch(url,requestOptions);
            // Muốn sử dụng được await thì hàm phải là một hàm async
        
            if(response.status >=200 && response.status <300){
            return response.json();
            }

        const error = new Error(response.status);
        throw error; // tạo ra lỗi cho parent, parent bắt lỗi bằng .catch()

    } catch {
        // Handle error
        const error = new Error(response.status);
        throw error; // tạo ra lỗi cho parent, parent bắt lỗi bằng .catch()
    };

};

const get = (url, params) =>  request(url, { method: 'GET'});

const post = (url, body) => request(url, {
    body: JSON.stringify(body),
    method: 'POST'
});

const patch = (url, body) => request(url, {
    body: JSON.stringify(body),
    method: 'PATCH'
});

const deleteRequest = (url) => request(url, { method: 'DELETE'});

const fetchClient = {
    get, //do cùng tên nên không cần ghi get: get
    post,
    patch,
    delete: deleteRequest,
};

export default fetchClient;