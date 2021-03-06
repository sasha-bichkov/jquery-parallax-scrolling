# JQuery-parallax-scrolling

**ATTENTION!!** The plugin under development!! And you can help me with it.
Check it out and report me if you find a bug.
I need to know browser and device that you're using.

## Usage
In your index.html

	<div class="sliders">
		<div class="slider">
		<div class="slider">
		<div class="slider">
	</div>

In your stylesheets file
	
	.slider { position: relative }

In your javascript file

	$('.sliders').parallax();

## Options
	
	$(element).parallax({
		children: '.slide',
		motion: 'vertical',
		speed: 1
	});

### _children_
By default it's set to `null`.

### _motion_
It's `vertical` by default and can be set as `horizontal`. You should use CSS
to work with `horisontal` value. You can see `horizontal.css` for example.

### _speed_ 
I recommend you to set the option to [0, 1], but you can play with it and set others number.

## Tests

### _PC_
* Chrome 43.0
* Opera 30
* IE 11.0 (doesn't work)
* Firefox 38.0

### _Devices_
* IPad Air (unfortunately, slides are blur when scrolling)

## License

The MIT License (MIT)

Copyright (c) 2015 Sasha Bichkov <aleksandar.bichkov@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
