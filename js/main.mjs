'use strict';

import postApi from './api/postApi.js';
import utils from './utils.js';


const renderPostList = (post) => {

  const postItemTemplate = document.querySelector('#postItemTemplate');
  const postItemElement = postItemTemplate.content.cloneNode(true).querySelector('li');
  const titleElement = postItemElement.querySelector('#postItemTitle');
  
  if (titleElement){
    titleElement.innerText = post.title;
  }

  const descriptionElement = postItemElement.querySelector('#postItemDescription');
  if (descriptionElement) {
    descriptionElement.innerText = utils.truncateTextlength(post.description, 100);
  }

  const imageElement = postItemElement.querySelector('#postItemImage');
  if (imageElement) {
     imageElement.src = post.imageUrl || AppConstants.DEFAULT_IMAGE_URL;
    // Resize image
    const thumbSrc = post.imageUrl.split('/');
    thumbSrc.pop();
    thumbSrc.pop();
    thumbSrc.push('400', '117');
    imageElement.src = thumbSrc.join('/');
    console.log(imageElement.src);
    //console.log(thumbSrc);
  }

  const authorElement = postItemElement.querySelector('#postItemAuthor');
  if (authorElement) {
    authorElement.innerText = post.author;
  }

  // Set time
  const timeElement = postItemElement.querySelector('#postItemTimeSpan');
  if (timeElement) {
    const timeString = utils.formatDate(post.createdAt);
    timeElement.innerText = ` - ${timeString}`;
  }

    //document
  //for (let i=0;i<post.length;i++){
    //postItem
    //console.log(postItemElement);
    //postList.appendChild(postItem);

    const postsElement = document.querySelector('#postsList');

    if (postsElement) {
      postsElement.appendChild(postItemElement)
    };



}

const init = async() => {

  // Get post list
  const postListValue = await postApi.getAll(
    {'_sort': 'updatedAt',
    '_order': 'desc',
    });
  console.log( )
  if (Array.isArray(postListValue)) {
    for (const post of postListValue) {
      //console.log(postItemElement);
      //const postItemElement = renderPostItem(p);
      //if (postItemElement) {
        renderPostList(post);
      //}
    }
  }
else {
  console.log('Nothing found!');
}
  //renderPostList(post);

}

init();