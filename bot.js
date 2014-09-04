var root = __dirname,
	five = require("johnny-five"),
	express = require("express"),
    // or "./lib/johnny-five" when running from the source
    board = new five.Board();

board.on("ready", function() {

	var drive = createDrive();

	initializeApi(drive);
});

function createDrive() {
	var drive = {
		left: createServo(3,false),
		right: createServo(10,true),
		forward: function (foot) {
			switch (foot)
			{
			case 'both':
				drive.left.forward()
				drive.right.forward()
				break;

			case 'left':
				drive.right.stop()
				drive.left.forward()
				break;
				
			case 'right':
				drive.left.stop()
				drive.right.forward()
				break;
			}
		},
		back: function (foot) {
			switch (foot)
			{
			case 'both':
				drive.left.back()
				drive.right.back()
				break;

			case 'left':
				drive.right.stop()
				drive.left.back()
				break;
				
			case 'right':
				drive.left.stop()
				drive.right.back()
				break;
			}
		},
		rotate: function (direction)
		{
			switch (direction)
			{
			case 'counterclockwise':
				drive.left.back()
				drive.right.forward()
				break;

			case 'clockwise':
				drive.left.forward()
				drive.right.back()
				break;
			}
		},
		stop: function () { drive.left.stop(); drive.right.stop(); }
	};

	drive.stop();

	return drive;
}

function createServo(pin, invert) {
	var servo = new five.Servo({
		pin: pin,
		isInverted: invert,
		type: 'continuous',
		specs: { speed: five.Servo.Continuous.speeds["@5.0V"] }
	});

	servo.forward = function() { servo.to(130); };
	servo.back = function() { servo.to(50); };

	servo.stop();

	return servo;
}

function initializeApi(drive) {
	var app = express();

	app.post('/move', function (req, res){
		var direction = req.param('direction');
		drive[req.param('direction')](req.param('foot'));
		res.send();
	});

	app.post('/rotate', function (req, res){
		var direction = req.param('direction');
		drive.rotate(direction);
		res.send();
	});

	app.post('/stop', function (req, res) {
		drive.stop();
		res.send();
	});

	app.use(express.static(__dirname + '/public'));

	app.listen(4242);
}