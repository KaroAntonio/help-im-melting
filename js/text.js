// overlay words on top of what there ur seeing there buddy

function draw_text() {

var idx = 0;
var pay_button = $('<div>PAY $$$ TO STOP MELTING</div>');
var ignore_button = $('<div class="highlight">IGNORE, U SLY FOX</div>');

wrds = [
	'oi vey.',
	'im',
	'melting.',
	'halp.',
	'im',
	'really very',
	'melting.',
	'it kinda hurts.',
	'This is',
	'a message',
	'from a person',
	'who is',
	'currently melting:',
	'im like a',
	'kraft singles slice',
	'on a windshield.',
	'Aka not sexy.',
	'Please',
	'give me',
	'ur coolness.',
	'I want',
	'to be frosty', 
	'like youuuu.',
	'Please dont',
	'ignore me',
	'...',
	'id',
	'hate that',
	':(',
	'Ur like,',
	'my hero',
]

console.log('draw text')

var overlay = $('<div>');
var overlay_text = $('<div>');
console.log('new');
overlay.addClass('noselect');

overlay_text.text(wrds[idx]);
overlay_text.appendTo(overlay);
overlay.appendTo('body');

overlay.css({
	textAlign: 'center',
	position:'fixed',
	zIndex: 1000,
	fontSize:110,
	color: 'red',
	width: window.innerWidth,
	height: window.innerHeight,
	//paddingLeft: window.innerWidth/2-200,
	paddingTop: window.innerHeight/2-100,
	userSelect: 'none',
	'-webkit-user-select': 'none',
	
});

overlay.click(function() {
	idx = (idx + 1) % wrds.length;
	overlay_text.html(wrds[idx]);
	document.getSelection().removeAllRanges();

	overlay.append(pay_button);
	overlay.append(ignore_button);
});
	
// BUTTONS

ignore_button.hover(function() {
	//$(this).css({'color':'yellow', 'cursor':'url(assets/sparkles.gif), auto'});
	$(this).css({'color':'yellow', 'cursor':'pointer'});
}, function() {
	$(this).css({'color':'red'});
});

pay_button.hover(function() {
	$(this).css({'color':'yellow', 'cursor':'pointer'});
}, function() {
	$(this).css({'color':'red'});
});

pay_button.click(function() {
	window.location.replace("http://www.worldlandtrust.org/projects/buy-acre");
});

ignore_button.click(function() {
	place_distraction();
});

overlay.append(pay_button);
overlay.append(ignore_button);

pay_button.css({
	fontSize:40,
	position:'fixed',
	bottom: 100,
	left: 100	
});

ignore_button.css({
	fontSize:40,
	position:'fixed',
	bottom: 100,
	right: 100	
});

function place_distraction() {
	var dist_urls = ['sparkles','sparkles','sparkles','unicorn_hula','rainicorn','pugicorn']
	var new_distract = $('<img>')
	new_distract.attr('src','assets/'+dist_urls[Math.floor(Math.random() * dist_urls.length)]+'.gif');
	new_distract.css({
		position: 'fixed',
		left: Math.random()*(window.innerWidth),
		top: Math.random()*(window.innerHeight),
	});
	$('body').append(new_distract);
}

}

