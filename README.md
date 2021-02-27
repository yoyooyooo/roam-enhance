enhance roam research

# before install

you should install [roam42](https://roamresearch.com/#/app/roamhacker/page/jI-X_cwaf)

# install

```js
const old = document.getElementById("roam-enhance");
old && old.remove();
const s = document.createElement("script");
s.src = "https://roam-enhance.vercel.app/main.js";
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

### change internal menu and custom your own menu
 
 you can create a page named `roam/enhance/menu`,then right click the page title, there will be a menu called `Pull internal menu` in the right click menu.
 click it and then it will automatically pull the built-in menu on the current page.
 
 At this point, you can freely change the order of these menus、delete them，or create your own menu.
 
### how to create your menu

By default, all menu options are wrapped with {{}}, which has 3 sublevels
1. <%menu:built-in menu name%>.
   Runs the built-in menu name
2. javascript code, such as ```javascript`````.
   Run the code and output its return
3. plain text
    will be copied as a template
