class EmoteReaction{
    constructor(link){
        this.link = link;
        this.ajaxCheckExistingReaction();
        this.ajaxToggleReaction();
    }

    ajaxCheckExistingReaction(){
        let link = this.link;

        $.ajax({
            type: 'get',
            url: link.attr('href'),
            success: function(data){
                let iTag;

                if(data.data.exist){
                    switch(link.attr('title')){
                        case 'haha': iTag = '<i class="fa-solid fa-face-grin-squint-tears"></i>';
                        break;

                        case 'wow': iTag = '<i class="fa-solid fa-face-surprise"></i>';
                        break;

                        case 'love': iTag = '<i class="fa-solid fa-heart"></i>';
                        break;

                        case 'angry': iTag = '<i class="fa-solid fa-face-angry"></i>';
                        break;

                        default: iTag = '<i class="fa-solid fa-face-frown-open"></i>';
                    }
                }

                link.html(iTag);
            }, 
            error: function(error){
                console.log(error.responseText);
            }
        });
    }

    ajaxToggleReaction(){
        let link = this.link;
        link.on('click', function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: link.attr('href'),
                success: function(data){
                    let reacts = data.data.reacts;
                    let id = data.data.id;
                    let type = data.data.type;

                    for(let key in reacts){
                        if(reacts[key] == 1){
                            let span, a;
                            switch(type){
                                case 'Post': span = $(`#p-${id}-${key}`);
                                a = $(`#p-${id}-${key}-a`);
                                break;
                                
                                default: span = $(`#c-${id}-${key}`);
                                a = $(`#c-${id}-${key}-a`);
                            }

                            let count = parseInt(span.attr('data-count'));
                            count+=1;
                            span.attr('data-count', count);
                            span.html(`${count}`);

                            let iTag;
                            if(key == 'haha'){
                                iTag = '<i class="fa-solid fa-face-grin-squint-tears"></i>';
                            }else if(key == 'sad'){
                                iTag = '<i class="fa-solid fa-face-frown-open"></i>'
                            }else if(key == 'angry'){
                                iTag = '<i class="fa-solid fa-face-angry"></i>';
                            }else if(key == 'love'){
                                iTag = '<i class="fa-solid fa-heart"></i>';
                            }else{
                                iTag = '<i class="fa-solid fa-face-surprise"></i>'
                            }
                            a.html(iTag);
                        }else if(reacts[key] == -1){
                            let span, a;
                            switch(type){
                                case 'Post': span = $(`#p-${id}-${key}`);
                                a = $(`#p-${id}-${key}-a`);
                                break;
                                
                                default: span = $(`#c-${id}-${key}`);
                                a = $(`#c-${id}-${key}-a`);
                            }

                            let count = parseInt(span.attr('data-count'));
                            count-=1;
                            span.attr('data-count', count);
                            span.html(`${count}`);

                            let iTag;
                            if(key == 'haha'){
                                iTag = '<i class="fa-regular fa-face-grin-squint-tears"></i>';
                            }else if(key == 'sad'){
                                iTag = '<i class="fa-regular fa-face-frown-open"></i>'
                            }else if(key == 'angry'){
                                iTag = '<i class="fa-regular fa-face-angry"></i>';
                            }else if(key == 'love'){
                                iTag = '<i class="fa-regular fa-heart"></i>';
                            }else{
                                iTag = '<i class="fa-regular fa-face-surprise"></i>'
                            }
                            a.html(iTag);
                        }
                    }
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
}