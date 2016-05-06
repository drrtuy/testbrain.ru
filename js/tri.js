var tri = $('#tri').val();
var targTri = $('#targ').val();
var speed = 50;
var debug = 0;
var canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var w = canvas.clientWidth;// - 200;
var h = canvas.clientHeight;// - 200;
var ctx = canvas.getContext('2d');
var interval;

$('#regen').click(function() {
    triList = drawTris(tri, targTri);
});

$('#start').click(function (){    
    interval = setInterval(moveAllTris, $('#speed').val(), triList);
    $('#start').prop( "disabled", true );
    $('#stop').prop( "disabled", false );
});

$('#stop').click(function (){
    clearInterval(interval);
    $('#start').prop( "disabled", false );
    $('#stop').prop( "disabled", true);
    revealTris(triList);
});

$('#stop').prop( "disabled", true);

$('#input').change(function(){
    this.attr('value', this.val())
    interval = this.val();
});

$('#tri').change(function(){
    $('#tri').attr('value', $('#tri').val())
    tri = $('#tri').val();
});

$('#targ').change(function(){
    $('#targ').attr('value', $('#targ').val())
    targTri = $('#targ').val();
});

//triangle repr object
/*
{'name': String,
 'coord': { x: int, y: int},
 'target': { x: int, y: int},
 'rad': int
}

*/
function randColor(){
    return '#' + Math.floor(Math.random()*16777215).toString(16);
};

function randInt(min, max){
  return Math.floor(Math.random() * (max)) + min;
};

function getRandUniq(){
    var d = new Date();
    return d.getMilliseconds().toString() + d.getHours().toString()
};

function randTriangle(){
    var name = 'tri' + getRandUniq();
    var rad = randInt(50, 150);
    var x = randInt(rad, w-rad);
    var y = randInt(rad, h-rad);
    var color = randColor();
    ctx.fillStyle = color;
    ctx.fillRect(x,y,rad,rad);
    //console.log(x.toString()+ " " + y.toString());
    //console.log ("width:("+ window.innerWidth.toString()+") randWidth ("+rad.toString() + ") height  ("+window.innerHeight.toString()+") randHeight (" + rad.toString()+")");
    return {'name': name, 'coord': {'x': x, 'y': y}, 'target': {'x': '', 'y': ''}, 'rad': rad, 'c': color};
}

function randTargTriangle(){
    var name = 'targtri' + getRandUniq();
    var rad = randInt(30, 50);
    var x = randInt(rad, w-rad);
    var y = randInt(rad, h-rad);
    var color = randColor();
    ctx.strokeStyle = color;
    ctx.strokeRect(x,y,rad,rad);
    //console.log(x.toString()+ " " + y.toString());
    //console.log ("width:("+ window.innerWidth.toString()+") randWidth ("+rad.toString() + ") height  ("+window.innerHeight.toString()+") randHeight (" + rad.toString()+")");
    return {'name': name, 'coord': {'x': x, 'y': y}, 'target': {'x': '', 'y': ''}, 'rad': rad, 'c': color};

};

function noTarget(tri){
    if (tri.target.x === '' || tri.target.y === '')
        return true;
    //return true if current position is near the target
    var maxDiff = tri.rad/4.0;
    var diffX = Math.abs(tri.target.x - tri.coord.x);
    var diffY = Math.abs(tri.target.y - tri.coord.y);
    if (debug >= 3) {
        console.log(diffX.toString()+" "+diffY.toString()+ "" +maxDiff.toString());
    };
    return diffX <= maxDiff &&  diffY <= maxDiff;
};

function getTarget(tri){
    return {'x': randInt(tri.rad, w-tri.rad), 'y': randInt(tri.rad, h-tri.rad)};
};

function getDist(a, b){
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};
function getSin(a, c){
    return Math.abs(a) / c;
};

function getCos(b, c){
    return Math.abs(b) / c;
};

function getDiff(tri){
    var diff = {};
      
    //console.log("before x:{" + tri.coord.x.toString()+ "} y: {" + tri.coord.y.toString() + "}");
    var dist = getDist(tri.coord, tri.target);
    var speed = tri.rad/2;
    var speedX = speed * getSin(tri.coord.x - tri.target.x, dist);
    var speedY = speed * getCos(tri.coord.y - tri.target.y, dist);
    if (tri.target.x < tri.coord.x) {
        diff.x = tri.coord.x - speedX;
    } else {
        diff.x = tri.coord.x + speedX;
    };
    if (tri.target.y < tri.coord.y) {
        diff.y = tri.coord.y - speedY;
    } else {
        diff.y = tri.coord.y + speedY;
    };
    //console.log("after x:{" + diff.x.toString()+ "} y: {" + diff.y.toString() + "}");
    return diff;
};

function moveTri(tri){    
    if (noTarget(tri))  {
        tri.target = getTarget(tri);
    };
    diff = getDiff(tri);
    tri.coord.x = Math.floor(diff.x);
    tri.coord.y = Math.floor(diff.y);
    if (debug >= 2) {
        console.log('x {'+ tri.coord.x.toString() +"} y {" + tri.coord.y.toString() + "}");
    };
    ctx.fillStyle = tri.c;
    ctx.fillRect(tri.coord.x,tri.coord.y,tri.rad,tri.rad);
    if (debug >= 1) {
        console.log('moving '+ tri.name+' color '+tri.c.toString());
    };
};

function revealTri(tri){
    var x = tri.coord.x;
    var y = tri.coord.y;    
    var c = tri.c;
    var rad = tri.rad;
    if(tri.name.includes('targtri')){
        ctx.strokeStyle = c;
        ctx.strokeRect(x,y,rad,rad);
    } else {
	ctx.fillStyle = c;
	ctx.fillRect(x,y,rad,rad);
    };
    if (debug >= 1) {
        console.log('moving '+ tri.name+' color '+tri.c.toString());
    };
};

function moveAllTris(triList){
    ctx.clearRect(0,0, w, h);
    var t, tri;
    triList.forEach(function (tri, index, array) {
            //console.log(tri.name + ' ' + tri.target.x.toString());        
            moveTri(tri);        
    });
    //console.log('moved all tris');
    return;
};

function moveAllTris(triList){
    ctx.clearRect(0,0, w, h);
    var t, tri;
    triList.forEach(function (tri, index, array) {
            //console.log(tri.name + ' ' + tri.target.x.toString());        
            moveTri(tri);        
    });
    //console.log('moved all tris');
};

function revealTris(triList){
    ctx.clearRect(0,0, w, h);
    var t, tri;
    triList.forEach(function (tri, index, array) {
            revealTri(tri);        
    });
    return;
};


function drawTris(triNumb, targTriNumb){
    ctx.clearRect(0,0, w, h);
    var i;
    var triList = [];

    for (i = 0; i < triNumb; i++){
        triList.push(randTriangle());
    };
    
    for (i = 0; i < targTriNumb; i++){
        triList.push(randTargTriangle());
    };

    return triList;
};



var triList = drawTris(tri, targTri);
