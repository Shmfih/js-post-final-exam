


const request = async(url, options) => {

    try {
        const requestOptions = {
            ...options,
            headers: {
            'Content-Type': 'application/json'
            },
        };
        
        
        
            const response = await fetch(url,requestOptions);

        
            if(response.status >=200 && response.status <300){
            return response.json();
            }

        const error = new Error(response.status);
        throw error;

    } catch {
        // Handle error
        const error = new Error(response.status);
        throw error;
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
    get,
    post,
    patch,
    delete: deleteRequest,
};

export default fetchClient;