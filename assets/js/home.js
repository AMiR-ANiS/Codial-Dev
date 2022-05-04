{
    // method to create a post DOM
    let newPostDom = function(post, exist){
        let postDate = new Date(post.createdAt);
        let date = postDate.toDateString();
        let time = postDate.toLocaleTimeString();
        
        if(exist){
            return $(`<li id="post-${post._id}">
            <div class="post-image">
                <img src="${post.imagePath}">
            </div>
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
                    </a> | 
                    <span class="post-reactions">
                        <a id="p-${post._id}-haha-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=haha" title="haha">
                            <i class="fa-regular fa-face-grin-squint-tears"></i>    
                        </a>
                        <span id="p-${post._id}-haha" data-count="0"> 0 </span>
                        <a id="p-${post._id}-love-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=love" title="love">
                            <i class="fa-regular fa-heart"></i>
                        </a>
                        <span id="p-${post._id}-love" data-count="0"> 0 </span>
                        <a id="p-${post._id}-sad-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=sad" title="sad">
                            <i class="fa-regular fa-face-frown-open"></i>
                        </a>
                        <span id="p-${post._id}-sad" data-count="0"> 0 </span>
                        <a id="p-${post._id}-angry-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=angry" title="angry">
                            <i class="fa-regular fa-face-angry"></i>
                        </a>
                        <span id="p-${post._id}-angry" data-count="0"> 0 </span>
                        <a id="p-${post._id}-wow-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=wow" title="wow">
                            <i class="fa-regular fa-face-surprise"></i>
                        </a>
                        <span id="p-${post._id}-wow" data-count="0"> 0 </span>
                    </span>
                    | <a class="delete-post-button" href="/posts/destroy/${post._id}" title="delete post">
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
        }else{
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
                            </a> | 
                            <span class="post-reactions">
                                <a id="p-${post._id}-haha-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=haha" title="haha">
                                    <i class="fa-regular fa-face-grin-squint-tears"></i>    
                                </a>
                                <span id="p-${post._id}-haha" data-count="0"> 0 </span>
                                <a id="p-${post._id}-love-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=love" title="love">
                                    <i class="fa-regular fa-heart"></i>
                                </a>
                                <span id="p-${post._id}-love" data-count="0"> 0 </span>
                                <a id="p-${post._id}-sad-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=sad" title="sad">
                                    <i class="fa-regular fa-face-frown-open"></i>
                                </a>
                                <span id="p-${post._id}-sad" data-count="0"> 0 </span>
                                <a id="p-${post._id}-angry-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=angry" title="angry">
                                    <i class="fa-regular fa-face-angry"></i>
                                </a>
                                <span id="p-${post._id}-angry" data-count="0"> 0 </span>
                                <a id="p-${post._id}-wow-a" href="/reactions/toggle/?id=${post._id}&type=Post&react=wow" title="wow">
                                    <i class="fa-regular fa-face-surprise"></i>
                                </a>
                                <span id="p-${post._id}-wow" data-count="0"> 0 </span>
                            </span>
                            | <a class="delete-post-button" href="/posts/destroy/${post._id}" title="delete post">
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
                            </a> | 
                            <span class="comment-reactions">
                                <a id="c-${comment._id}-haha-a" href="/reactions/toggle/?id=${comment._id}&type=Comment&react=haha" title="haha">
                                    <i class="fa-regular fa-face-grin-squint-tears"></i>    
                                </a>
                                <span id="c-${comment._id}-haha" data-count="0"> 0 </span>
                                <a id="c-${comment._id}-love-a" href="/reactions/toggle/?id=${comment._id}&type=Comment&react=love" title="love">
                                    <i class="fa-regular fa-heart"></i>
                                </a>
                                <span id="c-${comment._id}-love" data-count="0"> 0 </span>
                                <a id="c-${comment._id}-sad-a" href="/reactions/toggle/?id=${comment._id}&type=Comment&react=sad" title="sad">
                                    <i class="fa-regular fa-face-frown-open"></i>
                                </a>
                                <span id="c-${comment._id}-sad" data-count="0"> 0 </span>
                                <a id="c-${comment._id}-angry-a" href="/reactions/toggle/?id=${comment._id}&type=Comment&react=angry" title="angry">
                                    <i class="fa-regular fa-face-angry"></i>
                                </a>
                                <span id="c-${comment._id}-angry" data-count="0"> 0 </span>
                                <a id="c-${comment._id}-wow-a" href="/reactions/toggle/?id=${comment._id}&type=Comment&react=wow" title="wow">
                                    <i class="fa-regular fa-face-surprise"></i>
                                </a>
                                <span id="c-${comment._id}-wow" data-count="0"> 0 </span>
                            </span>
                            | <a class="delete-comment-button" href="/comments/destroy/${comment._id}">
                                <i class="fa-regular fa-trash-can"></i>
                            </a>
                        </small>
                    </div>
                </li> `);
    }

    let newFriendDom = function(friendship, currUser){
        let friendName, friendId;
        if(friendship.fromUser._id == currUser._id){
            friendName = friendship.toUser.name;
            friendId = friendship.toUser._id;
        }else{
            friendName = friendship.fromUser.name;
            friendId = friendship.fromUser._id;
        }
        return $(`<li id="friend-${friendship._id}">
                    <p>
                        <a class="user-name" href="/users/profile/${friendId}" title="view profile">
                            ${friendName}
                        </a>
                        <a class="remove-friend" href="/friendship/destroy/?id=${friendship._id}" title="remove friend">
                            <i class="fa-solid fa-user-slash"></i>
                        </a>
                    </p>
                </li>`);
    }

    // method to submit the form data for new post using AJAX
    let ajaxCreatePost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.on('submit', function(e){
            e.preventDefault();
            console.log(this);

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: function(data){
                    let textArea = $('textarea', newPostForm);
                    textArea.val('');

                    let newPost = newPostDom(data.data.post, data.data.exist);
                    $('#list-of-posts').prepend(newPost);

                    let newPostLikeButton = $('.like-button', newPost);
                    ajaxToggleLike(newPostLikeButton);

                    let newPostDeleteButton = $('.delete-post-button', newPost);
                    ajaxDeletePost(newPostDeleteButton);

                    let postNewCommentForm = $(`#post-${data.data.post._id}-new-comment-form`, newPost);
                    ajaxCreateComment(postNewCommentForm);

                    let postReactions = $('.post-reactions', newPost);
                    $('a', postReactions).each(function(){
                        let link = $(this);
                        new EmoteReaction(link);
                    });

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

    // Method to delete a post from DOM
    let ajaxDeletePost = function(deleteButton){
        deleteButton.on('click', function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: deleteButton.prop('href'),
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
        });
    }

    //Method for sending new comment form data using AJAX
    let ajaxCreateComment = function(commentForm){
        commentForm.on('submit', function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: commentForm.serialize(),
                success: function(data){
                    let input = $('input[name=content]', commentForm);
                    input.val('');

                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-${data.data.comment.post}-comments`).prepend(newComment);

                    let newCommentLikeButton = $('.like-button', newComment);
                    ajaxToggleLike(newCommentLikeButton);

                    let newCommentDeleteButton = $('.delete-comment-button', newComment);
                    ajaxDeleteComment(newCommentDeleteButton);

                    let commentReactions = $('.comment-reactions', newComment);
                    $('a', commentReactions).each(function(){
                        let link = $(this);
                        new EmoteReaction(link);
                    });

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
                        link.html('<i class="fa-regular fa-thumbs-up"></i>');
                    }
                    else{
                        likesCount+=1;
                        link.html('<i class="fa-solid fa-thumbs-up"></i>');
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

    let ajaxAcceptRejectFriendRequest = function(link){
        link.on('click', function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: link.attr('href'),
                success: function(data){

                    $(`#friend-request-${data.data.friendship._id}`).remove();

                    if(data.data.accept){
                        let newFriend = newFriendDom(data.data.friendship, data.data.curr_user);
                        $('#friend-list').append(newFriend);

                        let removeLink = $('.remove-friend', newFriend);
                        ajaxRemoveFriend(removeLink);
                    }
                    
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
        });
    }

    let ajaxRemoveFriend = function(link){
        link.on('click', function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: link.attr('href'),
                success: function(data){
                    $(`#friend-${data.data.friendship_id}`).remove();

                    new Noty({
                        text: data.message,
                        type: 'success',
                        layout: 'topRight',
                        timeout: 3000,
                        theme: 'relax'
                    }).show();
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

    let existingFriendRequestLinksToAjax = function(){
        $('.accept-request').each(function(){
            let acceptLink = $(this);
            ajaxAcceptRejectFriendRequest(acceptLink);
        });

        $('.reject-request').each(function(){
            let rejectLink = $(this);
            ajaxAcceptRejectFriendRequest(rejectLink);
        });
    }

    let existingRemoveFriendLinksToAjax = function(){
        $('.remove-friend').each(function(){
            let removeLink = $(this);
            ajaxRemoveFriend(removeLink);
        });
    }

    let existingLikeByUserCheck = function(){
        $('.like-button').each(function(){
            let link = $(this);

            $.ajax({
                type: 'get',
                url: link.attr('href'),
                success: function(data){
                    if(data.data.exist){
                        link.html('<i class="fa-solid fa-thumbs-up"></i>');
                    }
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    let showHideChat = function(){
        let chatButton = $('#maximize-chat');
        let chat = $('.chat-box');
        chatButton.on('click', function(){
            chatButton.css('display', 'none');
            chat.css('display','block');
        });

        let minimize = $('#minimize-chat', chat);
        minimize.on('click', function(){
            chat.css('display', 'none');
            chatButton.css('display', 'block');
        });
    }

    ajaxCreatePost();
    existingPostDeleteLinksToAjax();
    existingNewCommentFormsToAjax();
    existingCommentDeleteLinksToAjax();
    existingLikeLinksToAjax();
    existingFriendRequestLinksToAjax();
    existingRemoveFriendLinksToAjax();
    existingLikeByUserCheck();
    showHideChat();
}