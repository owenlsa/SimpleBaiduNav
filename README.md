# SimpleBaiduNav

SimpleBaiduNav 是一个用于导航和管理收藏链接的项目。该项目包含多个 HTML、CSS 和 JavaScript 文件，旨在提供一个用户友好的界面。 

## 项目结构
```
SimpleBaiduNav/
├── icons/          // 包含图标图像的目录
├── 404.html        // 自定义 404 错误页面
├── index.html      // Web 应用程序的主要入口点，包含页面结构和搜索功能
├── items.js        // 管理页面上显示的项目的 JavaScript 文件，包含收藏项的定义和渲染逻辑
├── README.md       // 项目的文档文件
├── scripts.js      // 包含应用程序附加脚本的 JavaScript 文件，处理页面交互逻辑
├── styles.css      // 用于样式化 Web 应用程序的 CSS 文件
```

## 收藏条目的增加流程

在 `items.js` 文件中，收藏条目的增加流程如下：

1. 在 `favItems` 数组中添加新的收藏项对象。每个对象包含 `href`（URL）、`icon`（图标路径）、`name`（名称）和 `group`（所属组）属性。例如：
    ```js
    const favItems = [
        { href: "https://example.com", icon: "icons/example.svg", name: "Example", group: GROUPS.TOOLS },
        // 其他收藏项...
    ];
    ```

2. 在 `GROUPS` 对象中添加相应的组（如果需要）：
    ```js
    const GROUPS = {
        TOOLS: { id: 1, name: "工具" },
        // 其他组...
    };
    ```

通过以上步骤，可以在 `items.js` 文件中添加新的收藏条目，并在页面上显示。

## Unsplash接口动态更新壁纸(可选)

该项目使用 Unsplash 接口动态更新壁纸。使用该特性的步骤如下：

1. **获取 Unsplash 客户端 ID**：
   - 你需要在 Unsplash 开发者平台申请一个客户端 ID，并将其替换到 `scripts.js` 文件中的 `CLIENT_ID` 变量中。

2. **设置备用图片 URL**(可选)：
   - 在 `scripts.js` 文件中，将 `FALLBACK_IMAGE_URL` 变量替换为你希望在 Unsplash 请求失败时显示的备用图片 URL。
