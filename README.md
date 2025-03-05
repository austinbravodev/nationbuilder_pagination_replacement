# NationBuilder Pagination Replacement

This library can be used to replace pagination on your NationBuilder website with:
- infinite scroll (next pages load automatically as the user scrolls)
- a "load more" button (next page loads on click)
- "load all" functionality (all pages load on page load)
- a "load more" button *with* "load all" functionality (all remaining pages load on click)

It overcomes common pitfalls of this functionality (e.g. preserving state on back / forward navigation) and is also optimized for performance (the next page is pre-fetched upon rendering of the previous). It also gracefully falls back to standard pagination on any page other than the first, on error, or when the necessary browser functionality is not available.

## Purchase a License

A license is required to use this plugin - you can view the full License Agreement as well as the available licensing options [**here**](https://github.com/austinbravodev/nationbuilder_pagination_replacement?tab=License-1-ov-file#readme) and purchase a license [**here**](https://www.paypal.com/ncp/payment/328YACFEVSPDQ).

## Contact

For full-service installations, custom implementations, support, or feedback, get in touch at [austinbravo1@gmail.com](mailto:austinbravo1@gmail.com).

## Demos

*Note that while the demos are all blog pages, this plugin will work on any paginated NationBuilder page type.*

- [Load More](https://paginationreplacement-austinbravodev.nationbuilder.com/)
- [Infinite Scroll](https://paginationreplacement-austinbravodev.nationbuilder.com/infinite_scroll)
- [Load All](https://paginationreplacement-austinbravodev.nationbuilder.com/load_all)

---

## Usage

Add the script before the closing `</body>` tag:

```html
<script defer src="https://cdn.jsdelivr.net/gh/austinbravodev/nationbuilder_pagination_replacement/paginationReplacementPurify.min.js"></script>
```

If you already use the [DOMPurify library](https://github.com/cure53/DOMPurify) on your site or will be using a different HTML sanitizer, you can use the version that does not bundle this library:

```html
<script defer src="https://cdn.jsdelivr.net/gh/austinbravodev/nationbuilder_pagination_replacement/paginationReplacement.min.js"></script>
```

### Initialization

This is an example setup used on the [Load More](https://paginationreplacement-austinbravodev.nationbuilder.com/) demo, which uses NationBuilder's free Momentum theme, which uses Bootstrap 4:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  paginationReplacement({
    itemsContainerSelector: "#blog-page-{{ page.id }}",
    paginationContainerSelector: ".pagination",
    nextPageUrl: (paginationContainer) =>
      paginationContainer.lastElementChild.firstElementChild.href,
    previousPageCondition: (paginationContainer) =>
      paginationContainer.firstElementChild.classList.contains("disabled"),
    nextPageCondition: (paginationContainer) =>
      paginationContainer.lastElementChild.classList.contains("disabled"),
    messagesSelector: "#prMessages",
    messagesContainerSelector: "#prMessagesContainer",
    messagesLoadingIconSelector: "#prMessagesIcon",
    buttonSelector: "#prButton",
    buttonContainerSelector: "#prButtonContainer",
    messagesContainerHide: (messagesContainer) => {
      messagesContainer.style.setProperty("display", "none", "important");
    },
    // loadAll: true,
  });
});
```

Here is the messages and buttons HTML that works with such a setup, placed immediately after the pagination container:

```html

<div id="prButtonContainer" class="text-center" style="display: none;">
  <button id="prButton" type="button" class="btn btn-primary">Load More</button>
</div>

<div id="prMessagesContainer" class="d-flex justify-content-center align-items-center text-muted small mt-2" style="display: none !important;">
  <span id="prMessagesIcon" class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" style="display: none;"></span>
  <span id="prMessages"></span>
</div>

```

Or the equivalent `makeMessages` and `makeButton` functions, if you don't want to add HTML to every template:

```javascript
makeButton: (appendElement) => {
  const btnCont = document.createElement("div");
  btnCont.id = "prButtonContainer";
  btnCont.classList.add("text-center");
  btnCont.style.display = "none";

  const btn = document.createElement("button");
  btn.id = "prButton";
  btn.type = "button";
  btn.classList.add("btn", "btn-primary");
  btn.textContent = "Load More";
  btn.disabled = true;

  btnCont.append(btn);

  return {
    btn,
    btnCont,
    appendElement:
      appendElement.insertAdjacentElement("afterend", btnCont) ??
      appendElement,
  };
},
makeMessages: (appendElement) => {
  const msgsCont = document.createElement("div");
  msgsCont.id = "prMessagesContainer";
  msgsCont.classList.add(
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "text-muted",
    "small",
    "mt-2",
  );

  msgsCont.style.setProperty("display", "none", "important");

  const msgsLoadIcon = document.createElement("span");
  msgsLoadIcon.id = "prMessagesIcon";
  msgsLoadIcon.classList.add("spinner-border", "spinner-border-sm", "mr-1");
  msgsLoadIcon.role = "status";
  msgsLoadIcon.setAttribute("aria-hidden", "true");
  msgsLoadIcon.style.display = "none";

  const msgs = document.createElement("span");
  msgs.id = "prMessages";

  msgsCont.append(msgsLoadIcon, msgs);
  appendElement.insertAdjacentElement("afterend", msgsCont);

  return { msgs, msgsCont, msgsLoadIcon };
},
```

---

## Options

```javascript
// property values are *not* defaults unless otherwise noted
// properties with the `Selector` suffix are strings passed to `document.querySelector`

sanitize: window.DOMPurify?.sanitize, // HTML sanitizer function - this value is the default
loadAll: false, // `false` is the default
// if `false` and no "load more" button is present, will default to infinite scroll
// can be `true` with a "load more" button (will load all remaining pages on click)

// REQUIRED
// all properties in this section are required

itemsContainerSelector, // paginated content container - next page contents will be appended to this element
paginationContainerSelector,

previousPageCondition: (paginationContainer) => {
  // if no prior pages
  return true;
  // else
  return false;
},
nextPageCondition: (paginationContainer) => {
  // if no subsequent pages
  return true;
  // else
  return false;
},
nextPageUrl: (paginationContainer) => {
  return "https://nextpageurl.com/";
},

// MESSAGES
// use the selector properties OR the `makeMessages` function, not both
// messages will be assigned to the messages element's `textContent` property, so it's best this element is empty
// if using infinite scroll, the messages container element must *not* be hidden - otherwise, the messages container element should be hidden by default
// the loading icon element should be hidden by default

messagesSelector, // required if not using the `makeMessages` function
messagesContainerSelector, // will default to the element selected by `messagesSelector` if not supplied
messagesLoadingIconSelector,

makeMessages: (appendElement /* will be the paginationContainer *unless* `makeButton` returns a new `appendElement` */) => {
  // create messages and optionally messages container and / or a loading icon elements
  // add created element(s) to DOM, e.g.
  appendElement.insertAdjacentElement("afterend", msgsCont);
  // return created elements (if `msgsCont` is not returned, will default to `msgs`)
  return { msgs, /* and optionally */ msgsCont, msgsLoadIcon };
},

// the following property values *are* the default messages
loadingMessage: "Loading...",
errorMessage: "An error occurred - please use pagination.",

// BUTTONS
// use the selector properties OR the `makeButton` function, not both
// the button container element should be hidden by default, and the button element disabled

buttonSelector, // required if using "load more" functionality and not using the `makeButton` function
buttonContainerSelector, // will default to the element selected by `buttonSelector` if using "load more" functionality and not supplied

makeButton: (paginationContainer) => {
  // create button and optionally button container elements
  // add created element(s) to DOM, e.g.
  pagintationContainer.insertAdjacentElement("afterend", btnCont);
  // return created elements and optionally the element that will be passed as `appendElement` to `makeMessages` (useful to append the messages container to)
  // if `btnCont` is not returned, will default to `btn`
  return { btn, /* and optionally */ btnCont, appendElement };
},

// ELEMENT DISPLAY
// the properties in this section can be passed a string which will be assigned to the element's `style.display` attribute or a function for full control
// the values in this section *are* defaults

paginationContainerShow: "",
paginationContainerHide: "none",
messagesContainerShow: "",
messagesContainerHide: "none",
messagesLoadingIconShow: "",
messagesLoadingIconHide: "none",
buttonContainerShow: "",
buttonContainerHide: "none",

// called on click
buttonLoading: (btn) => {
  btn.disabled = true;
},
// called when the next page has been rendered due to a click
buttonLoaded: (btn) => {
  btn.disabled = false;
},
```