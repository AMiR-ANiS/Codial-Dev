// surround in curly brackets for block scope
{
    // console.log('script loaded !');

    // method to create a post DOM
    let newPostDom = function(post){
        let postDate = new Date(post.createdAt);
        let date = postDate.toDateString();
        let time = postDate.toLocaleTimeString();
        return $(`<li id="post-${post._id}">
                    <p class="post-content">
                        ${post.content}
                    </p>
                    <small>
                        posted by:
                        <strong>
                            <a class="post-user" href="/users/profile/${post.user._id}" title="view profile">
                                ${post.user.name}
                            </a>
                        </strong>
                        <br>
                        ${date}, ${time}
                        <br>
                        <span class="post-like-count">
                            0
                        </span> Likes
                    </small>
                    <div class="post-actions">
                        <small>
                            <a class="like-button" href="/likes/toggle/?id=${post._id}&type=Post" title="like" data-likes="0" data-postid="${post._id}">
                                <i class="fa-regular fa-thumbs-up"></i>
                            </a>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}" title="delete post">
                                <i class="fa-regular fa-trash-can"></i>
                            </a>
                        </small>
                    </div>
                    <div class="post-comments">
                        <form id="post-${post._id}-new-comment-form" method="POST" action="/comments/create">
                            <input type="text" name="content" placeholder="Type comment..." required>
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add">
                        </form>
                        <div class="comments-container">
                            <ul id="post-${post._id}-comments">
                            </ul>
                        </div>
                    </div>
                </li>`);
    }

    // method to create a comment DOM
    let newCommentDom = function(comment){
        let commentDate = new Date(comment.createdAt);
        let date = commentDate.toDateString();
        let time = commentDate.toLocaleTimeString();

        return $(`<li id="comment-${comment._id}">
                    <p class="comment-content">
                        ${comment.content}
                    </p>
                    <small>
                        <strong>
                            <a class="comment-user" href="/users/profile/${comment.user._id}">
                                ${comment.user.name}
                            </a>
                        </strong>
                        <br>
                        ${date}, ${time}
                        <br>
                        <span class="comment-like-count">
                            0
                        </span> Likes
                    </small>
                    <div class="comment-actions">
                        <small>
                            <a class="like-button" href="/likes/toggle/?id=${comment._id}&type=Comment" title="like" data-likes="0" data-commentid="${comment._id}">
                                <i class="fa-regular fa-thumbs-up"></i>
                            </a>
                            <a class="delete-comment-button" href="/comments/destroy/${comment._id}">
                                <i class="fa-regular fa-trash-can"></i>
                            </a>
                        </small>
                    </div>
                </li> `);
    }

    // method to submit the form data for new post using AJAX
    let ajaxCreatePost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.on('submit', function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    // console.log(data);
                    // data is json data
                    let newPost = newPostDom(data.data.post);
                    $('#list-of-posts').prepend(newPost);

                    let newPostLikeButton = $('.like-button', newPost);
                    ajaxToggleLike(newPostLikeButton);

                    let newPostDeleteButton = $('.delete-post-button', newPost);
                    ajaxDeletePost(newPostDeleteButton);

                    let postNewCommentForm = $(`#post-${data.data.post._id}-new-comment-form`, newPost);
                    ajaxCreateComment(postNewCommentForm);
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

    // Method to delete a post from DOM
    let ajaxDeletePost = function(deleteButton){
        // $(deleteLink).click(function(event){
        deleteButton.on('click', function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: deleteButton.prop('href'),
                success: function(data){
                    // console.log(data.data.post_id);
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

    let ajaxCreateComment = function(commentForm){
        commentForm.on('submit', function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: commentForm.serialize(),
                success: function(data){
                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-${data.data.comment.post}-comments`).prepend(newComment);

                    let newCommentLikeButton = $('.like-button', newComment);
                    ajaxToggleLike(newCommentLikeButton);

                    let newCommentDeleteButton = $('.delete-comment-button', newComment);
                    ajaxDeleteComment(newCommentDeleteButton);

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

    let ajaxDeleteComment = function(deleteButton){
        deleteButton.on('click', function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: deleteButton.prop('href'),
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

    let ajaxToggleLike = function(link){
        link.on('click', function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: link.prop('href'),
                success: function(data){
                    let likesCount = parseInt(link.attr('data-likes'));
                    if(data.data.deleted){
                        likesCount-=1;
                    }
                    else{
                        likesCount+=1;
                    }
                    link.attr('data-likes', likesCount);
                    if(link.attr('data-postid')){
                        let postId = link.attr('data-postid');
                        $(`#post-${postId} .post-like-count`).html(`${likesCount}`);
                    }else{
                        let commentId = link.attr('data-commentid');
                        $(`#comment-${commentId} .comment-like-count`).html(`${likesCount}`);
                    }
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    let existingPostDeleteLinksToAjax = function(){
        $('.delete-post-button').each(function(){
            let deleteButton = $(this);
            ajaxDeletePost(deleteButton);
        });
    }

    let existingNewCommentFormsToAjax = function(){
        $('.post-comments>form').each(function(){
            let commentForm = $(this);
            ajaxCreateComment(commentForm);
        });
    }

    let existingCommentDeleteLinksToAjax = function(){
        $('.delete-comment-button').each(function(){
            let deleteButton = $(this);
            ajaxDeleteComment(deleteButton);
        });
    }

    let existingLikeLinksToAjax = function(){
        $('.like-button').each(function(){
            let likeButton = $(this);
            ajaxToggleLike(likeButton);
        });
    }

    ajaxCreatePost();
    existingPostDeleteLinksToAjax();
    existingNewCommentFormsToAjax();
    existingCommentDeleteLinksToAjax();
    existingLikeLinksToAjax();
}