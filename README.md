enhance roam research

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
  - <%menu:Delete block and its references%>
  - <%menu:Delete current block and embed block's refers%>
  - <%menu:Remove tags%>
  - <%menu:child blocks remove tags%>
  - <%menu:Child embed to text%>
  - <%menu:Collapse all cloze%>
  - <%menu:Expand all cloze%>
- PageTitleMenu
  - <%menu:Clear current page%>
  - <%menu:Extract All children's highlight%>
  - <%menu:Delete all refering blocks%>
  - <%menu:Extract currentPage's refers%>
- PageTitleMenu_Sidebar
  - <%menu:Focus on page%>
  - <%menu:Clear current page%>
  - <%menu:Extract All children's highlight%>
  - <%menu:Delete all refering blocks%>
  - <%menu:Extract currentPage's refers%>

### Relationship with roam42

Now，partially compatible with roam42.For some reason,you can use some of roam42's commands that are not output blocks, such as `<%DATE%>`,You can't use such command like `<%TODOOVERDUE:20%>`.

### `roam/enhance/menu` demo

You can copy code below to your `roam/enhance/menu` page

- **BlockMenu**
  - Delete
    - {{删除当前行及其所有引用}}
      - <%menu:Delete block and its references%>
    - {{删除当前行及其 embed 的所有引用}}
      - <%menu:Delete current block and embed block's refers%>
  - Format
    - {{删除标签}}
      - <%menu:Remove tags%>
  - Format child blocks
    - {{Embed => text}}
      - <%menu:Child embed to text%>
    - {{删除标签}}
      - <%menu:Child blocks remove tags%>
    - {{合并子 block}}
      - <%menu:Merge child blocks%>
  - Cloze
    - {{展开所有}}
      - <%menu:Expand all cloze%>
    - {{收缩所有}}
      - <%menu:Collapse all cloze%>
  - Extract
    - {{提取子级高亮}}
      - <%menu:Extract All children's highlight%>
- **PageTitleMenu**
  - {{清空当前页/块}}
    - <%menu:Clear current block/page%>
  - {{Delete all refering blocks}}
    - <%menu:Delete all refering blocks%>
  - {{Extract currentPage's refers}}
    - <%menu:Extract currentPage's refers%>
- **PageTitleMenu_Sidebar**
  - {{清空当前页/块}}
    - <%menu:Clear current block/page%>
  - {{Focus on page}}
    - <%menu:Focus on page%>
  - {{Delete all refering blocks}}
    - <%menu:Delete all refering blocks%>
  - {{Extract currentPage's refers}}
    - <%menu:Extract currentPage's refers%>
