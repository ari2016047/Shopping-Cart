var res="",r;
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
function cal2()
{
	var y = document.getElementById("x1");
	y.value = eval(y.value);
}	
	
