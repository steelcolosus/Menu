$(function () 
{
    var stageList = Array(),//List of stages to build the menu
        stageSize = 200,//Size of the stage box
        menu = $('#stages'),//Container of the stages
        size = stageList.length-1==0?1:stageList.length,//size of the stages list
        total = size,//Actual total stages
        stageContainerSize = size*(stageSize),//Stage container size
        stageDiv = stageList.length,
        index = 0, //Starting index
        endIndex = total; //End index;




    $('body').on('click',function(event)
    {
        var posX,
            posY,
            offR,
            offL,
            name,
            color;


        if($(event.target).hasClass("stageDiv"))
        {
            posX = event.pageX-$(event.target).offset().left; 
            posY = event.pageY-$(event.target).offset().top;
            offR = (stageSize/2)+70;
            offL = (stageSize/2)-70;

            if(posX>offL&&posX<offR)
            {
                console.log( posX + ' , ' + posY);
                setActive($(event.target));
            }
        }
        else if($(event.target).hasClass("moveLeftVisible"))
        {
            moveLeft(1); 
        }
        else if($(event.target).hasClass("moveRightVisible"))
        {
            moveRight(1); 
        }
        else if($(event.target).hasClass("save"))
        {
           name = $('#stageName').val();
           color = randomColor();
           saveStage(name,color,false);
           $('.addStage').popover('hide');
        }
        else if($(event.target).hasClass("cancel"))
        {
           $('.addStage').popover('hide');
        }
        else if($(event.target).hasClass("addStage"))
        {
            $('.addStage').popover('show');
            event.stopPropagation();
        }
    });

    $('#barMenu').hover(
      function () 
      {
        $('.moveLeft').toggleClass('moveLeft moveLeftVisible');
        $('.moveRight').toggleClass('moveRight moveRightVisible');
      },
      function () 
      {
        $('.moveLeftVisible').toggleClass('moveLeftVisible moveLeft');
        $('.moveRightVisible').toggleClass('moveRightVisible moveRight');
      }
    );

    function bindPopOp()
    {
        var form = $("<div id='newStageDiv' >")
                    .append($("<div class='form-group' name='stageName'>")
                        .append($("<label for='stageName'>Name</label>"))
                        .append($("<input type='text' id='stageName' name='stageName' class='form-control' placeholder='Stage Name'/>")))
                    .append($("<div class='checkbox' >")
                        .append($("<label>")
                            .append("<input type='checkbox' name='start'> Start stage")))
                    .append($("<hr>"))
                    .append($("<button id='save' class='btn btn-info save ' type='button'>Save</button> "))
                    .append($("<button id='cancel' class='btn btn-danger cancel ' type='button'>Cancel</button>"));

        var popopOptions = 
            {
                html: true,
                placement: 'left',
                trigger: 'manual',
                title: 'Create new stage',
                content: form
            };

        
        $('#addStage').popover(popopOptions);
    }

    function randomColor()
    {
        return '#'+Math.floor(Math.random()*16777215).toString(16);;
    }

    function saveStage(name,color,start)
    {
        var leftFirst;
        size+=1;
        total = size;

        $('.stageDiv').each(

            function(index,stage)
            {
                $(stage).css('z-index',total);
                total-=1;
            }

        );

        addItemMenu(size+". "+name,color,true);
        leftFirst = $('.stageDiv').first().position().left;
        menu.css('width',menu.width()+stageSize);
        endIndex+=1
        
        if(leftFirst<0)
        {
            $('.stageDiv').last().css('left',leftFirst);
        }

        var move = (endIndex-index);
        stageDiv = $('div.stageDiv');
        moveRight(move);    
        $("#addStage").popover('hide');
    }

    function createMenu(menuItems,size)
    {
        menu.css('width',(menuItems.length*size));

        if(menuItems!=null&&menuItems.length>0)
        {
           $.each(menuItems, 
                function (index, stage) 
                {
                    var name = (index + 1) + ". " + stage.name;
                    addItemMenu(name,stage.color,stage.current);
                }
            );
        }
    }

    function addItemMenu(name,color,current)
    {
        var stageArrow = $('<div>').addClass("stageDiv");
        stageArrow.addClass("pull-left");
        stageArrow.css("z-index", total);
        stageArrow.attr("data-color", color);
        stageArrow.html("<br />"+name);
        stageArrow.addClass("arrow_box_innactive");

        if (current) 
        {
          setActive(stageArrow);
        } 

        menu.append(stageArrow);
        total -= 1;
    }

    function setActive(element)
    {
        var color = element.attr('data-color');

        $('.arrow_box').toggleClass('arrow_box arrow_box_innactive');
        element.toggleClass('arrow_box_innactive arrow_box');
        
        addCss(".arrow_box","background: "+color+";");
        addCss(".arrow_box:after","border-left-color: "+color+";");
    }

    function moveLeft(steps)
    {
        var move = 0;

        for (var i = 0; i < steps; i++) 
        {
            if(index > 0)
            {
              index-=1;            
              move+=1;
            }
        }

        $('div.stageDiv').animate({'left':'+='+(move*stageSize)+'px'});
    }

    function moveRight(steps)
    {
        var move=0;
        var currentSize,stgSize,totalLeft,newSize;
        for(var x = 0 ; x<steps ; x++)
        {
            currentSize = $('#stageWrapper').width();
            stgSize = $('#stages').width();
            totalLeft = (stgSize/stageSize) - index;
            newSize = totalLeft*stageSize;

            if(index < endIndex&& newSize>currentSize )
            {
                index+=1;
                move+=1;
            }
        }
        $('div.stageDiv').animate({'left': '-='+(move*stageSize)+'px'});
    }  

    function addCss(sel, css) 
    {
        var S = document.styleSheets[document.styleSheets.length - 1];      
        var r = (S.cssRules !== undefined) ? S.cssRules : S.rules;

        if (S.insertRule)
        {
             S.insertRule(sel + '{' + css + '}', r.length);
        }
        else if (S.addRule)
        {
             S.addRule(sel, css, r.length);
        }
    }

    //create popop to save stage
    bindPopOp();
    // create stages menu
    createMenu(stageList,stageSize);
});



 