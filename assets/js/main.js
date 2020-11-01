let $main = $('#main'),
    $gallery = $('a.gallery'),
    $contact = $('#contact-form'),
    $navMain = $('#nav-main'),
    $navGallery = $('#nav-gallery'),
    $navContact = $('#nav-contact'),
    $arrowDown = $('#arrow-down'),
    $bgMain = $('#bg-main'),
    $bgGallery = $('#bg-gallery'),
    $bgContact = $('#bg-contact'),
    $order = $('#order'),
    $animationElements = $('.hideme'),
    $window = $(window),
    $scrollTop = $('.scroll-top'),
    $wrapper = $('#wrapper'),
    $form = $('#contact-form'),
    $email = $('#email'),
    $name = $('#name'),
    $message = $('#message'),
    $info = $('#info'),
    $submit = $('#submit'),
    $labName = $('#labName'),
    $labEmail = $('#labEmail'),
    $labMsg = $('#labMsg');

let app = {};

app.changeBackgroundOnHover = function($navItem, $bgImg) {
  $navItem.hover(function() {
    $bgImg.toggleClass('current');
  });
};

app.scrollOnClick = function($clicked, $target) {
  $clicked.click(function() {
    $('html, body')
    .clearQueue()
    .animate({
        scrollTop: $target.offset().top
    }, 1000);
  });
};

app.scrollOnClickInit = function() {
  app.scrollOnClick($navMain, $main);
  app.scrollOnClick($navGallery, $gallery);
  app.scrollOnClick($navContact, $contact);
  app.scrollOnClick($arrowDown, $gallery);
  app.scrollOnClick($order, $contact);
  app.scrollOnClick($scrollTop, $wrapper);
};

app.fadeInOutOnScroll = function() {
  let $extraHeight = 0;

  if ($window.width() <= 768)
    $extraHeight = 50;
  else
    $extraHeight = 0;

  let $windowHeight = $window.height();
  let $windowTop = $window.scrollTop();
  let $windowBottom = ($windowTop + $windowHeight + $extraHeight);

  $.each($animationElements, function() {
    let $element = $(this);
    let $elementHeight = $element.outerHeight();
    let $elementTop = $element.offset().top;
    let $elementBottom = ($elementTop + $elementHeight);

    if (($elementBottom >= $windowTop) &&
        ($elementTop <= $windowBottom)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
  });
};

app.fadeInOutScrollTopButton = function() {
  let $windowTop = $window.scrollTop();
  let $galleryTop = $('#gallery').offset().top;

  if ($galleryTop <= $windowTop)
    $scrollTop.addClass('in-view');
  else
    $scrollTop.removeClass('in-view');
};

app.inputFocusBlur = function($el, $label) {
  $el.focus(function () {
    $el.css('border-color', 'rgba(49, 49, 49, .5)');
    $label.addClass('label-animate');
  });
  $el.blur(function () {
    if ($el.val() === '') {
      $el.css('border-color', 'rgba(49, 49, 49, 1)');
      $label.removeClass('label-animate');
    }
  });
};

app.formSubmit = function() {
  $submit.on('click', function(e) {
    e.preventDefault();
    if(app.validate()) {
      $.ajax({
        type: "POST",
        url: "https://www.zonadekoracije.com/mailer.php",
        data: $form.serialize(),
        dataType: "json",
        success: function() {
          $email.val('');
          $name.val('');
          $message.val('');

          $info
          .html('Poruka uspešno poslata.')
          .css({
            color: '#4bb543',
            opacity: 1
          });
        },
        error: function (jqXHR, exception) {
          var msg = '';
          if (jqXHR.status === 0)
            msg = 'Not connect.\n Verify Network.';
          else if (jqXHR.status == 404)
            msg = 'Requested page not found. [404]';
          else if (jqXHR.status == 500)
            msg = 'Internal Server Error [500].';
          else if (exception === 'parsererror')
            msg = 'Requested JSON parse failed.';
          else if (exception === 'timeout')
            msg = 'Time out error.';
          else if (exception === 'abort')
            msg = 'Ajax request aborted.';
          else
            msg = 'Uncaught Error.\n' + jqXHR.responseText;

          $info
          .html(msg)
          .css({
            color: '#cc0000',
            opacity: 1
          });
        }
      });
    }
  });
};

app.validate = function() {
  var valid = true;
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if(!regex.test($email.val())) {
    $email.css('border-color', '#cc0000');
    valid = false;
  }
  if($.trim($name.val()) === "") {
    $name.css('border-color', '#cc0000');
    valid = false;
  }
  if($.trim($message.val()) === "") {
    $message.css('border-color', '#cc0000');
    valid = false;
  }

  return valid;
};

app.init = function() {
  app.changeBackgroundOnHover($navGallery, $bgGallery);
  app.changeBackgroundOnHover($navContact, $bgContact);

  app.scrollOnClickInit();

  $window.on('scroll resize load', app.fadeInOutOnScroll);
  $window.on('scroll resize load', app.fadeInOutScrollTopButton)

  $gallery.featherlightGallery({
		gallery: {
			fadeIn: 300,
			fadeOut: 300
		},
		openSpeed:    300,
		closeSpeed:   300
	});

  app.inputFocusBlur($name, $labName);
  app.inputFocusBlur($email, $labEmail);
  app.inputFocusBlur($message, $labMsg);

  app.formSubmit();
};

app.init();
