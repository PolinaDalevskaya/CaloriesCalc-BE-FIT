$(document).ready(function(){
  $('.delete-product').on('click', function(e){
    $target = $(e.target);
    var id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/product/'+id,
      success: function(response){
        location.reload();
      }
    });
  });

  $('.addproduct').on('click', function(e){
    $target = $(e.target);

    const amount = $target.parents("tr").find('input[type=number]').val();
    const name = $target.parents("tr").find('.pName').text();
    const calories = $target.parents("tr").find('.pCalories').text();
    const user = getUrlVars();


    var data = {}

    data.name = name;
    data.calories = calories;
    data.user = user;
    data.amount = amount * calories / 100;

    $.ajax({
      type: 'POST',
      url: '/user/addproduct',
      data: data,
      success: function(response){
        location.reload();
      }
    });
  });

  function getUrlVars()
  {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('/calc/') + 6).split('&').toString();
      return hashes;
  }
});
