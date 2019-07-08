
import postApi from './api/postApi.js';
import utils from './utils.js';
import AppConstants from './appConstants.js';

let oldPostData; // Make global variable to store old data from server

const setFieldValue = async(post) => {
  
  // Set form value
  utils.setValueByElementId('postTitle',post.title);
  utils.setValueByElementId('postAuthor',post.author);
  utils.setValueByElementId('postDescription', post.description);
  const img = document.querySelector('#postHeroImage');
  if(img){
     img.setAttribute('style', `background-image: url("${post.imageUrl}");`);
  } 
      
};


const handleChangeImageClick = () => {

  // Random id number
  const randomId = 1 + Math.trunc(Math.random() * 999);

  // Generate image URL
  const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

  // Update post image
  utils.setBackgroundImageByElementId('postHeroImage', imageUrl);

};


const validatePostForm = () => {
  let isValid = true;

  // Check title
  const title = utils.getValueByElementId('postTitle');
  if (!title) {
    utils.addClassByElementId('postTitle', ['is-invalid']);
    isValid = false;
  }

  // Check author
  const author = utils.getValueByElementId('postAuthor');
  if (!author) {
    utils.addClassByElementId('postAuthor', ['is-invalid']);
    isValid = false;
  }

  return isValid;
};


const handlePostFormSubmit = async (postId) => {
  
  // Form validation
  const isValid = validatePostForm();
  if (isValid) {
    try {
      
      const newData = {
        id: postId,
        title: utils.getValueByElementId('postTitle'),
        author: utils.getValueByElementId('postAuthor'),
        description: utils.getValueByElementId('postDescription'),
        imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
      };
      
      // Edit mode
      if (postId) {
        
        // Check submit data, only add new data
        let editedData = {}; 
        const oldData = oldPostData; // Get old data
        const checkKey = ['title', 'author', 'description', 'imageUrl' ]; // Key to check
        let hasChange = false;
        for (const key of checkKey){
          if(newData[key]!==oldData[key]){
            editedData = Object.assign(editedData,{[key] : newData[key]}); // Assign any change to editedData object
            hasChange = true;
          }
        }

        // Alert if nothing changed
        if (!hasChange){
          alert ('Nothing changed!');
          return;
        }
        else {
          showLoadingSpinner();
          // Add id to new data
          editedData = Object.assign(editedData, {id: postId});
          // Update changed data
          await postApi.update(editedData);
          hideLoadingSpinner();
          alert('Save post successfully!');
          // Redirect to post detail page
          window.location = `post-detail.html?postId=${postId}`;
        }
      }


      // Add mode
      else {
        showLoadingSpinner();
        const newPost = await postApi.add(newData);
        // Go to edit page
        const viewPageUrl = `post-detail.html?postId=${newPost.id}`;
        hideLoadingSpinner();
        alert('Add new post successfully!');
        window.location = viewPageUrl;
      }
    } catch (error) {
      alert('Oops!Something went wrong: ', error);
    }
  }
};


const showLoadingSpinner = () => {
  const saveButton = document.querySelector('#saveButton');
  saveButton.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
}

const hideLoadingSpinner = () => {
  const saveButton = document.querySelector('#saveButton');
  saveButton.innerHTML='<i class="fas fa-save mr-1"></i> Save';
}

const init = async () => {
  // Get postId from query string
  const params = new URLSearchParams (window.location.search);
  const postId = params.get('postId');
  const isEditMode = !!postId;

  // Check if edit mode
  if (isEditMode) {

    if (!postId) return;
    const post = await postApi.getDetail(postId);
    setFieldValue(post);
    oldPostData = post; // Set global variable

    const goToDetailPageLink = document.getElementById('goToDetailPageLink');
    goToDetailPageLink.href = `post-detail.html?postId=${post.id}`;
    goToDetailPageLink.innerHTML = '<i class="fas fa-eye mr-1"></i> View post detail';
  } else {
    // Else, random post image for add-mode
    handleChangeImageClick();
  }

  // Add event for change post image button
  const changeImageButton = document.getElementById('postChangeImage');
  if (changeImageButton) {
    changeImageButton.addEventListener('click', handleChangeImageClick);
  }

  // Handle form submit button
  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.addEventListener('submit', (e) => {
      handlePostFormSubmit(postId);
      e.preventDefault();
    });
  }
};
init();