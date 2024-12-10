document.addEventListener("DOMContentLoaded", function () {
    const GROUPS = {
        NOTES: { id: 3, name: "笔记" },
        NAS: { id: 1, name: "NAS" },
        TOOLS: { id: 2, name: "工具" }
    };

    /**
     * An array of favorite items, each containing a URL, icon path, name, and group.
     * 
     * @constant {Array<Object>} favItems
     * @property {string} favItems[].href - The URL of the favorite item.
     * @property {string} favItems[].icon - The path to the icon representing the favorite item.
     * @property {string} favItems[].name - The name of the favorite item.
     * @property {Object} favItems[].group - The group to which the favorite item belongs.
     */
    const favItems = [
        { href: "https://example.com", icon: "icons/cacher.svg", name: "Cacher", group: GROUPS.NOTES },
        { href: "https://example.com", icon: "icons/gist.svg", name: "Github Gist", group: GROUPS.NOTES },
        { href: "https://example.com", icon: "icons/plex.svg", name: "Plex", group: GROUPS.NAS },
        { href: "https://example.com", icon: "icons/qb.svg", name: "qBittorrent", group: GROUPS.NAS },
        { href: "https://example.com", icon: "icons/alist.svg", name: "Alist", group: GROUPS.NAS },
        { href: "https://example.com", icon: "icons/nastools.svg", name: "NasTools", group: GROUPS.NAS },
        { href: "https://example.com", icon: "icons/ql.svg", name: "青龙", group: GROUPS.NAS },
        { href: "https://example.com", icon: "icons/ip111.svg", name: "ip111", group: GROUPS.TOOLS },
        { href: "https://example.com", icon: "icons/hotel.svg", name: "万豪价格监控", group: GROUPS.TOOLS },
        { href: "https://example.com", icon: "icons/ChatGPT.svg", name: "自建ChatGPT", group: GROUPS.TOOLS },
        { href: "https://example.com", icon: "icons/Terminal.svg", name: "Tabby", group: GROUPS.TOOLS },
        { href: "https://example.com", icon: "icons/serverStatus.svg", name: "Server Status", group: GROUPS.TOOLS },
        { href: "https://example.com", icon: "icons/aria.svg", name: "AriaNg", group: GROUPS.TOOLS },
        { href: "https://example.com", icon: "icons/frp.svg", name: "FRP Dashboard", group: GROUPS.TOOLS }
    ];

    // 按字母表顺序排序收藏项
    favItems.sort((a, b) => a.name.localeCompare(b.name));

    const favListContainer = document.getElementById("favlist");

    /**
     * 提取SVG主颜色并生成蒙版颜色
     * 
     * @param {string} svgUrl - The URL of the SVG icon.
     * @returns {Promise<string>} - The faded main color in rgba format.
     */
    async function fetchAndFadeMainColor(svgUrl) {
        const response = await fetch(svgUrl);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

        const elements = svgDoc.querySelectorAll('path, rect, circle');
        let fillColor = null;
        elements.forEach(element => {
            const color = element.getAttribute('fill');
            if (color && color !== 'none' && /^#[0-9A-F]{3,6}$/i.test(color)) {
                fillColor = color;
            }
        });

        // 如果 fillColor 为 null 或者无法解析，则使用默认颜色
        if (!fillColor || fillColor === 'none' || fillColor.length !== 7) {
            fillColor = '#3388FF'; // 默认颜色
        } else if (fillColor.length === 4) {
            fillColor = `#${fillColor[1]}${fillColor[1]}${fillColor[2]}${fillColor[2]}${fillColor[3]}${fillColor[3]}`;
        }

        // 变淡主颜色
        const color = fillColor.replace('#', '');
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        return `rgba(${r},${g},${b},0.3)`;
    }

    /**
     * 根据组名将项目分组
     * 
     * @param {Array<Object>} items - 收藏项数组
     * @returns {Object} - 按组名分组的收藏项
     */
    function groupItemsByGroupName(items) {
        return items.reduce((groups, item) => {
            const groupName = item.group.name;
            const group = groups[groupName] || [];
            group.push(item);
            groups[groupName] = group;
            return groups;
        }, {});
    }

    /**
     * 根据组ID排序组
     * 
     * @param {Object} groups - 按组名分组的收藏项
     * @returns {Array<string>} - 排序后的组名数组
     */
    function sortGroupsById(groups) {
        return Object.keys(groups).sort((a, b) => groups[a][0].group.id - groups[b][0].group.id);
    }

    /**
     * 获取所有收藏项的颜色
     * 
     * @param {Array<Object>} items - 收藏项数组
     * @returns {Promise<Array<string>>} - 所有收藏项的颜色数组
     */
    async function fetchAllColors(items) {
        const colorPromises = items.map(item => fetchAndFadeMainColor(item.icon));
        return Promise.all(colorPromises);
    }

    /**
     * 创建组容器
     * 
     * @param {string} groupName - 组名
     * @param {Array<Object>} groupItems - 组内的收藏项
     * @param {Array<string>} colors - 组内收藏项的颜色数组
     * @returns {HTMLElement} - 组容器元素
     */
    function createGroupContainer(groupName, groupItems, colors) {
        const groupContainer = document.createElement("div");
        groupContainer.className = "group-container";

        const groupHeader = document.createElement("h4");
        groupHeader.textContent = `————— ${groupName} —————`;
        groupContainer.appendChild(groupHeader);

        groupItems.forEach((item, index) => {
            const box = document.createElement("div");
            box.className = "box";

            const anchor = document.createElement("a");
            anchor.href = item.href;
            box.appendChild(anchor);

            const p = document.createElement("p");
            p.className = "url";

            const mask = document.createElement("div");
            mask.className = "icon-mask";

            const object = document.createElement("object");
            object.className = "icon";
            object.type = "image/svg+xml";
            object.data = item.icon;

            const mainColor = colors[index];
            mask.style.backgroundColor = mainColor;
            mask.style.pointerEvents = "none";

            mask.appendChild(object);
            p.appendChild(mask);
            p.appendChild(document.createTextNode(item.name));

            box.appendChild(p);
            groupContainer.appendChild(box);
        });

        return groupContainer;
    }

    /**
     * 渲染收藏项
     */
    async function renderFavItems() {
        const groupedItems = groupItemsByGroupName(favItems);
        const sortedGroupNames = sortGroupsById(groupedItems);

        const allGroupContainers = await Promise.all(sortedGroupNames.map(async groupName => {
            const groupItems = groupedItems[groupName];
            const colors = await fetchAllColors(groupItems);
            return createGroupContainer(groupName, groupItems, colors);
        }));

        allGroupContainers.forEach(groupContainer => {
            favListContainer.appendChild(groupContainer);
        });
    }

    renderFavItems();
});