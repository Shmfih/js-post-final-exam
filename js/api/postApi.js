import fetchClient from "./fetchClient.js";
import AppConstants from "../appConstants.js";

class PostAPI {

    getResourceName(){
        return 'posts';
    }

    getAll (params) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
        const defaultParams = { _page: AppConstants.DEFAULT_PAGE, _limit: AppConstants.DEFAULT_LIMIT};
        
        if(!params){    
            return fetchClient.get(url,defaultParams);
        }
        else {
            return fetchClient.get(url,params)
        }
    }

    getDetail (postID) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postID}`;
        return fetchClient.get(url);
    }
 
    add (post) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
        return fetchClient.post(url,post);
    }

    update (post) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postID}`;
        return fetchClient.patch(url,post);
    }

    remove (postID) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postID}`;
        return fetchClient.delete(url);
    }

}

const postApi = new PostAPI;
export default postApi;
