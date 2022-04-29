{
    let createPendingButton = function(){
        return $(`<button type="button">Friend request pending!</button>`);
    }

    let createAddButton = function(profileUserId){
        return $(`<button class="add-friend-button" type="button" data-user="${profileUserId}" >Add friend</button>`);
    }

    let createRemoveButton = function(friendship, profileUserId){
        return $(`<button type="button" class="remove-friend-button" data-id="${friendship._id}" data-user="${profileUserId}">Remove friend</button>`);
    }

    let ajaxSendFriendRequest = function(button){
        button.on('click', function(){
            let toUser = button.attr('data-user');
            $.ajax({
                type: 'post',
                url: `/friendship/create/?toUser=${toUser}`,
                success: function(data){
                    button.remove();
                    
                    let pendingButton = createPendingButton();
                    $('.profile-info').append(pendingButton);
                    
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

    let ajaxAcceptFriendRequest = function(button){
        button.on('click', function(){
            let fromUser = button.attr('data-user');

            $.ajax({
                type: 'post',
                url: `/friendship/accept/?fromUser=${fromUser}`,
                success: function(data){
                    button.remove();
                    $('.reject-friend-button').remove();

                    let removeButton = createRemoveButton(data.data.friendship, data.data.profile_user_id);
                    $('.profile-info').append(removeButton);

                    ajaxRemoveFriendRequest(removeButton);


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

    let ajaxRejectFriendRequest = function(button){
        button.on('click', function(){
            let fromUser = button.attr('data-user');

            $.ajax({
                type: 'post',
                url: `/friendship/reject/?fromUser=${fromUser}`,
                success: function(data){
                    button.remove();
                    $('.accept-friend-button').remove();

                    let addButton = createAddButton(data.data.profile_user_id);
                    $('.profile-info').append(addButton);

                    ajaxSendFriendRequest(addButton);

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

    let ajaxRemoveFriendRequest = function(button){
        button.on('click', function(){
            let friendshipId = button.attr('data-id');
            let profileUser = button.attr('data-user');

            $.ajax({
                type: 'post',
                url: `/friendship/destroy/?id=${friendshipId}&toUser=${profileUser}`,
                success: function(data){
                    button.remove();

                    let addButton = createAddButton(data.data.profile_user_id);
                    $('.profile-info').append(addButton);

                    ajaxSendFriendRequest(addButton);

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

    let existingFriendButtonsToAjax = function(){
        $('.add-friend-button').each(function(){
            let btn = $(this);
            ajaxSendFriendRequest(btn);
        });

        $('.accept-friend-button').each(function(){
            let btn = $(this);
            ajaxAcceptFriendRequest(btn);
        });

        $('.reject-friend-button').each(function(){
            let btn = $(this);
            ajaxRejectFriendRequest(btn);
        });

        $('.remove-friend-button').each(function(){
            let btn = $(this);
            ajaxRemoveFriendRequest(btn);
        });
    }

    existingFriendButtonsToAjax();
}