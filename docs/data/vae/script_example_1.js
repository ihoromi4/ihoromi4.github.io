async function runNN(input, context)
{
    var inputTensor = new onnx.Tensor(input, 'float32', [1, 2]);
    var outputMap = await sess.run([inputTensor]);
    var outputTensor = outputMap.values().next().value;
    
    drawTensor(outputTensor, context);
}

function restoreImg(color)
{
	return color * conf.std + conf.mean;
}

function drawTensor(tensor, context)
{
    var imageData = context.createImageData(28, 28);
    var data = imageData.data;
    var tensorData = tensor.data;
    for (let i = 0; i < tensorData.length; i++) {
        data[i*4] = restoreImg(tensorData[i]) * 255;
        data[i*4+1] = restoreImg(tensorData[i]) * 255;
        data[i*4+2] = restoreImg(tensorData[i]) * 255;
        data[i*4+3] = 255;
    }
    imageData.data = data;
    context.putImageData(imageData, 0, 0);
}

function mouseEvent(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
    var [x_min, x_max, y_min, y_max] = [conf.x_min, conf.x_max, conf.y_min, conf.y_max];
    var x1 = x_min + (x_max - x_min) * (x / rect.width);
    var x2 = y_min + (y_max - y_min) * (y / rect.height);
    
    ex1_code.innerHTML = "(" + [x1, x2].map(c=>c.toFixed(2)).join(", ") + ")";
    
    runNN([x1, x2], context);
}

document.getElementById('map').onmousemove = mouseEvent;

const canvas_viewport = document.getElementById('viewport');
canvas_viewport.width = 28;
canvas_viewport.height = 28; 
context = canvas_viewport.getContext('2d');
context.fillRect(0, 0, canvas_viewport.width, canvas_viewport.height);

var ex1_code = document.getElementById("ex1_code");

const json = $.getJSON({'url': "./data/vae/config.json", 'async': false});  
conf = JSON.parse(json.responseText);

const sess = new onnx.InferenceSession();
sess.loadModel('./data/vae/decoder.onnx');

console.log("Example 1 initialized");

