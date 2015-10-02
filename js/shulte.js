var scene = $('#scene');
var audio = document.getElementById("audio");
var vkShareDescr = '';

function ArrayShuffle(a) {
    var d, c, b = a.length;
    while (b) {
        c = Math.floor(Math.random() * b);
        d = a[--b];
        a[b] = a[c];
        a[c] = d
    }
    return a
}

function makeMap (map) {
    var colors = 4;
    var numbs = 25;
    var i,it;
    for (i=0;i<colors;i++){
        for (it=1;it<=numbs;it++){
            map.push([it,i]);
        }
    }
    return map;
}

//var map = makeMap([]);

/*
var map = [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [9, 0],
    [10, 0],
    [11, 0],
    [12, 0],
    [13, 0],
    [14, 0],
    [15, 0],
    [16, 0],
    [17, 0],
    [18, 0],
    [19, 0],
    [20, 0],
    [21, 0],
    [22, 0],
    [23, 0],
    [24, 0],
    [25, 0],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [7, 1],
    [8, 1],
    [9, 1],
    [10, 1],
    [11, 1],
    [12, 1],
    [13, 1],
    [14, 1],
    [15, 1],
    [16, 1],
    [17, 1],
    [18, 1],
    [19, 1],
    [20, 1],
    [21, 1],
    [22, 1],
    [23, 1],
    [24, 1]
];
*/

var base = 60;
var clocktimer, dateObj, dh, dm, ds, ms;
var readout = '';
var h = 1;
var m = 1;
var tm = 1;
var s = 0;
var ts = 0;
var ms = 0;
var show = true;
var init = 0;
var ii = 0;

function clearALL() {
    clearTimeout(clocktimer);
    h = 1;
    m = 1;
    tm = 1;
    s = 0;
    ts = 0;
    ms = 0;
    init = 0;
    show = true;
    readout = '00:00.00';
    document.clockform.clock.value = readout;
    var CF = document.clockform;
    ii = 0
}
function addMEM() {
    if (init > 0) {
        var CF = document.clockform;
        CF[mPLUS[ii]].value = readout;
        if (ii == 9) {
            ii = 0
        } else {
            ii++
        }
    }
}
function startTIME() {
    var cdateObj = new Date();
    var t = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);
    if (t > 999) {
        s++
    }
    if (s >= (m * base)) {
        ts = 0;
        m++
    } else {
        ts = parseInt((ms / 100) + s);
        if (ts >= base) {
            ts = ts - ((m - 1) * base)
        }
    }
    if (m > (h * base)) {
        tm = 1;
        h++
    } else {
        tm = parseInt((ms / 100) + m);
        if (tm >= base) {
            tm = tm - ((h - 1) * base)
        }
    }
    ms = Math.round(t / 10);
    if (ms > 99) {
        ms = 0
    }
    if (ms == 0) {
        ms = '00'
    }
    if (ms > 0 && ms <= 9) {
        ms = '0' + ms
    }
    if (ts > 0) {
        ds = ts;
        if (ts < 10) {
            ds = '0' + ts
        }
    } else {
        ds = '00'
    }
    dm = tm - 1;
    if (dm > 0) {
        if (dm < 10) {
            dm = '0' + dm
        }
    } else {
        dm = '00'
    }
    dh = h - 1;
    if (dh > 0) {
        if (dh < 10) {
            dh = '0' + dh
        }
    } else {
        dh = '00'
    }
    readout = dm + ':' + ds + '.' + ms;
    if (show == true) {
        document.clockform.clock.value = readout
    }
    clocktimer = setTimeout("startTIME()", 1)
}
function findTIME() {
    if (init == 0) {
        dateObj = new Date();
        startTIME();
        init = 1
    } else {
        if (show == true) {
            show = false
        } else {
            show = true
        }
    }
}
function setNext(cell) {
    cell.attr("next", "ok")
}
function initScene() {
    scene.empty();
    enableSettings();
    map = makeMap([]);
    var cols = {'black': 0, 'red': 1, 'green': 2, 'blue': 3};
    var key, elem, num, col;
    for (key=0;key<map.length;key++) {
        elem = map[key];
        num = elem[0];
        col = elem[1];        
        if (col == cols.black) {
            scene.append('<div class="cell cell-black" val="' + num + '">' + num + '</div>')
        } else if (col == cols.red) {
            scene.append('<div class="cell cell-red" val="' + num + '">' + num + '</div>')
        } else if (col == cols.green) {
            scene.append('<div class="cell cell-green" val="' + num + '">' + num + '</div>')
        } else if (col == cols.blue) {
            scene.append('<div class="cell cell-blue" val="' + num + '">' + num + '</div>')
        } 
    }
    scene.append('<div class="clr"></div>')
}

