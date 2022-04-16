// surround in curly brackets for block scope
{
    // console.log('script loaded !');

    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(event){
            event.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    // console.log(data);
                    // data is json data
                    let newPost = newPostDom(data.data);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($('.delete-post-button', newPost));
                    createComment($('.new-comment-form', newPost));
                    // $() is delete link inside the new post
                    // .delete-post-button class inside the newPost
                    // space between ( and .delete-post-button

                    new Noty({
                        text: data.message,
                        theme: 'relax',
                        layout: 'topRight',
                        timeout: 3000,
                        type: 'success'
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
            // serialize converts the form data into json
        });
    }

    // method to create a post in DOM
    let newPostDom = function(data){
        return $(`<li id="post-${data.post_id}">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${data.post_id}">
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        </small>
                        ${data.post_content}<br>
                        <small>
                            ${data.post_user}
                        </small>
                    </p>
                    <div class="post-comments">
                        <form class="new-comment-form" method="POST" action="/comments/create">
                            <input type="text" name="content" placeholder="Type comment..." required>
                            <input type="hidden" name="post" value="${data.post_id}">
                            <input type="submit" value="Add">
                        </form>
                        <div class="post-comments-list">
                            <ul id="post-comments-${data.post_id}">
                            </ul>
                        </div>
                    </div>
                </li>`);
    }

    // Method to delete a post from DOM
    let deletePost = function(deleteLink){
        // $(deleteLink).click(function(event){
        deleteLink.on('click', function(event){
            event.preventDefault();

            $.ajax({
                type: 'get',
                url: deleteLink.prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        text: data.message,
                        theme: 'relax',
                        type: 'success',
                        timeout: 3000,
                        layout: 'topRight'
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
            //prop('href') gets the value of href property of passed <a> tag
        });
    }

    let convertPostDeleteLinksToAJAX = function(){
        let deleteLinks = $('a.delete-post-button');
        // console.log(deleteLinks);
        for(let i=0; i<deleteLinks.length; i++){
            deletePost(deleteLinks.eq(i));
        }
    }

    let createComment = function(commentFormLink){
        commentFormLink.on('submit', function(event){
            event.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: commentFormLink.serialize(),
                success: function(data){
                    let newComment = newCommentDom(data.data);
                    $(`#post-comments-${data.data.post_id}`).prepend(newComment);
                    deleteComment($('.delete-comment-button', newComment));
                    new Noty({
                        text: data.message,
                        theme: 'relax',
                        layout: 'topRight',
                        timeout: 3000,
                        type: 'success'
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    let newCommentDom = function(data){
        return $(`<li id="comment-${data.comment_id}">
                    <p>
                        <small>
                            <a class="delete-comment-button" href="/comments/destroy/${data.comment_id}">
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        </small>
                        ${data.comment_content}
                        <br>
                        <small>
                            ${data.comment_user}
                        </small>
                    </p>
                </li>`);
    }

    let deleteComment = function(deleteLink){
        deleteLink.on('click', function(event){
            event.preventDefault();

            $.ajax({
                type: 'get',
                url: deleteLink.prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty({
                        text: data.message,
                        type: 'success',
                        theme: 'relax',
                        layout: 'topRight',
                        timeout: 3000
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    let convertAddCommentFormLinksToAJAX = function(){
        let commentForms = $('.new-comment-form');
        // console.log(commentForms);
        for(let i=0; i<commentForms.length; i++){
            createComment(commentForms.eq(i));
        }
    }

    let convertCommentDeleteLinksToAJAX = function(){
        let deleteLinks = $('a.delete-comment-button');
        for(let i=0; i<deleteLinks.length; i++){
            deleteComment(deleteLinks.eq(i));
        }
    }

    createPost();
    convertPostDeleteLinksToAJAX();
    convertAddCommentFormLinksToAJAX();
    convertCommentDeleteLinksToAJAX();
}