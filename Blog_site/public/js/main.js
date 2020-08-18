//jshint esversion : 8 
const responsive = {
    0: {
        items: 1
    },
    320: {
        items: 1
    },
    560: {
        items: 2
    },
    960: {
        items: 3
    }
};

$(document).ready(function () {

    $nav = $('.nav');
    $toggleCollapse = $('.toggle-collapse');

    /** click event on toggle menu */
    $toggleCollapse.click(function () {
        $nav.toggleClass('collapse');
    });

    // owl-crousel for blog
    $('.owl-carousel').owlCarousel({
        loop: true,
        autoplay: false,
        autoplayTimeout: 3000,
        dots: false,
        nav: true,
        navText: [$('.owl-navigation .owl-nav-prev'), $('.owl-navigation .owl-nav-next')],
        responsive: responsive
    });


    // click to scroll top
    $('.move-up span').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });

  
    $('#myForm').on('submit' , (e) =>{
        e.preventDefault();
        // This assumes the form's name is `myForm`
 
        var form = document.getElementById("myForm");
        var formData = new FormData(form);
        let response = fetch('https://image-server11.herokuapp.com/upload', {
          method: 'POST',
          body: formData
        })
        .then (response => response.json())
        .then ( (json)=>{
           
            
            let pathString = 'https://image-server11.herokuapp.com/images/'+ json.filename;
            let input = document.createElement("input");
            input.type ="hidden";
            input.value = pathString;
            input.name = "postImage";
           let viewarr = $('#myForm').serializeArray();
           let view = {};
           for(let i in viewarr)
           {
               view[viewarr[i].name] = viewarr[i].value;
           }
           const customform = document.createElement('form');
           customform.method = 'POST';
           customform.action = '/upload';
           let title = document.createElement('input');
           title.type='hidden';
           title.name = 'title';
           title.value = view['name'];
           let content = document.createElement('input');
           content.type='hidden';
           content.name = 'description';
           content.value = view['desc'];
           let category = document.createElement('input');
           category.type='hidden';
           category.name = 'categ';
           category.value = view['category'];
           customform.appendChild(input);
           customform.appendChild(title);
           customform.appendChild(content);
           customform.appendChild(category);
           document.body.appendChild(customform);
           customform.submit();

        } ); 
      });
    // AOS Instance
    AOS.init();
});
