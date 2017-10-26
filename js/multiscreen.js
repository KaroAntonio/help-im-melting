// multiscreen is splits this screen so that it displays only a quadrant of the rendered screen
// it assumes jquery is included

var width = window.innerWidth;
var height = window.innerHeight;

function init_multiscreen() {
	var n_rows, n_cols, pos;

	// prompt for grid size and position
	console.log('init');
	var prompt = $('<div>');
	prompt.appendTo('body');
	prompt.css({
		position:'absolute',
		zIndex:10000,
		top:100,
		left:100,
	});

	var rows_input = $('<input>');
	var cols_input = $('<input>');
	var pos_input = $('<input>');

	rows_input[0].value = 'n rows';
	cols_input[0].value = 'n cols';
	pos_input[0].value = 'position';
	
	prompt.append(rows_input);
	prompt.append(cols_input);
	prompt.append(pos_input);

	var btn = $('<button>');
	btn.text('+++++');
	btn.appendTo(prompt);
	btn.click( function () { 
		n_rows = parseInt(rows_input.val());
		n_cols = parseInt(cols_input.val());
		pos = parseInt(pos_input.val());
		prompt.remove();		
		//resize_and_position(n_rows, n_cols, pos);
		draw_text();
		run_three_scene(n_rows, n_cols, pos);
	});
	prompt.children().css({width: width-200});
	console.log('asdf')

}

function resize_and_position(nr, nc, p) {

	var r = Math.floor(p / nc);
	var c = p - (r*nc);

	$('body').css({
		width:width*nc,
		height:height*nr
	});
	$('body').css({
		top:height*r,
		left:width*c
	});
}

