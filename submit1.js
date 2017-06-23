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
