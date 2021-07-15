Title: Variational Autoencoder (VAE) Example using MNIST
Date: 2021-05-18 9:20
Lang: ru
Autor: Ihor Omelchenko
Category: Machine Learning
Tags: AI, ML, VAE, example
Summary: Interactive examples of Variational Autoencoder.
Status: published

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/onnxjs/dist/onnx.min.js"></script>
<style>
div.example { width: 100%; height: auto; text-align: center;}
img#map { width: 100%; float: left; display:inline-block; }
img#map:after { content: ""; display: block; padding-bottom: 100% }
canvas#viewport { width: 100%; image-rendering: crisp-edges; float: right }
canvas#draw { width: 100%; float: left; image-rendering: crisp-edges; }
canvas#restore { width: 100%; image-rendering: crisp-edges; float: right }
div.vertical { border-left: 6px solid #0000; height: 100%; position:absolute; left: 50%; }
button {
  background-color: #D9411E;
  padding: .6em .6em;
  font-size: .8em;
  line-height: 1;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
}
div.border {
  display:inline-block;
  background-color: #000;
  border-radius: 10px;
  border: 4px solid #D9411E;
  padding: 5px;
  width: 100%;
}
table.example {
	text-align: center;
	vertical-align: middle;
	margin-left: auto;
	margin-right: auto;
}
th, td {
	width: 100%;
	text-align: center;
	vertical-align: middle !important;
	align-content: center;
}

.slidecontainer {
  width: 100%; /* Width of the outside container */
  padding: 6px;
}

/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.9; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #D9411E; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #D9411E; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
</style>

Вариационный Автоенкодер (англ. Variational Autoencoder - VAE) это тип нейронной сети, который используется для нахождения способа эффективного кодирования через обучение без учителя.

Вариационный автокодировщик состоит из двух нейросетей. Первая сжимает входные данные, переводя их в векторное пространство более низкой размерности чем входные данные, она называется **кодировщик**. Вторая, векторы из этого пространства, восстанавливает в данные подобные исходным и называется **декодировщик**. Цель обучения - наилучшим способом сжимать и восстанавливать данные, подобные данным из обучающего набора.

Автокодировщики обладают двумя интересными для нас свойствами:

1. Способность сжимать входные данные (снижение размерности данных)
2. Возможность генерировать новые данные из сжатого представления (генеративная модель)

Рассмотрим подробнее каждое свойство.

# Данные

В данной статье используется, ставший уже классическим, датасет MNIST. Он состоит из 70 000 изображений рукописных цифр (от 0 до 9). Каждое изображение имеет разрешение 28 х 28 пикселей. Цвета представленны оттенками серого. Датасет содержит порядка 7000 примеров написания каждой цифры. Нетрудно посчитать, что каждое изображение состоит из 784 пикселей, каждый представлен одним числом uint8. И следовательно информация о том, какая из 10 цифр нарисована на изображении содержится в этих 784 числах. Очевидно, для того чтобы закодировать информацию о числе нужно намного меньше данных. Например, информация о цифре (их 10) и стиле написания цифры (наклон, масштаб и т.д.).

# Сжатие данных

Начнем сразу же с примера сжатия изображения рукописной цифры. Здесь используется предварительно обученный вариационный автоенкодер. Как уже было сказано выше, изображение состоит из 784 чисел. После сжатия нейронной сетью мы получим 10 чисел. Попробуйте сами нарисовать цифру в левом прямоугольнике и она в реальном времени будет преобразована кодировщиком в код. Или задайте код набором ползунков. В правом прямоугольнике отобразится цифра восстановаленная из кода декодировщиком.

<div class="example" id="example_2">
	<table class="example" style="width: 100%; height: auto; table-layout: fixed;">
		<tr>
			<th><text>Draw image here</text></th>
			<th><text>Code</text></th>
			<th><text>Restored image</text></th>
		</tr>
		<tr>
			<td>
				<div class="border">
					<canvas id="draw"></canvas>
				</div>
			</td>
			<td>
				<div id="slidecontainer">
					<input type="range" min="-5" max="5" value="0" step="0.1" class="slider">
				</div>
			</td>
			<td>
				<div class="border">
					<canvas id="restore"></canvas>
				</div>
			</td>
		</tr>
		<tr>
			<td><button type="button" id="draw_clear" onclick="drawClear()">Clear</button></td>
			<td>
				<span id="encoder_out" style="font-weight: bold;">(0.0, 0.0)</span>
			</td>
			<td></td>
		</tr>
	</table>
</div>


Если мы зададим вопрос: за что отвечает каждое значение в коде, то в общем случае ответа не будет. В процессе обучения каждое измерение скрытого вектора начинает отвечать за случайный аспект написания цифры. Это может быть наклон, толщина линии, пропорции, или что-то другое. Это можно определить только экспериментально для уже обученной сети.

# Генерация данных

Используя энкодер мы получили отображение цифр из валидационного набора на пространство кодов.
Каждая точка изображения соответствует двумерному коду.
В следующем примере мы увидим как скрытое двумерное векторное пространство связано с изображением цифры.

<div class="example" id="example_1">
	<table class="example" style="width: 100%; height: auto; table-layout: fixed;">
		<tr>
			<th><text>Map</text></th>
			<th>Code</td>
			<th><text>Generated image</text></th>
		</tr>
		<tr>
			<td>
				<div class="border">
					<img src="data/vae/map.png" alt="map" id="map">
				</div>
			</td>
			<td>
				<span id="ex1_code" style="font-weight: bold;">(0.0, 0.0)</span>
			</td>
			<td>
				<div class="border">
					<canvas class="canvas elevation" id="viewport"></canvas>
				</div>
			</td>
		</tr>
	</table>
</div>

# Как и почему оно работает

Тут должна быть диаграмма работы вариационного автокодировщика.

Вариационный автокодировщик состоит из последовательно соединенных нейросетей: кодировщика и декодировщика. И кодировщик и декодировщик являются полносвязными нейросетями (читай многослойный перцептрон - MLP). На вход кодировщику подается исходное изображение рукописной цифры. На выходе кодировщика параметры нормального распределения $N(z|\mu(X, \theta), \sigma(X, \theta))$. Где $\mu$ и $\sigma$ это функции с обучаемыми параметрами $\theta$, в нашем случае это нейросеть-кодировщик. Cкрытый вектор семплируется из этого распределения. На вход декодировщику подаюся значения семплированные из указанного ранее нормально граспределения, а на выходе вычисляется восстановленное по скрытому вектору изображение.

В вариационном автокодировщике скрытый вектор моделируется с помощью многомерного нормального распределения $N(\boldsymbol{\mu}, \boldsymbol{\Sigma})$. Предполагается, что компоненты скрытого вектора $\boldsymbol{z}$ статистически независимы, следовательно ковариационная матрица $\boldsymbol{\Sigma}$ принимает диагональный вид. В процессе обучения автокодировщик оценивает плотности вероятностей для компонентов скрытого вектора. Другими словами праметры многомерного нормального распределения как функции фходных данных моделируются нейронной сетью. При сжатии на выходе мы получим параметры многомерного нормального распределения - математическое ожидание $\mu$ и дисперсию $\sigma$.

# Источники

1. [Auto-Encoding Variational Bayes [Diederik P Kingma, Max Welling]](https://arxiv.org/abs/1312.6114) исходная научная работа, в которой впервые был представлен вариационный автокодировщик.

<script src="data/vae/script_example_1.js"></script>
<script src="data/vae/script_example_2.js"></script>

