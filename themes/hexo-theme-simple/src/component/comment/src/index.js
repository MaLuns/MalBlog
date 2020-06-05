import css from './index.less'
import html from './index.html'
import Emoji from './emojis/index'
import { detect, createList, pathToData, escape, unescape } from './libs/util'
import marked from 'marked';
import DOMPurify from 'dompurify';
import tcp from './libs/tcb'

class ComComment extends HTMLElement {

    constructor() {
        super()
        this._commentList = [];
        this.sending = false;
        this.detect = detect();
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: true
        });

        this.render(this.attachShadow({ mode: 'open' }))
    }

    /**
     * 生成dom
     * @param {*} shadowRoot 
     */
    render(shadowRoot = this.shadowRoot) {
        shadowRoot.innerHTML = `<style>${css}</style>${html}`
        this._event_init(shadowRoot)
    }

    /**
     * 事件绑定
     * @param {*} shadowRoot 
     */
    _event_init(shadowRoot = this.shadowRoot) {
        this.nick_input = shadowRoot.getElementById('nick');
        this.email_input = shadowRoot.getElementById('email');
        this.link_input = shadowRoot.getElementById('link');

        let textarea_hidden = this.textarea_hidden = shadowRoot.getElementById("content_hidden");
        this.textarea = shadowRoot.getElementById("textarea");
        this.sendBtn = shadowRoot.getElementById("send-btn");

        //输入
        this.textarea.addEventListener('input', function () {
            textarea_hidden.innerHTML = DOMPurify.sanitize(marked(this.value));
            this.style.height = textarea_hidden.offsetHeight + 40 + 'px';
        })

        //发送
        this.sendBtn.addEventListener('click', () => {
            let comment = this.textarea.value;
            let email = this.email_input.value;
            let nick = this.nick_input.value || 'Anonymous';
            let link = this.link_input.value;
            localStorage.setItem('comment_user_info', JSON.stringify({ nick, email, link }))
            let { browser, version, os, osVersion } = this.detect;

            if (comment == '') { this.textarea.focus(); return; }
            if (nick.length < 2) { this.nick_input.focus(); return; }
            if (email.length < 6 || email.indexOf('@') < 1 || email.indexOf('.') < 3) { this.email_input.focus(); return; }

            let avatar = '';
            if (/^[1-9][0-9]{6,}@qq.com/.test(email)) {
                let qq = /^[1-9][0-9]{6,}/.exec(email)[0];
            }

            let parms = {
                url: location.pathname,
                ua: navigator.userAgent,
                browser: `${browser} ${version}`,
                os: `${os} ${osVersion}`,
                avatar,
                nick: DOMPurify.sanitize(nick),
                email: DOMPurify.sanitize(email),
                link: DOMPurify.sanitize(link),
                content: DOMPurify.sanitize(marked(comment)),
            }
            this._send(parms);
        });

        //回复
        shadowRoot.getElementById("list-content").addEventListener('click', (e) => {
            if (e.target.className == 'c-at') {
                e.target.parentElement.parentElement.querySelector('.list-edit').appendChild(shadowRoot.getElementById('c-comment'));
                let { topId, id, idpath } = e.target.dataset;

                let { email, link, nick, _id } = pathToData(this._commentList, idpath, 'childer');
                this.atComment = {
                    topID: topId || id,
                    atCommentID: _id,
                    email,
                    link,
                    nick
                }
            }
        })

        //取消
        shadowRoot.getElementById("close-btn").addEventListener('click', (e) => {
            shadowRoot.appendChild(shadowRoot.getElementById('c-comment'));
            this.atComment = null
        })
    }

    /**
     * 加载完成
     */
    connectedCallback() {
        if (localStorage.getItem('comment_user_info')) {
            let { nick, email, link } = JSON.parse(localStorage.getItem('comment_user_info'))
            this.nick_input.value = nick == 'Anonymous' ? '' : nick;
            this.email_input.value = email;
            this.link_input.value = link;
        }
        this._init_tcb();
    }

    /**
     * 初始化tcb
     */
    async _init_tcb() {
        let evn = this.getAttribute("evn");
        let hash = this.getAttribute("hash")
        this._dbs = new tcp(evn, hash)

        await this._dbs._init();
        this._morelist()
    }

    /**
     * 加载更改评论
     */
    async _morelist() {
        let data = await this._dbs.getComment();
        this._commentList = this._commentList.concat(data)
        this.shadowRoot.querySelector(".list-content").appendChild(createList(data));
    }

    /**
     * 发送信息
     * @param {*} parms 
     */
    async _send(parms) {
        if (!this.sending) {
            this.sending = true;

            parms.istop = !this.atComment;
            parms.date = new Date();
            if (!!this.atComment) {
                parms.topID = this.atComment.topID
                parms.at = {
                    ...this.atComment
                }
            }
            this._dbs.addComment(parms).then(res => {
                //生成dom
                if (!!this.atComment) {
                    this.shadowRoot.appendChild(this.shadowRoot.getElementById('c-comment'));
                }
                this.sending = false;
            }).catch(res => {
                this.sending = false;
            });
        }
    }

}

!customElements.get('com-comment') && customElements.define('com-comment', ComComment)
