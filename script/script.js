let isExit = false
$(document).keydown(function (event) {
    if (event.keyCode == 27) {
        isExit = true
    }
});

function init() {
    if (!window.localStorage) {
        console.log('浏览器版本太低，不支持缓存技术，所以无法指定演出时间进行购票，将默认选择第一个演出时间进行购票')
        grab()
    } else {
        cacheGrab()
    }
}

function getItem(name) {
    let storage = window.localStorage
    try {
        // 从localstorage中取出数据转换成对象格式
        let json = storage.getItem(name)
        let jsonObj = JSON.parse(json)
        return jsonObj || -1
    }
    catch (err) {
        return -1
    }
}

function setItem(name, data) {
    let storage = window.localStorage
    // 将对象转换成JSON格式存入localStorage
    let dataValue = JSON.stringify(data)
    storage.setItem(name, dataValue)
}

function removeItem(name) {
    let storage = window.localStorage
    storage.removeItem(name)
}


// 默认演出时间刷票
function grab() {
    if(isExit) return false
    // 此处为相应页面的抢票按钮，请自行获取dom元素
    let button = $('.buy-btn');

    if (button && button.length > 0 && !button.eq(0).prop("disabled")) {
        // 可抢票，点击抢票
        button.eq(0).click();
    } else {
        console.log('a')
        // 不可抢票，刷新页面
        setTimeout(function () {
            window.location.reload();
        }, 100);
    }
}

// 指定演出时间刷票
function cacheGrab() {
    let newButton = null
    let showTimeIndex = getItem('showTimeIndex')
    let showTimeList = $('.choiceTime').eq(0).find('span')
    if (showTimeIndex && showTimeIndex > 0 && showTimeList.length >= showTimeIndex) {
        showTimeList.eq(showTimeIndex - 1).click()
        grab()
    } else {
        removeItem('showTimeIndex')
        let style = buttonStyle()
        newButton = $('<button class="buy-btn2 cur-hand" style="' + style + '">开始刷票,可按ESC退出键，终止刷票</button>')
        $('.submitState').append(newButton)
        newButton.bind('click', function () {
            showTimeIndex = $('.choiceTime').eq(0).find('.active').index()
            setItem('showTimeIndex', showTimeIndex + 1)
            grab()
        })
    }
}

function buttonStyle() {
    let style = `
        background: red;
        border: 1px solid #ffcb00;
        font-size: 14px;
        color: #fff;
        width: 240px;
        height: 38px;
        outline: none;
    `
    return style
}

$(function () {
    setTimeout(function () {
        init()
    }, 200)
})