# Siteswap Art

This service transforms siteswap patterns into graphics.
A siteswap pattern is usually written as 3, for example, but is actually sequence of 3 3 3 ... infinitely long.
The following transformations are applied to the i-th term a<sub>i</sub> of this infinite sequence.
First, each i-th term is converted to polar coordinates (r<sub>i</sub>, &theta;<sub>i</sub>) as follows:

r<sub>0</sub> = 0, r<sub>i</sub> = r<sub>i-1</sub> + C<br>
&theta;<sub>0</sub> = 0, &theta;<sub>i</sub> = &theta;<sub>i-1</sub> + a<sub>i</sub> * D

Where C and D are constants.
Then they are converted to rectangular coordinates.

x<sub>i</sub> = r<sub>i</sub> * cos &theta;<sub>i</sub><br>
y<sub>i</sub> = r<sub>i</sub> * sin &theta;<sub>i</sub>

Finally, they are plotted on the canvas and you can get the siteswap as a graphic.

# File list

<dl>
  <dt>index.html</dt>
    <dd>This is the service entrance page. Usually redirect to the simplified version.</dd>
  <dt>simple.html</dt>
    <dd>This is the simplified version page. It is fixed at C = 1 and D = 10 degree.</dd>
  <dt>simple.css</dt>
    <dd>The style sheet for the simplified version.</dd>
  <dt>simple.js</dt>
    <dd>This is a controller that receives the input of the simplified version and outputs the resulting graphic.</dd>
  <dt>standard.html</dt>
    <dd>This is the standard version page. You can specify C and D in addition to the pattern. However, the range is 0.1 &le; C &le; 10, 0 &le; D &le; 90.</dd>
  <dt>standard.css</dt>
    <dd>The style sheet for the standard version.</dd>
  <dt>standard.js</dt>
    <dd>This is a controller that receives the input of the standard version and outputs the resulting graphic.</dd>
  <dt>professional.html</dt>
    <dd>This is the professional version page. The range of values​that can be specified for C and D is large. In addition, you can set color and change the drawing formula.</dd>
  <dt>professional.css</dt>
    <dd>The style sheet for the professional version.</dd>
  <dt>professional.js</dt>
    <dd>This is a controller that receives the input of the professional version and outputs the resulting graphic.</dd>
  <dt>gallery/index.html</dt>
    <dd>This page is a list of the art created in the professional version.</dd>
  <dt>gallery/gallery.css</dt>
    <dd>The style sheet for the art list page.</dd>
  <dt>gallery/*.png</dt>
    <dd>Various siteswap art graphics saved as PNG files.</dd>
</dl>

