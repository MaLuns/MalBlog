window.onload = function () {

    let lastScrollTop = 0;
    let isShow = true;
    let navDom = document.getElementById("header-nav");
    let backTopDom = document.getElementById("back-to-top");
    window.addEventListener("scroll", scrollEvent);
    let a = backTopDom.querySelector("div");
    a.addEventListener("click", function (e) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        window.event ? e.cancelBubble = true : e.stopPropagation();
    });

    function scrollEvent() {
        console.log(1)
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop - lastScrollTop > 0 && isShow) {
            if (scrollTop > 200) {
                navDom.style.transform = 'translateY(-50px)';
                isShow = false;
            }
        }
        if (scrollTop - lastScrollTop < 0 && !isShow) {
            navDom.style.transform = 'translateY(0)';
            isShow = true;
        }
        if (scrollTop > 700) {
            backTopDom.style.top = `${(window.innerHeight - 1000) > 0 ? 0 : (window.innerHeight - 1000)}px`;
        } else {
            backTopDom.style.top = `-1000px`;
        }
        lastScrollTop = scrollTop;
    }

    /* (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 700 && (backTopDom.style.top = `${ window.innerHeight - 1000 } px`) */
}

