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
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    // $() is delete link inside the new post
                    // .delete-post-button class inside the newPost
                    // space between ( and .delete-post-button
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
            // serialize converts the form data into json
        });
    }

    // method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        </small>
                        ${post.content}<br>
                        <small>
                            ${post.user.name}
                        </small>
                    </p>
                    <div class="post-comments">
                        <form method="POST" action="/comments/create">
                            <input type="text" name="content" placeholder="Type comment..." required>
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add">
                        </form>
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">
                            </ul>
                        </div>
                    </div>
                </li>`);
    }

    // Method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(event){
            event.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
            //prop('href') gets the value of href property of passed <a> tag
        });
    }

    createPost();
}