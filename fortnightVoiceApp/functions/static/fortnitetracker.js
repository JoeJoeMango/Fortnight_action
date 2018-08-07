$(function(){
  var submitBtn = $('#submit');

  var platfromDropdownBtn = $('#platform a');

  var epicNickName = $('#epicNickName');

  var results = $('#results');
  var values = [];
  //defult values
  var dropDownValue = 'pc';

  submitBtn.click(function () {
    var data = {};
    data.epicNickName = epicNickName.val().toLowerCase();
    data.dropDownValue = dropDownValue.toLowerCase();

    $.ajax({
      type: "POST",
      url: '/',
      dataType: 'json',
      data: data,
      success: function(data){
        data = JSON.parse(data);
        // console.log(data);
        displayData(data);


      }
    });
    resetResult();
  });
  platfromDropdownBtn.click(function(){
    // dropDownValue = $(this).text();
    dropDownValue = $(this).text();
  });

  function resetResult(){
    results.html('');
    epicNickName.val('');
    // epicNickName_.val('');

  }
  function displayData(data){
    var epicUserHandel = data.epicUserHandle;
    var list = '<ul class="list-group">'+
                  '<li class="list-group-item">' + 'solo: ' + data.stats.p2.top1.value + '</li>' +
                  '<li class="list-group-item">' + 'duos: ' + data.stats.p10.top1.value + '</li>' +
                  '<li class="list-group-item">' + 'Teams: ' + data.stats.p9.top1.value + '</li>' +
              '</ul>';
              // console.log(data.stats.p2.top1.value);
    var template = '<div class="card">' +
                        '<h5 class="card-header">' + epicUserHandel + '</h5>' +
                        '<div class="card-body">' +
                        '<h5 class="card-title">' + 'wins' + '</h5>' +
                          '<p class="card-text">' + list + '</p>' +
                        '</div>' +
                    '</div>';

        results.html(template);
  }
});
