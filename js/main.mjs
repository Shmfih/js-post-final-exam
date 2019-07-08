'use strict';

import postApi from './api/postApi.js';
import utils from './utils.js';
import AppConstants from './appConstants.js';

const addPostToList = (post) => {

  // Get post element template
  const postItemTemplate = document.querySelector('#postItemTemplate');
  const postItemElement = postItemTemplate.content.cloneNode(true).querySelector('li');
  
  // Set post'stitle
  const titleElement = postItemElement.querySelector('#postItemTitle');
  if (titleElement){
    titleElement.innerText = post.title;
  }

  // Set post's description
  const descriptionElement = postItemElement.querySelector('#postItemDescription');
  if (descriptionElement) {
    descriptionElement.innerText = utils.truncateTextlength(post.description, 100);
  }

  // Resize and set post's image
  const imageElement = postItemElement.querySelector('#postItemImage');
  if (imageElement) {
    imageElement.src = post.imageUrl || AppConstants.DEFAULT_IMAGE_URL;
    const thumbSrc = post.imageUrl.split('/');
    thumbSrc.pop();
    thumbSrc.pop();
    thumbSrc.push('400', '117');
    imageElement.src = thumbSrc.join('/');
  }

  // Set post's author
  const authorElement = postItemElement.querySelector('#postItemAuthor');
  if (authorElement) {
    authorElement.innerText = post.author;
  }

  // Set post's time
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

  // Get search params from URL
  const searchParams = new URLSearchParams(window.location.search)   
  const _page = searchParams.get('_page');
  const _limit = searchParams.get('_limit');
  
  // Prepair for fetching data
  const searchString = {
      _page: _page?_page:AppConstants.DEFAULT_PAGE,
      _limit: _limit?_limit:AppConstants.DEFAULT_LIMIT,
      _sort: 'updatedAt',
      _order: 'desc',
  };

  // Get post list from server
  const postListItem = await postApi.getAll(searchString);

  return postListItem;
}

const renderPostList = (postListItemData) => {
    
  if (postListItemData) {
    for (const post of postListItemData) {
      addPostToList(post);
    }
  }
}

// Get total page and return array to render
// Array format: [prevButton, 1,2,3....., nextButton]
// The first and last item of array is 0 or 1 for prevButton & nextButton's enable
const getPageList = (pagination) => {
  const { _limit, _totalRows, _page } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  let pageArray = [];
  

  // Check vaild page number
  if (_page >= 1 && _page <= totalPages) {
    const isFirstPage = _page === 1? 0 : 1; //if first page, disable prevButton, set it = 0
    const isLastPage = _page === totalPages ? 0 : 1; //if last page, disable nextButton, set it = 0
    
    // Push prevButton state
    pageArray.push(isFirstPage);

    // Push page number to array
    for (let n=0;n < totalPages; n++){
      pageArray.push(n+1);
    }
    
    // Push nextButton state
    pageArray.push(isLastPage);
    
  }
  else {
    // Return [0,0] if no page detected
    pageArray = [0,0];
  }

  return pageArray;
}

const renderPagination = (pagination) => {

  // Finde page pagination element
  const postPagination = document.querySelector('#postsPagination');

  if (postPagination) {

    // Get page list array
    const pageList = getPageList(pagination);
    const { _page, _limit } = pagination;

    // Check vaild page list arrat
    if (pageList.length >= 3) {

      pageList.forEach((page,index) => {

        // Create li element in page-item
        const pageElements = document.createElement('li');
        pageElements.classList.add('page-item');

        // Render page list item by input array
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
            // Other page list items
            pageElements.innerHTML = `<a class="page-link" href="?_page=${page}&_limit=${_limit}">${page}</a>`;
            if(_page===page) pageElements.classList.add('active'); // Highlight active page
            break;
        }
        
        postPagination.appendChild(pageElements);
      });

      // Show page list
      postPagination.removeAttribute('hidden');
      }
      
    }

};

const handleRemovePostButtonClick = async (post) => {
  try {
    // Confirm delete?
    const confirmMessage = `Do you really want to remove ${post.title}?!`;
    
    if (window.confirm(confirmMessage)) {
      // Remove post
      await postApi.remove(post.id);
      // Reload page
      window.location.reload();
    }
  } catch (error) {
    // Alert error
    alert('Oops! Error in deleting post: ', error);
  }
};

const init = async() => {

  // Get post list items and render
  const postListItem = await getPostList();
  renderPostList(postListItem.data);
  renderPagination(postListItem.pagination);
  
  // Hide loading spinner
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