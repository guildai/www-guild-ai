function trySmoothScroll(href, pushHistory, topMargin) {
  if (href.charAt(0) === '#') {
    const target = $(href);
    if (target.length > 0) {
      if (pushHistory) {
        window.history.pushState(null, null, href);
      }
      const fixedHeaderHeight = $('.site-header.sticky').outerHeight();
      const scrollTop = target.offset().top - (fixedHeaderHeight || 0);
      $('html, body').animate({scrollTop: scrollTop}, 400);
      return true;
    }
  }
  return false;
}

$(function() {

  "use strict";

  // Scroll to anchor in page load
  trySmoothScroll(location.hash, false);

  // Scroll to page links
  $('a').click(function(e) {
    const href = e.target.getAttribute('href');
    if (href && href !== '#') {
      if (trySmoothScroll(href, true)) {
        return false;
      }
    }
  });

  // Back to top
  $('#scroll-up').on('click', function() {
    $('html, body').animate({scrollTop : 0}, 400);
    return false;
  });

  //
  // Top navbar
  //
  if ($('.site-header').hasClass('sticky') && !$('.site-header').hasClass('navbar-sm')) {
    var navbar_lg = $('.site-header').hasClass('navbar-lg');
    $(window).on('scroll', function() {
      var offset = $('.site-header').offset().top + $('.site-header').height();

      if ($(window).scrollTop() > offset) {
        if (navbar_lg) {
          $('.site-header').removeClass('navbar-lg');
        }
        $('.site-header').addClass('navbar-sm');

      } else {
        if (navbar_lg) {
          $('.site-header').addClass('navbar-lg');
        }
        $('.site-header').removeClass('navbar-sm');
      }
    });
  }

  // Manage transparent navbar
  if ($('.site-header').hasClass('navbar-transparent') && $('.site-header').hasClass('sticky')) {

    if ($('.site-header > .banner').length == 0) {
      $('.site-header').removeClass('navbar-transparent');
    } else {
      if ($('.site-header').hasClass('sticky')) {
        $(window).on('scroll', function() {
          var offset = $('.site-header .navbar').height();
          if ($(window).scrollTop() > offset) {
            $('.site-header').removeClass('navbar-transparent')
          }
          else {
            $('.site-header').addClass('navbar-transparent')
          }
        });
      }
    }
  }

  // Margin top for sticky navbar without banner
  if ($('.site-header').hasClass('sticky') && $('.site-header > .banner').length == 0) {
    $('.site-header').css('padding-top', $('.site-header > .navbar').height() + 30);
  }

  //
  // Sidebar
  //

  var offcanvas_open = function() {
    $('body').addClass('open-sidebar');
    $('body').prepend('<div class="offcanvas-backdrop"></div>');
    setTimeout(function() {
      $('.offcanvas-backdrop').addClass('in');
    }, 0);
    $('html').css('overflow', 'hidden');
  }

  var offcanvas_close = function() {
    $('body').removeClass('open-sidebar');
    $('.offcanvas-backdrop').removeClass('in');
    setTimeout(function() {
      $('html').css('overflow', 'visible');
      $('.offcanvas-backdrop').remove();
    }, 250);
  }

  // Offcanvas
  //
  $('[data-toggle="offcanvas"]').on('click', function () {
    if ($('body').hasClass('open-sidebar')) {
      offcanvas_close();
    } else {
      offcanvas_open();
    }
  });


  // Close offcanvas upon clicking on backdrop
  //
  $(document).on('click', '.offcanvas-backdrop', function() {
    offcanvas_close();
  });


  // Close offcanvas in single page layouts upon clicking on a menu
  //
  $('.nav.sidenav a').on('click', function() {
    offcanvas_close();
  });

  // Dropdown
  //
  $('.sidenav.dropable > li > a').on('click', function(e) {

    if (0 < $(this).next("ul").length) {
      e.preventDefault();
    }

    if (0 == $(this).next("ul").length) {
      return;
    }

    if ($(this).hasClass('open')) {
      $(this).removeClass('open').next("ul").slideUp(200);
    } else {
      $(this).closest(".sidenav").find("> li > a").removeClass('open');
      $(this).closest(".sidenav").find("ul:visible").slideUp(200);
      $(this).addClass('open').next("ul").slideDown(200, function() {
        update_scrollbar();
      });
    }
  });

  $('.sidenav.dropable > li > a.active').addClass('open');
  $('.sidenav.dropable > li > ul').prev('a').addClass('has-child');


  // Inner menus dropable
  $('.sidenav .dropable a').on('click', function(e){

    if ( 0 < $(this).next("ul").length ) {
      e.preventDefault();
    }

    if ( 0 == $(this).next("ul").length ) {
      return;
    }

    if ( $(this).hasClass('open') ) {
      $(this).removeClass('open').next("ul").slideUp(200);
    } else {
      $(this).closest("ul").find("> li > a").removeClass('open');
      $(this).closest("ul").find("> li > ul:visible").slideUp(200);
      $(this).addClass('open').next("ul").slideDown(200, function() {
        update_scrollbar();
      });
    }
  });

  $('.sidenav .dropable a.active').addClass('open');
  $('.sidenav .dropable ul').prev('a').addClass('has-child');

  // Perfect scrollbar for sidebar
  $('.sidebar-boxed, .sidenav.sticky').perfectScrollbar({
    wheelSpeed: 0.4,
  });

  var update_scrollbar = function() {
    $('.sidebar-boxed, .sidenav.sticky').perfectScrollbar('update');
  }


  if ($(window).width() < 768) {
    $('.sidebar-boxed').removeClass('sidebar-dark');
  }

  // Sticky behaviour
  if ($('.sidenav').hasClass('sticky')) {
    $(window).on('scroll', function() {
      var $sidenav   = $('.sidenav'),
          offset     = $('.sidebar').offset(),
          offset_top = 0;

      if ($(window).scrollTop() > offset.top) {
        if ( $('.site-header.sticky').length ) {
          offset_top = 100;
        }
        $sidenav.css({ position: 'fixed', top: offset_top +'px' });
      } else {
        $sidenav.css('position', 'static');
      }

      // If we are in footer area
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 80) {
        $sidenav.css('bottom', '80px');
        update_scrollbar();
      } else {
        $sidenav.css('bottom', '40px');
      }
    });
  }

  // Equal height
  $('.grid-view > li, .categorized-view > li, .promo.small-icon').matchHeight();
  $('.promo').matchHeight();

  //
  // Code viewers
  //

  // Copy to clipboard
  // It doesn't support Safari yet, and also has some minor bugs
  $('pre').each(function(index, value) {
    $(this).prepend('<a class="btn btn-sm btn-teal clipboard-copy" data-original-title="Copied">Copy</a>');
  });

  // Code snippet
  $('pre').each(function(index, value) {
    if ($(this).parents('.code-window').length || $(this).parents('.code-taps').length) {
      return;
    }
    var title = "";
    if ($(this).children("code").attr('class')) {
      title = $(this).children("code").attr('class');
      title = title.replace("language-", "");
      title = title.toLowerCase();
      if (title == "markup") {
        title = "html";
      }
    }
    var span = '<span class="language-name">'+ title +'</span>';
    $(this).prepend(span);
  });

  $('pre .language-name').parent().on('scroll', function(){
    $(this).find('.language-name').css('transform', 'translate('+ $(this).scrollLeft() +'px, '+ $(this).scrollTop() +'px)');
  });

  // Code window
  $('.code-window').each(function(index, value){
    var topbar = '<div class="window-bar"><div class="circles">';
    topbar += '<span class="circle circle-red"></span> <span class="circle circle-yellow"></span> <span class="circle circle-green"></span>';
    if ($(this).attr('data-title')) {
      topbar += '<span class="window-title">'+ $(this).data('title') +'</span>';
    }
    topbar += '</div>';//.circles

    // Languages
    if ($(this).children().length > 1) {
      topbar += '<div class="languages"><div class="btn-group" data-toggle="buttons">';

      $(this).children(':not(.prism-show-language)').each(function(index, value){
        var active='', check='', title='';
        if (index == 0) {
          active = ' active';
          check = ' checked';
        }
        if ($(this).children("code").attr('class')) {
          title = $(this).children("code").attr('class');
          title = title.replace("language-", "");
          title = title.toLowerCase();
          if (title == "markup") {
            title = "html";
          }
        }
        else if ($(this).hasClass('code-preview')) {
          title = 'Example';
        }
        topbar += '<label class="btn'+ active +'"><input type="radio" autocomplete="off"'+ check +'>'+ title +'</label>';
      });

      topbar += '</div></div>';
    }

    topbar += '</div>';//.window-bar

    $(this).children(':not(:first)').hide(0);
    $(this).children().wrapAll('<div class="window-content"></div>');
    $(this).prepend(topbar);

    //Event handler, change tab
    var window_content = $(this).children('.window-content');
    $(this).find(".btn-group .btn").on('click', function() {
      var i = $(this).index();
      window_content.children(":visible").fadeOut(200, function() {
        window_content.children(":not(.prism-show-language):eq("+ i +")").fadeIn(200);
      });
    });
  });

  // Code tabs
  $('.code-tabs').each(function(index, value){
    var topbar = '';

    //Languages
    if ($(this).children().length > 1) {
      topbar += '<div class="languages"><div class="btn-group" data-toggle="buttons">';

      $(this).children(':not(.prism-show-language)').each(function(index, value){
        var active='', check='', title='';
        if (index == 0) {
          active = ' active';
          check = ' checked';
        }
        if ($(this).children("code").attr('class')) {
          title = $(this).children("code").attr('class');
          title = title.replace("language-", "");
          title = title.toLowerCase();
          if (title == "markup") {
            title = "html";
          }
        }
        else if ($(this).hasClass('code-preview')) {
          title = 'Example';
        }
        topbar += '<label class="btn'+ active +'"><input type="radio" autocomplete="off"'+ check +'>'+ title +'</label>';
      });

      topbar += '</div></div>';
    }

    $(this).children(':not(:first)').hide(0);
    $(this).children().wrapAll('<div class="window-content"></div>');
    $(this).prepend(topbar);

    //Event handler, change tab
    var window_content = $(this).children('.window-content');
    $(this).find(".btn-group .btn").on('click', function() {
      var i = $(this).index();
      window_content.children(":visible").fadeOut(200, function() {
        window_content.children(":not(.prism-show-language):eq("+ i +")").fadeIn(200);
      });
    });
  });

  // Trim code blocks
  $('pre code').each(function(){
    $(this).html($.trim($(this).html()));
  });

  // Copy to clipboard
  $('.code-preview .clipboard-copy').remove();
  $('.clipboard-copy').tooltip({
    placement: 'left',
    trigger: 'manual'
  });

  // Move copy button when the content is scrolling
  $('.clipboard-copy').parent().on('scroll', function(){
    $(this).find('.clipboard-copy').css('transform', 'translate('+ $(this).scrollLeft() +'px, '+ $(this).scrollTop() +'px)');
  });

  if ($('.clipboard-copy').length > 0) {

    var clipboardSnippets = new Clipboard('.clipboard-copy', {
      target: function(trigger) {
        return trigger.nextElementSibling;
      }
    });

    clipboardSnippets.on('success', function(e) {
      e.clearSelection();
      $(e.trigger).tooltip('show');
      setTimeout(function(el) {
        $(el.trigger).tooltip('hide');
      }, 1500, e);
    });
  }

  // Set initial focus for modals
  $('.modal').on('shown.bs.modal', function () {
    $('.initial-focus').focus();
  });

  // Search

  var client = algoliasearch('I1IYALZNSK', '4863af8e5dd6e8d374f000181f8bd352');
  var index = client.initIndex('guild.ai');
  var search = algoliasearchHelper(client, 'guild.ai');

  search.on('result', function(content) {
    handleSearchResults(content);
  });

  var hitItem = function(hit) {
    return ''
      + '<li>'
      + '<h6><a href="' + hit.location
      + '" title="' + hit.location + '">'
      + hit._snippetResult.title.value
      + '</a></h6>'
      + '<p>' + hit._snippetResult.text.value + '</p>'
      + '</li>';
  };

  var pageItem = function(index, curPage) {
    return ''
      + '<li' + (index === curPage ? ' class="active"' : '') + '>'
      + '<a href="#nav-page-' + index + '">' + (index + 1) + '</a></li>';
  };

  var pageNavItem = function(type, active) {
    return ''
      + '<li class="' + (active ? '' : 'disabled') + '">'
      + '<a href="' + (active ? '#nav-' + type : '') + '"'
      + ' class="' + type +'"'
      + (active ? '' : ' tabindex="-1"') + '>'
      + '<i class="fa fa-angle-' + (type === 'previous' ? 'left' : 'right')
      + '"></i></a></li>';
  };

  var handleSearchResults = function(content) {
    $('#search-results').html(function() {
      return $.map(content.hits, hitItem);
    });
    $('#search-pages').html(function() {
      var items = [];
      items.push(pageNavItem('previous', content.page > 0));
      const maxPages = 10;
      const startPage = Math.max(
        0, content.page - parseInt(maxPages / 2)
          - (content.page === content.nbPages - 1 ? 1 : 0));
      const endPage = Math.min(
        startPage + parseInt(maxPages / 2) + 1,
        content.nbPages - 1);
      for (var i = startPage; i <= endPage; i++) {
        items.push(pageItem(i, content.page));
      }
      items.push(pageNavItem('next', content.page < content.nbPages - 1));
      return items;
    });
  };

  var clearSearch = function() {
    search.state.query = '';
    $('#search-input').val('');
    $('#search-results').empty();
    $('#search-pages').empty();
  }

  $('#search-input').on('keyup', function(e) {
    if (e.key !== 'Escape') {
      const val = $(this).val().trim();
      if (!val) {
        clearSearch();
      } else if (val != search.state.query) {
        search.setQuery(val).search();
      }
    }
  });

  $('#search-pages').on('click', 'a', function(e) {
    const target = $(e.target).closest('a');
    const href = target.attr('href');
    if (href.startsWith('#nav-page')) {
      search.setPage(href.slice(10)).search();
    } else if (href === '#nav-previous') {
      search.previousPage().search();
    } else if (href === '#nav-next') {
      search.nextPage().search();
    }
    return false;
  });

  // Close search and scroll to internal links
  $('#search-results').on('click', 'a', function(e) {
    const linkHref = e.target.href || '';
    const curHref = ''
          + window.location.protocol + '//'
          + window.location.host
          + window.location.pathname;
    if (linkHref.startsWith(curHref)) {
      const relPath = linkHref.slice(curHref.length);
      if (relPath.startsWith("#")) {
        $('#search-modal').modal('hide');
        trySmoothScroll(relPath, true);
        return false;
      }
    }
  });

  $('#search-modal').on('show.bs.modal', function () {
    clearSearch();
  });
});
