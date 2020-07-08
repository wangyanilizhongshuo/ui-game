
// 1.对象属性函数简写： { fn(e){} }
try{
	var obj = { 
		fn(e){
			console.log(123);
		}, 
	};
}
catch(err){
	console.log('1.对象属性函数简写 报错'+JSON.stringify(err));
}


// 2.对象 动态属性名： obj[name]
try{
	var obj_name = { 
		a: 123,
	};
	console.log(obj_name['a']);
}
catch(err){
	console.log('2.对象 动态属性名 报错'+JSON.stringify(err));
}


// 3.对象 属性名值同名： obj={ name: name }
try{
	var name = '对象 属性名值同名';
	var obj_name = { 
		name,
	};
}
catch(err){
	console.log('3.对象 属性名值同名 报错'+JSON.stringify(err));
}



// 4.map数组方法： array.map()
try{
	var map_arr = [1,2,3];
	map_arr.map(function(item){
		console.log(item);
	})
}
catch(err){
	console.log('4.map数组方法： array.map() 报错'+JSON.stringify(err));
}


// 5.find数组方法： array.find()
try{
	var find_arr = [1,2,3];
	find_arr.find(function(item){
		console.log(item);
	})
}
catch(err){
	console.log('5.find数组方法： array.find() 报错'+JSON.stringify(err));
}

