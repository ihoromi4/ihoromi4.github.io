//import ndarray from "ndarray";

var p_encoder_out = document.getElementById("encoder_out");

var ns = 10;
var slider = document.getElementsByClassName("slider")[0];
for (let i = 1; i < ns; i++) {
	slider.after(slider.cloneNode(true));
}
var ex2_elements_sliders = document.getElementsByClassName("slider");

var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = 28;
canvas.height = 28; 
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "#fff2";
ctx.lineJoin = "round";
ctx.lineWidth = 2;
//ctx.filter = "blur(1px)";


var canvas_restore = document.getElementById("restore");
var ctx_restore = canvas_restore.getContext("2d");
canvas_restore.width = 28;
canvas_restore.height = 28;
ctx_restore.fillRect(0, 0, canvas_restore.width, canvas_restore.height);

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

function pointerDown(evt)
{
	var pt = evt.touches ? evt.touches[0] : evt;
	drawStart(relPos(pt));
}

function pointerMove(evt)
{
	var pt = evt.touches ? evt.touches[0] : evt;
	drawMove(relPos(pt));
	
	rezip();
	evt.preventDefault();
}

function draw(method, move, stop)
{
	return evt => {
		if (method == "add") pointerDown(evt);
		canvas[method + "EventListener"](move, pointerMove);
		canvas[method + "EventListener"](stop, ctx.closePath);
	};
}

async function rezip()
{
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var arr = new Float32Array(canvas.width * canvas.height);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = imageData.data[i*4] / 255.0;
	}
	var inputTensor = new onnx.Tensor(arr, 'float32', [1, canvas.width * canvas.height]);
	
	var outputMap = await ex2_encoder_sess.run([inputTensor]);
	var outputTensor = outputMap.values().next().value;
	
	// visualisation
	p_encoder_out.innerHTML = "(" + Array.from(outputTensor.data).map(c=>c.toFixed(2)).join(", ") + ")";
	for (let i = 0; i < ex2_elements_sliders.length; i++) {
		ex2_elements_sliders[i].value = outputTensor.data[i];
	}
	
	restoreImage(ex2_decoder_sess, outputTensor.data, ctx_restore);
	//drawTensor(inputTensor, ctx_restore);
}

function drawClear()
{
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx_restore.fillRect(0, 0, canvas_restore.width, canvas_restore.height);
	p_encoder_out.innerHTML = "(0.0, 0.0)";
	for (let i = 0; i < ex2_elements_sliders.length; i++) {
		ex2_elements_sliders[i].value = 0;
	}
}

function onSliderInput(id)
{
	var n = ex2_elements_sliders.length;
	var code = new Float32Array(n);
	for (let i = 0; i < ex2_elements_sliders.length; i++) {
		code[i] = ex2_elements_sliders[i].value;
	}
	p_encoder_out.innerHTML = "(" + Array.from(code).map(c=>c.toFixed(2)).join(", ") + ")";
	restoreImage(ex2_decoder_sess, code, ctx_restore);
}

async function restoreImage(sess, input, context)
{
    var inputTensor = new onnx.Tensor(input, 'float32', [1, input.length]);
    var outputMap = await sess.run([inputTensor]);
    var outputTensor = outputMap.values().next().value;
    
    drawTensor(outputTensor, context);
}

for (let i = 0; i < ex2_elements_sliders.length; i++) {
	ex2_elements_sliders[i].oninput = () => onSliderInput(i);
}

const ex2_encoder_sess = new onnx.InferenceSession();
ex2_encoder_sess.loadModel('./data/vae/encoder_10.onnx');

const ex2_decoder_sess = new onnx.InferenceSession();
ex2_decoder_sess.loadModel('./data/vae/decoder_10.onnx');

// mouse events
canvas.addEventListener("mousedown", draw("add", "mousemove", "mouseup"));
canvas.addEventListener("mouseup", draw("remove", "mousemove", "mouseup"));
canvas.addEventListener("mouseout", draw("remove", "mousemove", "mouseup"));

// touch events
canvas.addEventListener("touchstart", draw("add", "touchmove", "touchend"));
canvas.addEventListener("touchend", draw("remove", "touchmove", "touchend"));
