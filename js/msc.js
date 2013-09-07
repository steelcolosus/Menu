



$(function () {
    var stageList = Array(),
        newStage = true,
        stageSize = 200,
        menu = $('#stages'),
        size = stageList.length,
        total = size-1,
        stageContainerSize = size*(stageSize),
        stageDiv = stageList.length,
        index = 0, //Starting index
        endIndex = total; //End index;

    //create popop to save stage
    var pop = bindPopOp();
    $('body').on('click',function(event){

        if($(event.target).hasClass("stageDiv")){
            
            var posX = event.pageX-$(event.target).offset().left; 
            var posY = event.pageY-$(event.target).offset().top;
            var offR = (stageSize/2)+70;
            var offL = (stageSize/2)-70;

            if(posX>offL&&posX<offR){
                console.log( posX + ' , ' + posY);
                setActive($(event.target));
            }

        }else if($(event.target).hasClass("moveLeftVisible")){
            
            moveLeft(1); 

        }else if($(event.target).hasClass("moveRightVisible")){
            
            moveRight(1); 

        }else if($(event.target).hasClass("save")){
            
            var name = $('#stageName').val();
            var color = randomColor();
            pop.popover("hide");
            saveStage(name,color,false);

        }else if($(event.target).hasClass("cancel")){
            
            newStage=true;
            pop.popover("hide");

        }else if($(event.target).hasClass("addStage")){
            
            if(newStage==true){
                pop.popover("show");    
                newStage = false;
            }

        }
    });

    $('#barMenu').hover(
      function () {
        $('.moveLeft').toggleClass('moveLeft moveLeftVisible');
        $('.moveRight').toggleClass('moveRight moveRightVisible');
       
      },
      function () {
        $('.moveLeftVisible').toggleClass('moveLeftVisible moveLeft');
        $('.moveRightVisible').toggleClass('moveRightVisible moveRight');
        
      }
    );

    function bindPopOp(){
        var form = $("<form role='form' action='#' method='get'>")
                    .append($("<div class='form-group' name='stageName'>")
                        .append($("<label for='stageName'>Name</label>"))
                        .append($("<input type='text' id='stageName' name='stageName' class='form-control' placeholder='Stage Name'/>")))
                    .append($("<div class='checkbox' >")
                        .append($("<label>")
                            .append("<input type='checkbox' name='start'> Start stage")))
                    .append($("<hr>"))
                    .append($("<button id='save' class='btn btn-info save' type='button'>Save</button> "))
                    .append($("<button id='cancel' class='btn btn-danger cancel' type='button'>Cancel</button>"));

        var popopOptions = {
                html: true,
                placement: 'bottom',
                trigger: 'click',
                title: 'Create new stage',
                content: form
            };

        pop = $('#addStage');
        pop.popover(popopOptions);
        return pop;
    }

    function randomColor(){

        var color = '#'+Math.floor(Math.random()*16777215).toString(16);
        return color;
    }

    function saveStage(name,color,start){
        size+=1;
        total = size;
        $('.stageDiv').each(function(index,stage){
            $(stage).css('z-index',total);
            total-=1;
        });
        addItemMenu(size+". "+name,color,true);
        menu.css('width',menu.width()+stageSize);
        endIndex+=1
        var leftFirst = $('.stageDiv').first().position().left;
        if(leftFirst<0){
            $('.stageDiv').last().css('left',leftFirst);
        }
        var move = (endIndex-index);
        stageDiv = $('div.stageDiv');
        moveRight(move);    
        $("#addStage").popover('hide');
    }

    function createMenu(menuItems,size){
        menu.css('width',(menuItems.length*size));
        if(menuItems!=null&&menuItems.length>0){
           $.each(menuItems, function (index, stage) {
                var name = (index + 1) + ". " + stage.name;
                addItemMenu(name,stage.color,stage.current);
            });
        }
    }

    function addItemMenu(name,color,current){
                var stageArrow = $('<div>').addClass("stageDiv");
                stageArrow.addClass("pull-left");
                stageArrow.css("z-index", total);
                stageArrow.attr("data-color", color);
                stageArrow.html("<br />"+name);
                stageArrow.addClass("arrow_box_innactive");
                if (current) {
                  setActive(stageArrow);
                } 
                menu.append(stageArrow);
                total -= 1;
    }

    function setActive(element){
        $('.arrow_box').toggleClass('arrow_box arrow_box_innactive');
        element.toggleClass('arrow_box_innactive arrow_box');
        var color = element.attr('data-color');
        addCss(".arrow_box","background: "+color+";");
        addCss(".arrow_box:after","border-left-color: "+color+";");
    }

    function moveLeft(steps){
        
        var move = 0;
        for (var i = 0; i < steps; i++) {
            if(index > 0){
              index-=1;            
              move+=1;
            }
        }
        $('div.stageDiv').animate({'left':'+='+(move*stageSize)+'px'});
    }

    function moveRight(steps){
        var move=0;
        for(var x = 0 ; x<steps ; x++){
            var currentSize = $('#stageWrapper').width();
            var stgSize = $('#stages').width();
            var totalLeft = (stgSize/stageSize) - index;
            var newSize = totalLeft*stageSize;
            if(index < endIndex&& newSize>currentSize ){
                index+=1;
                move+=1;
            }
        }
        $('div.stageDiv').animate({'left': '-='+(move*stageSize)+'px'});
    }  

    function addCss(sel, css) {

        var S = document.styleSheets[document.styleSheets.length - 1];      
        var r = (S.cssRules !== undefined) ? S.cssRules : S.rules;
        if (S.insertRule) S.insertRule(sel + '{' + css + '}', r.length);
        else if (S.addRule) S.addRule(sel, css, r.length);
    }
    


    // create stages menu
    createMenu(stageList,stageSize);


});



 