'use strict';

import postApi from './api/postApi.js';
import utils from './utils.js';

const renderPost = async(post) => {
    
    utils.setTextByElementId('postDetailTitle',post.title);
    utils.setTextByElementId('postDetailAuthor',post.author);
    utils.setTextByElementId('postDetailTimeSpan',utils.formatDate(post.createdAt));
    const img = document.querySelector('#postHeroImage');
    if(img){
       img.setAttribute('style', `background-image: url("${post.imageUrl}");`);
    }
    utils.setTextByElementId('postDetailDescription',post.description);
    //const postDescription = document.querySelector('.post-content-wrapper');
    //console.log(postDescription);
    //postDescription.innerHTML = `<p>${post.description}</p>`;

}

const renderEditLink = (post) => {
    const editLink = document.querySelector('#goToEditPageLink');
    if (editLink){
        editLink.href = `add-edit-post.html?postId=${post.id}`;
        editLink.innerHTML = '<i class="fas fa-edit"></i>Edit post';
    }
}

const init = async() => {
    try {
        const params = new URLSearchParams (window.location.search);
        const postId = params.get('postId');
        //console.log(postId)
        if (!postId) return;
        const post = await postApi.getDetail(postId);
        //console.log(post);
        renderEditLink(post);
        renderPost(post);
    } catch (error){
        console.log(error)
    }
}

init();