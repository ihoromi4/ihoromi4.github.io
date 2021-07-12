//import ndarray from "ndarray";

var p_encoder_out = document.getElementById("encoder_out");

var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = 28;
canvas.height = 28; 
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "#fff5";
ctx.lineJoin = "round";
ctx.lineWidth = 1;
//ctx.filter = "blur(1px)";


var canvas_restore = document.getElementById("restore");
var ctx_restore = canvas_restore.getContext("2d");
canvas_restore.width = 28;
canvas_restore.height = 28; 

function relPos(pt)
{
    var rect = pt.target.getBoundingClientRect();
    var clientX = pt.clientX - rect.left;
    var clientY = pt.clientY - rect.top;
    var x = clientX / canvas.offsetWidth * canvas.width
    var y = clientY / canvas.offsetWidth * canvas.height;
    return [x, y];
}

function drawStart(pt)
{
	ctx.beginPath();
	ctx.moveTo.apply(ctx, pt);
	ctx.stroke();
}

function drawMove(pt)
{
	ctx.lineTo.apply(ctx, pt);
	ctx.stroke();
}

function pointerDown(e)
{
	var pt = e.touches ? e.touches[0] : e;
	drawStart(relPos(pt));
}

function pointerMove(e)
{
	var pt = e.touches ? e.touches[0] : e;
	drawMove(relPos(pt));
	
	rezip();
}

function draw(method, move, stop)
{
	return e => {
		if (method == "add") pointerDown(e);
		canvas[method + "EventListener"](move, pointerMove);
		canvas[method + "EventListener"](stop, ctx.closePath);
	};
}

async function rezip()
{
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var arr = new Float32Array(canvas.width * canvas.height);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = imageData.data[i*4];
	}
	
	var inputTensor = new onnx.Tensor(arr, 'float32', [1, canvas.width * canvas.height]);
	
	var outputMap = await sess2.run([inputTensor]);
	var outputTensor = outputMap.values().next().value;
	console.log(outputTensor);
	p_encoder_out.innerHTML = String(outputTensor.data);
	
	runNN(outputTensor.data, ctx_restore);
}

function drawClear()
{
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const sess2 = new onnx.InferenceSession();
sess2.loadModel('./data/vae/encoder.onnx');

// mouse events
canvas.addEventListener("mousedown", draw("add", "mousemove", "mouseup"));
canvas.addEventListener("mouseup", draw("remove", "mousemove", "mouseup"));
canvas.addEventListener("mouseout", draw("remove", "mousemove", "mouseup"));

// touch events
canvas.addEventListener("touchstart", draw("add","touchmove","touchend"));
canvas.addEventListener("touchend", draw("remove","touchmove","touchend"));
