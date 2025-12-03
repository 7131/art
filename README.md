# Siteswap Art

English site: https://7131.github.io/art/<br>
Japanese site: https://app.7131.jp/art/

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

# Versions

<dl>
  <dt>Simplified version</dt>
    <dd>You can only see changes in shape due to differences in the specified pattern. It is fixed at C = 1 and D = 10 degree.</dd>
  <dt>Standard version</dt>
    <dd>In addition to the pattern, C and D can be specified. However, the range is 0.1 &le; C &le; 10, 0 &le; D &le; 90.</dd>
  <dt>Professional version</dt>
    <dd>The range of values that can be specified for C and D is large. In addition, colors can be set and the drawing formula can be changed.</dd>
</dl>

