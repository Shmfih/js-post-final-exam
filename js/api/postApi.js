import fetchClient from "./fetchClient.js";
import AppConstants from "../appConstants.js";

class PostAPI {

    getResourceName(){
        return 'posts';
    }

    getAll (params) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
        const defaultParams = { _page: AppConstants.DEFAULT_PAGE, _limit: AppConstants.DEFAULT_LIMIT};
        
        //console.log(url)
        if(params){    
            return fetchClient.get(url,params);
        }
        else {
            return fetchClient.get(url,defaultParams)
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
        const url = `${AppConstants.API_URL}/${this.getResourceName()}/${post.id}`;
        return fetchClient.patch(url,post);
    }

    remove (postID) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postID}`;
        return fetchClient.delete(url);
    }

}

const postApi = new PostAPI;
export default postApi;
