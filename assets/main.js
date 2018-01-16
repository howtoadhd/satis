function momentize(elements) {
  elements.each(function () {
    var element = $(this);
    element.text(moment(element.attr('datetime')).fromNow());
  });
}

$(function () {
  var input = $('input#search');
  var list = $('div#package-list');
  var packages = list.find('h3');
  var timeElements = $('time');
  var inputTimeout;

  var updateTimeElements = function () {
    momentize(timeElements);
  };

  var readHash = function () {
    var hash = window.decodeURIComponent(window.location.hash.substr(1));
    if (hash.length > 0) {
      input.val(hash);
      filterPackages();
    }
  };

  var updateHash = function () {
    window.location.hash = window.encodeURIComponent(input.val());
  };

  var filterPackages = function () {
    var needle = input.val().toLowerCase();

    list.hide();

    packages.each(function () {
      $(this).closest('div.card').toggle(
        $(this).text().toLowerCase().indexOf(needle) !== -1
      );
    });

    list.show();
  };

  input.keyup(function () {
    updateHash();
    window.clearTimeout(inputTimeout);
    inputTimeout = window.setTimeout(filterPackages, 350);
  });

  $(window).keyup(function (event) {
    if (event.keyCode === 27) { // "ESC" keyCode
      input.val('');
      filterPackages();
    }
  });

  readHash();
  updateTimeElements();
  window.setInterval(updateTimeElements, 5000);
});
