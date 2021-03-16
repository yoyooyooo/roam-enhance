enhance roam research, [Quick start](https://roamresearch.com/#/app/roam-enhance/page/sG3F86-49)

# before install

you should install [roam42](https://roamresearch.com/#/app/roamhacker/page/jI-X_cwaf)

# install

```js
const old = document.getElementById("roam-enhance");
old && old.remove();
const s = document.createElement("script");
s.src = "https://roam-enhance.vercel.app/main.js";
// or
// s.src = "https://cdn.jsdelivr.net/gh/yoyooyooo/roam-enhance/dist/main.js";
s.id = "roam-enhance";
s.async = true;
s.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(s);
```

# features

## enhance right click menu

click on block bullet:

<img src="http://github.com/yoyooyooo/roam-enhance/blob/master/images/1.png?raw=true" width="200" alt="click on block bullet"/>

click on page title:

<img src="http://github.com/yoyooyooo/roam-enhance/blob/master/images/2.png?raw=true" width="200" alt="click on page title"/>

click on page title of sidebar:

<img src="http://github.com/yoyooyooo/roam-enhance/blob/master/images/3.png?raw=true" width="200" alt="click on page title of sidebar"/>

### change build-in menu and custom your own menu

you can create a page named `roam/enhance/menu`,then right click the page title, there will be a menu called `Pull all build-in menu` in the right click menu.
click it and then it will automatically pull the built-in menu on the current page.

At this point, you can freely change the order of these menus、delete them，or create your own menu.

> Afterwards you can click `Pull unused build-in menu` to pull unused menu or new menu.

### how to create your menu

By default, all menu options are wrapped with {{}}, when click a block'bullet, its children will be executed in the following three ways:

1. <%menu:built-in menu name%>：

   Runs the built-in menu name

2. javascript code, such as ```javascript````` ：

   Run the code and output its return

3. plain text：

   will be copied as a template

### build-in menu

- BlockMenu
  - <%menu:Extract All children's highlight%>
  - <%menu:Delete block and its references%>
  - <%menu:Delete current block and embed block's refers%>
  - <%menu:Remove tags%>
  - <%menu:Child blocks remove tags%>
  - <%menu:Child embed to text%>
  - <%menu:Collapse all cloze%>
  - <%menu:Expand all cloze%>
  - <%menu:Merge blocks%>
  - <%menu:Split block%>
- PageTitleMenu
  - <%menu:Extract All children's highlight%>
  - <%menu:Clear current page%>
  - <%menu:Delete all refering blocks%>
  - <%menu:Extract currentPage's refers%>
- PageTitleMenu_Sidebar
  - <%menu:Extract All children's highlight%>
  - <%menu:Focus on page%>
  - <%menu:Clear current page%>
  - <%menu:Delete all refering blocks%>
  - <%menu:Extract currentPage's refers%>

### Relationship with roam42

Now，partially compatible with roam42. For some reason,you can use some of roam42's commands that are not output blocks, such as `<%DATE:2021-06-06%>`, and You can't use commands that automatically output content in roam42,such like `<%TODOOVERDUE:20%>`.

So your custom menu could look like this:

- {{demo}}
  - <%JA:return '===> '%><%DATE:2021-06-06%>

If you do not use `<%JA:%>` but use \`\`\`javascript\`\`\` directly, you will get some convenience, you can use some variables starting with $ in javascript code directly:

```javascript
console.log($ctx, $currentUid, $selectUids, $target, $pageTitle);
```

- $ctx: task's context, you can save your variables to it,it will be cleared after the task is completed.
- $currentUid: the uid of the currently clicked page or block
- $selectUids: the uid of the currently clicked page or block
- $target: the element currently clicked
- $pageTitle: the currently clicked page title

### `roam/enhance/menu` demo

https://roamresearch.com/#/app/roam-enhance/page/0wvmci2X2

### more document

see https://roamresearch.com/#/app/roam-enhance/page/sG3F86-49
