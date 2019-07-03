'use strict';

import postApi from './api/postApi.js';
import utils from './utils.js';
import AppConstants from './appConstants.js';

const addPost = (post) => {

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
  //console.log(imageElement);
  if (imageElement) {
    imageElement.src = post.imageUrl || AppConstants.DEFAULT_IMAGE_URL;
    //console.log(post.imageUrl );
    // Resize image
    const thumbSrc = post.imageUrl.split('/');
    thumbSrc.pop();
    thumbSrc.pop();
    thumbSrc.push('400', '117');
    imageElement.src = thumbSrc.join('/');
    //console.log(imageElement.src);
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

  // Add href to post items
  postItemElement.addEventListener('click', () => {
  const detailPageUrl = `post-detail.html?postId=${post.id}`;
  window.location = detailPageUrl;
  });

  // Render posts
  const postsElement = document.querySelector('#postsList');

  if (postsElement) {
    postsElement.appendChild(postItemElement);
  }

  //Edit button event
  const editButton = postItemElement.querySelector('#postItemEdit');
  editButton.addEventListener('click', (e) => {
    const editPageUrl = `add-edit-post.html?postId=${post.id}`;
    // Navigate to edit page
    window.location = editPageUrl;
    e.stopPropagation();
  });

  // Remove button event
  const removeButton = postItemElement.querySelector('#postItemRemove');
  removeButton.addEventListener('click', (e) => {
    handleRemovePostButtonClick(post);
    e.stopPropagation();
  });

  return postItemElement;
};



const getPostList = async() => {
  const searchParams = new URLSearchParams(window.location.search)   
  
  const _page = searchParams.get('_page');
  const _limit = searchParams.get('_limit');
   
  const searchString = {
      _page: _page?_page:AppConstants.DEFAULT_PAGE,
      _limit: _limit?_limit:AppConstants.DEFAULT_LIMIT,
      _sort: 'updatedAt',
      _order: 'desc',
    };

  const postListItem = await postApi.getAll(searchString);

  return postListItem;
}

const renderPostList = (postListItemData) => {
    

    //;
    //console.log(postListValue);
  if (postListItemData) {
      for (const post of postListItemData) {
          addPost(post);
      }
    }
  else {
    //console.log('Nothing found!');
  }
}


const getPageList = (pagination) => {
  const { _limit, _totalRows, _page } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  //let prevPage = -1;
  let pageArray = [];
  

  // Return 0,0 if no page detected
  if (_page >= 1 && _page <= totalPages) {
    const isFirstPage = _page === 1? 0 : 1; //if first page, no "Prev" button, set it = 0
    const isLastPage = _page === totalPages ? 0 : 1;
    pageArray.push(isFirstPage);
    for (let n=0;n < totalPages; n++){
      pageArray.push(n+1);
    }
  
    pageArray.push(isLastPage);
    
  }
  else {
    pageArray = [0,0];
  }


  console.log(pageArray);
  return pageArray;
  // Calculate prev page
  /*if (_page === 1) prevPage = 1;
  else if (_page === totalPages) prevPage = _page - 2 > 0 ? _page - 2 : 1;
  else prevPage = _page - 1;

  const currPage = prevPage + 1 > totalPages ? -1 : prevPage + 1;
  const nextPage = prevPage + 2 > totalPages ? -1 : prevPage + 2;

  return [
    _page === 1 || _page === 1 ? 0 : _page - 1,
    prevPage, currPage, nextPage,
    _page === totalPages || totalPages === _page ? 0 : _page + 1,
  ];*/

}

const renderPagination = (pagination) => {
  const postPagination = document.querySelector('#postsPagination');
  if (postPagination) {
    const pageList = getPageList(pagination);
    const { _page, _limit } = pagination;
    //console.log(pageList);
    // Make sure there is 1 page or more
    if (pageList.length >= 3) {
     
        

      pageList.forEach((page,index) => {
        const pageElements = document.createElement('li');
        pageElements.classList.add('page-item');
        switch (index){
          case 0:
            // PrevButton
            pageElements.innerHTML = `<a class="page-link" href="?_page=${_page-1}&_limit=${_limit}" aria-label="Previous">&laquo;</a>`;
            if(_page===1) pageElements.classList.add('disabled'); // Disable Prev Button in first page
            break;
          case pageList.length-1:
            // NextButton
            pageElements.innerHTML = `<a class="page-link" href="?_page=${_page+1}&_limit=${_limit}" aria-label="Next">&raquo;</a>`;
            if(_page===(pageList.length-2)) pageElements.classList.add('disabled'); // Disable Next button in last page
            break;
          default:
            pageElements.innerHTML = `<a class="page-link" href="?_page=${page}&_limit=${_limit}">${page}</a>`;
            if(_page===page) pageElements.classList.add('active'); 
            break;
        }
        console.log(index,pageElements);
        postPagination.appendChild(pageElements);
      });
      postPagination.removeAttribute('hidden');
      }
      
    }

};

const handleRemovePostButtonClick = async (post) => {
  try {
    const confirmMessage = `Do you really want to remove ${post.title}?!`;
    if (window.confirm(confirmMessage)) {
      // Remove post
      await postApi.removePost(post.id);

      // Reload page
      window.location.reload();
    }
  } catch (error) {
    alert('Oops! Error in deleting post: ', error);
  }
};

const init = async() => {

  // Get post items
  const postListItem = await getPostList();
  //console.log(postListItem);
  renderPostList(postListItem.data);
  renderPagination(postListItem.pagination);
  
  // hide loading spinner
  const loadingSpinner = document.querySelector('.spinner-border');
  loadingSpinner.classList.add('invisible');

  // Animation posts
  anime({
    targets: 'ul.posts-list > li',
    scale: [
      { value: 0.5, duration: 0 },
      { value: 1, duration: 300 },
    ],
    opacity: [
      { value: 0, duration: 0 },
      { value: 1, duration: 250 },
    ],
    translateX: [
      { value: 80, duration: 0 },
      { value: 0, duration: 500 },
    ],
    delay: anime.stagger(150),
    easing: 'linear'
  });
}

init();