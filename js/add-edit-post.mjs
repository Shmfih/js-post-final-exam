
import postApi from './api/postApi.js';
import utils from './utils.js';
import AppConstants from './appConstants.js';


const setFieldValue = async(post) => {
    
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
  console.log(imageUrl);
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
      
      const submitData = {
        id: postId,
        title: utils.getBackgroundImageByElementId('postHeroImage'),
        author: utils.getValueByElementId('postAuthor'),
        description: utils.getValueByElementId('postDescription'),
        imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
      };

      if (postId) {
        await postApi.update(submitData);
        alert('Save post successfully!');
      }
      else {
        const newPost = await postApi.add(submitData);

        // Go to edit page
        const editPageUrl = `add-edit-post.html?postId=${newPost.id}`;
        window.location = editPageUrl;

        alert('Add new post successfully!');
      }
    } catch (error) {
      alert('Oops!Something went wrong: ', error);
      console.log(error);
    }
  }
};


// ---------------------------
// MAIN LOGIC
// ---------------------------
const init = async () => {
  // Get postId from query string
  const params = new URLSearchParams (window.location.search);
  const postId = params.get('postId');
  const isEditMode = !!postId;
  console.log(isEditMode);
  // Check if edit mode
  if (isEditMode) {

    //console.log(postId);
    if (!postId) return;
    const post = await postApi.getDetail(postId);
    setFieldValue(post);


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