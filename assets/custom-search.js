$(document).ready(function() {
   const currentUrl = window.location.href;
//console.log(currentUrl);
  // Function to extract the value of a specific query parameter
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results || !results[2]) return null;
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Get the value of 'filter.p.tag'
    const filterTagValue = getParameterByName('filter.p.tag');
  $('.tag-type').val(filterTagValue);

    // Check if filter.p.tag value matches any radio button value
    if (filterTagValue) {
        if (filterTagValue === '医薬品') {
            // Set '医薬品' radio button to checked
            $('#stype-pharmaceuticals').prop('checked', true);
        } else if (filterTagValue === '美容・サプリ・他') {
            // Set '美容・サプリ・他' radio button to checked
            $('#stype-supplement').prop('checked', true);
        } else if (filterTagValue === 'web_search') {
            // Set 'Web Search' radio button to checked
            $('#stype-web-search').prop('checked', true);
        }
    }else{
      $('#stype-pharmaceuticals').prop('checked', true);
    }
  
  $('[name="stype"]').change(function(){
  var value = $( 'input[name=stype]:checked' ).val();
  $('.tag-type').val(value);
});
  const search =$('.site-header__search-btn');
  search.on('click', function() {
   var selectedOption = $('input[name="stype"]:checked').val();
  var query = $('.search-bar').val();
  //console.log(selectedOption, query);
 if (selectedOption === 'web_search') {
       //console.log('web search');
        var searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
        window.open(searchUrl, '_blank');
      } 
 else if (selectedOption === '医薬品') {
        

      $('#Search').attr('action', '{{ routes.search_url }}?q='+query);
        
      } else if (selectedOption === '美容・サプリ・他') {
   
        $('#Search').attr('action', '{{ routes.search_url }}?q='+query);
    
      } 
  
    });
         



  $(".predict-search").on("click", "li", function () {
    var clickedTitle = $(this).text();
    //console.log("Clicked title: " + clickedTitle);
    $("#Search").val(clickedTitle);
  });

  $(document).on("keyup", ".search-bar", function () {
    $(".predict-search").empty();

    var value = $(this).val();
    var trim_value = value.trim();
    console.log("`" + trim_value + "`");
    var productCount = 0;
    setTimeout(function () {
      if (trim_value == "" || trim_value == " ") {
        $(".predict-search").empty();
      } else {
        // console.log(value);
        // console.log('/search?type=product&options%5Bprefix%5D=last&filter.p.tag=&q='+value);
        fetch(
          "/search?type=product&options%5Bprefix%5D=last&filter.p.tag=&q=" +
            value
        )
          .then(function (response) {
            return response.text();
          })
          .then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var productTitleDiv = doc.querySelector(
              ".collection-grid__wrapper"
            );
            var gridItems = doc.querySelectorAll(".grid__item.grid-product");

            if (gridItems.length > 0) {
              $(".predict-search").empty();

              if (trim_value == "" || trim_value == " ") {
                $(".predict-search").empty();
              } else {
                // Loop through each grid__item and get the text from the grid-product__title
                gridItems.forEach(function (item) {
                  if (productCount < 5) {
                    var productTitle = item.querySelector(".grid-product__title");
                    var productPrice = item.querySelector(".grid-product__price");
                    var productImage = item.querySelector(".grid-product__image-mask");
                    var productAnchor = item.querySelector(".grid-product__link");
                    console.log(productImage, productTitle, '------' );
                    var product_title = productTitle
                      ? productTitle.textContent.trim()
                      : "No title";
                    var product_price = productPrice
                      ? productPrice.textContent.trim()
                      : "No price";
                    var product_image_src = productImage
                      ? productImage.getAttribute("data-link")
                      : "No image";
                    var product_link = productAnchor
                      ? productAnchor.getAttribute("href")
                      : "No link";
  
                    if (product_image_src === "No image") {
                      product_image_src =
                        "https://cdn.shopify.com/s/files/1/0555/3389/5873/files/dummy.webp?v=1727778525";
                    }
  
                    $(".predict-search").append(
                      "<li>" +
                        "<a href='" +
                        product_link +
                        "' class='search-title'>" +
                        "<img src='" +
                        product_image_src +
                        "' alt='" +
                        product_title +
                        "' class='search-img'>" +
                        product_title +
                        "</a>" +
                        "</li>"
                    );
                    productCount++;
                  }
                });
  
                if (gridItems.length > 5) {
                  $(".predict-search").append(
                    "<button class='show-more'>Show more</button>"
                  );
                }
              }
            }
          })
          .catch(function (err) {
            console.log("Failed to fetch page: ", err);
          });
      }
    }, 400);
  });

  $(document).on("click", ".show-more", function () {
    // Get the value for the query string
    var value = $(".header-search-bar .search-bar").val();
    var tagvalue = $(".tag-type").val();
    // console.log(tagvalue);
    var pharmaceuticals = $("#stype-pharmaceuticals").val();
    if (tagvalue) {
      var url =
        "/search?type=product&options%5Bprefix%5D=last&filter.p.tag=" +
        tagvalue +
        "&q=" +
        value;
    } else {
      var url =
        "/search?type=product&options%5Bprefix%5D=last&filter.p.tag=" +
        pharmaceuticals +
        "&q=" +
        value;
    }
    window.location.href = url;
  });
});
