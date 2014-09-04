var root = __dirname,
	five = require("johnny-five"),
	express = require("express"),
    // or "./lib/johnny-five" when running from the source
    board = new five.Board();

board.on("ready", function() {
	var drive = createDrive();
	board.repl.inject({drive:drive});
	initializeApi(drive);
});

function createDrive() {
	var drive = {
		left: createServo(3,false),
		right: createServo(10,true),
		forward: function (foot, rate) {
			switch (foot)
			{
			case 'both':
				drive.left.forward(rate)
				drive.right.forward(rate)
				break;

			case 'left':
				drive.right.stop()
				drive.left.forward(rate)
				break;
				
			case 'right':
				drive.left.stop()
				drive.right.forward(rate)
				break;
			}
		},
		back: function (foot, rate) {
			switch (foot)
			{
			case 'both':
				drive.left.back(rate)
				drive.right.back(rate)
				break;

			case 'left':
				drive.right.stop()
				drive.left.back(rate)
				break;
				
			case 'right':
				drive.left.stop()
				drive.right.back(rate)
				break;
			}
		},
		rotate: function (direction, rate)
		{
			switch (direction)
			{
			case 'counterclockwise':
				drive.left.back(rate)
				drive.right.forward(rate)
				break;

			case 'clockwise':
				drive.left.forward(rate)
				drive.right.back(rate)
				break;
			}
		},
		stop: function () { drive.left.stop(); drive.right.stop(); }
	};

	drive.stop();

	return drive;
}

function createServo(pin, invert) {
	var topSpeed = 90;
	var servo = new five.Servo({
		pin: pin,
		isInverted: invert,
		type: 'continuous',
		specs: { speed: five.Servo.Continuous.speeds["@5.0V"] }
	});

	servo.forward = function(rate) {
		var speed = 90 + ((rate || 1) * topSpeed);
		servo.to(speed);
	};
	servo.back = function(rate) {
		var speed = 90 - ((rate || 1) * topSpeed);
		servo.to(speed);
	};

	servo.stop();

	return servo;
}

function initializeApi(drive) {
	var app = express();

	app.post('/move', function (req, res){
		var direction = req.param('direction');
		drive[req.param('direction')](req.param('foot'), req.param('rate'));
		res.send();
	});

	app.post('/rotate', function (req, res){
		var direction = req.param('direction');
		drive.rotate(direction, req.param('rate'));
		res.send();
	});

	app.post('/stop', function (req, res) {
		drive.stop();
		res.send();
	});

	app.use(express.static(__dirname + '/public'));

	app.listen(4242);
}