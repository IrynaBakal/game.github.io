
PIXI.utils.sayHello();

var container = document.getElementById("container");

var app = new PIXI.Application(280, 280, {backgroundColor : 0x5C5CFF});
container.appendChild(app.view);


// Listen for animate update
/*app.ticker.add(function(delta) {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent tranformation
    bunny.rotation += 0.01 * delta;
});*/
var n = 7;
/*значения индексов, которые при проверке горизонтальных соседних плиток, могут спричинить ошибку*/
var arr1=[];
var el = -n;
for(let i=0;i<n;i++){
 el += n;
 arr1.push(el);
}

var arr2=[];
arr1.forEach(function(item, i, arr) {
  arr2[i]=arr[i]+(n-1);
});

var arr3=[];
arr1.forEach(function(item, i, arr) {
  arr3[i]=arr[i]+1;
});

var arr4=[];
arr2.forEach(function(item, i, arr) {
  arr4[i]=arr[i]-1;
});

var cont1 = {
    arr1,
    arr2,
    arr3,
    arr4
}
//console.log(cont1);

/*значения индексов, которые при проверке вертикальных соседних плиток, могут спричинить ошибку*/
var arr_1=[];
for(let i=0;i<n;i++){
 arr_1.push(i);
}

var arr_2=[];
arr_1.forEach(function(item, i, arr) {
  arr_2[i]=arr[i]+(n-1)*n;
});

var arr_3=[];
arr_1.forEach(function(item, i, arr) {
  arr_3[i]=arr[i]+n;
});

var arr_4=[];
arr_2.forEach(function(item, i, arr) {
  arr_4[i]=arr[i]-n;
});

var cont2 = {
    arr1: arr_1,
    arr2: arr_2,
    arr3: arr_3,
    arr4: arr_4
}
//console.log(cont2);

//Draw your Graphics
var a = 40, x = -40, y = -40, color;


