
Concentric = {};
Concentric.Utilities = {};
Concentric.OnScrollBinding = {};
Concentric.OnScrollStack = [];

Concentric.Utilities = {
  isValidEmail: function(email) {
    return validator.isEmail(email);
  },
  isValidUrl: function(url) {
    return validator.isURL(url);
  }
};

$(document).ready(function(){

  /*
   *  General event binding
   */
  (function() {
    var extraSmallBreakpoint = 768;
    var className = {
      forMenuOpenState: "is-open",
      forNoScrolling: "no-scroll"
    };

    var selector = {
      forMenuToggleButton: ".js-menuToggle",
      forMenuContainer: ".js-menu",
      forSiteYear: ".js-year",
      forAnimatedMenuIcon: ".js-animatedMenuIcon",
      forScrollTopButton: ".js-scrollTop",
      forHeaderLogo: ".js-headerLogo",
      forFooter: ".js-footer",
      forFooterLogo: ".js-footerLogo"
    };

    // Handle nav menu show/hide
    function _bindNavMenuHandler() {
      var menuState = false;

      $(selector.forMenuToggleButton).on("click", function() {
        menuState = !menuState;

        $(selector.forAnimatedMenuIcon).toggleClass(className.forMenuOpenState);
        $(selector.forMenuContainer).toggleClass(className.forMenuOpenState);

        $("body").toggleClass(className.forNoScrolling);
      });
    }

    // Smooth scroll back to top
    function _bindShowScrollTopButton() {
      if ($(window).width() <= extraSmallBreakpoint || !$(selector.forScrollTopButton).length) {
        return;
      }

      var scrollDistanceTrigger = 500;
      var $scrollTopButton = $(selector.forScrollTopButton);

      Concentric.OnScrollStack.push(function() {
        if ($(this).scrollTop() > scrollDistanceTrigger) {
          $scrollTopButton.fadeIn();
        } else {
          $scrollTopButton.fadeOut();
        }
      });

      $scrollTopButton.on("click", function(){
        $("html, body").animate({scrollTop : 0}, 500);
        return false;
      });
    }

    // Move scrollTop button with page when it's close to the footer
    function _bindScrollTopButtonPosition() {
      if ($(window).width() <= extraSmallBreakpoint || !$(selector.forScrollTopButton).length) {
        return;
      }

      Concentric.OnScrollStack.push(function() {
        var scrollDistance = $(this).scrollTop();
        var windowHeight = $(window).height();
        var $scrollTopButton = $(selector.forScrollTopButton);
        var footerTriggerPosition = $(selector.forFooter).offset().top - windowHeight - 60;

        if (_isProjectPage()) {
          footerTriggerPosition = footerTriggerPosition - 339;
        }

        if ( scrollDistance > footerTriggerPosition ) {
          var buttonMoveDistance = scrollDistance - footerTriggerPosition;

          $scrollTopButton.css({
            "margin-top": "-" + buttonMoveDistance + "px"
          });
        } else {
          $scrollTopButton.css({
            "margin-top": 0
          });
        }
      });
    }

    // Hide header logo when scrolling into footer
    function _bindScrollHeaderPosition() {
      Concentric.OnScrollStack.push(function() {
        var scrollDistance = $(this).scrollTop();
        var windowHeight = $(window).height();

        var footerLogoPosition = $(selector.forFooterLogo).offset().top - windowHeight + $(selector.forFooterLogo).height() + 15;
        if ( scrollDistance > footerLogoPosition ) {
          $(selector.forHeaderLogo + ":visible").fadeOut();
        } else {
          $(selector.forHeaderLogo + ":not(:visible)").fadeIn();
        }
      });
    }

    function _isProjectPage() {
      return $(".project-page").length;
    }

    // Set site year in footer
    function _setFooterDate() {
      var d = new Date();
      $(selector.forSiteYear).text(d.getFullYear());
    }

    function init() {
      _bindNavMenuHandler();
      _bindShowScrollTopButton();
      _setFooterDate();
      _bindScrollTopButtonPosition();
      _bindScrollHeaderPosition();
    }

    init();
  }());

  /*
   *  About page scrolling animations
   */
  (function() {
    // There are many animated bars in the DOM that are shown at
    // different breakpoints. We only need the currently visible ones.
    var selector = {
      forAboutPage: ".page-content.About",
      forSmallBusinessPage: ".page-content.Small.Business.Package",
      forAnimatedBars: ".js-animatedBar",
      forAnimatedBoxes: ".js-animatedAccentBox:visible"
    };

    function _bindProcessAnimations() {
      var minimumWindowWidth = 992;
      var targetDistance = "-100px";
      var rightAlignedClass = "anchored-right";

      var animationTriggered = false;
      var triggerPoint = 0;

      Concentric.OnScrollStack.push(function(a, b) {
        // Trigger point is equal to the top
        // bar reaching the midpoint of the window
        // f() = topOffset - (windowHeight/2)
        var viewportHeight = $(window).height();
        var bars = $(selector.forAnimatedBoxes);
        if (bars.length) {
          triggerPoint = $(bars[0]).offset().top - viewportHeight/2;
        }

        if (!animationTriggered && _wideEnough($(this).width()) && _scrollHeightReached($(this).scrollTop())) {
          _triggerAnimations();
        }
      });

      function _wideEnough(width) {
        // Since the animated styles are only shown on large
        // screens, we simply won't animate on smaller screens
        return width >= minimumWindowWidth;
      }

      function _triggerAnimations() {
        var animationInterval = 500;
        animationTriggered = true;

        $(selector.forAnimatedBoxes).each(function(i, el) {
          var that = this;
          var side = $(this).hasClass(rightAlignedClass) ? "left" : "right";
          var modifier = {};
          modifier[side] = targetDistance;

          setTimeout(function() {
            $(that).css(modifier);
          }, animationInterval * i);
        });
      }

      function _scrollHeightReached(scrollDist) {
        return scrollDist >= triggerPoint;
      }
    }

    function _bindServicesAnimations() {
      var widths = [ "40%", "58.33%", "76.67%", "95%" ];
      var animationTriggered = false;
      var triggerPoint = 0;

      Concentric.OnScrollStack.push(function(a, b) {
        // Trigger point is equal to the top
        // bar reaching the midpoint of the window
        // f() = topOffset - (windowHeight/2)
        var viewportHeight = $(window).height();
        var bars = $(selector.forAnimatedBars);
        if (bars.length) {
          triggerPoint = $(bars[0]).offset().top - viewportHeight/2;
        }

        if (!animationTriggered && _scrollHeightReached($(this).scrollTop())) {
          _triggerAnimations();
        }
      });

      function _triggerAnimations() {
        var animationInterval = 500;
        animationTriggered = true;

        $(selector.forAnimatedBars).each(function(i, el) {
          var that = this;
          var newWidth = widths[i];

          setTimeout(function() {
            $(that).css({
              width: newWidth
            });
          }, animationInterval * i);
        });
      }

      function _scrollHeightReached(scrollDist) {
        return scrollDist >= triggerPoint;
      }
    }

    function init() {
      if ($(selector.forAboutPage).length || $(selector.forSmallBusinessPage).length) {
        _bindProcessAnimations();
        _bindServicesAnimations();
      }
    }

    init();
  }());


  /*
   *  Social feeds
   */
  (function() {
    var feedName = {
      forInstagram: "instagram",
      forDribbble: "dribbble",
    };

    var className = {
      forImageGridWrapperClasses: ["col-xs-6", "col-md-3"],
      forImageContainerClasses: ["feed-image-container"]
    };

    var selector = {
      forFeedContainer: function (name){
        return ".js-" + name + "Feed";
      },
      forInvalidAccessTokenForm: ".js-invalidTokenNotificationForm"
    };

    var attributeName = {
      forInstagramAccessToken: "data-access-token"
    };

    var Post = function (imageUrl, sourceUrl) {
      this._image = imageUrl;
      this._destination = sourceUrl;

      this.getImage = function () {
        return this._image;
      };
      this.getDestination = function () {
        return this._destination;
      };
    };

    var Feed = function(containerSelector, data) {
      var that = this;
      this._containerSelector = containerSelector;
      this._container = $(this._containerSelector);
      this._posts = data; // Array of Post objects

      // General functions for creating DOM elements
      // for image URLs received from any API
      this._createGridWrapper = function (content) {
        var wrapper = document.createElement("div");
        wrapper.appendChild(content);

        className.forImageGridWrapperClasses.forEach(function(cssClass){
          wrapper.classList.add(cssClass);
        });

        return wrapper;
      };

      this._createImageContainer = function (img) {
        var container = document.createElement("div");
        container.appendChild(img);

        className.forImageContainerClasses.forEach(function(cssClass){
          container.classList.add(cssClass);
        });

        return container;
      };

      this._createLink = function (url, content) {
        var link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.appendChild(content);

        return link;
      };

      this._createImage = function (url) {
        var img = new Image();
        img.src = url;

        return img;
      };

      function render () {
        var postElements = [];

        that._posts.forEach(function(p) {
          var imageElement = that._createImage(p.getImage());
          var containedImage = that._createImageContainer(imageElement);
          var linkWrappedImage = that._createLink(p.getDestination(), containedImage);
          var finalElement = that._createGridWrapper(linkWrappedImage);

          postElements.push(finalElement);
        });

        that._container.append(postElements);
      };

      return {
        render: render
      };
    };

    function _instagramPlaceholderPresent() {
      return $(selector.forFeedContainer(feedName.forInstagram)).length;
    }

    function _dribbblePlaceholderPresent() {
      return $(selector.forFeedContainer(feedName.forDribbble)).length;
    }

    function _renderInstagram() {
      // NOTE - The instagram access token will regularly be invalidated by Instagram.
      // Here are instructions for getting a new one.
      // 1) Spin up local jekyll server
      // 2) Paste this URL into a browser: https://api.instagram.com/oauth/authorize/?client_id=9287f262d07145d2a48223f9aeaa0920&redirect_uri=http://www.concentric.design&response_type=token&callback=?
      // 3) Login with Concentric instagram cccount
      // 4) Copy the new access token from the URL in the address bar once it redirects back to the Concentric homepage

      var ACCESS_TOKEN = document.querySelector(selector.forFeedContainer(feedName.forInstagram)).dataset.accessToken;
      var CLIENT_ID = "9287f262d07145d2a48223f9aeaa0920";
      var USER_ID = "2585789514";
      var POSTS_COUNT = 4;

      var RECENT_POSTS_PATH = "/users/" + USER_ID + "/media/recent/";
      var API_ENDPOINT = "https://api.instagram.com/v1" + RECENT_POSTS_PATH + "?access_token=" + ACCESS_TOKEN + "&count=" + POSTS_COUNT + "&callback=?";

      function _getThumbnailUrl(post) {
        var url = post.images.standard_resolution.url;
        // var originalCropSizeString = "s150x150";
        // var newCropSizeString = "s200x200";

        return url;
      }

      function _processResults(data) {
        var things = [];

        data.forEach(function (item) {
          things.push(new Post(_getThumbnailUrl(item), item.link));
        });

        return things;
      };

      $.getJSON(API_ENDPOINT, function (result) {
        if (result.data) {
          var instagramPosts = _processResults(result.data);
          var instagramFeed = new Feed(
            selector.forFeedContainer(feedName.forInstagram),
            instagramPosts
          );

          instagramFeed.render();
        } else {
          // This typically means that the access token has been invalidated.
          // So, we're sending ourselves a notification email.
          if (result.meta && result.meta.error_type === "OAuthAccessTokenException") {
            var $invalidTokenNotificationForm = $(selector.forInvalidAccessTokenForm);

            $.ajax({
              url: $invalidTokenNotificationForm.attr('action'),
              type: $invalidTokenNotificationForm.attr('method'),
              data: $invalidTokenNotificationForm.serialize(),
              dataType: 'json',
              contentType: "application/json; charset=utf-8",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              error: function (err) {
                console.log("An error has occurred during survey submission.", err);
              },
              success: function (data) {
                console.log("Invalid token notification has been sent.");
              }
            });
          }
        }
      });
    }

    function _renderDribbble() {
      var ACCESS_TOKEN = "63cca889e27f3765ef6246747823d1348a5159d8252d8f8f95f50b4164724984";
      var SHOTS_PATH = "/teams/concentric/shots";
      var API_ENDPOINT = "https://api.dribbble.com/v1" + SHOTS_PATH + "?access_token=" + ACCESS_TOKEN;
      var DRIBBLE_SHOTS_COUNT = 4;

      var req = new XMLHttpRequest();

      function _processResults(data) {
        var things = [];

        data.forEach(function (item, i) {
          if (i < DRIBBLE_SHOTS_COUNT) {
            things.push(new Post(item.images.normal, item.html_url));
          }
        });

        return things;
      };

      req.onreadystatechange = function () {
        if (req.readyState !== XMLHttpRequest.DONE) {
          return;
        }

        if (req.status === 200) {
          var dribbblePosts = _processResults(JSON.parse(req.responseText));
          var dribbbleFeed = new Feed(
            selector.forFeedContainer(feedName.forDribbble),
            dribbblePosts
          );

          dribbbleFeed.render();
        } else {
          console.log(req);
        }
      };

      req.open('GET', API_ENDPOINT, true);
      req.send(null);
    }

    function init() {
      if (_instagramPlaceholderPresent()) {
        _renderInstagram();
      }

      if (_dribbblePlaceholderPresent()) {
        _renderDribbble();
      }
    }

    init();
  }());

  /*
   *  Footer mailing list signup
   */
  (function() {
    var TEST_EMAIL = "y@s";
    var animationClass = "is-submitted";
    var selector = {
      forFormContainer: "#js-mailingListForm",
      forSubscribeForm: "#js-mailingListForm",
      forEmailField: "#js-mailingListInput",
      forSubmitContainer: "#js-submitContainer",
      forSubmitButton: "#js-mailingListSubmit"
    };
    var className = {
      forError: "has-error"
    };
    var attributeName = {
      forDisabled: "disabled"
    };

    var submissionAttempted = false;
    var $form;
    var $submitContainer;
    var $emailField;
    var $submitButton;

    function _setVariables() {
      $form = $(selector.forSubscribeForm);
      $submitContainer = $(selector.forSubmitContainer);
      $emailField = $(selector.forEmailField);
      $submitButton = $(selector.forSubmitButton);
    }

    function _bindSubscribeEvents() {
      $emailField.on("keyup", function() {
        _checkForErrorState();
      });

      $form.on("submit", function(e) {
        e.preventDefault();

        submissionAttempted = true;
        _checkForErrorState();

        if (_testEmail()) {
          _simulateSubmission();
        } else if (_validForm()) {
          _sendSubscription();
        } else {
          console.log("Invalid email.");
        }
      });
    }

    function _checkForErrorState() {
      if (!submissionAttempted) {
        return;
      }

      if (_validForm()) {
        $(selector.forFormContainer).removeClass(className.forError);
      } else {
        $(selector.forFormContainer).addClass(className.forError);
      }
    }

    function _testEmail() {
      return $emailField.val() && $emailField.val().trim() === TEST_EMAIL;
    }

    function _validForm() {
      var email = $emailField.val() ? $emailField.val().trim() : null;
      return !!email && Concentric.Utilities.isValidEmail(email);
    }

    function _simulateSubmission() {
      _disableForm();

      setTimeout(function() {
        _enableForm();
        _resetForm();
        _triggerSuccessAnimation();
      }, 500);
    }

    function _triggerSuccessAnimation() {
      var revertInterval = 3 * 1000;
      var cachedButtonText = "";

      $submitContainer.addClass(animationClass);
      cachedButtonText = $submitButton.val();
      $submitButton.val("");

      setTimeout(function() {
        $submitContainer.removeClass(animationClass);
        $submitButton.val(cachedButtonText);
      }, revertInterval);
    }

    function _disableForm() {
      $emailField.attr(attributeName.forDisabled, true);
      $submitButton.attr(attributeName.forDisabled, true);
    }

    function _enableForm() {
      $emailField.removeAttr(attributeName.forDisabled);
      $submitButton.removeAttr(attributeName.forDisabled);
    }

    function _resetForm() {
      $emailField.val("");
    }

    function _sendSubscription() {
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),
        dataType: 'jsonp',
        jsonp: 'c',
        contentType: "application/json; charset=utf-8",
        error: function (err) {
          _enableForm();

          console.log("An error has occurred during registration", err);
        },
        success: function (data) {
          _enableForm();

          if (data["result"] != "success") {
            console.log("An error has occurred during registration", data);
          } else {
            _resetForm();
            _triggerSuccessAnimation();
            console.log("Registration success!");
          }
        }
      });

      _disableForm();
    }

    function init() {
      _setVariables();
      _bindSubscribeEvents();
    }

    init();
  }());

  /*
   *  Handler for all scroll revents
   */
  Concentric.OnScrollBinding = (function() {
    $(window).on("scroll", function(e) {
      Concentric.OnScrollStack.forEach(function(callBack) {
        callBack.call(this, e);
      });
    });
  }());
});
