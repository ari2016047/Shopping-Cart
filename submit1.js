function cdf()
{
	var y = document.getElementById("x1");
	y.value = "";
}
	
function cal1(x)
{
	var y = document.getElementById("x1");
	y.value +=x;
}

function sum()
{
	var y = document.getElementById("x1");
	y.value+="+";
}
function sub()
{
	var y = document.getElementById("x1");
	y.value+="-";
}
function mul()
{
	var y = document.getElementById("x1");
	y.value+="*";
}
function div()
{
	var y = document.getElementById("x1");
	y.value+="/";
}
function cal2()
{
	var y = document.getElementById("x1");
	y.value = eval(y.value);
}	
function sine()
{
	var y = document.getElementById("x1");
    y.value = Math.sin(y.value*Math.PI/180);
}
function cosine()
{
	var y = document.getElementById("x1");
    y.value = Math.cos(y.value*Math.PI/180);
}
function tangent()
{
	var y = document.getElementById("x1");
    y.value = Math.tan(y.value*Math.PI/180);
}
function dot()
{
	var y = document.getElementById("x1");
	y.value+=".";
}
function back() {
    var y = document.getElementById("x1");
    y.value= (y.value).substr(0, (y.value).length - 1);
}