for(let i=1;i<=n;i++){
	y+=40;
	for(let j=1;j<=n;j++){
		x+=40;
		var graphics = new PIXI.Graphics();

		graphics.lineStyle(1, 0x0000FF, 1);
		var rand = Math.floor(Math.random()*2);
		if(rand){
			color = 0xFADB12;
		}else{
			color = 0x18BC96;
		}
		graphics.beginFill(color, 1);
        graphics.dirty = true;        
        graphics.clearDirty = true;
		graphics.drawRect(0, 0, a, a);
		graphics.x = x;
		graphics.y = y;
		graphics.interactive = true;
		graphics.buttonMode = true;
        graphics.zOrder = 1;
        console.log(graphics);
		graphics.on("click",onClick);

		app.stage.addChild(graphics);
		function onClick () {
			var x = this.x;
			var y = this.y;
            var index = x/40 + y/40*n;
            console.log("tile's index " + index);
		    /*если три проверки по горизонтали не пройшли, тогда запускаем три проверки по вертикали*/
            if(!check(this,index,1,cont1,"hor")){
                check(this,index,n,cont2,"vert");
            }
		}

		function check(obj,indx,k,cont,direct){
            var result = false;
            var a,b; /*indexes of neighbor's tiles*/
            function check1(){
                for(let k = 0; k<n;k++){
                    var f = true;
                   if(indx==cont.arr1[k] || indx==cont.arr2[k]){
                        f = false;
                       console.log('bad indx 1 '+indx);
                       break;
                   } 
                }
                if(f && app.stage.getChildAt(indx+k).fillColor==app.stage.getChildAt(indx-k).fillColor && app.stage.getChildAt(indx+k).fillColor==obj.fillColor){
                    result = true;
                    a=indx+k;
                    b=indx-k;
                    console.log('good result 1 '+result);
                }else{
                    console.log('start check2 ');
                    check2();
                }
            }
            function check2(){
                for(let k = 0; k<n;k++){
                    var f = true;
                   if(indx==cont.arr1[k] || indx==cont.arr3[k]){
                        f = false;
                       console.log('bad indx 2 '+indx);
                       break;
                   } 
                    console.log('good indx 2 '+indx);
                }
                if(f && app.stage.getChildAt(indx-k).fillColor==app.stage.getChildAt(indx-2*k).fillColor && app.stage.getChildAt(indx-k).fillColor==obj.fillColor){
                    result = true;
                    a=indx-k;
                    b=indx-2*k;
                    console.log('good result 2'+result);
                }else{
                    console.log('start check3 ');
                    check3();
                }
            }
            function check3(){
                for(let k = 0; k<n;k++){
                    var f = true;
                   if(indx==cont.arr2[k] || indx==cont.arr4[k]){
                        f = false;
                       console.log('bad indx 3 '+indx);
                       break;
                   } 
                }
                if(f && app.stage.getChildAt(indx+k).fillColor==app.stage.getChildAt(indx+2*k).fillColor && app.stage.getChildAt(indx+k).fillColor==obj.fillColor){
                    result = true;
                    a=indx+k;
                    b=indx+2*k;
                    console.log('good result 3 '+result);
                }
            }
            
            check1();
            
		    console.log('result '+result);
            
            if(result){
                var empty = [indx,a,b];
                console.log(empty);
                var st = 0;
                empty.forEach(function(item, i, arr) {
                   /* var tid = setInterval(function() {
                        if ( st<=8 ) {
                            st++;
                            app.stage.getChildAt(empty[i]).alpha -= 0.1;
                        } else {
                            clearInterval( tid );
                        }
                    }, 150);*/
                    app.stage.getChildAt(empty[i]).alpha = 0;
                });
                move();
            }
            
            function move(){
                console.log(direct+' direct');
                let coords = [];
                if(direct=="hor"){
                   
                }else{
                    var min = empty[0];
                   for(let i=1;i<empty.length;i++){
                        if(empty[i]<min){
                            min = empty[i];
                        }
                    }
                    console.log('min '+min);
                    for(let start = min-7; start>=0;start-=7){
                        coords.push(start);
                    }
                //    if(coords.length>0){
                        console.log('length>0');
                        for(let h=0;h<coords.length;h++){
                           // console.log(app.stage.getChildAt(coords[h]).position._y);
                           // app.stage.getChildAt(coords[h]).position._y = 240;
                            console.log(coords[h]);
                            
                            
                        } 
                        let array = [...empty,...coords];
                        illusion(array);
                  //  }
                    console.log(coords);
                }
            }
            function illusion(array,z){
                console.log(array);
                console.log('AMOUNT '+array.length);
                var counter = 0, illusions = [];
                var x_illusion = ((array[0]+n) % n);/*номер столбца*/
                console.log('x_illusion '+x_illusion);
                
                for(let j=1;j<=array.length;j++){
                    illusions.push(48+j);
                    console.log(illusions);
                }
                var colors = [];
                for(let k=1;k<=array.length;k++){
                    let graphicsNew = new PIXI.Graphics();
                    graphicsNew.lineStyle(1, 0x0000FF, 1);
                    let rand = Math.floor(Math.random()*2);
                    if(rand){
                        color = 0xFADB12;
                        
                    }else{
                        color = 0x18BC96;
                        
                    }
                    colors.push(color);
                   // console.log(colors);
                    graphicsNew.x = x_illusion*40;
                    graphicsNew.y = -40*k;
                    graphicsNew.beginFill(0xE516F0, 1);
                    graphicsNew.drawRect(0, 0, 40, 40);
                    graphicsNew.zOrder = 5;
                    app.stage.addChild(graphicsNew); 
                }
                
                
                function setDeceleratingTimeout(callback, factor, times) {
		            var k = 0;
                    var internalCallback = function(t, counter) {
                        return function() {
                            if (t-- > 0) {
                                    factor +=10;
                                    k ++;
                             //   console.log('ABC '+k);
                              //  console.log('factor '+factor);
                                window.setTimeout(internalCallback, ++counter * factor);
                                callback();
                            }
                        }
                    }(times, 0);
                        window.setTimeout(internalCallback, factor);
                    }
           
                    setDeceleratingTimeout(function() {
                        console.log('ABC '+k);
                        illusions.forEach(function(item, i, arr) {
                       //     console.log(array.length*40-40*(i+1));
                            app.stage.getChildAt(arr[i]).y += 40;
                        });
                    }, 0, array.length);
                
                
                for(let h=array.length-1;h>=0;h--){
                    console.log(colors[h]);
                   // app.stage.getChildAt(array[h]).tint = colors[h];
                    app.stage.getChildAt(array[h]).fillColor = colors[h];
                    console.log(app.stage.getChildAt(array[h]));
                   // app.stage.getChildAt(array[h]).tint = 16777215;
                    app.stage.getChildAt(array[h]).alpha = 1;/*!!!!!!!!!!!!!!!!!!!!!!!!*/
                    app.stage.getChildAt(array[h]).zOrder = 10;
                    console.log("HHHHHHHH "+array[h]);
                    console.log(app.stage.getChildAt(array[h]));
                }
                var time = 1200;
                setTimeout(function(){
                    /*back alpha to 1 for clicked tile and neighbours*/
                 /*   for(let h=0;h<array.length;h++){
                       // app.stage.getChildAt(array[h]).alpha += 0.2;
                    }*/
                    /* move fakes */
                    for (let i = app.stage.children.length - 1; i > 48; i--) {	
                        app.stage.removeChild(app.stage.children[i]);
                     }
                
                    /*for(let c=0;c<illusions.length;c++){
                        app.stage.removeChild(app.stage.children(illusions[c])); 
                        console.log(app.stage.getChildAt(illusions[c]));
                         //  app.stage.removeChild(this);
                    }*/
                    
                },time);
               /* setTimeout(function(){
                    for(let i=0;i<48;i++){
                        console.log('IIIIIIIIIIIIIIII '+i);
                        console.log(app.stage.getChildAt(i));
                    }
                },1000)*/
                
                
              /*  for(let i=1;i<=array.length;i++){
                    
                    /*
                    setTimeout({
                        graphicsNew.y = amount*40 - y;
                        console.log(graphicsNew.y);
                    },100);
                    
                    setInterval(function(){
                      graphicsNew.y = amount*40-y;
                     },100);        
                */
                    
                  //  var f = setInterval(function(){
                        /*app.stage.getChildAt(48+i).y = amount*40-40*i;
                        console.log('Y AFTER '+app.stage.getChildAt(48+i).y);*/
                    //    z++;
                    //    console.log('ZERO '+z);
                    //    console.log(app.stage.getChildAt(48+i).y);
                  //  },50);
                    
                    //setTimeout(clearInterval(f),500);
                    
                    /*setTimeout(function(){
                        app.stage.getChildAt(48+i).y = amount*40-40*i;
                        console.log('Y AFTER '+app.stage.getChildAt(48+i).y);
                        console.log(i);
                    },500);*/
               /* }*/
                
                
                /*setTimeout(function(){
                    app.stage.getChildAt(48+i).alpha = 0.5;   
                },1000)*/
            }
            
            
		   //app.stage.removeChild(child);
		   //console.log(child);
		  // console.log('child.fillColor '+child.fillColor);
		  // app.stage.removeChild(child);
		    /*(function update() {
			   child.fillColor = "";
			    console.log(child);
			})();*/
			console.log(obj.fillColor);
            return result;
		}
	}
	x=-40;
    
}