function fillScene(next, rand) {
    scene.empty();
    if (rand) {
        map = ArrayShuffle(makeMap([]))
    }
    cellbg = $("#colorbg").is(":checked");
    var cols = {'black': 0, 'red': 1, 'green': 2, 'blue': 3};
    var key, elem, num, col;
    for (key in map) {
        elem = map[key];
        num = elem[0];
        col = elem[1];        
        if (!cellbg) {
            if (col == cols.black) {
                scene.append('<div class="cell cell-act cell-black" val="' + num + '">' + num + '</div>')
            } else if (col == cols.red) {
                scene.append('<div class="cell cell-act cell-red" val="' + num + '">' + num + '</div>')
            } else if (col == cols.green) {
                scene.append('<div class="cell cell-act cell-green" val="' + num + '">' + num + '</div>')
            } else if (col == cols.blue) {
                scene.append('<div class="cell cell-act cell-blue" val="' + num + '">' + num + '</div>')
            } 
        } else {
            if (val[1] == 0) {
                scene.append('<div class="cell cell-bg cell-act cell-black" val="' + val[0] + '">' + val[0] + '</div>')
            } else {
                scene.append('<div class="cell cell-bg cell-act cell-red"val="' + val[0] + '">' + val[0] + '</div>')
            }
        }
        next[1] == 0 ? $(".cell-black[val=\"" + next[0] + "\"]").attr("next", "ok") : $(".cell-red[val=\"" + next[0] + "\"]").attr("next", "ok")
    }
    scene.append('<div class="clr"></div>')
}


function endAlert(end) {
    findTIME();
    $("#alert").show();
    if (end) {
        $("#alert").addClass("text-green").text('Тест успешно пройден!');
        timeRes = vkShareDescr = 'Я прошел тест на скорость переключения внимания за время: ' + readout
    } else {
        $("#alert").addClass("text-red").text('К сожалению ошибки не допускаются. Попробуйте расслабиться, подумайте о чем нибудь приятном и попробуйте еще раз.');
        vkShareDescr = 'Я хочу пройти тест на скорость переключения <strong>внимания!</strong>'
    }
    $("#start-btn").text("Попробовать еще раз");
    $("#test-control").undelegate("#start-btn", 'click').delegate("#start-btn", 'click', function () {
        startTesting()
    });
    enableSettings();
    deactivateCells();
    audio.pause();
    audio.currentTime = 0;
    $('#vk-share').html(VK.Share.button({
        url: 'http://testbrain.ru/tests/viewtestGSh',
        title: 'testBrain - Проверь свой мозг',
        description: vkShareDescr,
        image: 'http://testbrain.ru/images/vk-share.png',
        noparse: true
    }, {
        type: 'link',
        text: 'Опубликовать результат'
    }))
}
function clrAlert() {
    $("#alert").hide()
}
function redelegateCells(cell) {
    var cellval = $(cell).attr("val");
    if (cellval == 25 && cell.attr("next") == "ok") {
        endAlert(1)
    } else {
        var val = 0;
        var next = [];
        if (cell.attr("next") == "ok") {
            cell.removeAttr("next");
            if (cell.hasClass("cell-black")) {
                val = 25 - cellval;
                next = [val, 1]
            } else {
                val = 25 - $(cell).attr("val") + 1;
                next = [val, 0]
            }
            fillScene(next, $("#randomscene").is(":checked"))
        } else {
            endAlert(0)
        }
    }
}
function activateCells() {
    $(".cell").addClass('cell-act');
    $("#start-btn").text("Прервать тестирование");
    $("#test-control").undelegate("#start-btn", 'click').delegate("#start-btn", 'click', function () {
        stopTesting()
    })
}
function deactivateCells() {
    $(".cell").removeClass('cell-act')
}
function disableSettings() {
    $("input.test-set").attr("disabled", true)
}
function enableSettings() {
    $("input.test-set").removeAttr("disabled")
}
function startTesting() {
    clearALL();
    clrAlert();
    fillScene([1, 0], 1);
    activateCells();
    disableSettings();
    scene.undelegate(".cell-act", "click").delegate(".cell-act", "click", function () {
        redelegateCells($(this))
    });
    findTIME();
    if (!$("#noaudio").is(":checked")) {
        audio.play()
    }
}
function stopTesting() {
    enableSettings();
    clearALL();
    deactivateCells();
    $("#start-btn").text("Начать тестирование");
    $("#test-control").undelegate("#start-btn", 'click').delegate("#start-btn", 'click', startTesting);
    audio.pause();
    audio.currentTime = 0
}
$(function () {
    initScene();
    clearALL();
    $("input.test-set").removeAttr("checked");
    $("#test-control").undelegate("#start-btn", 'click').delegate("#start-btn", 'click', startTesting);
    $(function () {
        $("#colorbg").change(function () {
            if ($(this).is(':checked')) $(".cell").addClass('cell-bg');
            else $(".cell").removeClass('cell-bg')
        })
    })
});
