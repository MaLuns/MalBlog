/**
 * 生成评论dom列表
 * @param {*} data 
 * {
 *  _id,
 *  avatar,
 *  nick,
 *  email,
 *  link,
 *  content,
 *  time,
 *  id,文章ID
 *  childer:[]
 * }
 */
export const createList = (data) => {
    const fragment = document.createDocumentFragment();

    data.forEach(item => {
        let dom = create('div', { class: "c-item", id: item._id })

        let img = create('img', { class: 'user-img', src: item.avatar });
        let vh = create('div', { class: "vh" })

        let head = create('div', { class: "c-head" })
        head.innerHTML = `${!!item.link ?
            `<a class="c-nick" rel="nofollow" href="${item.link}" target="_blank">${item.nick}</a>` :
            `<span class="c-nick">${item.nick}</span>`}
                <span class="c-sys">${item.browser}</span>
                <span class="c-sys">${item.os}</span>`

        let meta = create('div', { class: "c-meta" })
        meta.innerHTML = `
                    <span class="c-time">${timeAgo(new Date(item.date))}</span>
                    <span class="c-at" data-id='${item._id}'>回复</span>`

        let content = create('div', { class: "c-content", id: item._id })
        content.innerHTML = item.content;

        let quote = create('div', { class: "c-quote", id: item._id })
        if (!!item.childer)
            quote.appendChild(createList(item.childer))

        appendChild(vh, head, meta, content, quote)

        appendChild(dom, img, vh);

        fragment.appendChild(dom)
    })

    return fragment;
}

/**
 * 创建dom
 * @param {*} name 
 * @param {*} attrs 
 */
export const create = (name, attrs) => {
    let el = document.createElement(name)
    addAttr(el, attrs)
    return el
}

/**
 * 添加属性
 * @param {*} el 
 * @param {*} attrs 
 */
export const addAttr = (el, attrs) => {
    for (const key in attrs) {
        if (attrs.hasOwnProperty(key)) {
            el.setAttribute(key, attrs[key])
        }
    }
}

/**
 * 
 * @param {*} el 
 * @param {*} childers 
 */
const appendChild = (el, ...childers) => {
    childers.forEach(element => {
        el.appendChild(element)
    });
}

/**
 * 
 * @param {*} date 
 */
