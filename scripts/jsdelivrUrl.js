
hexo.locals.invalidate();

let { config, env } = hexo;
let { jsdelivrUrl } = config;

console.log(config)
if (env.args[0] != 'server' && jsdelivrUrl.enable) {
    hexo.extend.filter.register('after_post_render', function (data) {
        //data.content = ''
        /* console.log(data) */
        if (!!data.photos && data.photos.length > 0) {
            data.photos = data.photos.map(item => jsdelivrUrl.img + item)
        }
    }, 10)
}
