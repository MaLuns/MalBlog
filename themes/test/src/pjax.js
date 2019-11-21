require('jquery-pjax');
const NProgress = require('nprogress');

NProgress.configure({
    showSpinner: false,
    easing: 'ease-out',
    speed: 1000
});

$(document).pjax('a', '#main', {
    scrollTo: $('.main').position().top + 40,
    fragment: '#main',
    timeout: 5000,
});

$(document).on('pjax:start', function () {
    NProgress.start();
    $('html, body').animate({
        scrollTop: $('.main').position().top + 40
    }, 500);
    if (window.dplayerInstances) {
        for (var i = 0; i < window.dplayerInstances.length; i++) {
            window.dplayerInstances[i].destroy();
        }
    }
});

$(document).on('pjax:end', function () {
    NProgress.done();
    require('./loaded')();
    /*  require('./post-details')();
     require('./leancloud')();
     require('./share')();
     require('./pisces')(); */
    /*   CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox();
  
      ga('set', 'location', window.location.href);
      ga('send', 'pageview'); */
});
