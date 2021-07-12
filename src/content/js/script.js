async function runNN(input)
{
    var inputTensor = new onnx.Tensor(input, 'float32', [1, 2]);
    var outputMap = await sess.run([inputTensor]);
    var outputTensor = outputMap.values().next().value;
    
    drawTensor(outputTensor);
}

function drawTensor(tensor)
{
    var imageData = context.createImageData(28, 28);
    var data = imageData.data;
    var tensorData = tensor.data;
    for (let i = 0; i < tensorData.length; i++) {
        data[i*4] = tensorData[i] * 256;
        data[i*4+1] = tensorData[i] * 256;
        data[i*4+2] = tensorData[i] * 256;
        data[i*4+3] = 256;
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
    
//     console.log("x: " + (x / rect.width) + " ; y: " + (y / rect.height));
//     console.log("x1: " + x1 + " ; x2: " + x2);
    
    runNN([x1, x2]);
}

// document.getElementById('map').onclick = mouseEvent;
document.getElementById('map').onmousemove = mouseEvent;

const canvas = document.getElementById('viewport');
canvas.width = 28;
canvas.height = 28; 
context = canvas.getContext('2d');

const json = $.getJSON({'url': "./conf.json", 'async': false});  
conf = JSON.parse(json.responseText);

const sess = new onnx.InferenceSession();
sess.loadModel('./decoder.onnx');

console.log(111);