export const timeAgo = (date) => {
    if (date) {
        try {
            var oldTime = date.getTime();
            var currTime = new Date().getTime();
            var diffValue = currTime - oldTime;

            var days = Math.floor(diffValue / (24 * 3600 * 1000));
            if (days === 0) {
                //计算相差小时数
                var leave1 = diffValue % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));
                if (hours === 0) {
                    //计算相差分钟数
                    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
                    var minutes = Math.floor(leave2 / (60 * 1000));
                    if (minutes === 0) {
                        //计算相差秒数
                        var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
                        var seconds = Math.round(leave3 / 1000);
                        return seconds + `秒前`;
                    }
                    return minutes + `分钟前`;
                }
                return hours + `小时前`;
            }
            if (days < 0) return '刚刚';

            if (days < 8) {
                return days + `天前`;
            } else {
                return dateFormat(date)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const dateFormat = (date) => {
    var vDay = padWithZeros(date.getDate(), 2);
    var vMonth = padWithZeros(date.getMonth() + 1, 2);
    var vYear = padWithZeros(date.getFullYear(), 2);
    // var vHour = padWithZeros(date.getHours(), 2);
    // var vMinute = padWithZeros(date.getMinutes(), 2);
    // var vSecond = padWithZeros(date.getSeconds(), 2);
    return `${vYear}-${vMonth}-${vDay}`;
}

export const padWithZeros = (vNumber, width) => {
    var numAsString = vNumber.toString();
    while (numAsString.length < width) {
        numAsString = '0' + numAsString;
    }
    return numAsString;
}

/**
 * 获取浏览器标识信息
 */
export const detect = (u = navigator.userAgent) => {
    let info = {
        device: 'PC',
        osVersion: '',
        version: ''
    }
    var match = {
        //内核
        'Trident': u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
        'Presto': u.indexOf('Presto') > -1,
        'WebKit': u.indexOf('AppleWebKit') > -1,
        'Gecko': u.indexOf('Gecko/') > -1,
        //浏览器
        'Safari': u.indexOf('Safari') > -1,
        'Chrome': u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
        'IE': u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
        'Edge': u.indexOf('Edge') > -1,
        'Firefox': u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
        'Firefox Focus': u.indexOf('Focus') > -1,
        'Chromium': u.indexOf('Chromium') > -1,
        'Opera': u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
        'Vivaldi': u.indexOf('Vivaldi') > -1,
        'Yandex': u.indexOf('YaBrowser') > -1,
        'Kindle': u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
        '360': u.indexOf('360EE') > -1 || u.indexOf('360SE') > -1,
        'UC': u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
        'QQBrowser': u.indexOf('QQBrowser') > -1,
        'QQ': u.indexOf('QQ/') > -1,
        'Baidu': u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
        'Maxthon': u.indexOf('Maxthon') > -1,
        'Sogou': u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
        'LBBROWSER': u.indexOf('LBBROWSER') > -1,
        '2345Explorer': u.indexOf('2345Explorer') > -1,
        'TheWorld': u.indexOf('TheWorld') > -1,
        'XiaoMi': u.indexOf('MiuiBrowser') > -1,
        'Quark': u.indexOf('Quark') > -1,
        'Qiyu': u.indexOf('Qiyu') > -1,
        'Wechat': u.indexOf('MicroMessenger') > -1,
        'Taobao': u.indexOf('AliApp(TB') > -1,
        'Alipay': u.indexOf('AliApp(AP') > -1,
        'Weibo': u.indexOf('Weibo') > -1,
        'Douban': u.indexOf('com.douban.frodo') > -1,
        'Suning': u.indexOf('SNEBUY-APP') > -1,
        'iQiYi': u.indexOf('IqiyiApp') > -1,
        //系统或平台
        'Windows': u.indexOf('Windows') > -1,
        'Linux': u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
        'Mac OS': u.indexOf('Macintosh') > -1,
        'Android': u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
        'Ubuntu': u.indexOf('Ubuntu') > -1,
        'FreeBSD': u.indexOf('FreeBSD') > -1,
        'Debian': u.indexOf('Debian') > -1,
        'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
        'BlackBerry': u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
        'MeeGo': u.indexOf('MeeGo') > -1,
        'Symbian': u.indexOf('Symbian') > -1,
        'iOS': u.indexOf('like Mac OS X') > -1,
        'Chrome OS': u.indexOf('CrOS') > -1,
        'WebOS': u.indexOf('hpwOS') > -1,
        //设备
        'Mobile': u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
        'Tablet': u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1
    };

    //基本信息
    var hash = {
        engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
        browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Kindle', '360', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
        os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
        device: ['Mobile', 'Tablet']
    };

    for (var s in hash) {
        for (var i = 0; i < hash[s].length; i++) {
            var value = hash[s][i];
            if (match[value]) {
                info[s] = value;
            }
        }
    }

    //系统版本信息
    var osVersion = {
        'Windows': function () {
            var v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
            var hash = {
                '6.4': '10',
                '6.3': '8.1',
                '6.2': '8',
                '6.1': '7',
                '6.0': 'Vista',
                '5.2': 'XP',
                '5.1': 'XP',
                '5.0': '2000'
            };
            return hash[v] || v;
        },
        'Android': function () {
            return u.replace(/^.*Android ([\d.]+);.*$/, '$1');
        },
        'iOS': function () {
            return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
        },
        'Debian': function () {
            return u.replace(/^.*Debian\/([\d.]+).*$/, '$1');
        },
        'Windows Phone': function () {
            return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
        },
        'Mac OS': function () {
            return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
        },
        'WebOS': function () {
            return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
        }
    }

    if (osVersion[info.os]) {
        info.osVersion = osVersion[info.os]();
        if (info.osVersion == u) {
            info.osVersion = '';
        }
    }

    //浏览器版本信息
    var version = {
        'Safari': function () {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
        },
        'Chrome': function () {
            return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
        },
        'IE': function () {
            return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
        },
        'Edge': function () {
            return u.replace(/^.*Edge\/([\d.]+).*$/, '$1');
        },
        'Firefox': function () {
            return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
        },
        'Firefox Focus': function () {
            return u.replace(/^.*Focus\/([\d.]+).*$/, '$1');
        },
        'Chromium': function () {
            return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
        },
        'Opera': function () {
            return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
        },
        'Vivaldi': function () {
            return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
        },
        'Yandex': function () {
            return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
        },
        'Kindle': function () {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
        },
        'Maxthon': function () {
            return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
        },
        'QQBrowser': function () {
            return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
        },
        'QQ': function () {
            return u.replace(/^.*QQ\/([\d.]+).*$/, '$1');
        },
        'Baidu': function () {
            return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1');
        },
        'UC': function () {
            return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
        },
        'Sogou': function () {
            return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
        },
        '2345Explorer': function () {
            return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1');
        },
        'TheWorld': function () {
            return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
        },
        'XiaoMi': function () {
            return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
        },
        'Quark': function () {
            return u.replace(/^.*Quark\/([\d.]+).*$/, '$1');
        },
        'Qiyu': function () {
            return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
        },
        'Wechat': function () {
            return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
        },
        'Taobao': function () {
            return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
        },
        'Alipay': function () {
            return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
        },
        'Weibo': function () {
            return u.replace(/^.*weibo__([\d.]+).*$/, '$1');
        },
        'Douban': function () {
            return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
        },
        'Suning': function () {
            return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
        },
        'iQiYi': function () {
            return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
        }
    };

    if (version[info.browser]) {
        info.version = version[info.browser]();
        if (info.version == u) {
            info.version = '';
        }
    }

    //修正
    if (info.browser == 'Edge') {
        info.engine = 'EdgeHTML';
    } else if (info.browser == 'Chrome' && parseInt(info.version) > 27) {
        info.engine = 'Blink';
    } else if (info.browser == 'Opera' && parseInt(info.version) > 12) {
        info.engine = 'Blink';
    } else if (info.browser == 'Yandex') {
        info.engine = 'Blink';
    } else if (info.browser == undefined) {
        info.browser = 'Unknow App'
    }

    return info;
}

const unescapeMap = {};
const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#x60;',
    "\\": '&#x5c;'
};
for (let key in escapeMap) {
    unescapeMap[escapeMap[key]] = key;
}

const reUnescapedHtml = /[&<>"'`\\]/g
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source)
const reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#x60|#x5c);/g
const reHasEscapedHtml = RegExp(reEscapedHtml.source)


export const escape = (s) => {
    return (s && reHasUnescapedHtml.test(s)) ?
        s.replace(reUnescapedHtml, (chr) => escapeMap[chr]) :
        s
}

export const unescape = (s) => {
    return (s && reHasEscapedHtml.test(s)) ?
        s.replace(reEscapedHtml, (entity) => unescapeMap[entity]) :
        s
}