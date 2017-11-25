var store = window.localStorage;

load();

//load from storage
function load () {
	var myList = store.myList;
  if(myList) {
  	$('ul#items').html(myList);
  }
}

//save that shit, son
function save () {
  var myList = $('ul#items').html();
	store.setItem('myList', myList);
}

//check off item
var items = $('ul#items');
items.click(function(event) {
	var target = $(event.target);
  if (target.is('li')){
  	target.addClass('checked');
  }
  save();
});

//add uncheck button
var itemList = $('ul#items li');
var text = $('<span></span>').text('\u00D7').addClass('close');
itemList.append(text);

//uncheck
var xClose = $('.close');
xClose.click(function(event) {
	var target = $(event.target);
  if (target.is('span')){
  	target.parent().removeClass('checked');
  }
  save();
});

//navigation
$('a.sidenav').click(function(){
	var thisSub = $(this).nextUntil('a.sidenav');
  $(this).toggleClass('navopen');
  $('a.sidenav').not(this).removeClass('navopen');
	$('.side').not(thisSub).slideUp(300);
	$(this).nextUntil('a.sidenav').slideToggle(300);
  var thisID = $(this).attr('id');
	$('li').not('.' + thisID).hide();
  $('li.' + thisID).show();
  //stripes();
});

//filter
$('div.side a').click(function(){
	var id1 = $(this).parent().attr('id');
  var id2 = $(this).attr('id');
  if (id2 === "all") {
  	$('li.'+id1).show();
    $('li').not('.'+id1).hide();
  } else {
  	$('li.'+id1+'.'+id2).show();
  	$('li').not('.'+id1+'.'+id2).hide();
	}
  //stripes();
});

//auto-select searchbar text
$('input#filter').click(function(){
	$(this).select();
});

//search filter
var input = $('input#filter');
input.keyup(function(){
	var filter = input.val().toUpperCase();
	var filtered = $('ul#items li').filter(function() {
		var reg = new RegExp(filter, 'ig');
  	return reg.test($(this).text())
	});
  $('li').not(filtered).hide();
  filtered.show();
  //stripes();
});

function stripes () {
	$('ul#items li:visible').css('background-color', '#272822');
  $('ul#items li:visible:odd').css('background-color','#22231D');
}