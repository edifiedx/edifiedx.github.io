$(document).ready(function(){

	load();
	stripes();

});

var store = window.localStorage;

//load from storage
function load () {
	var myList = store.myList;
  if(myList) {
	updateItemArray();
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

//uncheck hover
$('ul#items li').hover(function(){
	$(this).children().toggleClass('close-shadow');
});

//item hover
$('ul#items li').hover(function(){
	$(this).toggleClass('item-hover');
});

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
  stripes();
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
  stripes();
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
  stripes();
});

function stripes () {
	$('ul#items li:visible').removeClass('stripe');
	$('ul#items li:visible:odd').addClass('stripe');
}

function compareStore () {
	var storeList = store.myList;
	var siteList = $('ul#items').html();
	var maxList = Math.max(storeList.length, siteList.length);
	for (i = 0; i < maxList; i++) {
		console.log(storeList[i].html());
		console.log(siteList[i].html());
	}
}

$('#save').click(function(){
	//var testx = $('ul#items li').contents().not($('li').children()).text();
	makeItemArray();
});

function updateItemArray () {
	//gets entire item list from source (probably not needed after changes to loading)
	var itemA = [];
	$('ul#items li').each(function(){
		itemA.push($(this).contents().not($('li').children()).text());
	});
	//gets checked item list from local storage
	var sList = store.getItem('myList');
	var listA = [];
	$(sList).filter('.checked').each(function() {
		listA.push($(this).text().replace('\u00D7',''));
	});
	//loops through checked item list to toggle class for items in source
	for (i = 0; i < listA.length; i++) {
		var itemI = listA[i];
		$('ul#items li:contains("' + itemI + '")').addClass('checked');
	}
}

function cleanStorage () {
	var str = store.getItem('myList');
	str = str.replace(' style=""', '').replace('<span class="close">×</span><span class="close">×</span>', '<span class="close">×</span>');
}