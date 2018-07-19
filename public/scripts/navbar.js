$('nav a').parents('li,ul').removeClass('active');
$('a[href="' + this.location.pathname + '"]').parents('li,ul').addClass('active');