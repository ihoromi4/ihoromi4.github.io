Title: Variational Autoencoder (VAE) Example using MNIST
Date: 2021-05-18 9:20
Lang: en
Autor: Ihor Omelchenko
Category: Machine Learning
Tags: AI, ML, VAE, example
Summary: Interactive examples of Variational Autoencoder.
Status: draft

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
}
th, td {
	width: 100%;
	text-align: center;
	vertical-align: middle !important;
}
</style>

Вариационный Автоенкодер (англ. Variational Autoencoder - VAE) это тип нейронной сети, который используется для нахождения способа эффективного кодирования через обучение без учителя.

Вариационный автокодировщик состоит из двух нейросетей. Первая сжимает входные данные, переводя их в векторное пространство более низкой размерности чем входные данные. Вторая, векторы из этого пространства, восстанавливает в данные подобные исходным. Цель обучения - наилучшим способом сжимать и восстанавливать данные.

Автокодировщики обладают двумя интересными для нас свойствами:

1. Способность сжимать входные данные (снижение размерности данных)
2. Возможность генерировать новые данные из сжатого представления (генеративная модель)

Рассмотрим подробнее каждое свойство.

# Данные

В данной статье используется, ставший уже классическим, датасет MNIST. Он состоит из 70 000 изображений рукописных цифр (от 0 до 9). Каждое изображение имеет разрешение 28 х 28 пикселей. Цвета представленны оттенками серого. Датасет содержит порядка 7000 примеров написания каждой цифры. Нетрудно посчитать, что каждое изображение состоит из 784 пикселей, каждый представлен одним числом. И следовательно информация о том, какая из 10 цифр нарисована на изображении содержится в этих 784 числах. Очевидно, для того чтобы закодировать информацию о числе нужно намного меньше данных.

# Сжатие данных

Модель случайного скрытого вектора выглядит как $N(z|\mu(X, \theta), \sigma(X, \theta))$. Где $\mu$ и $\sigma$ это функции с обучаемыми параметрами $\theta$, в нашем случае это нейросети.

В вариационном автокодировщие скрытый вектор моделируется с помощью многомерного нормального распределения $N(\boldsymbol{\mu}, \boldsymbol{\Sigma})$. Предполагается, что компоненты скрытого вектора $\boldsymbol{z}$ статистически независимы, следовательно ковариационная матрица $\boldsymbol{\Sigma}$ принимает диагональный вид. В процессе обучения автокодировщик оценивает плотности вероятностей для компонентов скрытого вектора. Другими словами праметры многомерного нормального распределения как функции фходных данных моделируются нейронной сетью. При сжатии на выходе мы получим параметры многомерного нормального распределения - математическое ожидание $\mu$ и дисперсию $\sigma$.

У интерпретации многомерного скрытого вектора есть большие трудности. В процессе обучения каждое измерение скрытого вектора начинает отвечать за случайный аспект написания цифры. Это может быть наклон, толщина линии, пропорции, или что-то другое. Это можно определить только экспериментально на уже обученной сети.

Второе свойство - автокодировщик может генерировать новые примеры данных по заданному сжатому представлению. Таким образом мы можем создать примеры похожие на данные, на которых обучался автокодировщик.

В следующем примере вы можете сами нарисовать число и увидеть как нейросеть сжимает изображение и восстанавливает его.

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
				<span id="encoder_out" style="font-weight: bold;">(0.0, 0.0)</span>
			</td>
			<td>
				<div class="border">
					<canvas id="restore"></canvas>
				</div>
			</td>
		</tr>
		<tr>
			<td><button type="button" id="draw_clear" onclick="drawClear()">Clear</button></td>
			<td></td>
			<td></td>
		</tr>
	</table>
</div>

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


<script src="data/vae/script_example_1.js"></script>
<script src="data/vae/script_example_2.js"></script>

