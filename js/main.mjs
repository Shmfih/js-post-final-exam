'use strict';

import postApi from './api/postApi.js';
import utils from './utils.js';
import AppConstants from './appConstants.js';
import queryString from './api/queryString.js';

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



}

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
    console.log('Nothing found!');
  }
}


const getPageList = (pagination) => {
  const { _limit, _totalRows, _page } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  let prevPage = -1;

  // Return -1 if invalid page detected
  if (_page < 1 || _page > totalPages) return [0, -1, -1, -1, 0];


  // Calculate prev page
  if (_page === 1) prevPage = 1;
  else if (_page === totalPages) prevPage = _page - 2 > 0 ? _page - 2 : 1;
  else prevPage = _page - 1;

  const currPage = prevPage + 1 > totalPages ? -1 : prevPage + 1;
  const nextPage = prevPage + 2 > totalPages ? -1 : prevPage + 2;

  return [
    _page === 1 || _page === 1 ? 0 : _page - 1,
    prevPage, currPage, nextPage,
    _page === totalPages || totalPages === _page ? 0 : _page + 1,
  ];
}

const renderPagination = (pagination) => {
  const postPagination = document.querySelector('#postsPagination');
  if (postPagination) {
    const pageList = getPageList(pagination);
    const { _page, _limit } = pagination;
    // Search list of 5 page items
    const pageItems = postPagination.querySelectorAll('.page-item');

    // Just to make sure pageItems has exactly 5 items
    if (pageItems.length === 5) {
      pageItems.forEach((item, idx) => {
        switch (pageList[idx]) {
          case -1:
            item.setAttribute('hidden', '');
            break;
          case 0:
            item.classList.add('disabled');
            break;
          default: {
            // Find page link
            const pageLink = item.querySelector('.page-link');
            if (pageLink) {
              // Update href of page link
              pageLink.href = `?_page=${pageList[idx]}&_limit=${_limit}`;

              // Update text content of page link for item: 1, 2, 3 (zero base)
              if (idx > 0 && idx < 4) {
                pageLink.textContent = pageList[idx];
              }
            }

            // Set current active page item, only for 1, 2, 3 (zero base)
            if (idx > 0 && idx < 4 && pageList[idx] === _page) {
              item.classList.add('active');
            }
          }
        }
      });

      // Show pagination
      postPagination.removeAttribute('hidden');
    }
  }
};


const init = async() => {

  // Get post items
  const postListItem = await getPostList();
  console.log(postListItem);
  renderPostList(postListItem.data);
  renderPagination(postListItem.pagination);
  // Animation
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
    delay: anime.stagger(150), // increase delay by 100ms for each elements.
    easing: 'linear'
  });
}

init();