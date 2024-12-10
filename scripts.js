const CLIENT_ID = 'YOUR_UNSPLASH_CLIENT_ID';
const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1635796317915-cc556e08f896?q=80&w=3828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

function showOrHide() {
    const favlist = $("#favlist");
    if (favlist.data('animating')) return; // 如果正在动画，直接返回
    favlist.data('animating', true); // 设置动画标志

    $("#favlist .group-container").each(function (index, element) {
        const header = $(element).find("h4");
        const boxes = $(element).find(".box");

        if (header.css("visibility") == "visible") {
            // 隐藏 header 和 boxes
            header.css("opacity", "0").removeClass("show").addClass("hide");
            boxes.each(function (index, box) {
                $(box).css("opacity", "0").removeClass("show").addClass("hide");
                setTimeout(function () {
                    $(box).css("display", "none");
                }, 300);
            });
        } else {
            // 显示 header 和 boxes
            header.css("display", "block");
            boxes.css("display", "inline-block");
            setTimeout(function () {
                header.css("opacity", "1").removeClass("hide").addClass("show");
                boxes.css("opacity", "1").removeClass("hide").addClass("show");
            }, 0); // 确保在 display 设置后立即开始动画
        }
    });

    setTimeout(function () {
        favlist.data('animating', false); // 动画结束，解除标志
    }, 300);
}

function search() {
    const searchInput = document.getElementById("search_input");
    const query = searchInput.value.trim();
    if (query !== "") {
        window.location.href = `https://www.baidu.com/s?ie=utf-8&from=1011440l&wd=${query}`;
        searchInput.value = "";
    }
    return false;
}

document.addEventListener('DOMContentLoaded', function () {
    const CACHE_KEY = 'unsplash-background';
    const CACHE_EXPIRATION_KEY = 'unsplash-background-expiration';
    const CACHE_DURATION = 3 * 60 * 60 * 1000;  // 3 hours in milliseconds

    // 检查缓存是否有效
    function isCacheValid() {
        const expirationTime = localStorage.getItem(CACHE_EXPIRATION_KEY);
        return expirationTime && new Date().getTime() < expirationTime;
    }

    // 设置背景图片
    function setBackground(url) {
        document.body.style.setProperty('--background-image', `url('${url}')`);
    }

    // 获取并缓存背景图片
    function fetchAndCacheBackground() {
        fetch(`https://api.unsplash.com/photos/random?client_id=${CLIENT_ID}&query=wallpapers`)
            .then(response => response.json())
            .then(data => {
                const imageUrl = data.urls.raw;
                localStorage.setItem(CACHE_KEY, imageUrl);
                localStorage.setItem(CACHE_EXPIRATION_KEY, new Date().getTime() + CACHE_DURATION);
                setBackground(imageUrl);
            })
            .catch(error => {
                console.error('Error fetching image from Unsplash:', error);
                setBackground(FALLBACK_IMAGE_URL);
            });
    }

    // 根据缓存状态设置背景图片
    if (isCacheValid()) {
        const cachedImageUrl = localStorage.getItem(CACHE_KEY);
        setBackground(cachedImageUrl);
    } else {
        fetchAndCacheBackground();
    }
});