'use strict';

// ----------- LEARNING -----------
import postApi from './api/postApi.js';

const init = async() => {
  const post = await postApi.getAll();
  console.log(post);

  const template = document.querySelector('#postItemTemplate');
  const postItem = template.content.cloneNode(true);
  const postList = document.querySelector('#postsList');
  for (let i=0;i<post.length;i++){
    console.log(i);
    //const node = document.importNode(postItem);
    postList.appendChild(postItem);
  }
  

}

init();




// event trong js có tính bubble nghĩa là event của child node ảnh hưởng lên event của parents
// vì vậy, dùng e.stopPropagtion();