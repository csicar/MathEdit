var canvas = document.getElementById("canvas");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext("2d");
var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
var sin = Math.sin,
cos = Math.cos,
tan = Math.tan,
log = Math.log,
pow = Math.pow,
sqrt = Math.sqrt,
pi = Math.PI;


var c = new webkitAudioContext()
var os = c.createOscillator();
os.connect(c.destination);
os.noteOn(0);
function playSound(n){
	os.frequency.value = n;
}
function stopSound(){
	os.stop(0)
}
playSound(0)
	

function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}
//           min---------|-------------max
//           0--------|---------255

function draw(func, scaleX, scaleY, offsetX, offsetY){
	var max = func(0, 0);
	var min = func(0, 0);
	for(var x = 0; x < canvasWidth; x++){
		for(var y = 0; y < canvasHeight; y++){
			var val = func(x,y)
			if(val > max){
				max=val;
			}
			if(val < min){
				min=val;
			}
		}
	}
	for(var x = 0; x < canvasWidth; x++){
		for(var y = 0; y < canvasHeight; y++){
			var val = ((func(x,y)-min)/(max-min))
			drawPixel(x, y, (sin(pi*val - pi/2)*0.5+0.5)*255, 
							(sin(pi*val       )*0.5+0.5)*255, 
							(sin(pi*val + pi/2)*0.5+0.5)*255,
					 255);
		}
	}
	updateCanvas();
}

var math = mathjs();
var parser = math.parser();
function MyCtrl($scope){

	$scope.math = math;
	$scope.parser = parser;
	var Storage = {
		save: function(){
			var graphs = []
			Object.keys(parser.scope).forEach(function(name){
				graphs.push(parser.scope[name].text)
			})
			localStorage["graph"] = JSON.stringify(graphs)
			console.log("save")
		},
		load: function(){
			try{
				var graphs = JSON.parse(localStorage["graph"] || '[]');
				console.log(graphs)
				graphs.forEach(function(graph){
					try {						
						var def = parser.eval(graph)
						def.text = graph	
					}catch(e){

					}
				})
			}catch(e){
				console.log(e)
			}
		}
	}
	parser.set('plot', function(func){
		ctx.moveTo(0, func(0))
		for(var x = 0; x < canvasWidth; x++){
			ctx.lineTo(x, func(x)-canvasHeight)
		}
		ctx.stroke();
	})
	$scope.currFunc = function(){};
	$scope.input = 'f(x, y)= x+y';
	Storage.load()
	$scope.download = function(){
		 var url = canvas.toDataURL("image/jpg");
		 window.open(url)
	}
	$scope.run = function(){
		try{
			var def = parser.eval($scope.input);
			def.text = $scope.input
			Storage.save();
			$scope.currFunc = def
			draw(def);
		}catch(e){
			console.error(e)
		}
	}
	$scope.playSound = function(a){
		try {				
			var val = $scope.currFunc(a.offsetX, a.offsetY)
			playSound(val)
		}catch(e){
		}
	}
	$scope.stopSound = function(){
		playSound(0)
	}
	$scope.draw = draw
}
