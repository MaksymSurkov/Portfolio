(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            spollersArray.forEach((spollersBlock => {
                const isHoverSpoller = spollersBlock.hasAttribute("data-spoller-hover");
                const isMobileDevice = () => typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
                const details = spollersBlock.querySelectorAll("details");
                details.forEach((detail => {
                    const summary = detail.querySelector("summary");
                    if (isHoverSpoller) if (isMobileDevice()) {
                        if (summary) summary.addEventListener("click", (e => {
                            e.preventDefault();
                            toggleSpoller(summary);
                        }));
                    } else {
                        detail.addEventListener("mouseenter", onSpollerHoverEnter);
                        detail.addEventListener("mouseleave", onSpollerHoverLeave);
                        if (summary) summary.addEventListener("click", (e => e.preventDefault()));
                    } else if (summary) summary.addEventListener("click", setSpollerAction);
                }));
            }));
            const spollersRegular = Array.from(spollersArray).filter((item => !item.dataset.spollers.split(",")[0]));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach((spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
            function setSpollerAction(e) {
                e.preventDefault();
                const spollerTitle = e.target.closest("summary");
                if (spollerTitle && spollerTitle.closest("[data-spollers]").classList.contains("_spoller-init")) toggleSpoller(spollerTitle);
            }
            function toggleSpoller(spollerTitle) {
                const spollerBlock = spollerTitle.closest("details");
                if (spollerBlock.open) closeSpoller(spollerBlock); else openSpoller(spollerBlock);
            }
            function onSpollerHoverEnter(e) {
                const spollerBlock = e.currentTarget;
                clearTimeout(spollerBlock._hoverTimeout);
                if (!spollerBlock.open) openSpoller(spollerBlock);
            }
            function onSpollerHoverLeave(e) {
                const spollerBlock = e.currentTarget;
                spollerBlock._hoverTimeout = setTimeout((() => {
                    if (spollerBlock.open) closeSpoller(spollerBlock);
                }), 300);
            }
            function openSpoller(spollerBlock) {
                const spollerTitle = spollerBlock.querySelector("summary");
                const spollerBody = spollerTitle.nextElementSibling;
                const spollersBlock = spollerBlock.closest("[data-spollers]");
                const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (!spollersBlock.querySelectorAll("._slide").length) {
                    if (oneSpoller) hideSpollersBody(spollersBlock);
                    spollerBlock.open = true;
                    spollerTitle.classList.add("_spoller-active");
                    _slideDown(spollerBody, spollerSpeed);
                    setTimeout((() => {
                        spollerBody.classList.add("_visible");
                    }), spollerSpeed / 2);
                }
            }
            function closeSpoller(spollerBlock) {
                const spollerTitle = spollerBlock.querySelector("summary");
                const spollerBody = spollerTitle.nextElementSibling;
                const spollersBlock = spollerBlock.closest("[data-spollers]");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                spollerTitle.classList.remove("_spoller-active");
                spollerBody.classList.remove("_visible");
                _slideUp(spollerBody, spollerSpeed);
                setTimeout((() => {
                    spollerBlock.open = false;
                }), spollerSpeed);
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout((() => {
                        spollerActiveBlock.open = false;
                    }), spollerSpeed);
                }
            }
        }
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function rippleEffect() {
        const rippleElements = document.querySelectorAll("[data-ripple]");
        rippleElements.forEach((button => {
            button.addEventListener("click", (e => createRipple(e, "click")));
            button.addEventListener("mouseenter", (e => createRipple(e, "hover")));
            button.addEventListener("mouseleave", (e => {
                delete e.currentTarget.dataset.rippleHoverTriggered;
            }));
        }));
        function createRipple(e, type) {
            const button = e.currentTarget;
            if (type === "hover" && button.dataset.rippleHoverTriggered) return;
            if (type === "hover") button.dataset.rippleHoverTriggered = "true";
            const ripple = document.createElement("span");
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            ripple.style.width = ripple.style.height = `${diameter}px`;
            if (type === "click") {
                ripple.style.left = `${e.pageX - (button.getBoundingClientRect().left + scrollX) - radius}px`;
                ripple.style.top = `${e.pageY - (button.getBoundingClientRect().top + scrollY) - radius}px`;
            } else if (type === "hover") {
                ripple.style.left = `${button.clientWidth / 2 - radius}px`;
                ripple.style.top = `${button.clientHeight / 2 - radius}px`;
            }
            ripple.classList.add("ripple");
            button.appendChild(ripple);
            ripple.addEventListener("animationend", (() => {
                ripple.remove();
            }));
        }
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function getDigFormat(item, sepp = " ") {
        return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    const marquee = () => {
        const $marqueeArray = document.querySelectorAll("[data-marquee]");
        const CLASS_NAMES = {
            wrapper: "marquee-wrapper",
            inner: "marquee-inner",
            item: "marquee-item"
        };
        if (!$marqueeArray.length) return;
        const {head} = document;
        function debounce(delay, fn) {
            let timerId;
            return (...args) => {
                if (timerId) clearTimeout(timerId);
                timerId = setTimeout((() => {
                    fn(...args);
                    timerId = null;
                }), delay);
            };
        }
        const onWindowWidthResize = cb => {
            if (!cb && !isFunction(cb)) return;
            let prevWidth = 0;
            const handleResize = () => {
                const currentWidth = window.innerWidth;
                if (prevWidth !== currentWidth) {
                    prevWidth = currentWidth;
                    cb();
                }
            };
            window.addEventListener("resize", debounce(50, handleResize));
            handleResize();
        };
        const buildMarquee = marqueeNode => {
            if (!marqueeNode) return;
            const $marquee = marqueeNode;
            const $childElements = $marquee.children;
            if (!$childElements.length) return;
            $marquee.classList.add(CLASS_NAMES.wrapper);
            Array.from($childElements).forEach(($childItem => $childItem.classList.add(CLASS_NAMES.item)));
            const htmlStructure = `<div class="${CLASS_NAMES.inner}">${$marquee.innerHTML}</div>`;
            $marquee.innerHTML = htmlStructure;
        };
        const getElSize = ($el, isVertical) => {
            if (isVertical) return $el.offsetHeight;
            return $el.offsetWidth;
        };
        $marqueeArray.forEach(($wrapper => {
            if (!$wrapper) return;
            buildMarquee($wrapper);
            const $marqueeInner = $wrapper.firstElementChild;
            let cacheArray = [];
            if (!$marqueeInner) return;
            const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-marquee-space"));
            const $items = $wrapper.querySelectorAll(`.${CLASS_NAMES.item}`);
            const speed = parseFloat($wrapper.getAttribute("data-marquee-speed")) / 10 || 100;
            const isMousePaused = $wrapper.hasAttribute("data-marquee-pause-mouse-enter");
            const direction = $wrapper.getAttribute("data-marquee-direction");
            const isVertical = direction === "bottom" || direction === "top";
            const animName = `marqueeAnimation-${Math.floor(Math.random() * 1e7)}`;
            let spaceBetweenItem = parseFloat(window.getComputedStyle($items[0])?.getPropertyValue("margin-right"));
            let spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
            let startPosition = parseFloat($wrapper.getAttribute("data-marquee-start")) || 0;
            let sumSize = 0;
            let firstScreenVisibleSize = 0;
            let initialSizeElements = 0;
            let initialElementsLength = $marqueeInner.children.length;
            let index = 0;
            let counterDuplicateElements = 0;
            const initEvents = () => {
                if (startPosition) $marqueeInner.addEventListener("animationiteration", onChangeStartPosition);
                if (!isMousePaused) return;
                $marqueeInner.removeEventListener("mouseenter", onChangePaused);
                $marqueeInner.removeEventListener("mouseleave", onChangePaused);
                $marqueeInner.addEventListener("mouseenter", onChangePaused);
                $marqueeInner.addEventListener("mouseleave", onChangePaused);
            };
            const onChangeStartPosition = () => {
                startPosition = 0;
                $marqueeInner.removeEventListener("animationiteration", onChangeStartPosition);
                onResize();
            };
            const setBaseStyles = firstScreenVisibleSize => {
                let baseStyle = "display: flex; flex-wrap: nowrap;";
                if (isVertical) {
                    baseStyle += `\n\t\t\t\tflex-direction: column;\n\t\t\t position: relative;\n\t\t\t will-change: transform;`;
                    if (direction === "bottom") baseStyle += `top: -${firstScreenVisibleSize}px;`;
                } else {
                    baseStyle += `\n\t\t\t\tposition: relative;\n\t\t\t will-change: transform;`;
                    if (direction === "right") baseStyle += `left: -${firstScreenVisibleSize}px;;`;
                }
                $marqueeInner.style.cssText = baseStyle;
            };
            const setdirectionAnim = totalWidth => {
                switch (direction) {
                  case "right":
                  case "bottom":
                    return totalWidth;

                  default:
                    return -totalWidth;
                }
            };
            const animation = () => {
                const keyFrameCss = `@keyframes ${animName} {\n\t\t\t\t\t 0% {\n\t\t\t\t\t\t transform: translate${isVertical ? "Y" : "X"}(${startPosition}%);\n\t\t\t\t\t }\n\t\t\t\t\t 100% {\n\t\t\t\t\t\t transform: translate${isVertical ? "Y" : "X"}(${setdirectionAnim(firstScreenVisibleSize)}px);\n\t\t\t\t\t }\n\t\t\t\t }`;
                const $style = document.createElement("style");
                $style.classList.add(animName);
                $style.innerHTML = keyFrameCss;
                head.append($style);
                $marqueeInner.style.animation = `${animName} ${(firstScreenVisibleSize + startPosition * firstScreenVisibleSize / 100) / speed}s infinite linear`;
            };
            const addDublicateElements = () => {
                sumSize = firstScreenVisibleSize = initialSizeElements = counterDuplicateElements = index = 0;
                const $parentNodeWidth = getElSize($wrapper, isVertical);
                let $childrenEl = Array.from($marqueeInner.children);
                if (!$childrenEl.length) return;
                if (!cacheArray.length) cacheArray = $childrenEl.map(($item => $item)); else $childrenEl = [ ...cacheArray ];
                $marqueeInner.style.display = "flex";
                if (isVertical) $marqueeInner.style.flexDirection = "column";
                $marqueeInner.innerHTML = "";
                $childrenEl.forEach(($item => {
                    $marqueeInner.append($item);
                }));
                $childrenEl.forEach(($item => {
                    if (isVertical) $item.style.marginBottom = `${spaceBetween}px`; else {
                        $item.style.marginRight = `${spaceBetween}px`;
                        $item.style.flexShrink = 0;
                    }
                    const sizeEl = getElSize($item, isVertical);
                    sumSize += sizeEl + spaceBetween;
                    firstScreenVisibleSize += sizeEl + spaceBetween;
                    initialSizeElements += sizeEl + spaceBetween;
                    counterDuplicateElements += 1;
                    return sizeEl;
                }));
                const $multiplyWidth = $parentNodeWidth * 2 + initialSizeElements;
                for (;sumSize < $multiplyWidth; index += 1) {
                    if (!$childrenEl[index]) index = 0;
                    const $cloneNone = $childrenEl[index].cloneNode(true);
                    const $lastElement = $marqueeInner.children[index];
                    $marqueeInner.append($cloneNone);
                    sumSize += getElSize($lastElement, isVertical) + spaceBetween;
                    if (firstScreenVisibleSize < $parentNodeWidth || counterDuplicateElements % initialElementsLength !== 0) {
                        counterDuplicateElements += 1;
                        firstScreenVisibleSize += getElSize($lastElement, isVertical) + spaceBetween;
                    }
                }
                setBaseStyles(firstScreenVisibleSize);
            };
            const correctSpaceBetween = () => {
                if (spaceBetweenItem) {
                    $items.forEach(($item => $item.style.removeProperty("margin-right")));
                    spaceBetweenItem = parseFloat(window.getComputedStyle($items[0]).getPropertyValue("margin-right"));
                    spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
                }
            };
            const init = () => {
                correctSpaceBetween();
                addDublicateElements();
                animation();
                initEvents();
            };
            const onResize = () => {
                head.querySelector(`.${animName}`)?.remove();
                init();
            };
            const onChangePaused = e => {
                const {type, target} = e;
                target.style.animationPlayState = type === "mouseenter" ? "paused" : "running";
            };
            onWindowWidthResize(onResize);
        }));
    };
    marquee();
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    function ssr_window_esm_isObject(obj) {
        return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target, src) {
        if (target === void 0) target = {};
        if (src === void 0) src = {};
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        Object.keys(src).filter((key => noExtend.indexOf(key) < 0)).forEach((key => {
            if (typeof target[key] === "undefined") target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = typeof document !== "undefined" ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if (typeof setTimeout === "undefined") {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if (typeof setTimeout === "undefined") return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = typeof window !== "undefined" ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function utils_classesToTokens(classes) {
        if (classes === void 0) classes = "";
        return classes.trim().split(" ").filter((c => !!c.trim()));
    }
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay) {
        if (delay === void 0) delay = 0;
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis) {
        if (axis === void 0) axis = "x";
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if (axis === "x") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if (axis === "y") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
    }
    function isNode(node) {
        if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") return node instanceof HTMLElement;
        return node && (node.nodeType === 1 || node.nodeType === 11);
    }
    function utils_extend() {
        const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < arguments.length; i += 1) {
            const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== void 0 && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
        let {swiper, targetPosition, side} = _ref;
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => dir === "next" && current >= target || dir === "prev" && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (startTime === null) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    function utils_elementChildren(element, selector) {
        if (selector === void 0) selector = "";
        const window = ssr_window_esm_getWindow();
        const children = [ ...element.children ];
        if (window.HTMLSlotElement && element instanceof HTMLSlotElement) children.push(...element.assignedElements());
        if (!selector) return children;
        return children.filter((el => el.matches(selector)));
    }
    function elementIsChildOfSlot(el, slot) {
        const elementsQueue = [ slot ];
        while (elementsQueue.length > 0) {
            const elementToCheck = elementsQueue.shift();
            if (el === elementToCheck) return true;
            elementsQueue.push(...elementToCheck.children, ...elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : [], ...elementToCheck.assignedElements ? elementToCheck.assignedElements() : []);
        }
    }
    function elementIsChildOf(el, parent) {
        const window = ssr_window_esm_getWindow();
        let isChild = parent.contains(el);
        if (!isChild && window.HTMLSlotElement && parent instanceof HTMLSlotElement) {
            const children = [ ...parent.assignedElements() ];
            isChild = children.includes(el);
            if (!isChild) isChild = elementIsChildOfSlot(el, parent);
        }
        return isChild;
    }
    function showWarning(text) {
        try {
            console.warn(text);
            return;
        } catch (err) {}
    }
    function utils_createElement(tag, classes) {
        if (classes === void 0) classes = [];
        const el = document.createElement(tag);
        el.classList.add(...Array.isArray(classes) ? classes : utils_classesToTokens(classes));
        return el;
    }
    function elementPrevAll(el, selector) {
        const prevEls = [];
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (prev.matches(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return prevEls;
    }
    function elementNextAll(el, selector) {
        const nextEls = [];
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (next.matches(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return nextEls;
    }
    function elementStyle(el, prop) {
        const window = ssr_window_esm_getWindow();
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    }
    function utils_elementIndex(el) {
        let child = el;
        let i;
        if (child) {
            i = 0;
            while ((child = child.previousSibling) !== null) if (child.nodeType === 1) i += 1;
            return i;
        }
        return;
    }
    function utils_elementParents(el, selector) {
        const parents = [];
        let parent = el.parentElement;
        while (parent) {
            if (selector) {
                if (parent.matches(selector)) parents.push(parent);
            } else parents.push(parent);
            parent = parent.parentElement;
        }
        return parents;
    }
    function utils_elementOuterSize(el, size, includeMargins) {
        const window = ssr_window_esm_getWindow();
        if (includeMargins) return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
        return el.offsetWidth;
    }
    function utils_makeElementsArray(el) {
        return (Array.isArray(el) ? el : [ el ]).filter((e => !!e));
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && document.documentElement.style && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice(_temp) {
        let {userAgent} = _temp === void 0 ? {} : _temp;
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = platform === "Win32";
        let macos = platform === "MacIntel";
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides) {
        if (overrides === void 0) overrides = {};
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        const device = getDevice();
        let needPerspectiveFix = false;
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        if (isSafari()) {
            const ua = String(window.navigator.userAgent);
            if (ua.includes("Version/")) {
                const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num => Number(num)));
                needPerspectiveFix = major < 16 || major === 16 && minor < 2;
            }
        }
        const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent);
        const isSafariBrowser = isSafari();
        const need3dFix = isSafariBrowser || isWebView && device.ios;
        return {
            isSafari: needPerspectiveFix || isSafariBrowser,
            needPerspectiveFix,
            need3dFix,
            isWebView
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize(_ref) {
        let {swiper, on, emit} = _ref;
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((_ref2 => {
                        let {contentBoxSize, contentRect, target} = _ref2;
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && typeof window.ResizeObserver !== "undefined") {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = function(target, options) {
            if (options === void 0) options = {};
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (swiper.__preventObserver__) return;
                if (mutations.length === 1) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: typeof options.attributes === "undefined" ? true : options.attributes,
                childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
                characterData: typeof options.characterData === "undefined" ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = utils_elementParents(swiper.hostEl);
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.hostEl, {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.wrapperEl, {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    var eventsEmitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            function onceHandler() {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if (typeof handler === "undefined") self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit() {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            if (typeof args[0] === "string" || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const el = swiper.el;
        if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) width = swiper.params.width; else width = el.clientWidth;
        if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) height = swiper.params.height; else height = el.clientHeight;
        if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) return;
        width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
        height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {wrapperEl, slidesEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = utils_elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if (typeof offsetBefore === "function") offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if (typeof offsetAfter === "function") offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if (typeof swiperSize === "undefined") return;
        if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize; else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
        swiper.virtualSize = -spaceBetween;
        slides.forEach((slideEl => {
            if (rtl) slideEl.style.marginLeft = ""; else slideEl.style.marginRight = "";
            slideEl.style.marginBottom = "";
            slideEl.style.marginTop = "";
        }));
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slides); else if (swiper.grid) swiper.grid.unsetSlides();
        let slideSize;
        const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key => typeof params.breakpoints[key].slidesPerView !== "undefined")).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            let slide;
            if (slides[i]) slide = slides[i];
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slides);
            if (slides[i] && elementStyle(slide, "display") === "none") continue;
            if (params.slidesPerView === "auto") {
                if (shouldResetSlideSize) slides[i].style[swiper.getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide);
                const currentTransform = slide.style.transform;
                const currentWebKitTransform = slide.style.webkitTransform;
                if (currentTransform) slide.style.transform = "none";
                if (currentWebKitTransform) slide.style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? utils_elementOuterSize(slide, "width", true) : utils_elementOuterSize(slide, "height", true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && boxSizing === "border-box") slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide;
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide.style.transform = currentTransform;
                if (currentWebKitTransform) slide.style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
        if (params.setWrapperSize) wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (isVirtual && params.loop) {
            const size = slidesSizesGrid[0] + spaceBetween;
            if (params.slidesPerGroup > 1) {
                const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
                const groupSize = size * params.slidesPerGroup;
                for (let i = 0; i < groups; i += 1) snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
            }
            for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
                if (params.slidesPerGroup === 1) snapGrid.push(snapGrid[snapGrid.length - 1] + size);
                slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
                swiper.virtualSize += size;
            }
        }
        if (snapGrid.length === 0) snapGrid = [ 0 ];
        if (spaceBetween !== 0) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode || params.loop) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).forEach((slideEl => {
                slideEl.style[key] = `${spaceBetween}px`;
            }));
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (spaceBetween || 0);
            }));
            allSlidesSize -= spaceBetween;
            const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
            snapGrid = snapGrid.map((snap => {
                if (snap <= 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (spaceBetween || 0);
            }));
            allSlidesSize -= spaceBetween;
            const offsetSize = (params.slidesOffsetBefore || 0) + (params.slidesOffsetAfter || 0);
            if (allSlidesSize + offsetSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        swiper.emit("slidesUpdated");
        if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.el.classList.remove(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if (typeof speed === "number") swiper.setTransition(speed); else if (speed === true) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides[swiper.getSlideIndexByData(index)];
            return swiper.slides[index];
        };
        if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || []).forEach((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if (typeof activeSlides[i] !== "undefined") {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
    }
    const toggleSlideClasses$1 = (slideEl, condition, className) => {
        if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className); else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
    };
    function updateSlidesProgress(translate) {
        if (translate === void 0) translate = this && this.translate || 0;
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (slides.length === 0) return;
        if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        let spaceBetween = params.spaceBetween;
        if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size; else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
            }
            toggleSlideClasses$1(slide, isVisible, params.slideVisibleClass);
            toggleSlideClasses$1(slide, isFullyVisible, params.slideFullyVisibleClass);
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
    }
    function updateProgress(translate) {
        const swiper = this;
        if (typeof translate === "undefined") {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd, progressLoop} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (translatesDiff === 0) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
            const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
            isBeginning = isBeginningRounded || progress <= 0;
            isEnd = isEndRounded || progress >= 1;
            if (isBeginningRounded) progress = 0;
            if (isEndRounded) progress = 1;
        }
        if (params.loop) {
            const firstSlideIndex = swiper.getSlideIndexByData(0);
            const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
            const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
            const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
            const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
            const translateAbs = Math.abs(translate);
            if (translateAbs >= firstSlideTranslate) progressLoop = (translateAbs - firstSlideTranslate) / translateMax; else progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
            if (progressLoop > 1) progressLoop -= 1;
        }
        Object.assign(swiper, {
            progress,
            progressLoop,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    const toggleSlideClasses = (slideEl, condition, className) => {
        if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className); else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
    };
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, slidesEl, activeIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
        const getFilteredSlide = selector => utils_elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
        let activeSlide;
        let prevSlide;
        let nextSlide;
        if (isVirtual) if (params.loop) {
            let slideIndex = activeIndex - swiper.virtual.slidesBefore;
            if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
            if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
            activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
        } else activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`); else if (gridEnabled) {
            activeSlide = slides.find((slideEl => slideEl.column === activeIndex));
            nextSlide = slides.find((slideEl => slideEl.column === activeIndex + 1));
            prevSlide = slides.find((slideEl => slideEl.column === activeIndex - 1));
        } else activeSlide = slides[activeIndex];
        if (activeSlide) if (!gridEnabled) {
            nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
            if (params.loop && !nextSlide) nextSlide = slides[0];
            prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
            if (params.loop && !prevSlide === 0) prevSlide = slides[slides.length - 1];
        }
        slides.forEach((slideEl => {
            toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
            toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
            toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
        }));
        swiper.emitSlidesClasses();
    }
    const processLazyPreloader = (swiper, imageEl) => {
        if (!swiper || swiper.destroyed || !swiper.params) return;
        const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
        const slideEl = imageEl.closest(slideSelector());
        if (slideEl) {
            let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            if (!lazyEl && swiper.isElement) if (slideEl.shadowRoot) lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`); else requestAnimationFrame((() => {
                if (slideEl.shadowRoot) {
                    lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
                    if (lazyEl) lazyEl.remove();
                }
            }));
            if (lazyEl) lazyEl.remove();
        }
    };
    const unlazy = (swiper, index) => {
        if (!swiper.slides[index]) return;
        const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
        if (imageEl) imageEl.removeAttribute("loading");
    };
    const preload = swiper => {
        if (!swiper || swiper.destroyed || !swiper.params) return;
        let amount = swiper.params.lazyPreloadPrevNext;
        const len = swiper.slides.length;
        if (!len || !amount || amount < 0) return;
        amount = Math.min(amount, len);
        const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
        const activeIndex = swiper.activeIndex;
        if (swiper.params.grid && swiper.params.grid.rows > 1) {
            const activeColumn = activeIndex;
            const preloadColumns = [ activeColumn - amount ];
            preloadColumns.push(...Array.from({
                length: amount
            }).map(((_, i) => activeColumn + slidesPerView + i)));
            swiper.slides.forEach(((slideEl, i) => {
                if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
            }));
            return;
        }
        const slideIndexLastInView = activeIndex + slidesPerView - 1;
        if (swiper.params.rewind || swiper.params.loop) for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
            const realIndex = (i % len + len) % len;
            if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
        } else for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) unlazy(swiper, i);
    };
    function getActiveIndexByTranslate(swiper) {
        const {slidesGrid, params} = swiper;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        let activeIndex;
        for (let i = 0; i < slidesGrid.length; i += 1) if (typeof slidesGrid[i + 1] !== "undefined") {
            if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
        } else if (translate >= slidesGrid[i]) activeIndex = i;
        if (params.normalizeSlideIndex) if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
        return activeIndex;
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        const getVirtualRealIndex = aIndex => {
            let realIndex = aIndex - swiper.virtual.slidesBefore;
            if (realIndex < 0) realIndex = swiper.virtual.slides.length + realIndex;
            if (realIndex >= swiper.virtual.slides.length) realIndex -= swiper.virtual.slides.length;
            return realIndex;
        };
        if (typeof activeIndex === "undefined") activeIndex = getActiveIndexByTranslate(swiper);
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex && !swiper.params.loop) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
            swiper.realIndex = getVirtualRealIndex(activeIndex);
            return;
        }
        const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
        let realIndex;
        if (swiper.virtual && params.virtual.enabled && params.loop) realIndex = getVirtualRealIndex(activeIndex); else if (gridEnabled) {
            const firstSlideInColumn = swiper.slides.find((slideEl => slideEl.column === activeIndex));
            let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
            if (Number.isNaN(activeSlideIndex)) activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
            realIndex = Math.floor(activeSlideIndex / params.grid.rows);
        } else if (swiper.slides[activeIndex]) {
            const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
            if (slideIndex) realIndex = parseInt(slideIndex, 10); else realIndex = activeIndex;
        } else realIndex = activeIndex;
        Object.assign(swiper, {
            previousSnapIndex,
            snapIndex,
            previousRealIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        if (swiper.initialized) preload(swiper);
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) {
            if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
            swiper.emit("slideChange");
        }
    }
    function updateClickedSlide(el, path) {
        const swiper = this;
        const params = swiper.params;
        let slide = el.closest(`.${params.slideClass}, swiper-slide`);
        if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) [ ...path.slice(path.indexOf(el) + 1, path.length) ].forEach((pathEl => {
            if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) slide = pathEl;
        }));
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    var update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis) {
        if (axis === void 0) axis = this.isHorizontal() ? "x" : "y";
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate(wrapperEl, axis);
        currentTranslate += swiper.cssOverflowAdjustment();
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) {
            if (swiper.isHorizontal()) x -= swiper.cssOverflowAdjustment(); else y -= swiper.cssOverflowAdjustment();
            wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        }
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (translatesDiff === 0) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
        if (translate === void 0) translate = 0;
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (translateBounds === void 0) translateBounds = true;
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (speed === 0) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    swiper.animating = false;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    var translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) {
            swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
            swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
        }
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit(_ref) {
        let {swiper, runCallbacks, direction, step} = _ref;
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if (dir === "reset") {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if (dir === "next") swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks, direction) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd(runCallbacks, direction) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    var transition = {
        setTransition,
        transitionStart,
        transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
        if (index === void 0) index = 0;
        if (runCallbacks === void 0) runCallbacks = true;
        if (typeof index === "string") index = parseInt(index, 10);
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) return false;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        const translate = -snapGrid[snapIndex];
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(translate * 100);
            const normalizedGrid = Math.floor(slidesGrid[i] * 100);
            const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
            if (typeof slidesGrid[i + 1] !== "undefined") {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        swiper.updateProgress(translate);
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        const isInitialVirtual = isVirtual && initial;
        if (!isInitialVirtual && (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate)) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if (params.effect !== "slide") swiper.setTranslate(translate);
            if (direction !== "reset") {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (speed === 0) {
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
                    swiper._cssModeVirtualInitialSet = true;
                    requestAnimationFrame((() => {
                        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                    }));
                } else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._immediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        const browser = getBrowser();
        const isSafari = browser.isSafari;
        if (isVirtual && !initial && isSafari && swiper.isElement) swiper.virtual.update(false, false, slideIndex);
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (speed === 0) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
        if (index === void 0) index = 0;
        if (runCallbacks === void 0) runCallbacks = true;
        if (typeof index === "string") {
            const indexAsNumber = parseInt(index, 10);
            index = indexAsNumber;
        }
        const swiper = this;
        if (swiper.destroyed) return;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
        let newIndex = index;
        if (swiper.params.loop) if (swiper.virtual && swiper.params.virtual.enabled) newIndex += swiper.virtual.slidesBefore; else {
            let targetSlideIndex;
            if (gridEnabled) {
                const slideIndex = newIndex * swiper.params.grid.rows;
                targetSlideIndex = swiper.slides.find((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex)).column;
            } else targetSlideIndex = swiper.getSlideIndexByData(newIndex);
            const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
            const {centeredSlides} = swiper.params;
            let slidesPerView = swiper.params.slidesPerView;
            if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic(); else {
                slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
                if (centeredSlides && slidesPerView % 2 === 0) slidesPerView += 1;
            }
            let needLoopFix = cols - targetSlideIndex < slidesPerView;
            if (centeredSlides) needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
            if (internal && centeredSlides && swiper.params.slidesPerView !== "auto" && !gridEnabled) needLoopFix = false;
            if (needLoopFix) {
                const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
                swiper.loopFix({
                    direction,
                    slideTo: true,
                    activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
                    slideRealIndex: direction === "next" ? swiper.realIndex : void 0
                });
            }
            if (gridEnabled) {
                const slideIndex = newIndex * swiper.params.grid.rows;
                newIndex = swiper.slides.find((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex)).column;
            } else newIndex = swiper.getSlideIndexByData(newIndex);
        }
        requestAnimationFrame((() => {
            swiper.slideTo(newIndex, speed, runCallbacks, internal);
        }));
        return swiper;
    }
    function slideNext(speed, runCallbacks, internal) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {enabled, params, animating} = swiper;
        if (!enabled || swiper.destroyed) return swiper;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        let perGroup = params.slidesPerGroup;
        if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        if (params.loop) {
            if (animating && !isVirtual && params.loopPreventsSliding) return false;
            swiper.loopFix({
                direction: "next"
            });
            swiper._clientLeft = swiper.wrapperEl.clientLeft;
            if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
                requestAnimationFrame((() => {
                    swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
                }));
                return true;
            }
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params, snapGrid, slidesGrid, rtlTranslate, enabled, animating} = swiper;
        if (!enabled || swiper.destroyed) return swiper;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        if (params.loop) {
            if (animating && !isVirtual && params.loopPreventsSliding) return false;
            swiper.loopFix({
                direction: "prev"
            });
            swiper._clientLeft = swiper.wrapperEl.clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        const isFreeMode = params.freeMode && params.freeMode.enabled;
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if (typeof prevSnapIndex !== "undefined") prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if (typeof prevSnap !== "undefined") {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
            requestAnimationFrame((() => {
                swiper.slideTo(prevIndex, speed, runCallbacks, internal);
            }));
            return true;
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        if (swiper.destroyed) return;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
        if (runCallbacks === void 0) runCallbacks = true;
        if (threshold === void 0) threshold = .5;
        const swiper = this;
        if (swiper.destroyed) return;
        if (typeof speed === "undefined") speed = swiper.params.speed;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        if (swiper.destroyed) return;
        const {params, slidesEl} = swiper;
        const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    var slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate(slideRealIndex, initial) {
        const swiper = this;
        const {params, slidesEl} = swiper;
        if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
        const initSlides = () => {
            const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
            slides.forEach(((el, index) => {
                el.setAttribute("data-swiper-slide-index", index);
            }));
        };
        const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
        const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
        const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
        const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
        const addBlankSlides = amountOfSlides => {
            for (let i = 0; i < amountOfSlides; i += 1) {
                const slideEl = swiper.isElement ? utils_createElement("swiper-slide", [ params.slideBlankClass ]) : utils_createElement("div", [ params.slideClass, params.slideBlankClass ]);
                swiper.slidesEl.append(slideEl);
            }
        };
        if (shouldFillGroup) {
            if (params.loopAddBlankSlides) {
                const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
                addBlankSlides(slidesToAdd);
                swiper.recalcSlides();
                swiper.updateSlides();
            } else showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
            initSlides();
        } else if (shouldFillGrid) {
            if (params.loopAddBlankSlides) {
                const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
                addBlankSlides(slidesToAdd);
                swiper.recalcSlides();
                swiper.updateSlides();
            } else showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
            initSlides();
        } else initSlides();
        swiper.loopFix({
            slideRealIndex,
            direction: params.centeredSlides ? void 0 : "next",
            initial
        });
    }
    function loopFix(_temp) {
        let {slideRealIndex, slideTo = true, direction, setTranslate, activeSlideIndex, initial, byController, byMousewheel} = _temp === void 0 ? {} : _temp;
        const swiper = this;
        if (!swiper.params.loop) return;
        swiper.emit("beforeLoopFix");
        const {slides, allowSlidePrev, allowSlideNext, slidesEl, params} = swiper;
        const {centeredSlides, initialSlide} = params;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        if (swiper.virtual && params.virtual.enabled) {
            if (slideTo) if (!params.centeredSlides && swiper.snapIndex === 0) swiper.slideTo(swiper.virtual.slides.length, 0, false, true); else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true); else if (swiper.snapIndex === swiper.snapGrid.length - 1) swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
            swiper.allowSlidePrev = allowSlidePrev;
            swiper.allowSlideNext = allowSlideNext;
            swiper.emit("loopFix");
            return;
        }
        let slidesPerView = params.slidesPerView;
        if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic(); else {
            slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
            if (centeredSlides && slidesPerView % 2 === 0) slidesPerView += 1;
        }
        const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
        let loopedSlides = slidesPerGroup;
        if (loopedSlides % slidesPerGroup !== 0) loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
        loopedSlides += params.loopAdditionalSlides;
        swiper.loopedSlides = loopedSlides;
        const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
        if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"); else if (gridEnabled && params.grid.fill === "row") showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
        const prependSlidesIndexes = [];
        const appendSlidesIndexes = [];
        const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
        const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !centeredSlides;
        let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
        if (typeof activeSlideIndex === "undefined") activeSlideIndex = swiper.getSlideIndex(slides.find((el => el.classList.contains(params.slideActiveClass)))); else activeIndex = activeSlideIndex;
        const isNext = direction === "next" || !direction;
        const isPrev = direction === "prev" || !direction;
        let slidesPrepended = 0;
        let slidesAppended = 0;
        const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
        const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate === "undefined" ? -slidesPerView / 2 + .5 : 0);
        if (activeColIndexWithShift < loopedSlides) {
            slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
            for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
                const index = i - Math.floor(i / cols) * cols;
                if (gridEnabled) {
                    const colIndexToPrepend = cols - index - 1;
                    for (let i = slides.length - 1; i >= 0; i -= 1) if (slides[i].column === colIndexToPrepend) prependSlidesIndexes.push(i);
                } else prependSlidesIndexes.push(cols - index - 1);
            }
        } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
            slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
            if (isInitialOverflow) slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
            for (let i = 0; i < slidesAppended; i += 1) {
                const index = i - Math.floor(i / cols) * cols;
                if (gridEnabled) slides.forEach(((slide, slideIndex) => {
                    if (slide.column === index) appendSlidesIndexes.push(slideIndex);
                })); else appendSlidesIndexes.push(index);
            }
        }
        swiper.__preventObserver__ = true;
        requestAnimationFrame((() => {
            swiper.__preventObserver__ = false;
        }));
        if (swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
            if (appendSlidesIndexes.includes(activeSlideIndex)) appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
            if (prependSlidesIndexes.includes(activeSlideIndex)) prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
        }
        if (isPrev) prependSlidesIndexes.forEach((index => {
            slides[index].swiperLoopMoveDOM = true;
            slidesEl.prepend(slides[index]);
            slides[index].swiperLoopMoveDOM = false;
        }));
        if (isNext) appendSlidesIndexes.forEach((index => {
            slides[index].swiperLoopMoveDOM = true;
            slidesEl.append(slides[index]);
            slides[index].swiperLoopMoveDOM = false;
        }));
        swiper.recalcSlides();
        if (params.slidesPerView === "auto") swiper.updateSlides(); else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) swiper.slides.forEach(((slide, slideIndex) => {
            swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
        }));
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (slideTo) if (prependSlidesIndexes.length > 0 && isPrev) {
            if (typeof slideRealIndex === "undefined") {
                const currentSlideTranslate = swiper.slidesGrid[activeIndex];
                const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
                const diff = newSlideTranslate - currentSlideTranslate;
                if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
                    swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
                    if (setTranslate) {
                        swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
                        swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
                    }
                }
            } else if (setTranslate) {
                const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
                swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
                swiper.touchEventsData.currentTranslate = swiper.translate;
            }
        } else if (appendSlidesIndexes.length > 0 && isNext) if (typeof slideRealIndex === "undefined") {
            const currentSlideTranslate = swiper.slidesGrid[activeIndex];
            const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
            const diff = newSlideTranslate - currentSlideTranslate;
            if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
                swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
                if (setTranslate) {
                    swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
                    swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
                }
            }
        } else {
            const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
            swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.controller && swiper.controller.control && !byController) {
            const loopParams = {
                slideRealIndex,
                direction,
                setTranslate,
                activeSlideIndex,
                byController: true
            };
            if (Array.isArray(swiper.controller.control)) swiper.controller.control.forEach((c => {
                if (!c.destroyed && c.params.loop) c.loopFix({
                    ...loopParams,
                    slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
                });
            })); else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) swiper.controller.control.loopFix({
                ...loopParams,
                slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo : false
            });
        }
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {params, slidesEl} = swiper;
        if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual.enabled) return;
        swiper.recalcSlides();
        const newSlidesOrder = [];
        swiper.slides.forEach((slideEl => {
            const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
            newSlidesOrder[index] = slideEl;
        }));
        swiper.slides.forEach((slideEl => {
            slideEl.removeAttribute("data-swiper-slide-index");
        }));
        newSlidesOrder.forEach((slideEl => {
            slidesEl.append(slideEl);
        }));
        swiper.recalcSlides();
        swiper.slideTo(swiper.realIndex, 0);
    }
    var loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
        if (swiper.isElement) swiper.__preventObserver__ = true;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
        if (swiper.isElement) requestAnimationFrame((() => {
            swiper.__preventObserver__ = false;
        }));
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        if (swiper.isElement) swiper.__preventObserver__ = true;
        swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
        if (swiper.isElement) requestAnimationFrame((() => {
            swiper.__preventObserver__ = false;
        }));
    }
    var grabCursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base) {
        if (base === void 0) base = this;
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function preventEdgeSwipe(swiper, event, startX) {
        const window = ssr_window_esm_getWindow();
        const {params} = swiper;
        const edgeSwipeDetection = params.edgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
            if (edgeSwipeDetection === "prevent") {
                event.preventDefault();
                return true;
            }
            return false;
        }
        return true;
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        const data = swiper.touchEventsData;
        if (e.type === "pointerdown") {
            if (data.pointerId !== null && data.pointerId !== e.pointerId) return;
            data.pointerId = e.pointerId;
        } else if (e.type === "touchstart" && e.targetTouches.length === 1) data.touchId = e.targetTouches[0].identifier;
        if (e.type === "touchstart") {
            preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
            return;
        }
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && e.pointerType === "mouse") return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let targetEl = e.target;
        if (params.touchEventsTarget === "wrapper") if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
        if ("which" in e && e.which === 3) return;
        if ("button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
        const eventPath = e.composedPath ? e.composedPath() : e.path;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) targetEl = eventPath[0];
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!targetEl.closest(params.swipeHandler)) return;
        touches.currentX = e.pageX;
        touches.currentY = e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        if (!preventEdgeSwipe(swiper, e, startX)) return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        let preventDefault = true;
        if (targetEl.matches(data.focusableElements)) {
            preventDefault = false;
            if (targetEl.nodeName === "SELECT") data.isTouched = false;
        }
        if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl && (e.pointerType === "mouse" || e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) document.activeElement.blur();
        const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
        if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) e.preventDefault();
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && event.pointerType === "mouse") return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (e.type === "pointermove") {
            if (data.touchId !== null) return;
            const id = e.pointerId;
            if (id !== data.pointerId) return;
        }
        let targetTouch;
        if (e.type === "touchmove") {
            targetTouch = [ ...e.changedTouches ].find((t => t.identifier === data.touchId));
            if (!targetTouch || targetTouch.identifier !== data.touchId) return;
        } else targetTouch = e;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        const pageX = targetTouch.pageX;
        const pageY = targetTouch.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!e.target.matches(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (rtl && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) return; else if (!rtl && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) return;
        if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== e.target && e.pointerType !== "mouse") document.activeElement.blur();
        if (document.activeElement) if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        touches.previousX = touches.currentX;
        touches.previousY = touches.currentY;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if (typeof data.isScrolling === "undefined") {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if (typeof data.startMoving === "undefined") if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        let diff = swiper.isHorizontal() ? diffX : diffY;
        let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
        if (params.oneWayMovement) {
            diff = Math.abs(diff) * (rtl ? 1 : -1);
            touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
        }
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) {
            diff = -diff;
            touchesDiff = -touchesDiff;
        }
        const prevTouchesDirection = swiper.touchesDirection;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
        const isLoop = swiper.params.loop && !params.cssMode;
        const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
        if (!data.isMoved) {
            if (isLoop && allowLoopFix) swiper.loopFix({
                direction: swiper.swipeDirection
            });
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) {
                const evt = new window.CustomEvent("transitionend", {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        bySwiperTouchMove: true
                    }
                });
                swiper.wrapperEl.dispatchEvent(evt);
            }
            data.allowMomentumBounce = false;
            if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        let loopFixed;
        (new Date).getTime();
        if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
            Object.assign(touches, {
                startX: pageX,
                startY: pageY,
                currentX: pageX,
                currentY: pageY,
                startTranslate: data.currentTranslate
            });
            data.loopSwapReset = true;
            data.startTranslate = data.currentTranslate;
            return;
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0) {
            if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) swiper.loopFix({
                direction: "prev",
                setTranslate: true,
                activeSlideIndex: 0
            });
            if (data.currentTranslate > swiper.minTranslate()) {
                disableParentSwiper = false;
                if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
            }
        } else if (diff < 0) {
            if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) swiper.loopFix({
                direction: "next",
                setTranslate: true,
                activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
            });
            if (data.currentTranslate < swiper.maxTranslate()) {
                disableParentSwiper = false;
                if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
            }
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let targetTouch;
        const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
        if (!isTouchEvent) {
            if (data.touchId !== null) return;
            if (e.pointerId !== data.pointerId) return;
            targetTouch = e;
        } else {
            targetTouch = [ ...e.changedTouches ].find((t => t.identifier === data.touchId));
            if (!targetTouch || targetTouch.identifier !== data.touchId) return;
        }
        if ([ "pointercancel", "pointerout", "pointerleave", "contextmenu" ].includes(e.type)) {
            const proceed = [ "pointercancel", "contextmenu" ].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
            if (!proceed) return;
        }
        data.pointerId = null;
        data.touchId = null;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && e.pointerType === "mouse") return;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if (typeof slidesGrid[i + increment] !== "undefined") {
                if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (swipeToLast || currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if (swiper.swipeDirection === "next") if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if (swiper.swipeDirection === "prev") if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if (swiper.swipeDirection === "next") swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
                if (swiper.swipeDirection === "prev") swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && el.offsetWidth === 0) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        const isVirtualLoop = isVirtual && params.loop;
        if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else if (swiper.params.loop && !isVirtual) swiper.slideToLoop(swiper.realIndex, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
            clearTimeout(swiper.autoplay.resizeTimeout);
            swiper.autoplay.resizeTimeout = setTimeout((() => {
                if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.resume();
            }), 500);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (swiper.translate === 0) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (translatesDiff === 0) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    function onLoad(e) {
        const swiper = this;
        processLazyPreloader(swiper, e.target);
        if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) return;
        swiper.update();
    }
    function onDocumentTouchStart() {
        const swiper = this;
        if (swiper.documentTouchHandlerProceeded) return;
        swiper.documentTouchHandlerProceeded = true;
        if (swiper.params.touchReleaseOnEdges) swiper.el.style.touchAction = "auto";
    }
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, el, wrapperEl, device} = swiper;
        const capture = !!params.nested;
        const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!el || typeof el === "string") return;
        document[domMethod]("touchstart", swiper.onDocumentTouchStart, {
            passive: false,
            capture
        });
        el[domMethod]("touchstart", swiper.onTouchStart, {
            passive: false
        });
        el[domMethod]("pointerdown", swiper.onTouchStart, {
            passive: false
        });
        document[domMethod]("touchmove", swiper.onTouchMove, {
            passive: false,
            capture
        });
        document[domMethod]("pointermove", swiper.onTouchMove, {
            passive: false,
            capture
        });
        document[domMethod]("touchend", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointerup", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointercancel", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("touchcancel", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointerout", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointerleave", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("contextmenu", swiper.onTouchEnd, {
            passive: true
        });
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
        el[domMethod]("load", swiper.onLoad, {
            capture: true
        });
    };
    function attachEvents() {
        const swiper = this;
        const {params} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        swiper.onLoad = onLoad.bind(swiper);
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    var events$1 = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {realIndex, initialized, params, el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
        const document = ssr_window_esm_getDocument();
        const breakpointsBase = params.breakpointsBase === "window" || !params.breakpointsBase ? params.breakpointsBase : "container";
        const breakpointContainer = [ "window", "container" ].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document.querySelector(params.breakpointsBase);
        const breakpoint = swiper.getBreakpoint(breakpoints, breakpointsBase, breakpointContainer);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasGrabCursor = swiper.params.grabCursor;
        const isGrabCursor = breakpointParams.grabCursor;
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            el.classList.add(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") el.classList.add(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        if (wasGrabCursor && !isGrabCursor) swiper.unsetGrabCursor(); else if (!wasGrabCursor && isGrabCursor) swiper.setGrabCursor();
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            if (typeof breakpointParams[prop] === "undefined") return;
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        const wasLoop = params.loop;
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        const hasLoop = swiper.params.loop;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (initialized) if (needsReLoop) {
            swiper.loopDestroy();
            swiper.loopCreate(realIndex);
            swiper.updateSlides();
        } else if (!wasLoop && hasLoop) {
            swiper.loopCreate(realIndex);
            swiper.updateSlides();
        } else if (wasLoop && !hasLoop) swiper.loopDestroy();
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base, containerEl) {
        if (base === void 0) base = "window";
        if (!breakpoints || base === "container" && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = base === "window" ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if (typeof point === "string" && point.indexOf("@") === 0) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if (base === "window") {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    var breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if (typeof item === "object") Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if (typeof item === "string") resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, el, device} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        el.classList.add(...classNames);
        swiper.emitContainerClasses();
    }
    function swiper_core_removeClasses() {
        const swiper = this;
        const {el, classNames} = swiper;
        if (!el || typeof el === "string") return;
        el.classList.remove(...classNames);
        swiper.emitContainerClasses();
    }
    var classes = {
        addClasses,
        removeClasses: swiper_core_removeClasses
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = swiper.snapGrid.length === 1;
        if (params.allowSlideNext === true) swiper.allowSlideNext = !swiper.isLocked;
        if (params.allowSlidePrev === true) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    var checkOverflow$1 = {
        checkOverflow
    };
    var defaults = {
        init: true,
        direction: "horizontal",
        oneWayMovement: false,
        swiperElementNodeName: "SWIPER-CONTAINER",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        eventsPrefix: "swiper",
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 5,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        loop: false,
        loopAddBlankSlides: true,
        loopAdditionalSlides: 0,
        loopPreventsSliding: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-blank",
        slideActiveClass: "swiper-slide-active",
        slideVisibleClass: "swiper-slide-visible",
        slideFullyVisibleClass: "swiper-slide-fully-visible",
        slideNextClass: "swiper-slide-next",
        slidePrevClass: "swiper-slide-prev",
        wrapperClass: "swiper-wrapper",
        lazyPreloaderClass: "swiper-lazy-preloader",
        lazyPreloadPrevNext: 0,
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj) {
            if (obj === void 0) obj = {};
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if (typeof moduleParams !== "object" || moduleParams === null) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (params[moduleParamName] === true) params[moduleParamName] = {
                enabled: true
            };
            if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) params[moduleParamName].auto = true;
            if ([ "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) params[moduleParamName].auto = true;
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter,
        update,
        translate,
        transition,
        slide,
        loop,
        grabCursor,
        events: events$1,
        breakpoints,
        checkOverflow: checkOverflow$1,
        classes
    };
    const extendedDefaults = {};
    class swiper_core_Swiper {
        constructor() {
            let el;
            let params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            const document = ssr_window_esm_getDocument();
            if (params.el && typeof params.el === "string" && document.querySelectorAll(params.el).length > 1) {
                const swipers = [];
                document.querySelectorAll(params.el).forEach((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new swiper_core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    params,
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: [],
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return swiper.params.direction === "horizontal";
                },
                isVertical() {
                    return swiper.params.direction === "vertical";
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                cssOverflowAdjustment() {
                    return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
                },
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: 0,
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    startMoving: void 0,
                    pointerId: null,
                    touchId: null
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        getDirectionLabel(property) {
            if (this.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        getSlideIndex(slideEl) {
            const {slidesEl, params} = this;
            const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
            const firstSlideIndex = utils_elementIndex(slides[0]);
            return utils_elementIndex(slideEl) - firstSlideIndex;
        }
        getSlideIndexByData(index) {
            return this.getSlideIndex(this.slides.find((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === index)));
        }
        recalcSlides() {
            const swiper = this;
            const {slidesEl, params} = swiper;
            swiper.slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0)).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.forEach((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
            if (view === void 0) view = "current";
            if (exact === void 0) exact = false;
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (typeof params.slidesPerView === "number") return params.slidesPerView;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += Math.ceil(slides[i].swiperSlideSize);
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if (view === "current") for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            [ ...swiper.el.querySelectorAll('[loading="lazy"]') ].forEach((imageEl => {
                if (imageEl.complete) processLazyPreloader(swiper, imageEl);
            }));
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
                setTranslate();
                if (params.autoHeight) swiper.updateAutoHeight();
            } else {
                if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
                    const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
                    translated = swiper.slideTo(slides.length - 1, 0, false, true);
                } else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
            if (needUpdate === void 0) needUpdate = true;
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
            if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") return swiper;
            swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
            swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.forEach((slideEl => {
                if (newDirection === "vertical") slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
            swiper.rtl = direction === "rtl";
            swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
            if (swiper.rtl) {
                swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(element) {
            const swiper = this;
            if (swiper.mounted) return true;
            let el = element || swiper.params.el;
            if (typeof el === "string") el = document.querySelector(el);
            if (!el) return false;
            el.swiper = swiper;
            if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) swiper.isElement = true;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = el.shadowRoot.querySelector(getWrapperSelector());
                    return res;
                }
                return utils_elementChildren(el, getWrapperSelector())[0];
            };
            let wrapperEl = getWrapper();
            if (!wrapperEl && swiper.params.createElements) {
                wrapperEl = utils_createElement("div", swiper.params.wrapperClass);
                el.append(wrapperEl);
                utils_elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl => {
                    wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                el,
                wrapperEl,
                slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
                hostEl: swiper.isElement ? el.parentNode.host : el,
                mounted: true,
                rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
                rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
                wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (mounted === false) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            if (swiper.params.loop) swiper.loopCreate(void 0, true);
            swiper.attachEvents();
            const lazyElements = [ ...swiper.el.querySelectorAll('[loading="lazy"]') ];
            if (swiper.isElement) lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
            lazyElements.forEach((imageEl => {
                if (imageEl.complete) processLazyPreloader(swiper, imageEl); else imageEl.addEventListener("load", (e => {
                    processLazyPreloader(swiper, e.target);
                }));
            }));
            preload(swiper);
            swiper.initialized = true;
            preload(swiper);
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance, cleanStyles) {
            if (deleteInstance === void 0) deleteInstance = true;
            if (cleanStyles === void 0) cleanStyles = true;
            const swiper = this;
            const {params, el, wrapperEl, slides} = swiper;
            if (typeof swiper.params === "undefined" || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                if (el && typeof el !== "string") el.removeAttribute("style");
                if (wrapperEl) wrapperEl.removeAttribute("style");
                if (slides && slides.length) slides.forEach((slideEl => {
                    slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
                    slideEl.removeAttribute("style");
                    slideEl.removeAttribute("data-swiper-slide-index");
                }));
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (deleteInstance !== false) {
                if (swiper.el && typeof swiper.el !== "string") swiper.el.swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!swiper_core_Swiper.prototype.__modules__) swiper_core_Swiper.prototype.__modules__ = [];
            const modules = swiper_core_Swiper.prototype.__modules__;
            if (typeof mod === "function" && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => swiper_core_Swiper.installModule(m)));
                return swiper_core_Swiper;
            }
            swiper_core_Swiper.installModule(module);
            return swiper_core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            swiper_core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    swiper_core_Swiper.use([ Resize, Observer ]);
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && params.auto === true) {
                let element = utils_elementChildren(swiper.el, `.${checkProps[key]}`)[0];
                if (!element) {
                    element = utils_createElement("div", checkProps[key]);
                    element.className = checkProps[key];
                    swiper.el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            prevEl: null
        };
        function getEl(el) {
            let res;
            if (el && typeof el === "string" && swiper.isElement) {
                res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
                if (res) return res;
            }
            if (el) {
                if (typeof el === "string") res = [ ...document.querySelectorAll(el) ];
                if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) res = swiper.el.querySelector(el); else if (res && res.length === 1) res = res[0];
            }
            if (el && !res) return el;
            return res;
        }
        function toggleEl(el, disabled) {
            const params = swiper.params.navigation;
            el = utils_makeElementsArray(el);
            el.forEach((subEl => {
                if (subEl) {
                    subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
                    if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
                    if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
                }
            }));
        }
        function update() {
            const {nextEl, prevEl} = swiper.navigation;
            if (swiper.params.loop) {
                toggleEl(prevEl, false);
                toggleEl(nextEl, false);
                return;
            }
            toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            let nextEl = getEl(params.nextEl);
            let prevEl = getEl(params.prevEl);
            Object.assign(swiper.navigation, {
                nextEl,
                prevEl
            });
            nextEl = utils_makeElementsArray(nextEl);
            prevEl = utils_makeElementsArray(prevEl);
            const initButton = (el, dir) => {
                if (el) el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
                if (!swiper.enabled && el) el.classList.add(...params.lockClass.split(" "));
            };
            nextEl.forEach((el => initButton(el, "next")));
            prevEl.forEach((el => initButton(el, "prev")));
        }
        function destroy() {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = utils_makeElementsArray(nextEl);
            prevEl = utils_makeElementsArray(prevEl);
            const destroyButton = (el, dir) => {
                el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
                el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
            };
            nextEl.forEach((el => destroyButton(el, "next")));
            prevEl.forEach((el => destroyButton(el, "prev")));
        }
        on("init", (() => {
            if (swiper.params.navigation.enabled === false) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = utils_makeElementsArray(nextEl);
            prevEl = utils_makeElementsArray(prevEl);
            if (swiper.enabled) {
                update();
                return;
            }
            [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.add(swiper.params.navigation.lockClass)));
        }));
        on("click", ((_s, e) => {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = utils_makeElementsArray(nextEl);
            prevEl = utils_makeElementsArray(prevEl);
            const targetEl = e.target;
            let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
            if (swiper.isElement && !targetIsButton) {
                const path = e.path || e.composedPath && e.composedPath();
                if (path) targetIsButton = path.find((pathEl => nextEl.includes(pathEl) || prevEl.includes(pathEl)));
            }
            if (swiper.params.navigation.hideOnClick && !targetIsButton) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if (nextEl.length) isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass); else if (prevEl.length) isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
                if (isHidden === true) emit("navigationShow"); else emit("navigationHide");
                [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.toggle(swiper.params.navigation.hiddenClass)));
            }
        }));
        const enable = () => {
            swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
            init();
            update();
        };
        const disable = () => {
            swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function Autoplay(_ref) {
        let {swiper, extendParams, on, emit, params} = _ref;
        swiper.autoplay = {
            running: false,
            paused: false,
            timeLeft: 0
        };
        extendParams({
            autoplay: {
                enabled: false,
                delay: 3e3,
                waitForTransition: true,
                disableOnInteraction: false,
                stopOnLastSlide: false,
                reverseDirection: false,
                pauseOnMouseEnter: false
            }
        });
        let timeout;
        let raf;
        let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
        let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
        let autoplayTimeLeft;
        let autoplayStartTime = (new Date).getTime();
        let wasPaused;
        let isTouched;
        let pausedByTouch;
        let touchStartTimeout;
        let slideChanged;
        let pausedByInteraction;
        let pausedByPointerEnter;
        function onTransitionEnd(e) {
            if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
            if (e.target !== swiper.wrapperEl) return;
            swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
            if (pausedByPointerEnter || e.detail && e.detail.bySwiperTouchMove) return;
            resume();
        }
        const calcTimeLeft = () => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            if (swiper.autoplay.paused) wasPaused = true; else if (wasPaused) {
                autoplayDelayCurrent = autoplayTimeLeft;
                wasPaused = false;
            }
            const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (new Date).getTime();
            swiper.autoplay.timeLeft = timeLeft;
            emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
            raf = requestAnimationFrame((() => {
                calcTimeLeft();
            }));
        };
        const getSlideDelay = () => {
            let activeSlideEl;
            if (swiper.virtual && swiper.params.virtual.enabled) activeSlideEl = swiper.slides.find((slideEl => slideEl.classList.contains("swiper-slide-active"))); else activeSlideEl = swiper.slides[swiper.activeIndex];
            if (!activeSlideEl) return;
            const currentSlideDelay = parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
            return currentSlideDelay;
        };
        const run = delayForce => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            cancelAnimationFrame(raf);
            calcTimeLeft();
            let delay = typeof delayForce === "undefined" ? swiper.params.autoplay.delay : delayForce;
            autoplayDelayTotal = swiper.params.autoplay.delay;
            autoplayDelayCurrent = swiper.params.autoplay.delay;
            const currentSlideDelay = getSlideDelay();
            if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === "undefined") {
                delay = currentSlideDelay;
                autoplayDelayTotal = currentSlideDelay;
                autoplayDelayCurrent = currentSlideDelay;
            }
            autoplayTimeLeft = delay;
            const speed = swiper.params.speed;
            const proceed = () => {
                if (!swiper || swiper.destroyed) return;
                if (swiper.params.autoplay.reverseDirection) {
                    if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
                        swiper.slidePrev(speed, true, true);
                        emit("autoplay");
                    } else if (!swiper.params.autoplay.stopOnLastSlide) {
                        swiper.slideTo(swiper.slides.length - 1, speed, true, true);
                        emit("autoplay");
                    }
                } else if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
                    swiper.slideNext(speed, true, true);
                    emit("autoplay");
                } else if (!swiper.params.autoplay.stopOnLastSlide) {
                    swiper.slideTo(0, speed, true, true);
                    emit("autoplay");
                }
                if (swiper.params.cssMode) {
                    autoplayStartTime = (new Date).getTime();
                    requestAnimationFrame((() => {
                        run();
                    }));
                }
            };
            if (delay > 0) {
                clearTimeout(timeout);
                timeout = setTimeout((() => {
                    proceed();
                }), delay);
            } else requestAnimationFrame((() => {
                proceed();
            }));
            return delay;
        };
        const start = () => {
            autoplayStartTime = (new Date).getTime();
            swiper.autoplay.running = true;
            run();
            emit("autoplayStart");
        };
        const stop = () => {
            swiper.autoplay.running = false;
            clearTimeout(timeout);
            cancelAnimationFrame(raf);
            emit("autoplayStop");
        };
        const pause = (internal, reset) => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            clearTimeout(timeout);
            if (!internal) pausedByInteraction = true;
            const proceed = () => {
                emit("autoplayPause");
                if (swiper.params.autoplay.waitForTransition) swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd); else resume();
            };
            swiper.autoplay.paused = true;
            if (reset) {
                if (slideChanged) autoplayTimeLeft = swiper.params.autoplay.delay;
                slideChanged = false;
                proceed();
                return;
            }
            const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
            autoplayTimeLeft = delay - ((new Date).getTime() - autoplayStartTime);
            if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
            if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
            proceed();
        };
        const resume = () => {
            if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
            autoplayStartTime = (new Date).getTime();
            if (pausedByInteraction) {
                pausedByInteraction = false;
                run(autoplayTimeLeft);
            } else run();
            swiper.autoplay.paused = false;
            emit("autoplayResume");
        };
        const onVisibilityChange = () => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            const document = ssr_window_esm_getDocument();
            if (document.visibilityState === "hidden") {
                pausedByInteraction = true;
                pause(true);
            }
            if (document.visibilityState === "visible") resume();
        };
        const onPointerEnter = e => {
            if (e.pointerType !== "mouse") return;
            pausedByInteraction = true;
            pausedByPointerEnter = true;
            if (swiper.animating || swiper.autoplay.paused) return;
            pause(true);
        };
        const onPointerLeave = e => {
            if (e.pointerType !== "mouse") return;
            pausedByPointerEnter = false;
            if (swiper.autoplay.paused) resume();
        };
        const attachMouseEvents = () => {
            if (swiper.params.autoplay.pauseOnMouseEnter) {
                swiper.el.addEventListener("pointerenter", onPointerEnter);
                swiper.el.addEventListener("pointerleave", onPointerLeave);
            }
        };
        const detachMouseEvents = () => {
            if (swiper.el && typeof swiper.el !== "string") {
                swiper.el.removeEventListener("pointerenter", onPointerEnter);
                swiper.el.removeEventListener("pointerleave", onPointerLeave);
            }
        };
        const attachDocumentEvents = () => {
            const document = ssr_window_esm_getDocument();
            document.addEventListener("visibilitychange", onVisibilityChange);
        };
        const detachDocumentEvents = () => {
            const document = ssr_window_esm_getDocument();
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
        on("init", (() => {
            if (swiper.params.autoplay.enabled) {
                attachMouseEvents();
                attachDocumentEvents();
                start();
            }
        }));
        on("destroy", (() => {
            detachMouseEvents();
            detachDocumentEvents();
            if (swiper.autoplay.running) stop();
        }));
        on("_freeModeStaticRelease", (() => {
            if (pausedByTouch || pausedByInteraction) resume();
        }));
        on("_freeModeNoMomentumRelease", (() => {
            if (!swiper.params.autoplay.disableOnInteraction) pause(true, true); else stop();
        }));
        on("beforeTransitionStart", ((_s, speed, internal) => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            if (internal || !swiper.params.autoplay.disableOnInteraction) pause(true, true); else stop();
        }));
        on("sliderFirstMove", (() => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            if (swiper.params.autoplay.disableOnInteraction) {
                stop();
                return;
            }
            isTouched = true;
            pausedByTouch = false;
            pausedByInteraction = false;
            touchStartTimeout = setTimeout((() => {
                pausedByInteraction = true;
                pausedByTouch = true;
                pause(true);
            }), 200);
        }));
        on("touchEnd", (() => {
            if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
            clearTimeout(touchStartTimeout);
            clearTimeout(timeout);
            if (swiper.params.autoplay.disableOnInteraction) {
                pausedByTouch = false;
                isTouched = false;
                return;
            }
            if (pausedByTouch && swiper.params.cssMode) resume();
            pausedByTouch = false;
            isTouched = false;
        }));
        on("slideChange", (() => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            slideChanged = true;
        }));
        Object.assign(swiper.autoplay, {
            start,
            stop,
            pause,
            resume
        });
    }
    function initSliders() {
        if (document.querySelector(".swiper")) new swiper_core_Swiper(".testimonials-block__slider", {
            modules: [ Navigation, Autoplay ],
            observer: true,
            observeParents: true,
            slidesPerView: 4,
            spaceBetween: 50,
            speed: 1e3,
            autoplay: {
                delay: 1e3,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            watchSlidesProgress: true,
            loop: true,
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 50
                },
                580: {
                    slidesPerView: 1,
                    spaceBetween: 50
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 50
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 50
                },
                1268: {
                    slidesPerView: 4,
                    spaceBetween: 50
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    if (item.dataset.watch === "navigator" && !item.dataset.watchThreshold) {
                        let valueOfThreshold;
                        if (item.clientHeight > 2) {
                            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
                            if (valueOfThreshold > 1) valueOfThreshold = 1;
                        } else valueOfThreshold = 1;
                        item.setAttribute("data-watch-threshold", valueOfThreshold.toFixed(2));
                    }
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            console.log(configWatcher);
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    function digitsCounter() {
        function digitsCountersInit(digitsCountersItems) {
            let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
            if (digitsCounters.length) digitsCounters.forEach((digitsCounter => {
                if (digitsCounter.hasAttribute("data-go")) return;
                digitsCounter.setAttribute("data-go", "");
                digitsCounter.dataset.digitsCounter = digitsCounter.innerHTML;
                digitsCounter.innerHTML = `0`;
                digitsCountersAnimate(digitsCounter);
            }));
        }
        function digitsCountersAnimate(digitsCounter) {
            let startTimestamp = null;
            const duration = parseFloat(digitsCounter.dataset.digitsCounterSpeed) ? parseFloat(digitsCounter.dataset.digitsCounterSpeed) : 1e3;
            const startValue = parseFloat(digitsCounter.dataset.digitsCounter);
            const format = digitsCounter.dataset.digitsCounterFormat ? digitsCounter.dataset.digitsCounterFormat : " ";
            const startPosition = 0;
            const step = timestamp => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (startPosition + startValue));
                digitsCounter.innerHTML = typeof digitsCounter.dataset.digitsCounterFormat !== "undefined" ? getDigFormat(value, format) : value;
                if (progress < 1) window.requestAnimationFrame(step); else digitsCounter.removeAttribute("data-go");
            };
            window.requestAnimationFrame(step);
        }
        function digitsCounterAction(e) {
            const entry = e.detail.entry;
            const targetElement = entry.target;
            if (targetElement.querySelectorAll("[data-digits-counter]").length) digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
        }
        document.addEventListener("watcherCallback", digitsCounterAction);
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function t(t, e, i) {
        return Math.max(t, Math.min(e, i));
    }
    class Animate {
        advance(e) {
            if (!this.isRunning) return;
            let i = !1;
            if (this.lerp) this.value = (s = this.value, o = this.to, n = 60 * this.lerp, r = e, 
            function(t, e, i) {
                return (1 - i) * t + i * e;
            }(s, o, 1 - Math.exp(-n * r))), Math.round(this.value) === this.to && (this.value = this.to, 
            i = !0); else {
                this.currentTime += e;
                const s = t(0, this.currentTime / this.duration, 1);
                i = s >= 1;
                const o = i ? 1 : this.easing(s);
                this.value = this.from + (this.to - this.from) * o;
            }
            var s, o, n, r;
            this.onUpdate?.(this.value, i), i && this.stop();
        }
        stop() {
            this.isRunning = !1;
        }
        fromTo(t, e, {lerp: i = .1, duration: s = 1, easing: o = t => t, onStart: n, onUpdate: r}) {
            this.from = this.value = t, this.to = e, this.lerp = i, this.duration = s, this.easing = o, 
            this.currentTime = 0, this.isRunning = !0, n?.(), this.onUpdate = r;
        }
    }
    class Dimensions {
        constructor({wrapper: t, content: e, autoResize: i = !0, debounce: s = 250} = {}) {
            this.wrapper = t, this.content = e, i && (this.debouncedResize = function(t, e) {
                let i;
                return function() {
                    let s = arguments, o = this;
                    clearTimeout(i), i = setTimeout((function() {
                        t.apply(o, s);
                    }), e);
                };
            }(this.resize, s), this.wrapper === window ? window.addEventListener("resize", this.debouncedResize, !1) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), 
            this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), 
            this.contentResizeObserver.observe(this.content)), this.resize();
        }
        destroy() {
            this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect(), 
            window.removeEventListener("resize", this.debouncedResize, !1);
        }
        resize=() => {
            this.onWrapperResize(), this.onContentResize();
        };
        onWrapperResize=() => {
            this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, 
            this.height = this.wrapper.clientHeight);
        };
        onContentResize=() => {
            this.wrapper === window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, 
            this.scrollWidth = this.wrapper.scrollWidth);
        };
        get limit() {
            return {
                x: this.scrollWidth - this.width,
                y: this.scrollHeight - this.height
            };
        }
    }
    class Emitter {
        constructor() {
            this.events = {};
        }
        emit(t, ...e) {
            let i = this.events[t] || [];
            for (let t = 0, s = i.length; t < s; t++) i[t](...e);
        }
        on(t, e) {
            return this.events[t]?.push(e) || (this.events[t] = [ e ]), () => {
                this.events[t] = this.events[t]?.filter((t => e !== t));
            };
        }
        off(t, e) {
            this.events[t] = this.events[t]?.filter((t => e !== t));
        }
        destroy() {
            this.events = {};
        }
    }
    const e = 100 / 6;
    class VirtualScroll {
        constructor(t, {wheelMultiplier: e = 1, touchMultiplier: i = 1}) {
            this.element = t, this.wheelMultiplier = e, this.touchMultiplier = i, this.touchStart = {
                x: null,
                y: null
            }, this.emitter = new Emitter, window.addEventListener("resize", this.onWindowResize, !1), 
            this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, {
                passive: !1
            }), this.element.addEventListener("touchstart", this.onTouchStart, {
                passive: !1
            }), this.element.addEventListener("touchmove", this.onTouchMove, {
                passive: !1
            }), this.element.addEventListener("touchend", this.onTouchEnd, {
                passive: !1
            });
        }
        on(t, e) {
            return this.emitter.on(t, e);
        }
        destroy() {
            this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize, !1), 
            this.element.removeEventListener("wheel", this.onWheel, {
                passive: !1
            }), this.element.removeEventListener("touchstart", this.onTouchStart, {
                passive: !1
            }), this.element.removeEventListener("touchmove", this.onTouchMove, {
                passive: !1
            }), this.element.removeEventListener("touchend", this.onTouchEnd, {
                passive: !1
            });
        }
        onTouchStart=t => {
            const {clientX: e, clientY: i} = t.targetTouches ? t.targetTouches[0] : t;
            this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = {
                x: 0,
                y: 0
            }, this.emitter.emit("scroll", {
                deltaX: 0,
                deltaY: 0,
                event: t
            });
        };
        onTouchMove=t => {
            const {clientX: e, clientY: i} = t.targetTouches ? t.targetTouches[0] : t, s = -(e - this.touchStart.x) * this.touchMultiplier, o = -(i - this.touchStart.y) * this.touchMultiplier;
            this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = {
                x: s,
                y: o
            }, this.emitter.emit("scroll", {
                deltaX: s,
                deltaY: o,
                event: t
            });
        };
        onTouchEnd=t => {
            this.emitter.emit("scroll", {
                deltaX: this.lastDelta.x,
                deltaY: this.lastDelta.y,
                event: t
            });
        };
        onWheel=t => {
            let {deltaX: i, deltaY: s, deltaMode: o} = t;
            i *= 1 === o ? e : 2 === o ? this.windowWidth : 1, s *= 1 === o ? e : 2 === o ? this.windowHeight : 1, 
            i *= this.wheelMultiplier, s *= this.wheelMultiplier, this.emitter.emit("scroll", {
                deltaX: i,
                deltaY: s,
                event: t
            });
        };
        onWindowResize=() => {
            this.windowWidth = window.innerWidth, this.windowHeight = window.innerHeight;
        };
    }
    class Lenis {
        constructor({wrapper: t = window, content: e = document.documentElement, wheelEventsTarget: i = t, eventsTarget: s = i, smoothWheel: o = !0, syncTouch: n = !1, syncTouchLerp: r = .075, touchInertiaMultiplier: l = 35, duration: h, easing: a = t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), lerp: c = !h && .1, infinite: d = !1, orientation: p = "vertical", gestureOrientation: u = "vertical", touchMultiplier: m = 1, wheelMultiplier: v = 1, autoResize: g = !0, __experimental__naiveDimensions: S = !1} = {}) {
            this.__isSmooth = !1, this.__isScrolling = !1, this.__isStopped = !1, this.__isLocked = !1, 
            this.onVirtualScroll = ({deltaX: t, deltaY: e, event: i}) => {
                if (i.ctrlKey) return;
                const s = i.type.includes("touch"), o = i.type.includes("wheel");
                if (this.options.syncTouch && s && "touchstart" === i.type && !this.isStopped && !this.isLocked) return void this.reset();
                const n = 0 === t && 0 === e, r = "vertical" === this.options.gestureOrientation && 0 === e || "horizontal" === this.options.gestureOrientation && 0 === t;
                if (n || r) return;
                let l = i.composedPath();
                if (l = l.slice(0, l.indexOf(this.rootElement)), l.find((t => {
                    var e, i, n, r, l;
                    return (null === (e = t.hasAttribute) || void 0 === e ? void 0 : e.call(t, "data-lenis-prevent")) || s && (null === (i = t.hasAttribute) || void 0 === i ? void 0 : i.call(t, "data-lenis-prevent-touch")) || o && (null === (n = t.hasAttribute) || void 0 === n ? void 0 : n.call(t, "data-lenis-prevent-wheel")) || (null === (r = t.classList) || void 0 === r ? void 0 : r.contains("lenis")) && !(null === (l = t.classList) || void 0 === l ? void 0 : l.contains("lenis-stopped"));
                }))) return;
                if (this.isStopped || this.isLocked) return void i.preventDefault();
                if (this.isSmooth = this.options.syncTouch && s || this.options.smoothWheel && o, 
                !this.isSmooth) return this.isScrolling = !1, void this.animate.stop();
                i.preventDefault();
                let h = e;
                "both" === this.options.gestureOrientation ? h = Math.abs(e) > Math.abs(t) ? e : t : "horizontal" === this.options.gestureOrientation && (h = t);
                const a = s && this.options.syncTouch, c = s && "touchend" === i.type && Math.abs(h) > 5;
                c && (h = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + h, Object.assign({
                    programmatic: !1
                }, a ? {
                    lerp: c ? this.options.syncTouchLerp : 1
                } : {
                    lerp: this.options.lerp,
                    duration: this.options.duration,
                    easing: this.options.easing
                }));
            }, this.onNativeScroll = () => {
                if (!this.__preventNextScrollEvent && !this.isScrolling) {
                    const t = this.animatedScroll;
                    this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, 
                    this.direction = Math.sign(this.animatedScroll - t), this.emit();
                }
            }, window.lenisVersion = "1.0.42", t !== document.documentElement && t !== document.body || (t = window), 
            this.options = {
                wrapper: t,
                content: e,
                wheelEventsTarget: i,
                eventsTarget: s,
                smoothWheel: o,
                syncTouch: n,
                syncTouchLerp: r,
                touchInertiaMultiplier: l,
                duration: h,
                easing: a,
                lerp: c,
                infinite: d,
                gestureOrientation: u,
                orientation: p,
                touchMultiplier: m,
                wheelMultiplier: v,
                autoResize: g,
                __experimental__naiveDimensions: S
            }, this.animate = new Animate, this.emitter = new Emitter, this.dimensions = new Dimensions({
                wrapper: t,
                content: e,
                autoResize: g
            }), this.toggleClassName("lenis", !0), this.velocity = 0, this.isLocked = !1, this.isStopped = !1, 
            this.isSmooth = n || o, this.isScrolling = !1, this.targetScroll = this.animatedScroll = this.actualScroll, 
            this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1), this.virtualScroll = new VirtualScroll(s, {
                touchMultiplier: m,
                wheelMultiplier: v
            }), this.virtualScroll.on("scroll", this.onVirtualScroll);
        }
        destroy() {
            this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1), 
            this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClassName("lenis", !1), 
            this.toggleClassName("lenis-smooth", !1), this.toggleClassName("lenis-scrolling", !1), 
            this.toggleClassName("lenis-stopped", !1), this.toggleClassName("lenis-locked", !1);
        }
        on(t, e) {
            return this.emitter.on(t, e);
        }
        off(t, e) {
            return this.emitter.off(t, e);
        }
        setScroll(t) {
            this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t;
        }
        resize() {
            this.dimensions.resize();
        }
        emit() {
            this.emitter.emit("scroll", this);
        }
        reset() {
            this.isLocked = !1, this.isScrolling = !1, this.animatedScroll = this.targetScroll = this.actualScroll, 
            this.velocity = 0, this.animate.stop();
        }
        start() {
            this.isStopped && (this.isStopped = !1, this.reset());
        }
        stop() {
            this.isStopped || (this.isStopped = !0, this.animate.stop(), this.reset());
        }
        raf(t) {
            const e = t - (this.time || t);
            this.time = t, this.animate.advance(.001 * e);
        }
        scrollTo(e, {offset: i = 0, immediate: s = !1, lock: o = !1, duration: n = this.options.duration, easing: r = this.options.easing, lerp: l = !n && this.options.lerp, onComplete: h, force: a = !1, programmatic: c = !0} = {}) {
            if (!this.isStopped && !this.isLocked || a) {
                if ([ "top", "left", "start" ].includes(e)) e = 0; else if ([ "bottom", "right", "end" ].includes(e)) e = this.limit; else {
                    let t;
                    if ("string" == typeof e ? t = document.querySelector(e) : (null == e ? void 0 : e.nodeType) && (t = e), 
                    t) {
                        if (this.options.wrapper !== window) {
                            const t = this.options.wrapper.getBoundingClientRect();
                            i -= this.isHorizontal ? t.left : t.top;
                        }
                        const s = t.getBoundingClientRect();
                        e = (this.isHorizontal ? s.left : s.top) + this.animatedScroll;
                    }
                }
                if ("number" == typeof e) {
                    if (e += i, e = Math.round(e), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : e = t(0, e, this.limit), 
                    s) return this.animatedScroll = this.targetScroll = e, this.setScroll(this.scroll), 
                    this.reset(), void (null == h || h(this));
                    if (!c) {
                        if (e === this.targetScroll) return;
                        this.targetScroll = e;
                    }
                    this.animate.fromTo(this.animatedScroll, e, {
                        duration: n,
                        easing: r,
                        lerp: l,
                        onStart: () => {
                            o && (this.isLocked = !0), this.isScrolling = !0;
                        },
                        onUpdate: (t, e) => {
                            this.isScrolling = !0, this.velocity = t - this.animatedScroll, this.direction = Math.sign(this.velocity), 
                            this.animatedScroll = t, this.setScroll(this.scroll), c && (this.targetScroll = t), 
                            e || this.emit(), e && (this.reset(), this.emit(), null == h || h(this), this.__preventNextScrollEvent = !0, 
                            requestAnimationFrame((() => {
                                delete this.__preventNextScrollEvent;
                            })));
                        }
                    });
                }
            }
        }
        get rootElement() {
            return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
        }
        get limit() {
            return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
        }
        get isHorizontal() {
            return "horizontal" === this.options.orientation;
        }
        get actualScroll() {
            return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
        }
        get scroll() {
            return this.options.infinite ? (t = this.animatedScroll, e = this.limit, (t % e + e) % e) : this.animatedScroll;
            var t, e;
        }
        get progress() {
            return 0 === this.limit ? 1 : this.scroll / this.limit;
        }
        get isSmooth() {
            return this.__isSmooth;
        }
        set isSmooth(t) {
            this.__isSmooth !== t && (this.__isSmooth = t, this.toggleClassName("lenis-smooth", t));
        }
        get isScrolling() {
            return this.__isScrolling;
        }
        set isScrolling(t) {
            this.__isScrolling !== t && (this.__isScrolling = t, this.toggleClassName("lenis-scrolling", t));
        }
        get isStopped() {
            return this.__isStopped;
        }
        set isStopped(t) {
            this.__isStopped !== t && (this.__isStopped = t, this.toggleClassName("lenis-stopped", t));
        }
        get isLocked() {
            return this.__isLocked;
        }
        set isLocked(t) {
            this.__isLocked !== t && (this.__isLocked = t, this.toggleClassName("lenis-locked", t));
        }
        get className() {
            let t = "lenis";
            return this.isStopped && (t += " lenis-stopped"), this.isLocked && (t += " lenis-locked"), 
            this.isScrolling && (t += " lenis-scrolling"), this.isSmooth && (t += " lenis-smooth"), 
            t;
        }
        toggleClassName(t, e) {
            this.rootElement.classList.toggle(t, e), this.emitter.emit("className change", this);
        }
    }
    function memo(callback) {
        let result;
        return () => {
            if (result === void 0) result = callback();
            return result;
        };
    }
    const supportsScrollTimeline = memo((() => window.ScrollTimeline !== void 0));
    const noop = any => any;
    const MotionGlobalConfig = {
        skipAnimations: false,
        useManualTiming: false
    };
    const stepsOrder = [ "read", "resolveKeyframes", "update", "preRender", "render", "postRender" ];
    const statsBuffer = {
        value: null,
        addProjectionMetrics: null
    };
    function createRenderStep(runNextFrame, stepName) {
        let thisFrame = new Set;
        let nextFrame = new Set;
        let isProcessing = false;
        let flushNextFrame = false;
        const toKeepAlive = new WeakSet;
        let latestFrameData = {
            delta: 0,
            timestamp: 0,
            isProcessing: false
        };
        let numCalls = 0;
        function triggerCallback(callback) {
            if (toKeepAlive.has(callback)) {
                step.schedule(callback);
                runNextFrame();
            }
            numCalls++;
            callback(latestFrameData);
        }
        const step = {
            schedule: (callback, keepAlive = false, immediate = false) => {
                const addToCurrentFrame = immediate && isProcessing;
                const queue = addToCurrentFrame ? thisFrame : nextFrame;
                if (keepAlive) toKeepAlive.add(callback);
                if (!queue.has(callback)) queue.add(callback);
                return callback;
            },
            cancel: callback => {
                nextFrame.delete(callback);
                toKeepAlive.delete(callback);
            },
            process: frameData => {
                latestFrameData = frameData;
                if (isProcessing) {
                    flushNextFrame = true;
                    return;
                }
                isProcessing = true;
                [thisFrame, nextFrame] = [ nextFrame, thisFrame ];
                thisFrame.forEach(triggerCallback);
                if (stepName && statsBuffer.value) statsBuffer.value.frameloop[stepName].push(numCalls);
                numCalls = 0;
                thisFrame.clear();
                isProcessing = false;
                if (flushNextFrame) {
                    flushNextFrame = false;
                    step.process(frameData);
                }
            }
        };
        return step;
    }
    const maxElapsed = 40;
    function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
        let runNextFrame = false;
        let useDefaultElapsed = true;
        const state = {
            delta: 0,
            timestamp: 0,
            isProcessing: false
        };
        const flagRunNextFrame = () => runNextFrame = true;
        const steps = stepsOrder.reduce(((acc, key) => {
            acc[key] = createRenderStep(flagRunNextFrame, allowKeepAlive ? key : void 0);
            return acc;
        }), {});
        const {read, resolveKeyframes, update, preRender, render, postRender} = steps;
        const processBatch = () => {
            const timestamp = MotionGlobalConfig.useManualTiming ? state.timestamp : performance.now();
            runNextFrame = false;
            if (!MotionGlobalConfig.useManualTiming) state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
            state.timestamp = timestamp;
            state.isProcessing = true;
            read.process(state);
            resolveKeyframes.process(state);
            update.process(state);
            preRender.process(state);
            render.process(state);
            postRender.process(state);
            state.isProcessing = false;
            if (runNextFrame && allowKeepAlive) {
                useDefaultElapsed = false;
                scheduleNextBatch(processBatch);
            }
        };
        const wake = () => {
            runNextFrame = true;
            useDefaultElapsed = true;
            if (!state.isProcessing) scheduleNextBatch(processBatch);
        };
        const schedule = stepsOrder.reduce(((acc, key) => {
            const step = steps[key];
            acc[key] = (process, keepAlive = false, immediate = false) => {
                if (!runNextFrame) wake();
                return step.schedule(process, keepAlive, immediate);
            };
            return acc;
        }), {});
        const cancel = process => {
            for (let i = 0; i < stepsOrder.length; i++) steps[stepsOrder[i]].cancel(process);
        };
        return {
            schedule,
            cancel,
            state,
            steps
        };
    }
    const {schedule: frame_frame, cancel: cancelFrame, state: frameData, steps: frameSteps} = createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);
    function observeTimeline(update, timeline) {
        let prevProgress;
        const onFrame = () => {
            const {currentTime} = timeline;
            const percentage = currentTime === null ? 0 : currentTime.value;
            const progress = percentage / 100;
            if (prevProgress !== progress) update(progress);
            prevProgress = progress;
        };
        frame_frame.update(onFrame, true);
        return () => cancelFrame(onFrame);
    }
    function resolveElements(elementOrSelector, scope, selectorCache) {
        if (elementOrSelector instanceof EventTarget) return [ elementOrSelector ]; else if (typeof elementOrSelector === "string") {
            let root = document;
            if (scope) root = scope.current;
            const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
            return elements ? Array.from(elements) : [];
        }
        return Array.from(elementOrSelector);
    }
    const resizeHandlers = new WeakMap;
    let observer;
    function getElementSize(target, borderBoxSize) {
        if (borderBoxSize) {
            const {inlineSize, blockSize} = borderBoxSize[0];
            return {
                width: inlineSize,
                height: blockSize
            };
        } else if (target instanceof SVGElement && "getBBox" in target) return target.getBBox(); else return {
            width: target.offsetWidth,
            height: target.offsetHeight
        };
    }
    function notifyTarget({target, contentRect, borderBoxSize}) {
        resizeHandlers.get(target)?.forEach((handler => {
            handler({
                target,
                contentSize: contentRect,
                get size() {
                    return getElementSize(target, borderBoxSize);
                }
            });
        }));
    }
    function notifyAll(entries) {
        entries.forEach(notifyTarget);
    }
    function createResizeObserver() {
        if (typeof ResizeObserver === "undefined") return;
        observer = new ResizeObserver(notifyAll);
    }
    function resizeElement(target, handler) {
        if (!observer) createResizeObserver();
        const elements = resolveElements(target);
        elements.forEach((element => {
            let elementHandlers = resizeHandlers.get(element);
            if (!elementHandlers) {
                elementHandlers = new Set;
                resizeHandlers.set(element, elementHandlers);
            }
            elementHandlers.add(handler);
            observer?.observe(element);
        }));
        return () => {
            elements.forEach((element => {
                const elementHandlers = resizeHandlers.get(element);
                elementHandlers?.delete(handler);
                if (!elementHandlers?.size) observer?.unobserve(element);
            }));
        };
    }
    const windowCallbacks = new Set;
    let windowResizeHandler;
    function createWindowResizeHandler() {
        windowResizeHandler = () => {
            const size = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            const info = {
                target: window,
                size,
                contentSize: size
            };
            windowCallbacks.forEach((callback => callback(info)));
        };
        window.addEventListener("resize", windowResizeHandler);
    }
    function resizeWindow(callback) {
        windowCallbacks.add(callback);
        if (!windowResizeHandler) createWindowResizeHandler();
        return () => {
            windowCallbacks.delete(callback);
            if (!windowCallbacks.size && windowResizeHandler) windowResizeHandler = void 0;
        };
    }
    function resize(a, b) {
        return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
    }
    const progress = (from, to, value) => {
        const toFromDifference = to - from;
        return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
    };
    function velocityPerSecond(velocity, frameDuration) {
        return frameDuration ? velocity * (1e3 / frameDuration) : 0;
    }
    const info_maxElapsed = 50;
    const createAxisInfo = () => ({
        current: 0,
        offset: [],
        progress: 0,
        scrollLength: 0,
        targetOffset: 0,
        targetLength: 0,
        containerLength: 0,
        velocity: 0
    });
    const createScrollInfo = () => ({
        time: 0,
        x: createAxisInfo(),
        y: createAxisInfo()
    });
    const keys = {
        x: {
            length: "Width",
            position: "Left"
        },
        y: {
            length: "Height",
            position: "Top"
        }
    };
    function updateAxisInfo(element, axisName, info, time) {
        const axis = info[axisName];
        const {length, position} = keys[axisName];
        const prev = axis.current;
        const prevTime = info.time;
        axis.current = element[`scroll${position}`];
        axis.scrollLength = element[`scroll${length}`] - element[`client${length}`];
        axis.offset.length = 0;
        axis.offset[0] = 0;
        axis.offset[1] = axis.scrollLength;
        axis.progress = progress(0, axis.scrollLength, axis.current);
        const elapsed = time - prevTime;
        axis.velocity = elapsed > info_maxElapsed ? 0 : velocityPerSecond(axis.current - prev, elapsed);
    }
    function updateScrollInfo(element, info, time) {
        updateAxisInfo(element, "x", info, time);
        updateAxisInfo(element, "y", info, time);
        info.time = time;
    }
    const clamp = (min, max, v) => {
        if (v > max) return max;
        if (v < min) return min;
        return v;
    };
    let warning = () => {};
    let invariant = () => {};
    if (false) ;
    const mixNumber = (from, to, progress) => from + (to - from) * progress;
    function hueToRgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    function hslaToRgba({hue, saturation, lightness, alpha}) {
        hue /= 360;
        saturation /= 100;
        lightness /= 100;
        let red = 0;
        let green = 0;
        let blue = 0;
        if (!saturation) red = green = blue = lightness; else {
            const q = lightness < .5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
            const p = 2 * lightness - q;
            red = hueToRgb(p, q, hue + 1 / 3);
            green = hueToRgb(p, q, hue);
            blue = hueToRgb(p, q, hue - 1 / 3);
        }
        return {
            red: Math.round(red * 255),
            green: Math.round(green * 255),
            blue: Math.round(blue * 255),
            alpha
        };
    }
    const number = {
        test: v => typeof v === "number",
        parse: parseFloat,
        transform: v => v
    };
    const alpha = {
        ...number,
        transform: v => clamp(0, 1, v)
    };
    const scale = {
        ...number,
        default: 1
    };
    const sanitize = v => Math.round(v * 1e5) / 1e5;
    const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
    function isNullish(v) {
        return v == null;
    }
    const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
    const isColorString = (type, testProp) => v => Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
    const splitColor = (aName, bName, cName) => v => {
        if (typeof v !== "string") return v;
        const [a, b, c, alpha] = v.match(floatRegex);
        return {
            [aName]: parseFloat(a),
            [bName]: parseFloat(b),
            [cName]: parseFloat(c),
            alpha: alpha !== void 0 ? parseFloat(alpha) : 1
        };
    };
    const clampRgbUnit = v => clamp(0, 255, v);
    const rgbUnit = {
        ...number,
        transform: v => Math.round(clampRgbUnit(v))
    };
    const rgba = {
        test: isColorString("rgb", "red"),
        parse: splitColor("red", "green", "blue"),
        transform: ({red, green, blue, alpha: alpha$1 = 1}) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
    };
    function parseHex(v) {
        let r = "";
        let g = "";
        let b = "";
        let a = "";
        if (v.length > 5) {
            r = v.substring(1, 3);
            g = v.substring(3, 5);
            b = v.substring(5, 7);
            a = v.substring(7, 9);
        } else {
            r = v.substring(1, 2);
            g = v.substring(2, 3);
            b = v.substring(3, 4);
            a = v.substring(4, 5);
            r += r;
            g += g;
            b += b;
            a += a;
        }
        return {
            red: parseInt(r, 16),
            green: parseInt(g, 16),
            blue: parseInt(b, 16),
            alpha: a ? parseInt(a, 16) / 255 : 1
        };
    }
    const hex = {
        test: isColorString("#"),
        parse: parseHex,
        transform: rgba.transform
    };
    const createUnitType = unit => ({
        test: v => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
        parse: parseFloat,
        transform: v => `${v}${unit}`
    });
    const degrees = createUnitType("deg");
    const percent = createUnitType("%");
    const px = createUnitType("px");
    const vh = createUnitType("vh");
    const vw = createUnitType("vw");
    const progressPercentage = {
        ...percent,
        parse: v => percent.parse(v) / 100,
        transform: v => percent.transform(v * 100)
    };
    const hsla = {
        test: isColorString("hsl", "hue"),
        parse: splitColor("hue", "saturation", "lightness"),
        transform: ({hue, saturation, lightness, alpha: alpha$1 = 1}) => "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
    };
    function mixImmediate(a, b) {
        return p => p > 0 ? b : a;
    }
    const mixLinearColor = (from, to, v) => {
        const fromExpo = from * from;
        const expo = v * (to * to - fromExpo) + fromExpo;
        return expo < 0 ? 0 : Math.sqrt(expo);
    };
    const colorTypes = [ hex, rgba, hsla ];
    const getColorType = v => colorTypes.find((type => type.test(v)));
    function asRGBA(color) {
        const type = getColorType(color);
        warning(Boolean(type), `'${color}' is not an animatable color. Use the equivalent color code instead.`);
        if (!Boolean(type)) return false;
        let model = type.parse(color);
        if (type === hsla) model = hslaToRgba(model);
        return model;
    }
    const mixColor = (from, to) => {
        const fromRGBA = asRGBA(from);
        const toRGBA = asRGBA(to);
        if (!fromRGBA || !toRGBA) return mixImmediate(from, to);
        const blended = {
            ...fromRGBA
        };
        return v => {
            blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
            blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
            blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
            blended.alpha = mixNumber(fromRGBA.alpha, toRGBA.alpha, v);
            return rgba.transform(blended);
        };
    };
    const combineFunctions = (a, b) => v => b(a(v));
    const pipe = (...transformers) => transformers.reduce(combineFunctions);
    const color = {
        test: v => rgba.test(v) || hex.test(v) || hsla.test(v),
        parse: v => {
            if (rgba.test(v)) return rgba.parse(v); else if (hsla.test(v)) return hsla.parse(v); else return hex.parse(v);
        },
        transform: v => typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v)
    };
    const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
    function test(v) {
        return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
    }
    const NUMBER_TOKEN = "number";
    const COLOR_TOKEN = "color";
    const VAR_TOKEN = "var";
    const VAR_FUNCTION_TOKEN = "var(";
    const SPLIT_TOKEN = "${}";
    const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
    function analyseComplexValue(value) {
        const originalValue = value.toString();
        const values = [];
        const indexes = {
            color: [],
            number: [],
            var: []
        };
        const types = [];
        let i = 0;
        const tokenised = originalValue.replace(complexRegex, (parsedValue => {
            if (color.test(parsedValue)) {
                indexes.color.push(i);
                types.push(COLOR_TOKEN);
                values.push(color.parse(parsedValue));
            } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
                indexes.var.push(i);
                types.push(VAR_TOKEN);
                values.push(parsedValue);
            } else {
                indexes.number.push(i);
                types.push(NUMBER_TOKEN);
                values.push(parseFloat(parsedValue));
            }
            ++i;
            return SPLIT_TOKEN;
        }));
        const split = tokenised.split(SPLIT_TOKEN);
        return {
            values,
            split,
            indexes,
            types
        };
    }
    function parseComplexValue(v) {
        return analyseComplexValue(v).values;
    }
    function createTransformer(source) {
        const {split, types} = analyseComplexValue(source);
        const numSections = split.length;
        return v => {
            let output = "";
            for (let i = 0; i < numSections; i++) {
                output += split[i];
                if (v[i] !== void 0) {
                    const type = types[i];
                    if (type === NUMBER_TOKEN) output += sanitize(v[i]); else if (type === COLOR_TOKEN) output += color.transform(v[i]); else output += v[i];
                }
            }
            return output;
        };
    }
    const convertNumbersToZero = v => typeof v === "number" ? 0 : v;
    function getAnimatableNone(v) {
        const parsed = parseComplexValue(v);
        const transformer = createTransformer(v);
        return transformer(parsed.map(convertNumbersToZero));
    }
    const complex = {
        test,
        parse: parseComplexValue,
        createTransformer,
        getAnimatableNone
    };
    const checkStringStartsWith = token => key => typeof key === "string" && key.startsWith(token);
    const is_css_variable_isCSSVariableName = checkStringStartsWith("--");
    const startsAsVariableToken = checkStringStartsWith("var(--");
    const isCSSVariableToken = value => {
        const startsWithToken = startsAsVariableToken(value);
        if (!startsWithToken) return false;
        return singleCssVariableRegex.test(value.split("/*")[0].trim());
    };
    const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
    const invisibleValues = new Set([ "none", "hidden" ]);
    function mixVisibility(origin, target) {
        if (invisibleValues.has(origin)) return p => p <= 0 ? origin : target; else return p => p >= 1 ? target : origin;
    }
    function complex_mixNumber(a, b) {
        return p => mixNumber(a, b, p);
    }
    function getMixer(a) {
        if (typeof a === "number") return complex_mixNumber; else if (typeof a === "string") return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex; else if (Array.isArray(a)) return mixArray; else if (typeof a === "object") return color.test(a) ? mixColor : mixObject;
        return mixImmediate;
    }
    function mixArray(a, b) {
        const output = [ ...a ];
        const numValues = output.length;
        const blendValue = a.map(((v, i) => getMixer(v)(v, b[i])));
        return p => {
            for (let i = 0; i < numValues; i++) output[i] = blendValue[i](p);
            return output;
        };
    }
    function mixObject(a, b) {
        const output = {
            ...a,
            ...b
        };
        const blendValue = {};
        for (const key in output) if (a[key] !== void 0 && b[key] !== void 0) blendValue[key] = getMixer(a[key])(a[key], b[key]);
        return v => {
            for (const key in blendValue) output[key] = blendValue[key](v);
            return output;
        };
    }
    function matchOrder(origin, target) {
        const orderedOrigin = [];
        const pointers = {
            color: 0,
            var: 0,
            number: 0
        };
        for (let i = 0; i < target.values.length; i++) {
            const type = target.types[i];
            const originIndex = origin.indexes[type][pointers[type]];
            const originValue = origin.values[originIndex] ?? 0;
            orderedOrigin[i] = originValue;
            pointers[type]++;
        }
        return orderedOrigin;
    }
    const mixComplex = (origin, target) => {
        const template = complex.createTransformer(target);
        const originStats = analyseComplexValue(origin);
        const targetStats = analyseComplexValue(target);
        const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
        if (canInterpolate) {
            if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) return mixVisibility(origin, target);
            return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
        } else {
            warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`);
            return mixImmediate(origin, target);
        }
    };
    function mix(from, to, p) {
        if (typeof from === "number" && typeof to === "number" && typeof p === "number") return mixNumber(from, to, p);
        const mixer = getMixer(from);
        return mixer(from, to);
    }
    function createMixers(output, ease, customMixer) {
        const mixers = [];
        const mixerFactory = customMixer || mix;
        const numMixers = output.length - 1;
        for (let i = 0; i < numMixers; i++) {
            let mixer = mixerFactory(output[i], output[i + 1]);
            if (ease) {
                const easingFunction = Array.isArray(ease) ? ease[i] || noop : ease;
                mixer = pipe(easingFunction, mixer);
            }
            mixers.push(mixer);
        }
        return mixers;
    }
    function interpolate(input, output, {clamp: isClamp = true, ease, mixer} = {}) {
        const inputLength = input.length;
        invariant(inputLength === output.length, "Both input and output ranges must be the same length");
        if (inputLength === 1) return () => output[0];
        if (inputLength === 2 && output[0] === output[1]) return () => output[1];
        const isZeroDeltaRange = input[0] === input[1];
        if (input[0] > input[inputLength - 1]) {
            input = [ ...input ].reverse();
            output = [ ...output ].reverse();
        }
        const mixers = createMixers(output, ease, mixer);
        const numMixers = mixers.length;
        const interpolator = v => {
            if (isZeroDeltaRange && v < input[0]) return output[0];
            let i = 0;
            if (numMixers > 1) for (;i < input.length - 2; i++) if (v < input[i + 1]) break;
            const progressInRange = progress(input[i], input[i + 1], v);
            return mixers[i](progressInRange);
        };
        return isClamp ? v => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
    }
    function fillOffset(offset, remaining) {
        const min = offset[offset.length - 1];
        for (let i = 1; i <= remaining; i++) {
            const offsetProgress = progress(0, remaining, i);
            offset.push(mixNumber(min, 1, offsetProgress));
        }
    }
    function defaultOffset(arr) {
        const offset = [ 0 ];
        fillOffset(offset, arr.length - 1);
        return offset;
    }
    function calcInset(element, container) {
        const inset = {
            x: 0,
            y: 0
        };
        let current = element;
        while (current && current !== container) if (current instanceof HTMLElement) {
            inset.x += current.offsetLeft;
            inset.y += current.offsetTop;
            current = current.offsetParent;
        } else if (current.tagName === "svg") {
            const svgBoundingBox = current.getBoundingClientRect();
            current = current.parentElement;
            const parentBoundingBox = current.getBoundingClientRect();
            inset.x += svgBoundingBox.left - parentBoundingBox.left;
            inset.y += svgBoundingBox.top - parentBoundingBox.top;
        } else if (current instanceof SVGGraphicsElement) {
            const {x, y} = current.getBBox();
            inset.x += x;
            inset.y += y;
            let svg = null;
            let parent = current.parentNode;
            while (!svg) {
                if (parent.tagName === "svg") svg = parent;
                parent = current.parentNode;
            }
            current = svg;
        } else break;
        return inset;
    }
    const namedEdges = {
        start: 0,
        center: .5,
        end: 1
    };
    function resolveEdge(edge, length, inset = 0) {
        let delta = 0;
        if (edge in namedEdges) edge = namedEdges[edge];
        if (typeof edge === "string") {
            const asNumber = parseFloat(edge);
            if (edge.endsWith("px")) delta = asNumber; else if (edge.endsWith("%")) edge = asNumber / 100; else if (edge.endsWith("vw")) delta = asNumber / 100 * document.documentElement.clientWidth; else if (edge.endsWith("vh")) delta = asNumber / 100 * document.documentElement.clientHeight; else edge = asNumber;
        }
        if (typeof edge === "number") delta = length * edge;
        return inset + delta;
    }
    const offset_defaultOffset = [ 0, 0 ];
    function resolveOffset(offset, containerLength, targetLength, targetInset) {
        let offsetDefinition = Array.isArray(offset) ? offset : offset_defaultOffset;
        let targetPoint = 0;
        let containerPoint = 0;
        if (typeof offset === "number") offsetDefinition = [ offset, offset ]; else if (typeof offset === "string") {
            offset = offset.trim();
            if (offset.includes(" ")) offsetDefinition = offset.split(" "); else offsetDefinition = [ offset, namedEdges[offset] ? offset : `0` ];
        }
        targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
        containerPoint = resolveEdge(offsetDefinition[1], containerLength);
        return targetPoint - containerPoint;
    }
    const ScrollOffset = {
        Enter: [ [ 0, 1 ], [ 1, 1 ] ],
        Exit: [ [ 0, 0 ], [ 1, 0 ] ],
        Any: [ [ 1, 0 ], [ 0, 1 ] ],
        All: [ [ 0, 0 ], [ 1, 1 ] ]
    };
    const point = {
        x: 0,
        y: 0
    };
    function getTargetSize(target) {
        return "getBBox" in target && target.tagName !== "svg" ? target.getBBox() : {
            width: target.clientWidth,
            height: target.clientHeight
        };
    }
    function resolveOffsets(container, info, options) {
        const {offset: offsetDefinition = ScrollOffset.All} = options;
        const {target = container, axis = "y"} = options;
        const lengthLabel = axis === "y" ? "height" : "width";
        const inset = target !== container ? calcInset(target, container) : point;
        const targetSize = target === container ? {
            width: container.scrollWidth,
            height: container.scrollHeight
        } : getTargetSize(target);
        const containerSize = {
            width: container.clientWidth,
            height: container.clientHeight
        };
        info[axis].offset.length = 0;
        let hasChanged = !info[axis].interpolate;
        const numOffsets = offsetDefinition.length;
        for (let i = 0; i < numOffsets; i++) {
            const offset = resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset[axis]);
            if (!hasChanged && offset !== info[axis].interpolatorOffsets[i]) hasChanged = true;
            info[axis].offset[i] = offset;
        }
        if (hasChanged) {
            info[axis].interpolate = interpolate(info[axis].offset, defaultOffset(offsetDefinition), {
                clamp: false
            });
            info[axis].interpolatorOffsets = [ ...info[axis].offset ];
        }
        info[axis].progress = clamp(0, 1, info[axis].interpolate(info[axis].current));
    }
    function measure(container, target = container, info) {
        info.x.targetOffset = 0;
        info.y.targetOffset = 0;
        if (target !== container) {
            let node = target;
            while (node && node !== container) {
                info.x.targetOffset += node.offsetLeft;
                info.y.targetOffset += node.offsetTop;
                node = node.offsetParent;
            }
        }
        info.x.targetLength = target === container ? target.scrollWidth : target.clientWidth;
        info.y.targetLength = target === container ? target.scrollHeight : target.clientHeight;
        info.x.containerLength = container.clientWidth;
        info.y.containerLength = container.clientHeight;
        if (false) ;
    }
    function createOnScrollHandler(element, onScroll, info, options = {}) {
        return {
            measure: () => measure(element, options.target, info),
            update: time => {
                updateScrollInfo(element, info, time);
                if (options.offset || options.target) resolveOffsets(element, info, options);
            },
            notify: () => onScroll(info)
        };
    }
    const scrollListeners = new WeakMap;
    const resizeListeners = new WeakMap;
    const onScrollHandlers = new WeakMap;
    const getEventTarget = element => element === document.documentElement ? window : element;
    function scrollInfo(onScroll, {container = document.documentElement, ...options} = {}) {
        let containerHandlers = onScrollHandlers.get(container);
        if (!containerHandlers) {
            containerHandlers = new Set;
            onScrollHandlers.set(container, containerHandlers);
        }
        const info = createScrollInfo();
        const containerHandler = createOnScrollHandler(container, onScroll, info, options);
        containerHandlers.add(containerHandler);
        if (!scrollListeners.has(container)) {
            const measureAll = () => {
                for (const handler of containerHandlers) handler.measure();
            };
            const updateAll = () => {
                for (const handler of containerHandlers) handler.update(frameData.timestamp);
            };
            const notifyAll = () => {
                for (const handler of containerHandlers) handler.notify();
            };
            const listener = () => {
                frame_frame.read(measureAll, false, true);
                frame_frame.read(updateAll, false, true);
                frame_frame.update(notifyAll, false, true);
            };
            scrollListeners.set(container, listener);
            const target = getEventTarget(container);
            window.addEventListener("resize", listener, {
                passive: true
            });
            if (container !== document.documentElement) resizeListeners.set(container, resize(container, listener));
            target.addEventListener("scroll", listener, {
                passive: true
            });
        }
        const listener = scrollListeners.get(container);
        frame_frame.read(listener, false, true);
        return () => {
            cancelFrame(listener);
            const currentHandlers = onScrollHandlers.get(container);
            if (!currentHandlers) return;
            currentHandlers.delete(containerHandler);
            if (currentHandlers.size) return;
            const scrollListener = scrollListeners.get(container);
            scrollListeners.delete(container);
            if (scrollListener) {
                getEventTarget(container).removeEventListener("scroll", scrollListener);
                resizeListeners.get(container)?.();
                window.removeEventListener("resize", scrollListener);
            }
        };
    }
    function scrollTimelineFallback({source, container, axis = "y"}) {
        if (source) container = source;
        const currentTime = {
            value: 0
        };
        const cancel = scrollInfo((info => {
            currentTime.value = info[axis].progress * 100;
        }), {
            container,
            axis
        });
        return {
            currentTime,
            cancel
        };
    }
    const timelineCache = new Map;
    function getTimeline({source, container = document.documentElement, axis = "y"} = {}) {
        if (source) container = source;
        if (!timelineCache.has(container)) timelineCache.set(container, {});
        const elementCache = timelineCache.get(container);
        if (!elementCache[axis]) elementCache[axis] = supportsScrollTimeline() ? new ScrollTimeline({
            source: container,
            axis
        }) : scrollTimelineFallback({
            source: container,
            axis
        });
        return elementCache[axis];
    }
    function isOnScrollWithInfo(onScroll) {
        return onScroll.length === 2;
    }
    function needsElementTracking(options) {
        return options && (options.target || options.offset);
    }
    function scrollFunction(onScroll, options) {
        if (isOnScrollWithInfo(onScroll) || needsElementTracking(options)) return scrollInfo((info => {
            onScroll(info[options.axis].progress, info);
        }), options); else return observeTimeline(onScroll, getTimeline(options));
    }
    function scrollAnimation(animation, options) {
        animation.flatten();
        if (needsElementTracking(options)) {
            animation.pause();
            return scrollInfo((info => {
                animation.time = animation.duration * info[options.axis].progress;
            }), options);
        } else {
            const timeline = getTimeline(options);
            if (animation.attachTimeline) return animation.attachTimeline(timeline, (valueAnimation => {
                valueAnimation.pause();
                return observeTimeline((progress => {
                    valueAnimation.time = valueAnimation.duration * progress;
                }), timeline);
            })); else return noop;
        }
    }
    function scroll_scroll(onScroll, {axis = "y", ...options} = {}) {
        const optionsWithDefaults = {
            axis,
            ...options
        };
        return typeof onScroll === "function" ? scrollFunction(onScroll, optionsWithDefaults) : scrollAnimation(onScroll, optionsWithDefaults);
    }
    class GroupAnimation {
        constructor(animations) {
            this.stop = () => this.runAll("stop");
            this.animations = animations.filter(Boolean);
        }
        get finished() {
            return Promise.all(this.animations.map((animation => animation.finished)));
        }
        getAll(propName) {
            return this.animations[0][propName];
        }
        setAll(propName, newValue) {
            for (let i = 0; i < this.animations.length; i++) this.animations[i][propName] = newValue;
        }
        attachTimeline(timeline, fallback) {
            const subscriptions = this.animations.map((animation => {
                if (supportsScrollTimeline() && animation.attachTimeline) return animation.attachTimeline(timeline); else if (typeof fallback === "function") return fallback(animation);
            }));
            return () => {
                subscriptions.forEach(((cancel, i) => {
                    cancel && cancel();
                    this.animations[i].stop();
                }));
            };
        }
        get time() {
            return this.getAll("time");
        }
        set time(time) {
            this.setAll("time", time);
        }
        get speed() {
            return this.getAll("speed");
        }
        set speed(speed) {
            this.setAll("speed", speed);
        }
        get startTime() {
            return this.getAll("startTime");
        }
        get duration() {
            let max = 0;
            for (let i = 0; i < this.animations.length; i++) max = Math.max(max, this.animations[i].duration);
            return max;
        }
        runAll(methodName) {
            this.animations.forEach((controls => controls[methodName]()));
        }
        flatten() {
            this.runAll("flatten");
        }
        play() {
            this.runAll("play");
        }
        pause() {
            this.runAll("pause");
        }
        cancel() {
            this.runAll("cancel");
        }
        complete() {
            this.runAll("complete");
        }
    }
    class GroupAnimationWithThen extends GroupAnimation {
        then(onResolve, _onReject) {
            return this.finished.finally(onResolve).then((() => {}));
        }
    }
    const secondsToMilliseconds = seconds => seconds * 1e3;
    const millisecondsToSeconds = milliseconds => milliseconds / 1e3;
    const supportsFlags = {};
    function memoSupports(callback, supportsFlag) {
        const memoized = memo(callback);
        return () => supportsFlags[supportsFlag] ?? memoized();
    }
    const supportsLinearEasing = memoSupports((() => {
        try {
            document.createElement("div").animate({
                opacity: 0
            }, {
                easing: "linear(0, 1)"
            });
        } catch (e) {
            return false;
        }
        return true;
    }), "linearEasing");
    const generateLinearEasing = (easing, duration, resolution = 10) => {
        let points = "";
        const numPoints = Math.max(Math.round(duration / resolution), 2);
        for (let i = 0; i < numPoints; i++) points += easing(i / (numPoints - 1)) + ", ";
        return `linear(${points.substring(0, points.length - 2)})`;
    };
    const maxGeneratorDuration = 2e4;
    function calcGeneratorDuration(generator) {
        let duration = 0;
        const timeStep = 50;
        let state = generator.next(duration);
        while (!state.done && duration < maxGeneratorDuration) {
            duration += timeStep;
            state = generator.next(duration);
        }
        return duration >= maxGeneratorDuration ? 1 / 0 : duration;
    }
    function createGeneratorEasing(options, scale = 100, createGenerator) {
        const generator = createGenerator({
            ...options,
            keyframes: [ 0, scale ]
        });
        const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
        return {
            type: "keyframes",
            ease: progress => generator.next(duration * progress).value / scale,
            duration: millisecondsToSeconds(duration)
        };
    }
    const velocitySampleDuration = 5;
    function calcGeneratorVelocity(resolveValue, t, current) {
        const prevT = Math.max(t - velocitySampleDuration, 0);
        return velocityPerSecond(current - resolveValue(prevT), t - prevT);
    }
    const springDefaults = {
        stiffness: 100,
        damping: 10,
        mass: 1,
        velocity: 0,
        duration: 800,
        bounce: .3,
        visualDuration: .3,
        restSpeed: {
            granular: .01,
            default: 2
        },
        restDelta: {
            granular: .005,
            default: .5
        },
        minDuration: .01,
        maxDuration: 10,
        minDamping: .05,
        maxDamping: 1
    };
    const safeMin = .001;
    function findSpring({duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass}) {
        let envelope;
        let derivative;
        warning(duration <= secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less");
        let dampingRatio = 1 - bounce;
        dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
        duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, millisecondsToSeconds(duration));
        if (dampingRatio < 1) {
            envelope = undampedFreq => {
                const exponentialDecay = undampedFreq * dampingRatio;
                const delta = exponentialDecay * duration;
                const a = exponentialDecay - velocity;
                const b = calcAngularFreq(undampedFreq, dampingRatio);
                const c = Math.exp(-delta);
                return safeMin - a / b * c;
            };
            derivative = undampedFreq => {
                const exponentialDecay = undampedFreq * dampingRatio;
                const delta = exponentialDecay * duration;
                const d = delta * velocity + velocity;
                const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq, 2) * duration;
                const f = Math.exp(-delta);
                const g = calcAngularFreq(Math.pow(undampedFreq, 2), dampingRatio);
                const factor = -envelope(undampedFreq) + safeMin > 0 ? -1 : 1;
                return factor * ((d - e) * f) / g;
            };
        } else {
            envelope = undampedFreq => {
                const a = Math.exp(-undampedFreq * duration);
                const b = (undampedFreq - velocity) * duration + 1;
                return -safeMin + a * b;
            };
            derivative = undampedFreq => {
                const a = Math.exp(-undampedFreq * duration);
                const b = (velocity - undampedFreq) * (duration * duration);
                return a * b;
            };
        }
        const initialGuess = 5 / duration;
        const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
        duration = secondsToMilliseconds(duration);
        if (isNaN(undampedFreq)) return {
            stiffness: springDefaults.stiffness,
            damping: springDefaults.damping,
            duration
        }; else {
            const stiffness = Math.pow(undampedFreq, 2) * mass;
            return {
                stiffness,
                damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
                duration
            };
        }
    }
    const rootIterations = 12;
    function approximateRoot(envelope, derivative, initialGuess) {
        let result = initialGuess;
        for (let i = 1; i < rootIterations; i++) result -= envelope(result) / derivative(result);
        return result;
    }
    function calcAngularFreq(undampedFreq, dampingRatio) {
        return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
    }
    const durationKeys = [ "duration", "bounce" ];
    const physicsKeys = [ "stiffness", "damping", "mass" ];
    function isSpringType(options, keys) {
        return keys.some((key => options[key] !== void 0));
    }
    function getSpringOptions(options) {
        let springOptions = {
            velocity: springDefaults.velocity,
            stiffness: springDefaults.stiffness,
            damping: springDefaults.damping,
            mass: springDefaults.mass,
            isResolvedFromDuration: false,
            ...options
        };
        if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) if (options.visualDuration) {
            const visualDuration = options.visualDuration;
            const root = 2 * Math.PI / (visualDuration * 1.2);
            const stiffness = root * root;
            const damping = 2 * clamp(.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
            springOptions = {
                ...springOptions,
                mass: springDefaults.mass,
                stiffness,
                damping
            };
        } else {
            const derived = findSpring(options);
            springOptions = {
                ...springOptions,
                ...derived,
                mass: springDefaults.mass
            };
            springOptions.isResolvedFromDuration = true;
        }
        return springOptions;
    }
    function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
        const options = typeof optionsOrVisualDuration !== "object" ? {
            visualDuration: optionsOrVisualDuration,
            keyframes: [ 0, 1 ],
            bounce
        } : optionsOrVisualDuration;
        let {restSpeed, restDelta} = options;
        const origin = options.keyframes[0];
        const target = options.keyframes[options.keyframes.length - 1];
        const state = {
            done: false,
            value: origin
        };
        const {stiffness, damping, mass, duration, velocity, isResolvedFromDuration} = getSpringOptions({
            ...options,
            velocity: -millisecondsToSeconds(options.velocity || 0)
        });
        const initialVelocity = velocity || 0;
        const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
        const initialDelta = target - origin;
        const undampedAngularFreq = millisecondsToSeconds(Math.sqrt(stiffness / mass));
        const isGranularScale = Math.abs(initialDelta) < 5;
        restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
        restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
        let resolveSpring;
        if (dampingRatio < 1) {
            const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
            resolveSpring = t => {
                const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
                return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
            };
        } else if (dampingRatio === 1) resolveSpring = t => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t); else {
            const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
            resolveSpring = t => {
                const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
                const freqForT = Math.min(dampedAngularFreq * t, 300);
                return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
            };
        }
        const generator = {
            calculatedDuration: isResolvedFromDuration ? duration || null : null,
            next: t => {
                const current = resolveSpring(t);
                if (!isResolvedFromDuration) {
                    let currentVelocity = 0;
                    if (dampingRatio < 1) currentVelocity = t === 0 ? secondsToMilliseconds(initialVelocity) : calcGeneratorVelocity(resolveSpring, t, current);
                    const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
                    const isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta;
                    state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
                } else state.done = t >= duration;
                state.value = state.done ? target : current;
                return state;
            },
            toString: () => {
                const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
                const easing = generateLinearEasing((progress => generator.next(calculatedDuration * progress).value), calculatedDuration, 30);
                return calculatedDuration + "ms " + easing;
            },
            toTransition: () => {}
        };
        return generator;
    }
    spring.applyToOptions = options => {
        const generatorOptions = createGeneratorEasing(options, 100, spring);
        options.ease = supportsLinearEasing() ? generatorOptions.ease : "easeOut";
        options.duration = secondsToMilliseconds(generatorOptions.duration);
        options.type = "keyframes";
        return options;
    };
    function isGenerator(type) {
        return typeof type === "function" && "applyToOptions" in type;
    }
    const wrap = (min, max, v) => {
        const rangeSize = max - min;
        return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
    };
    const isEasingArray = ease => Array.isArray(ease) && typeof ease[0] !== "number";
    function getEasingForSegment(easing, i) {
        return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
    }
    const isMotionValue = value => Boolean(value && value.getVelocity);
    function isDOMKeyframes(keyframes) {
        return typeof keyframes === "object" && !Array.isArray(keyframes);
    }
    function resolveSubjects(subject, keyframes, scope, selectorCache) {
        if (typeof subject === "string" && isDOMKeyframes(keyframes)) return resolveElements(subject, scope, selectorCache); else if (subject instanceof NodeList) return Array.from(subject); else if (Array.isArray(subject)) return subject; else return [ subject ];
    }
    function calculateRepeatDuration(duration, repeat, _repeatDelay) {
        return duration * (repeat + 1);
    }
    function calcNextTime(current, next, prev, labels) {
        if (typeof next === "number") return next; else if (next.startsWith("-") || next.startsWith("+")) return Math.max(0, current + parseFloat(next)); else if (next === "<") return prev; else return labels.get(next) ?? current;
    }
    function addUniqueItem(arr, item) {
        if (arr.indexOf(item) === -1) arr.push(item);
    }
    function removeItem(arr, item) {
        const index = arr.indexOf(item);
        if (index > -1) arr.splice(index, 1);
    }
    function eraseKeyframes(sequence, startTime, endTime) {
        for (let i = 0; i < sequence.length; i++) {
            const keyframe = sequence[i];
            if (keyframe.at > startTime && keyframe.at < endTime) {
                removeItem(sequence, keyframe);
                i--;
            }
        }
    }
    function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
        eraseKeyframes(sequence, startTime, endTime);
        for (let i = 0; i < keyframes.length; i++) sequence.push({
            value: keyframes[i],
            at: mixNumber(startTime, endTime, offset[i]),
            easing: getEasingForSegment(easing, i)
        });
    }
    function normalizeTimes(times, repeat) {
        for (let i = 0; i < times.length; i++) times[i] = times[i] / (repeat + 1);
    }
    function compareByTime(a, b) {
        if (a.at === b.at) {
            if (a.value === null) return 1;
            if (b.value === null) return -1;
            return 0;
        } else return a.at - b.at;
    }
    const defaultSegmentEasing = "easeInOut";
    const MAX_REPEAT = 20;
    function createAnimationsFromSequence(sequence, {defaultTransition = {}, ...sequenceTransition} = {}, scope, generators) {
        const defaultDuration = defaultTransition.duration || .3;
        const animationDefinitions = new Map;
        const sequences = new Map;
        const elementCache = {};
        const timeLabels = new Map;
        let prevTime = 0;
        let currentTime = 0;
        let totalDuration = 0;
        for (let i = 0; i < sequence.length; i++) {
            const segment = sequence[i];
            if (typeof segment === "string") {
                timeLabels.set(segment, currentTime);
                continue;
            } else if (!Array.isArray(segment)) {
                timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
                continue;
            }
            let [subject, keyframes, transition = {}] = segment;
            if (transition.at !== void 0) currentTime = calcNextTime(currentTime, transition.at, prevTime, timeLabels);
            let maxDuration = 0;
            const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
                const valueKeyframesAsList = keyframesAsList(valueKeyframes);
                const {delay = 0, times = defaultOffset(valueKeyframesAsList), type = "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition} = valueTransition;
                let {ease = defaultTransition.ease || "easeOut", duration} = valueTransition;
                const calculatedDelay = typeof delay === "function" ? delay(elementIndex, numSubjects) : delay;
                const numKeyframes = valueKeyframesAsList.length;
                const createGenerator = isGenerator(type) ? type : generators?.[type];
                if (numKeyframes <= 2 && createGenerator) {
                    let absoluteDelta = 100;
                    if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
                        const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
                        absoluteDelta = Math.abs(delta);
                    }
                    const springTransition = {
                        ...remainingTransition
                    };
                    if (duration !== void 0) springTransition.duration = secondsToMilliseconds(duration);
                    const springEasing = createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
                    ease = springEasing.ease;
                    duration = springEasing.duration;
                }
                duration ?? (duration = defaultDuration);
                const startTime = currentTime + calculatedDelay;
                if (times.length === 1 && times[0] === 0) times[1] = 1;
                const remainder = times.length - valueKeyframesAsList.length;
                remainder > 0 && fillOffset(times, remainder);
                valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
                if (repeat) {
                    invariant(repeat < MAX_REPEAT, "Repeat count too high, must be less than 20");
                    duration = calculateRepeatDuration(duration, repeat);
                    const originalKeyframes = [ ...valueKeyframesAsList ];
                    const originalTimes = [ ...times ];
                    ease = Array.isArray(ease) ? [ ...ease ] : [ ease ];
                    const originalEase = [ ...ease ];
                    for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
                        valueKeyframesAsList.push(...originalKeyframes);
                        for (let keyframeIndex = 0; keyframeIndex < originalKeyframes.length; keyframeIndex++) {
                            times.push(originalTimes[keyframeIndex] + (repeatIndex + 1));
                            ease.push(keyframeIndex === 0 ? "linear" : getEasingForSegment(originalEase, keyframeIndex - 1));
                        }
                    }
                    normalizeTimes(times, repeat);
                }
                const targetTime = startTime + duration;
                addKeyframes(valueSequence, valueKeyframesAsList, ease, times, startTime, targetTime);
                maxDuration = Math.max(calculatedDelay + duration, maxDuration);
                totalDuration = Math.max(targetTime, totalDuration);
            };
            if (isMotionValue(subject)) {
                const subjectSequence = getSubjectSequence(subject, sequences);
                resolveValueSequence(keyframes, transition, getValueSequence("default", subjectSequence));
            } else {
                const subjects = resolveSubjects(subject, keyframes, scope, elementCache);
                const numSubjects = subjects.length;
                for (let subjectIndex = 0; subjectIndex < numSubjects; subjectIndex++) {
                    keyframes;
                    transition;
                    const thisSubject = subjects[subjectIndex];
                    const subjectSequence = getSubjectSequence(thisSubject, sequences);
                    for (const key in keyframes) resolveValueSequence(keyframes[key], getValueTransition(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
                }
            }
            prevTime = currentTime;
            currentTime += maxDuration;
        }
        sequences.forEach(((valueSequences, element) => {
            for (const key in valueSequences) {
                const valueSequence = valueSequences[key];
                valueSequence.sort(compareByTime);
                const keyframes = [];
                const valueOffset = [];
                const valueEasing = [];
                for (let i = 0; i < valueSequence.length; i++) {
                    const {at, value, easing} = valueSequence[i];
                    keyframes.push(value);
                    valueOffset.push(progress(0, totalDuration, at));
                    valueEasing.push(easing || "easeOut");
                }
                if (valueOffset[0] !== 0) {
                    valueOffset.unshift(0);
                    keyframes.unshift(keyframes[0]);
                    valueEasing.unshift(defaultSegmentEasing);
                }
                if (valueOffset[valueOffset.length - 1] !== 1) {
                    valueOffset.push(1);
                    keyframes.push(null);
                }
                if (!animationDefinitions.has(element)) animationDefinitions.set(element, {
                    keyframes: {},
                    transition: {}
                });
                const definition = animationDefinitions.get(element);
                definition.keyframes[key] = keyframes;
                definition.transition[key] = {
                    ...defaultTransition,
                    duration: totalDuration,
                    ease: valueEasing,
                    times: valueOffset,
                    ...sequenceTransition
                };
            }
        }));
        return animationDefinitions;
    }
    function getSubjectSequence(subject, sequences) {
        !sequences.has(subject) && sequences.set(subject, {});
        return sequences.get(subject);
    }
    function getValueSequence(name, sequences) {
        if (!sequences[name]) sequences[name] = [];
        return sequences[name];
    }
    function keyframesAsList(keyframes) {
        return Array.isArray(keyframes) ? keyframes : [ keyframes ];
    }
    function getValueTransition(transition, key) {
        return transition && transition[key] ? {
            ...transition,
            ...transition[key]
        } : {
            ...transition
        };
    }
    const isNumber = keyframe => typeof keyframe === "number";
    const isNumberKeyframesArray = keyframes => keyframes.every(isNumber);
    const visualElementStore = new WeakMap;
    function get_value_transition_getValueTransition(transition, key) {
        return transition?.[key] ?? transition?.["default"] ?? transition;
    }
    const transformPropOrder = [ "transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY" ];
    const transformProps = new Set(transformPropOrder);
    const positionalKeys = new Set([ "width", "height", "top", "left", "right", "bottom", ...transformPropOrder ]);
    class SubscriptionManager {
        constructor() {
            this.subscriptions = [];
        }
        add(handler) {
            addUniqueItem(this.subscriptions, handler);
            return () => removeItem(this.subscriptions, handler);
        }
        notify(a, b, c) {
            const numSubscriptions = this.subscriptions.length;
            if (!numSubscriptions) return;
            if (numSubscriptions === 1) this.subscriptions[0](a, b, c); else for (let i = 0; i < numSubscriptions; i++) {
                const handler = this.subscriptions[i];
                handler && handler(a, b, c);
            }
        }
        getSize() {
            return this.subscriptions.length;
        }
        clear() {
            this.subscriptions.length = 0;
        }
    }
    let sync_time_now;
    function clearTime() {
        sync_time_now = void 0;
    }
    const time = {
        now: () => {
            if (sync_time_now === void 0) time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
            return sync_time_now;
        },
        set: newTime => {
            sync_time_now = newTime;
            queueMicrotask(clearTime);
        }
    };
    const MAX_VELOCITY_DELTA = 30;
    const isFloat = value => !isNaN(parseFloat(value));
    const collectMotionValues = {
        current: void 0
    };
    class MotionValue {
        constructor(init, options = {}) {
            this.version = "12.6.5";
            this.canTrackVelocity = null;
            this.events = {};
            this.updateAndNotify = (v, render = true) => {
                const currentTime = time.now();
                if (this.updatedAt !== currentTime) this.setPrevFrameValue();
                this.prev = this.current;
                this.setCurrent(v);
                if (this.current !== this.prev && this.events.change) this.events.change.notify(this.current);
                if (render && this.events.renderRequest) this.events.renderRequest.notify(this.current);
            };
            this.hasAnimated = false;
            this.setCurrent(init);
            this.owner = options.owner;
        }
        setCurrent(current) {
            this.current = current;
            this.updatedAt = time.now();
            if (this.canTrackVelocity === null && current !== void 0) this.canTrackVelocity = isFloat(this.current);
        }
        setPrevFrameValue(prevFrameValue = this.current) {
            this.prevFrameValue = prevFrameValue;
            this.prevUpdatedAt = this.updatedAt;
        }
        onChange(subscription) {
            if (false) ;
            return this.on("change", subscription);
        }
        on(eventName, callback) {
            if (!this.events[eventName]) this.events[eventName] = new SubscriptionManager;
            const unsubscribe = this.events[eventName].add(callback);
            if (eventName === "change") return () => {
                unsubscribe();
                frame_frame.read((() => {
                    if (!this.events.change.getSize()) this.stop();
                }));
            };
            return unsubscribe;
        }
        clearListeners() {
            for (const eventManagers in this.events) this.events[eventManagers].clear();
        }
        attach(passiveEffect, stopPassiveEffect) {
            this.passiveEffect = passiveEffect;
            this.stopPassiveEffect = stopPassiveEffect;
        }
        set(v, render = true) {
            if (!render || !this.passiveEffect) this.updateAndNotify(v, render); else this.passiveEffect(v, this.updateAndNotify);
        }
        setWithVelocity(prev, current, delta) {
            this.set(current);
            this.prev = void 0;
            this.prevFrameValue = prev;
            this.prevUpdatedAt = this.updatedAt - delta;
        }
        jump(v, endAnimation = true) {
            this.updateAndNotify(v);
            this.prev = v;
            this.prevUpdatedAt = this.prevFrameValue = void 0;
            endAnimation && this.stop();
            if (this.stopPassiveEffect) this.stopPassiveEffect();
        }
        get() {
            if (collectMotionValues.current) collectMotionValues.current.push(this);
            return this.current;
        }
        getPrevious() {
            return this.prev;
        }
        getVelocity() {
            const currentTime = time.now();
            if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) return 0;
            const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
            return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
        }
        start(startAnimation) {
            this.stop();
            return new Promise((resolve => {
                this.hasAnimated = true;
                this.animation = startAnimation(resolve);
                if (this.events.animationStart) this.events.animationStart.notify();
            })).then((() => {
                if (this.events.animationComplete) this.events.animationComplete.notify();
                this.clearAnimation();
            }));
        }
        stop() {
            if (this.animation) {
                this.animation.stop();
                if (this.events.animationCancel) this.events.animationCancel.notify();
            }
            this.clearAnimation();
        }
        isAnimating() {
            return !!this.animation;
        }
        clearAnimation() {
            delete this.animation;
        }
        destroy() {
            this.clearListeners();
            this.stop();
            if (this.stopPassiveEffect) this.stopPassiveEffect();
        }
    }
    function motionValue(init, options) {
        return new MotionValue(init, options);
    }
    const isKeyframesTarget = v => Array.isArray(v);
    const resolveFinalValueInKeyframes = v => isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
    function getValueState(visualElement) {
        const state = [ {}, {} ];
        visualElement?.values.forEach(((value, key) => {
            state[0][key] = value.get();
            state[1][key] = value.getVelocity();
        }));
        return state;
    }
    function resolveVariantFromProps(props, definition, custom, visualElement) {
        if (typeof definition === "function") {
            const [current, velocity] = getValueState(visualElement);
            definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
        }
        if (typeof definition === "string") definition = props.variants && props.variants[definition];
        if (typeof definition === "function") {
            const [current, velocity] = getValueState(visualElement);
            definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
        }
        return definition;
    }
    function resolveVariant(visualElement, definition, custom) {
        const props = visualElement.getProps();
        return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
    }
    function setMotionValue(visualElement, key, value) {
        if (visualElement.hasValue(key)) visualElement.getValue(key).set(value); else visualElement.addValue(key, motionValue(value));
    }
    function setTarget(visualElement, definition) {
        const resolved = resolveVariant(visualElement, definition);
        let {transitionEnd = {}, transition = {}, ...target} = resolved || {};
        target = {
            ...target,
            ...transitionEnd
        };
        for (const key in target) {
            const value = resolveFinalValueInKeyframes(target[key]);
            setMotionValue(visualElement, key, value);
        }
    }
    function isWillChangeMotionValue(value) {
        return Boolean(isMotionValue(value) && value.add);
    }
    function addValueToWillChange(visualElement, key) {
        const willChange = visualElement.getValue("willChange");
        if (isWillChangeMotionValue(willChange)) return willChange.add(key); else if (!willChange && MotionGlobalConfig.WillChange) {
            const newWillChange = new MotionGlobalConfig.WillChange("auto");
            visualElement.addValue("willChange", newWillChange);
            newWillChange.add(key);
        }
    }
    const camelToDash = str => str.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
    const optimizedAppearDataId = "framerAppearId";
    const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
    function getOptimisedAppearId(visualElement) {
        return visualElement.props[optimizedAppearDataAttribute];
    }
    const instantAnimationState = {
        current: false
    };
    const activeAnimations = {
        layout: 0,
        mainThread: 0,
        waapi: 0
    };
    const isBezierDefinition = easing => Array.isArray(easing) && typeof easing[0] === "number";
    const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
    const supportedWaapiEasing = {
        linear: "linear",
        ease: "ease",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
        circIn: cubicBezierAsString([ 0, .65, .55, 1 ]),
        circOut: cubicBezierAsString([ .55, 0, 1, .45 ]),
        backIn: cubicBezierAsString([ .31, .01, .66, -.59 ]),
        backOut: cubicBezierAsString([ .33, 1.53, .69, .99 ])
    };
    function mapEasingToNativeEasing(easing, duration) {
        if (!easing) return; else if (typeof easing === "function" && supportsLinearEasing()) return generateLinearEasing(easing, duration); else if (isBezierDefinition(easing)) return cubicBezierAsString(easing); else if (Array.isArray(easing)) return easing.map((segmentEasing => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut)); else return supportedWaapiEasing[easing];
    }
    function startWaapiAnimation(element, valueName, keyframes, {delay = 0, duration = 300, repeat = 0, repeatType = "loop", ease = "easeInOut", times} = {}, pseudoElement = void 0) {
        const keyframeOptions = {
            [valueName]: keyframes
        };
        if (times) keyframeOptions.offset = times;
        const easing = mapEasingToNativeEasing(ease, duration);
        if (Array.isArray(easing)) keyframeOptions.easing = easing;
        if (statsBuffer.value) activeAnimations.waapi++;
        const animation = element.animate(keyframeOptions, {
            delay,
            duration,
            easing: !Array.isArray(easing) ? easing : "linear",
            fill: "both",
            iterations: repeat + 1,
            direction: repeatType === "reverse" ? "alternate" : "normal",
            pseudoElement
        });
        if (statsBuffer.value) animation.finished.finally((() => {
            activeAnimations.waapi--;
        }));
        return animation;
    }
    function isWaapiSupportedEasing(easing) {
        return Boolean(typeof easing === "function" && supportsLinearEasing() || !easing || typeof easing === "string" && (easing in supportedWaapiEasing || supportsLinearEasing()) || isBezierDefinition(easing) || Array.isArray(easing) && easing.every(isWaapiSupportedEasing));
    }
    function attachTimeline(animation, timeline) {
        animation.timeline = timeline;
        animation.onfinish = null;
    }
    const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
    const subdivisionPrecision = 1e-7;
    const subdivisionMaxIterations = 12;
    function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
        let currentX;
        let currentT;
        let i = 0;
        do {
            currentT = lowerBound + (upperBound - lowerBound) / 2;
            currentX = calcBezier(currentT, mX1, mX2) - x;
            if (currentX > 0) upperBound = currentT; else lowerBound = currentT;
        } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
        return currentT;
    }
    function cubicBezier(mX1, mY1, mX2, mY2) {
        if (mX1 === mY1 && mX2 === mY2) return noop;
        const getTForX = aX => binarySubdivide(aX, 0, 1, mX1, mX2);
        return t => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
    }
    const mirrorEasing = easing => p => p <= .5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
    const reverseEasing = easing => p => 1 - easing(1 - p);
    const backOut = cubicBezier(.33, 1.53, .69, .99);
    const backIn = reverseEasing(backOut);
    const backInOut = mirrorEasing(backIn);
    const anticipate = p => (p *= 2) < 1 ? .5 * backIn(p) : .5 * (2 - Math.pow(2, -10 * (p - 1)));
    const circIn = p => 1 - Math.sin(Math.acos(p));
    const circOut = reverseEasing(circIn);
    const circInOut = mirrorEasing(circIn);
    const isZeroValueString = v => /^0[^.\s]+$/u.test(v);
    function isNone(value) {
        if (typeof value === "number") return value === 0; else if (value !== null) return value === "none" || value === "0" || isZeroValueString(value); else return true;
    }
    const maxDefaults = new Set([ "brightness", "contrast", "saturate", "opacity" ]);
    function applyDefaultFilter(v) {
        const [name, value] = v.slice(0, -1).split("(");
        if (name === "drop-shadow") return v;
        const [number] = value.match(floatRegex) || [];
        if (!number) return v;
        const unit = value.replace(number, "");
        let defaultValue = maxDefaults.has(name) ? 1 : 0;
        if (number !== value) defaultValue *= 100;
        return name + "(" + defaultValue + unit + ")";
    }
    const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
    const filter = {
        ...complex,
        getAnimatableNone: v => {
            const functions = v.match(functionRegex);
            return functions ? functions.map(applyDefaultFilter).join(" ") : v;
        }
    };
    const browserNumberValueTypes = {
        borderWidth: px,
        borderTopWidth: px,
        borderRightWidth: px,
        borderBottomWidth: px,
        borderLeftWidth: px,
        borderRadius: px,
        radius: px,
        borderTopLeftRadius: px,
        borderTopRightRadius: px,
        borderBottomRightRadius: px,
        borderBottomLeftRadius: px,
        width: px,
        maxWidth: px,
        height: px,
        maxHeight: px,
        top: px,
        right: px,
        bottom: px,
        left: px,
        padding: px,
        paddingTop: px,
        paddingRight: px,
        paddingBottom: px,
        paddingLeft: px,
        margin: px,
        marginTop: px,
        marginRight: px,
        marginBottom: px,
        marginLeft: px,
        backgroundPositionX: px,
        backgroundPositionY: px
    };
    const transformValueTypes = {
        rotate: degrees,
        rotateX: degrees,
        rotateY: degrees,
        rotateZ: degrees,
        scale,
        scaleX: scale,
        scaleY: scale,
        scaleZ: scale,
        skew: degrees,
        skewX: degrees,
        skewY: degrees,
        distance: px,
        translateX: px,
        translateY: px,
        translateZ: px,
        x: px,
        y: px,
        z: px,
        perspective: px,
        transformPerspective: px,
        opacity: alpha,
        originX: progressPercentage,
        originY: progressPercentage,
        originZ: px
    };
    const type_int_int = {
        ...number,
        transform: Math.round
    };
    const numberValueTypes = {
        ...browserNumberValueTypes,
        ...transformValueTypes,
        zIndex: type_int_int,
        size: px,
        fillOpacity: alpha,
        strokeOpacity: alpha,
        numOctaves: type_int_int
    };
    const defaultValueTypes = {
        ...numberValueTypes,
        color,
        backgroundColor: color,
        outlineColor: color,
        fill: color,
        stroke: color,
        borderColor: color,
        borderTopColor: color,
        borderRightColor: color,
        borderBottomColor: color,
        borderLeftColor: color,
        filter,
        WebkitFilter: filter
    };
    const getDefaultValueType = key => defaultValueTypes[key];
    function animatable_none_getAnimatableNone(key, value) {
        let defaultValueType = getDefaultValueType(key);
        if (defaultValueType !== filter) defaultValueType = complex;
        return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
    }
    const invalidTemplates = new Set([ "auto", "none", "0" ]);
    function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
        let i = 0;
        let animatableTemplate;
        while (i < unresolvedKeyframes.length && !animatableTemplate) {
            const keyframe = unresolvedKeyframes[i];
            if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) animatableTemplate = unresolvedKeyframes[i];
            i++;
        }
        if (animatableTemplate && name) for (const noneIndex of noneKeyframeIndexes) unresolvedKeyframes[noneIndex] = animatable_none_getAnimatableNone(name, animatableTemplate);
    }
    const radToDeg = rad => rad * 180 / Math.PI;
    const rotate = v => {
        const angle = radToDeg(Math.atan2(v[1], v[0]));
        return rebaseAngle(angle);
    };
    const matrix2dParsers = {
        x: 4,
        y: 5,
        translateX: 4,
        translateY: 5,
        scaleX: 0,
        scaleY: 3,
        scale: v => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
        rotate,
        rotateZ: rotate,
        skewX: v => radToDeg(Math.atan(v[1])),
        skewY: v => radToDeg(Math.atan(v[2])),
        skew: v => (Math.abs(v[1]) + Math.abs(v[2])) / 2
    };
    const rebaseAngle = angle => {
        angle %= 360;
        if (angle < 0) angle += 360;
        return angle;
    };
    const rotateZ = rotate;
    const scaleX = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    const scaleY = v => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
    const matrix3dParsers = {
        x: 12,
        y: 13,
        z: 14,
        translateX: 12,
        translateY: 13,
        translateZ: 14,
        scaleX,
        scaleY,
        scale: v => (scaleX(v) + scaleY(v)) / 2,
        rotateX: v => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
        rotateY: v => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
        rotateZ,
        rotate: rotateZ,
        skewX: v => radToDeg(Math.atan(v[4])),
        skewY: v => radToDeg(Math.atan(v[1])),
        skew: v => (Math.abs(v[1]) + Math.abs(v[4])) / 2
    };
    function defaultTransformValue(name) {
        return name.includes("scale") ? 1 : 0;
    }
    function parseValueFromTransform(transform, name) {
        if (!transform || transform === "none") return defaultTransformValue(name);
        const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
        let parsers;
        let match;
        if (matrix3dMatch) {
            parsers = matrix3dParsers;
            match = matrix3dMatch;
        } else {
            const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
            parsers = matrix2dParsers;
            match = matrix2dMatch;
        }
        if (!match) return defaultTransformValue(name);
        const valueParser = parsers[name];
        const values = match[1].split(",").map(convertTransformToNumber);
        return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
    }
    const readTransformValue = (instance, name) => {
        const {transform = "none"} = getComputedStyle(instance);
        return parseValueFromTransform(transform, name);
    };
    function convertTransformToNumber(value) {
        return parseFloat(value.trim());
    }
    const isNumOrPxType = v => v === number || v === px;
    const transformKeys = new Set([ "x", "y", "z" ]);
    const nonTranslationalTransformKeys = transformPropOrder.filter((key => !transformKeys.has(key)));
    function removeNonTranslationalTransform(visualElement) {
        const removedTransforms = [];
        nonTranslationalTransformKeys.forEach((key => {
            const value = visualElement.getValue(key);
            if (value !== void 0) {
                removedTransforms.push([ key, value.get() ]);
                value.set(key.startsWith("scale") ? 1 : 0);
            }
        }));
        return removedTransforms;
    }
    const positionalValues = {
        width: ({x}, {paddingLeft = "0", paddingRight = "0"}) => x.max - x.min - parseFloat(paddingLeft) - parseFloat(paddingRight),
        height: ({y}, {paddingTop = "0", paddingBottom = "0"}) => y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom),
        top: (_bbox, {top}) => parseFloat(top),
        left: (_bbox, {left}) => parseFloat(left),
        bottom: ({y}, {top}) => parseFloat(top) + (y.max - y.min),
        right: ({x}, {left}) => parseFloat(left) + (x.max - x.min),
        x: (_bbox, {transform}) => parseValueFromTransform(transform, "x"),
        y: (_bbox, {transform}) => parseValueFromTransform(transform, "y")
    };
    positionalValues.translateX = positionalValues.x;
    positionalValues.translateY = positionalValues.y;
    const toResolve = new Set;
    let isScheduled = false;
    let anyNeedsMeasurement = false;
    function measureAllKeyframes() {
        if (anyNeedsMeasurement) {
            const resolversToMeasure = Array.from(toResolve).filter((resolver => resolver.needsMeasurement));
            const elementsToMeasure = new Set(resolversToMeasure.map((resolver => resolver.element)));
            const transformsToRestore = new Map;
            elementsToMeasure.forEach((element => {
                const removedTransforms = removeNonTranslationalTransform(element);
                if (!removedTransforms.length) return;
                transformsToRestore.set(element, removedTransforms);
                element.render();
            }));
            resolversToMeasure.forEach((resolver => resolver.measureInitialState()));
            elementsToMeasure.forEach((element => {
                element.render();
                const restore = transformsToRestore.get(element);
                if (restore) restore.forEach((([key, value]) => {
                    element.getValue(key)?.set(value);
                }));
            }));
            resolversToMeasure.forEach((resolver => resolver.measureEndState()));
            resolversToMeasure.forEach((resolver => {
                if (resolver.suspendedScrollY !== void 0) window.scrollTo(0, resolver.suspendedScrollY);
            }));
        }
        anyNeedsMeasurement = false;
        isScheduled = false;
        toResolve.forEach((resolver => resolver.complete()));
        toResolve.clear();
    }
    function readAllKeyframes() {
        toResolve.forEach((resolver => {
            resolver.readKeyframes();
            if (resolver.needsMeasurement) anyNeedsMeasurement = true;
        }));
    }
    function flushKeyframeResolvers() {
        readAllKeyframes();
        measureAllKeyframes();
    }
    class KeyframeResolver {
        constructor(unresolvedKeyframes, onComplete, name, motionValue, element, isAsync = false) {
            this.isComplete = false;
            this.isAsync = false;
            this.needsMeasurement = false;
            this.isScheduled = false;
            this.unresolvedKeyframes = [ ...unresolvedKeyframes ];
            this.onComplete = onComplete;
            this.name = name;
            this.motionValue = motionValue;
            this.element = element;
            this.isAsync = isAsync;
        }
        scheduleResolve() {
            this.isScheduled = true;
            if (this.isAsync) {
                toResolve.add(this);
                if (!isScheduled) {
                    isScheduled = true;
                    frame_frame.read(readAllKeyframes);
                    frame_frame.resolveKeyframes(measureAllKeyframes);
                }
            } else {
                this.readKeyframes();
                this.complete();
            }
        }
        readKeyframes() {
            const {unresolvedKeyframes, name, element, motionValue} = this;
            for (let i = 0; i < unresolvedKeyframes.length; i++) if (unresolvedKeyframes[i] === null) if (i === 0) {
                const currentValue = motionValue?.get();
                const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
                if (currentValue !== void 0) unresolvedKeyframes[0] = currentValue; else if (element && name) {
                    const valueAsRead = element.readValue(name, finalKeyframe);
                    if (valueAsRead !== void 0 && valueAsRead !== null) unresolvedKeyframes[0] = valueAsRead;
                }
                if (unresolvedKeyframes[0] === void 0) unresolvedKeyframes[0] = finalKeyframe;
                if (motionValue && currentValue === void 0) motionValue.set(unresolvedKeyframes[0]);
            } else unresolvedKeyframes[i] = unresolvedKeyframes[i - 1];
        }
        setFinalKeyframe() {}
        measureInitialState() {}
        renderEndStyles() {}
        measureEndState() {}
        complete() {
            this.isComplete = true;
            this.onComplete(this.unresolvedKeyframes, this.finalKeyframe);
            toResolve.delete(this);
        }
        cancel() {
            if (!this.isComplete) {
                this.isScheduled = false;
                toResolve.delete(this);
            }
        }
        resume() {
            if (!this.isComplete) this.scheduleResolve();
        }
    }
    const isNumericalString = v => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
    const splitCSSVariableRegex = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
    function parseCSSVariable(current) {
        const match = splitCSSVariableRegex.exec(current);
        if (!match) return [ ,  ];
        const [, token1, token2, fallback] = match;
        return [ `--${token1 ?? token2}`, fallback ];
    }
    const maxDepth = 4;
    function getVariableValue(current, element, depth = 1) {
        invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`);
        const [token, fallback] = parseCSSVariable(current);
        if (!token) return;
        const resolved = window.getComputedStyle(element).getPropertyValue(token);
        if (resolved) {
            const trimmed = resolved.trim();
            return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
        }
        return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
    }
    const testValueType = v => type => type.test(v);
    const auto = {
        test: v => v === "auto",
        parse: v => v
    };
    const dimensionValueTypes = [ number, px, percent, degrees, vw, vh, auto ];
    const findDimensionValueType = v => dimensionValueTypes.find(testValueType(v));
    class DOMKeyframesResolver extends KeyframeResolver {
        constructor(unresolvedKeyframes, onComplete, name, motionValue, element) {
            super(unresolvedKeyframes, onComplete, name, motionValue, element, true);
        }
        readKeyframes() {
            const {unresolvedKeyframes, element, name} = this;
            if (!element || !element.current) return;
            super.readKeyframes();
            for (let i = 0; i < unresolvedKeyframes.length; i++) {
                let keyframe = unresolvedKeyframes[i];
                if (typeof keyframe === "string") {
                    keyframe = keyframe.trim();
                    if (isCSSVariableToken(keyframe)) {
                        const resolved = getVariableValue(keyframe, element.current);
                        if (resolved !== void 0) unresolvedKeyframes[i] = resolved;
                        if (i === unresolvedKeyframes.length - 1) this.finalKeyframe = keyframe;
                    }
                }
            }
            this.resolveNoneKeyframes();
            if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) return;
            const [origin, target] = unresolvedKeyframes;
            const originType = findDimensionValueType(origin);
            const targetType = findDimensionValueType(target);
            if (originType === targetType) return;
            if (isNumOrPxType(originType) && isNumOrPxType(targetType)) for (let i = 0; i < unresolvedKeyframes.length; i++) {
                const value = unresolvedKeyframes[i];
                if (typeof value === "string") unresolvedKeyframes[i] = parseFloat(value);
            } else this.needsMeasurement = true;
        }
        resolveNoneKeyframes() {
            const {unresolvedKeyframes, name} = this;
            const noneKeyframeIndexes = [];
            for (let i = 0; i < unresolvedKeyframes.length; i++) if (isNone(unresolvedKeyframes[i])) noneKeyframeIndexes.push(i);
            if (noneKeyframeIndexes.length) makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
        }
        measureInitialState() {
            const {element, unresolvedKeyframes, name} = this;
            if (!element || !element.current) return;
            if (name === "height") this.suspendedScrollY = window.pageYOffset;
            this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
            unresolvedKeyframes[0] = this.measuredOrigin;
            const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
            if (measureKeyframe !== void 0) element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
        }
        measureEndState() {
            const {element, name, unresolvedKeyframes} = this;
            if (!element || !element.current) return;
            const value = element.getValue(name);
            value && value.jump(this.measuredOrigin, false);
            const finalKeyframeIndex = unresolvedKeyframes.length - 1;
            const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
            unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
            if (finalKeyframe !== null && this.finalKeyframe === void 0) this.finalKeyframe = finalKeyframe;
            if (this.removedTransforms?.length) this.removedTransforms.forEach((([unsetTransformName, unsetTransformValue]) => {
                element.getValue(unsetTransformName).set(unsetTransformValue);
            }));
            this.resolveNoneKeyframes();
        }
    }
    const isAnimatable = (value, name) => {
        if (name === "zIndex") return false;
        if (typeof value === "number" || Array.isArray(value)) return true;
        if (typeof value === "string" && (complex.test(value) || value === "0") && !value.startsWith("url(")) return true;
        return false;
    };
    function hasKeyframesChanged(keyframes) {
        const current = keyframes[0];
        if (keyframes.length === 1) return true;
        for (let i = 0; i < keyframes.length; i++) if (keyframes[i] !== current) return true;
    }
    function canAnimate(keyframes, name, type, velocity) {
        const originKeyframe = keyframes[0];
        if (originKeyframe === null) return false;
        if (name === "display" || name === "visibility") return true;
        const targetKeyframe = keyframes[keyframes.length - 1];
        const isOriginAnimatable = isAnimatable(originKeyframe, name);
        const isTargetAnimatable = isAnimatable(targetKeyframe, name);
        warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". ${originKeyframe} is not an animatable value - to enable this animation set ${originKeyframe} to a value animatable to ${targetKeyframe} via the \`style\` property.`);
        if (!isOriginAnimatable || !isTargetAnimatable) return false;
        return hasKeyframesChanged(keyframes) || (type === "spring" || isGenerator(type)) && velocity;
    }
    const isNotNull = value => value !== null;
    function getFinalKeyframe(keyframes, {repeat, repeatType = "loop"}, finalKeyframe) {
        const resolvedKeyframes = keyframes.filter(isNotNull);
        const index = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
        return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
    }
    const MAX_RESOLVE_DELAY = 40;
    class BaseAnimation {
        constructor({autoplay = true, delay = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", ...options}) {
            this.isStopped = false;
            this.hasAttemptedResolve = false;
            this.createdAt = time.now();
            this.options = {
                autoplay,
                delay,
                type,
                repeat,
                repeatDelay,
                repeatType,
                ...options
            };
            this.updateFinishedPromise();
        }
        calcStartTime() {
            if (!this.resolvedAt) return this.createdAt;
            return this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt;
        }
        get resolved() {
            if (!this._resolved && !this.hasAttemptedResolve) flushKeyframeResolvers();
            return this._resolved;
        }
        onKeyframesResolved(keyframes, finalKeyframe) {
            this.resolvedAt = time.now();
            this.hasAttemptedResolve = true;
            const {name, type, velocity, delay, onComplete, onUpdate, isGenerator} = this.options;
            if (!isGenerator && !canAnimate(keyframes, name, type, velocity)) if (instantAnimationState.current || !delay) {
                onUpdate && onUpdate(getFinalKeyframe(keyframes, this.options, finalKeyframe));
                onComplete && onComplete();
                this.resolveFinishedPromise();
                return;
            } else this.options.duration = 0;
            const resolvedAnimation = this.initPlayback(keyframes, finalKeyframe);
            if (resolvedAnimation === false) return;
            this._resolved = {
                keyframes,
                finalKeyframe,
                ...resolvedAnimation
            };
            this.onPostResolved();
        }
        onPostResolved() {}
        then(resolve, reject) {
            return this.currentFinishedPromise.then(resolve, reject);
        }
        flatten() {
            if (!this.options.allowFlatten) return;
            this.options.type = "keyframes";
            this.options.ease = "linear";
        }
        updateFinishedPromise() {
            this.currentFinishedPromise = new Promise((resolve => {
                this.resolveFinishedPromise = resolve;
            }));
        }
    }
    function inertia({keyframes, velocity = 0, power = .8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = .5, restSpeed}) {
        const origin = keyframes[0];
        const state = {
            done: false,
            value: origin
        };
        const isOutOfBounds = v => min !== void 0 && v < min || max !== void 0 && v > max;
        const nearestBoundary = v => {
            if (min === void 0) return max;
            if (max === void 0) return min;
            return Math.abs(min - v) < Math.abs(max - v) ? min : max;
        };
        let amplitude = power * velocity;
        const ideal = origin + amplitude;
        const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
        if (target !== ideal) amplitude = target - origin;
        const calcDelta = t => -amplitude * Math.exp(-t / timeConstant);
        const calcLatest = t => target + calcDelta(t);
        const applyFriction = t => {
            const delta = calcDelta(t);
            const latest = calcLatest(t);
            state.done = Math.abs(delta) <= restDelta;
            state.value = state.done ? target : latest;
        };
        let timeReachedBoundary;
        let spring$1;
        const checkCatchBoundary = t => {
            if (!isOutOfBounds(state.value)) return;
            timeReachedBoundary = t;
            spring$1 = spring({
                keyframes: [ state.value, nearestBoundary(state.value) ],
                velocity: calcGeneratorVelocity(calcLatest, t, state.value),
                damping: bounceDamping,
                stiffness: bounceStiffness,
                restDelta,
                restSpeed
            });
        };
        checkCatchBoundary(0);
        return {
            calculatedDuration: null,
            next: t => {
                let hasUpdatedFrame = false;
                if (!spring$1 && timeReachedBoundary === void 0) {
                    hasUpdatedFrame = true;
                    applyFriction(t);
                    checkCatchBoundary(t);
                }
                if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) return spring$1.next(t - timeReachedBoundary); else {
                    !hasUpdatedFrame && applyFriction(t);
                    return state;
                }
            }
        };
    }
    const easeIn = cubicBezier(.42, 0, 1, 1);
    const easeOut = cubicBezier(0, 0, .58, 1);
    const easeInOut = cubicBezier(.42, 0, .58, 1);
    const easingLookup = {
        linear: noop,
        easeIn,
        easeInOut,
        easeOut,
        circIn,
        circInOut,
        circOut,
        backIn,
        backInOut,
        backOut,
        anticipate
    };
    const easingDefinitionToFunction = definition => {
        if (isBezierDefinition(definition)) {
            invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`);
            const [x1, y1, x2, y2] = definition;
            return cubicBezier(x1, y1, x2, y2);
        } else if (typeof definition === "string") {
            invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`);
            return easingLookup[definition];
        }
        return definition;
    };
    function convertOffsetToTimes(offset, duration) {
        return offset.map((o => o * duration));
    }
    function defaultEasing(values, easing) {
        return values.map((() => easing || easeInOut)).splice(0, values.length - 1);
    }
    function keyframes({duration = 300, keyframes: keyframeValues, times, ease = "easeInOut"}) {
        const easingFunctions = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
        const state = {
            done: false,
            value: keyframeValues[0]
        };
        const absoluteTimes = convertOffsetToTimes(times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues), duration);
        const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
            ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
        });
        return {
            calculatedDuration: duration,
            next: t => {
                state.value = mapTimeToKeyframe(t);
                state.done = t >= duration;
                return state;
            }
        };
    }
    const frameloopDriver = update => {
        const passTimestamp = ({timestamp}) => update(timestamp);
        return {
            start: () => frame_frame.update(passTimestamp, true),
            stop: () => cancelFrame(passTimestamp),
            now: () => frameData.isProcessing ? frameData.timestamp : time.now()
        };
    };
    const generators = {
        decay: inertia,
        inertia,
        tween: keyframes,
        keyframes,
        spring
    };
    const percentToProgress = percent => percent / 100;
    class MainThreadAnimation extends BaseAnimation {
        constructor(options) {
            super(options);
            this.holdTime = null;
            this.cancelTime = null;
            this.currentTime = 0;
            this.playbackSpeed = 1;
            this.pendingPlayState = "running";
            this.startTime = null;
            this.state = "idle";
            this.stop = () => {
                this.resolver.cancel();
                this.isStopped = true;
                if (this.state === "idle") return;
                this.teardown();
                const {onStop} = this.options;
                onStop && onStop();
            };
            const {name, motionValue, element, keyframes} = this.options;
            const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
            const onResolved = (resolvedKeyframes, finalKeyframe) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe);
            this.resolver = new KeyframeResolver$1(keyframes, onResolved, name, motionValue, element);
            this.resolver.scheduleResolve();
        }
        flatten() {
            super.flatten();
            if (this._resolved) Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
        }
        initPlayback(keyframes$1) {
            const {type = "keyframes", repeat = 0, repeatDelay = 0, repeatType, velocity = 0} = this.options;
            const generatorFactory = isGenerator(type) ? type : generators[type] || keyframes;
            let mapPercentToKeyframes;
            let mirroredGenerator;
            if (false) ;
            if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
                mapPercentToKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
                keyframes$1 = [ 0, 100 ];
            }
            const generator = generatorFactory({
                ...this.options,
                keyframes: keyframes$1
            });
            if (repeatType === "mirror") mirroredGenerator = generatorFactory({
                ...this.options,
                keyframes: [ ...keyframes$1 ].reverse(),
                velocity: -velocity
            });
            if (generator.calculatedDuration === null) generator.calculatedDuration = calcGeneratorDuration(generator);
            const {calculatedDuration} = generator;
            const resolvedDuration = calculatedDuration + repeatDelay;
            const totalDuration = resolvedDuration * (repeat + 1) - repeatDelay;
            return {
                generator,
                mirroredGenerator,
                mapPercentToKeyframes,
                calculatedDuration,
                resolvedDuration,
                totalDuration
            };
        }
        onPostResolved() {
            const {autoplay = true} = this.options;
            activeAnimations.mainThread++;
            this.play();
            if (this.pendingPlayState === "paused" || !autoplay) this.pause(); else this.state = this.pendingPlayState;
        }
        tick(timestamp, sample = false) {
            const {resolved} = this;
            if (!resolved) {
                const {keyframes} = this.options;
                return {
                    done: true,
                    value: keyframes[keyframes.length - 1]
                };
            }
            const {finalKeyframe, generator, mirroredGenerator, mapPercentToKeyframes, keyframes, calculatedDuration, totalDuration, resolvedDuration} = resolved;
            if (this.startTime === null) return generator.next(0);
            const {delay, repeat, repeatType, repeatDelay, onUpdate} = this.options;
            if (this.speed > 0) this.startTime = Math.min(this.startTime, timestamp); else if (this.speed < 0) this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
            if (sample) this.currentTime = timestamp; else if (this.holdTime !== null) this.currentTime = this.holdTime; else this.currentTime = Math.round(timestamp - this.startTime) * this.speed;
            const timeWithoutDelay = this.currentTime - delay * (this.speed >= 0 ? 1 : -1);
            const isInDelayPhase = this.speed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
            this.currentTime = Math.max(timeWithoutDelay, 0);
            if (this.state === "finished" && this.holdTime === null) this.currentTime = totalDuration;
            let elapsed = this.currentTime;
            let frameGenerator = generator;
            if (repeat) {
                const progress = Math.min(this.currentTime, totalDuration) / resolvedDuration;
                let currentIteration = Math.floor(progress);
                let iterationProgress = progress % 1;
                if (!iterationProgress && progress >= 1) iterationProgress = 1;
                iterationProgress === 1 && currentIteration--;
                currentIteration = Math.min(currentIteration, repeat + 1);
                const isOddIteration = Boolean(currentIteration % 2);
                if (isOddIteration) if (repeatType === "reverse") {
                    iterationProgress = 1 - iterationProgress;
                    if (repeatDelay) iterationProgress -= repeatDelay / resolvedDuration;
                } else if (repeatType === "mirror") frameGenerator = mirroredGenerator;
                elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
            }
            const state = isInDelayPhase ? {
                done: false,
                value: keyframes[0]
            } : frameGenerator.next(elapsed);
            if (mapPercentToKeyframes) state.value = mapPercentToKeyframes(state.value);
            let {done} = state;
            if (!isInDelayPhase && calculatedDuration !== null) done = this.speed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
            const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
            if (isAnimationFinished && finalKeyframe !== void 0) state.value = getFinalKeyframe(keyframes, this.options, finalKeyframe);
            if (onUpdate) onUpdate(state.value);
            if (isAnimationFinished) this.finish();
            return state;
        }
        get duration() {
            const {resolved} = this;
            return resolved ? millisecondsToSeconds(resolved.calculatedDuration) : 0;
        }
        get time() {
            return millisecondsToSeconds(this.currentTime);
        }
        set time(newTime) {
            newTime = secondsToMilliseconds(newTime);
            this.currentTime = newTime;
            if (this.holdTime !== null || this.speed === 0) this.holdTime = newTime; else if (this.driver) this.startTime = this.driver.now() - newTime / this.speed;
        }
        get speed() {
            return this.playbackSpeed;
        }
        set speed(newSpeed) {
            const hasChanged = this.playbackSpeed !== newSpeed;
            this.playbackSpeed = newSpeed;
            if (hasChanged) this.time = millisecondsToSeconds(this.currentTime);
        }
        play() {
            if (!this.resolver.isScheduled) this.resolver.resume();
            if (!this._resolved) {
                this.pendingPlayState = "running";
                return;
            }
            if (this.isStopped) return;
            const {driver = frameloopDriver, onPlay, startTime} = this.options;
            if (!this.driver) this.driver = driver((timestamp => this.tick(timestamp)));
            onPlay && onPlay();
            const now = this.driver.now();
            if (this.holdTime !== null) this.startTime = now - this.holdTime; else if (!this.startTime) this.startTime = startTime ?? this.calcStartTime(); else if (this.state === "finished") this.startTime = now;
            if (this.state === "finished") this.updateFinishedPromise();
            this.cancelTime = this.startTime;
            this.holdTime = null;
            this.state = "running";
            this.driver.start();
        }
        pause() {
            if (!this._resolved) {
                this.pendingPlayState = "paused";
                return;
            }
            this.state = "paused";
            this.holdTime = this.currentTime ?? 0;
        }
        complete() {
            if (this.state !== "running") this.play();
            this.pendingPlayState = this.state = "finished";
            this.holdTime = null;
        }
        finish() {
            this.teardown();
            this.state = "finished";
            const {onComplete} = this.options;
            onComplete && onComplete();
        }
        cancel() {
            if (this.cancelTime !== null) this.tick(this.cancelTime);
            this.teardown();
            this.updateFinishedPromise();
        }
        teardown() {
            this.state = "idle";
            this.stopDriver();
            this.resolveFinishedPromise();
            this.updateFinishedPromise();
            this.startTime = this.cancelTime = null;
            this.resolver.cancel();
            activeAnimations.mainThread--;
        }
        stopDriver() {
            if (!this.driver) return;
            this.driver.stop();
            this.driver = void 0;
        }
        sample(time) {
            this.startTime = 0;
            return this.tick(time, true);
        }
        get finished() {
            return this.currentFinishedPromise;
        }
    }
    const acceleratedValues = new Set([ "opacity", "clipPath", "filter", "transform" ]);
    const supportsWaapi = memo((() => Object.hasOwnProperty.call(Element.prototype, "animate")));
    const sampleDelta = 10;
    const maxDuration = 2e4;
    function requiresPregeneratedKeyframes(options) {
        return isGenerator(options.type) || options.type === "spring" || !isWaapiSupportedEasing(options.ease);
    }
    function pregenerateKeyframes(keyframes, options) {
        const sampleAnimation = new MainThreadAnimation({
            ...options,
            keyframes,
            repeat: 0,
            delay: 0,
            isGenerator: true
        });
        let state = {
            done: false,
            value: keyframes[0]
        };
        const pregeneratedKeyframes = [];
        let t = 0;
        while (!state.done && t < maxDuration) {
            state = sampleAnimation.sample(t);
            pregeneratedKeyframes.push(state.value);
            t += sampleDelta;
        }
        return {
            times: void 0,
            keyframes: pregeneratedKeyframes,
            duration: t - sampleDelta,
            ease: "linear"
        };
    }
    const unsupportedEasingFunctions = {
        anticipate,
        backInOut,
        circInOut
    };
    function isUnsupportedEase(key) {
        return key in unsupportedEasingFunctions;
    }
    class AcceleratedAnimation extends BaseAnimation {
        constructor(options) {
            super(options);
            const {name, motionValue, element, keyframes} = this.options;
            this.resolver = new DOMKeyframesResolver(keyframes, ((resolvedKeyframes, finalKeyframe) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe)), name, motionValue, element);
            this.resolver.scheduleResolve();
        }
        initPlayback(keyframes, finalKeyframe) {
            let {duration = 300, times, ease, type, motionValue, name, startTime} = this.options;
            if (!motionValue.owner || !motionValue.owner.current) return false;
            if (typeof ease === "string" && supportsLinearEasing() && isUnsupportedEase(ease)) ease = unsupportedEasingFunctions[ease];
            if (requiresPregeneratedKeyframes(this.options)) {
                const {onComplete, onUpdate, motionValue, element, ...options} = this.options;
                const pregeneratedAnimation = pregenerateKeyframes(keyframes, options);
                keyframes = pregeneratedAnimation.keyframes;
                if (keyframes.length === 1) keyframes[1] = keyframes[0];
                duration = pregeneratedAnimation.duration;
                times = pregeneratedAnimation.times;
                ease = pregeneratedAnimation.ease;
                type = "keyframes";
            }
            const animation = startWaapiAnimation(motionValue.owner.current, name, keyframes, {
                ...this.options,
                duration,
                times,
                ease
            });
            animation.startTime = startTime ?? this.calcStartTime();
            if (this.pendingTimeline) {
                attachTimeline(animation, this.pendingTimeline);
                this.pendingTimeline = void 0;
            } else animation.onfinish = () => {
                const {onComplete} = this.options;
                motionValue.set(getFinalKeyframe(keyframes, this.options, finalKeyframe));
                onComplete && onComplete();
                this.cancel();
                this.resolveFinishedPromise();
            };
            return {
                animation,
                duration,
                times,
                type,
                ease,
                keyframes
            };
        }
        get duration() {
            const {resolved} = this;
            if (!resolved) return 0;
            const {duration} = resolved;
            return millisecondsToSeconds(duration);
        }
        get time() {
            const {resolved} = this;
            if (!resolved) return 0;
            const {animation} = resolved;
            return millisecondsToSeconds(animation.currentTime || 0);
        }
        set time(newTime) {
            const {resolved} = this;
            if (!resolved) return;
            const {animation} = resolved;
            animation.currentTime = secondsToMilliseconds(newTime);
        }
        get speed() {
            const {resolved} = this;
            if (!resolved) return 1;
            const {animation} = resolved;
            return animation.playbackRate;
        }
        get finished() {
            return this.resolved.animation.finished;
        }
        set speed(newSpeed) {
            const {resolved} = this;
            if (!resolved) return;
            const {animation} = resolved;
            animation.playbackRate = newSpeed;
        }
        get state() {
            const {resolved} = this;
            if (!resolved) return "idle";
            const {animation} = resolved;
            return animation.playState;
        }
        get startTime() {
            const {resolved} = this;
            if (!resolved) return null;
            const {animation} = resolved;
            return animation.startTime;
        }
        attachTimeline(timeline) {
            if (!this._resolved) this.pendingTimeline = timeline; else {
                const {resolved} = this;
                if (!resolved) return noop;
                const {animation} = resolved;
                attachTimeline(animation, timeline);
            }
            return noop;
        }
        play() {
            if (this.isStopped) return;
            const {resolved} = this;
            if (!resolved) return;
            const {animation} = resolved;
            if (animation.playState === "finished") this.updateFinishedPromise();
            animation.play();
        }
        pause() {
            const {resolved} = this;
            if (!resolved) return;
            const {animation} = resolved;
            animation.pause();
        }
        stop() {
            this.resolver.cancel();
            this.isStopped = true;
            if (this.state === "idle") return;
            this.resolveFinishedPromise();
            this.updateFinishedPromise();
            const {resolved} = this;
            if (!resolved) return;
            const {animation, keyframes, duration, type, ease, times} = resolved;
            if (animation.playState === "idle" || animation.playState === "finished") return;
            if (this.time) {
                const {motionValue, onUpdate, onComplete, element, ...options} = this.options;
                const sampleAnimation = new MainThreadAnimation({
                    ...options,
                    keyframes,
                    duration,
                    type,
                    ease,
                    times,
                    isGenerator: true
                });
                const sampleTime = secondsToMilliseconds(this.time);
                motionValue.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta);
            }
            const {onStop} = this.options;
            onStop && onStop();
            this.cancel();
        }
        complete() {
            const {resolved} = this;
            if (!resolved) return;
            resolved.animation.finish();
        }
        cancel() {
            const {resolved} = this;
            if (!resolved) return;
            resolved.animation.cancel();
        }
        static supports(options) {
            const {motionValue, name, repeatDelay, repeatType, damping, type} = options;
            if (!motionValue || !motionValue.owner || !(motionValue.owner.current instanceof HTMLElement)) return false;
            const {onUpdate, transformTemplate} = motionValue.owner.getProps();
            return supportsWaapi() && name && acceleratedValues.has(name) && (name !== "transform" || !transformTemplate) && !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
        }
    }
    const underDampedSpring = {
        type: "spring",
        stiffness: 500,
        damping: 25,
        restSpeed: 10
    };
    const criticallyDampedSpring = target => ({
        type: "spring",
        stiffness: 550,
        damping: target === 0 ? 2 * Math.sqrt(550) : 30,
        restSpeed: 10
    });
    const keyframesTransition = {
        type: "keyframes",
        duration: .8
    };
    const ease = {
        type: "keyframes",
        ease: [ .25, .1, .35, 1 ],
        duration: .3
    };
    const getDefaultTransition = (valueKey, {keyframes}) => {
        if (keyframes.length > 2) return keyframesTransition; else if (transformProps.has(valueKey)) return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes[1]) : underDampedSpring;
        return ease;
    };
    function isTransitionDefined({when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition}) {
        return !!Object.keys(transition).length;
    }
    const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => onComplete => {
        const valueTransition = get_value_transition_getValueTransition(transition, name) || {};
        const delay = valueTransition.delay || transition.delay || 0;
        let {elapsed = 0} = transition;
        elapsed -= secondsToMilliseconds(delay);
        let options = {
            keyframes: Array.isArray(target) ? target : [ null, target ],
            ease: "easeOut",
            velocity: value.getVelocity(),
            ...valueTransition,
            delay: -elapsed,
            onUpdate: v => {
                value.set(v);
                valueTransition.onUpdate && valueTransition.onUpdate(v);
            },
            onComplete: () => {
                onComplete();
                valueTransition.onComplete && valueTransition.onComplete();
            },
            name,
            motionValue: value,
            element: isHandoff ? void 0 : element
        };
        if (!isTransitionDefined(valueTransition)) options = {
            ...options,
            ...getDefaultTransition(name, options)
        };
        if (options.duration) options.duration = secondsToMilliseconds(options.duration);
        if (options.repeatDelay) options.repeatDelay = secondsToMilliseconds(options.repeatDelay);
        if (options.from !== void 0) options.keyframes[0] = options.from;
        let shouldSkip = false;
        if (options.type === false || options.duration === 0 && !options.repeatDelay) {
            options.duration = 0;
            if (options.delay === 0) shouldSkip = true;
        }
        if (instantAnimationState.current || MotionGlobalConfig.skipAnimations) {
            shouldSkip = true;
            options.duration = 0;
            options.delay = 0;
        }
        options.allowFlatten = !valueTransition.type && !valueTransition.ease;
        if (shouldSkip && !isHandoff && value.get() !== void 0) {
            const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
            if (finalKeyframe !== void 0) {
                frame_frame.update((() => {
                    options.onUpdate(finalKeyframe);
                    options.onComplete();
                }));
                return new GroupAnimationWithThen([]);
            }
        }
        if (!isHandoff && AcceleratedAnimation.supports(options)) return new AcceleratedAnimation(options); else return new MainThreadAnimation(options);
    };
    function shouldBlockAnimation({protectedKeys, needsAnimating}, key) {
        const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
        needsAnimating[key] = false;
        return shouldBlock;
    }
    function animateTarget(visualElement, targetAndTransition, {delay = 0, transitionOverride, type} = {}) {
        let {transition = visualElement.getDefaultTransition(), transitionEnd, ...target} = targetAndTransition;
        if (transitionOverride) transition = transitionOverride;
        const animations = [];
        const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
        for (const key in target) {
            const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
            const valueTarget = target[key];
            if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) continue;
            const valueTransition = {
                delay,
                ...get_value_transition_getValueTransition(transition || {}, key)
            };
            let isHandoff = false;
            if (window.MotionHandoffAnimation) {
                const appearId = getOptimisedAppearId(visualElement);
                if (appearId) {
                    const startTime = window.MotionHandoffAnimation(appearId, key, frame_frame);
                    if (startTime !== null) {
                        valueTransition.startTime = startTime;
                        isHandoff = true;
                    }
                }
            }
            addValueToWillChange(visualElement, key);
            value.start(animateMotionValue(key, value, valueTarget, visualElement.shouldReduceMotion && positionalKeys.has(key) ? {
                type: false
            } : valueTransition, visualElement, isHandoff));
            const animation = value.animation;
            if (animation) animations.push(animation);
        }
        if (transitionEnd) Promise.all(animations).then((() => {
            frame_frame.update((() => {
                transitionEnd && setTarget(visualElement, transitionEnd);
            }));
        }));
        return animations;
    }
    function isSVGElement(element) {
        return element instanceof SVGElement && element.tagName !== "svg";
    }
    const createAxis = () => ({
        min: 0,
        max: 0
    });
    const createBox = () => ({
        x: createAxis(),
        y: createAxis()
    });
    const featureProps = {
        animation: [ "animate", "variants", "whileHover", "whileTap", "exit", "whileInView", "whileFocus", "whileDrag" ],
        exit: [ "exit" ],
        drag: [ "drag", "dragControls" ],
        focus: [ "whileFocus" ],
        hover: [ "whileHover", "onHoverStart", "onHoverEnd" ],
        tap: [ "whileTap", "onTap", "onTapStart", "onTapCancel" ],
        pan: [ "onPan", "onPanStart", "onPanSessionStart", "onPanEnd" ],
        inView: [ "whileInView", "onViewportEnter", "onViewportLeave" ],
        layout: [ "layout", "layoutId" ]
    };
    const featureDefinitions = {};
    for (const key in featureProps) featureDefinitions[key] = {
        isEnabled: props => featureProps[key].some((name => !!props[name]))
    };
    const isBrowser = typeof window !== "undefined";
    const prefersReducedMotion = {
        current: null
    };
    const hasReducedMotionListener = {
        current: false
    };
    function initPrefersReducedMotion() {
        hasReducedMotionListener.current = true;
        if (!isBrowser) return;
        if (window.matchMedia) {
            const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
            const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
            motionMediaQuery.addListener(setReducedMotionPreferences);
            setReducedMotionPreferences();
        } else prefersReducedMotion.current = false;
    }
    const valueTypes = [ ...dimensionValueTypes, color, complex ];
    const findValueType = v => valueTypes.find(testValueType(v));
    function isAnimationControls(v) {
        return v !== null && typeof v === "object" && typeof v.start === "function";
    }
    function isVariantLabel(v) {
        return typeof v === "string" || Array.isArray(v);
    }
    const variantPriorityOrder = [ "animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit" ];
    const variantProps = [ "initial", ...variantPriorityOrder ];
    function isControllingVariants(props) {
        return isAnimationControls(props.animate) || variantProps.some((name => isVariantLabel(props[name])));
    }
    function isVariantNode(props) {
        return Boolean(isControllingVariants(props) || props.variants);
    }
    function updateMotionValuesFromProps(element, next, prev) {
        for (const key in next) {
            const nextValue = next[key];
            const prevValue = prev[key];
            if (isMotionValue(nextValue)) {
                element.addValue(key, nextValue);
                if (false) ;
            } else if (isMotionValue(prevValue)) element.addValue(key, motionValue(nextValue, {
                owner: element
            })); else if (prevValue !== nextValue) if (element.hasValue(key)) {
                const existingValue = element.getValue(key);
                if (existingValue.liveStyle === true) existingValue.jump(nextValue); else if (!existingValue.hasAnimated) existingValue.set(nextValue);
            } else {
                const latestValue = element.getStaticValue(key);
                element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, {
                    owner: element
                }));
            }
        }
        for (const key in prev) if (next[key] === void 0) element.removeValue(key);
        return next;
    }
    const propEventHandlers = [ "AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete" ];
    class VisualElement {
        scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
            return {};
        }
        constructor({parent, props, presenceContext, reducedMotionConfig, blockInitialAnimation, visualState}, options = {}) {
            this.current = null;
            this.children = new Set;
            this.isVariantNode = false;
            this.isControllingVariants = false;
            this.shouldReduceMotion = null;
            this.values = new Map;
            this.KeyframeResolver = KeyframeResolver;
            this.features = {};
            this.valueSubscriptions = new Map;
            this.prevMotionValues = {};
            this.events = {};
            this.propEventSubscriptions = {};
            this.notifyUpdate = () => this.notify("Update", this.latestValues);
            this.render = () => {
                if (!this.current) return;
                this.triggerBuild();
                this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
            };
            this.renderScheduledAt = 0;
            this.scheduleRender = () => {
                const now = time.now();
                if (this.renderScheduledAt < now) {
                    this.renderScheduledAt = now;
                    frame_frame.render(this.render, false, true);
                }
            };
            const {latestValues, renderState, onUpdate} = visualState;
            this.onUpdate = onUpdate;
            this.latestValues = latestValues;
            this.baseTarget = {
                ...latestValues
            };
            this.initialValues = props.initial ? {
                ...latestValues
            } : {};
            this.renderState = renderState;
            this.parent = parent;
            this.props = props;
            this.presenceContext = presenceContext;
            this.depth = parent ? parent.depth + 1 : 0;
            this.reducedMotionConfig = reducedMotionConfig;
            this.options = options;
            this.blockInitialAnimation = Boolean(blockInitialAnimation);
            this.isControllingVariants = isControllingVariants(props);
            this.isVariantNode = isVariantNode(props);
            if (this.isVariantNode) this.variantChildren = new Set;
            this.manuallyAnimateOnMount = Boolean(parent && parent.current);
            const {willChange, ...initialMotionValues} = this.scrapeMotionValuesFromProps(props, {}, this);
            for (const key in initialMotionValues) {
                const value = initialMotionValues[key];
                if (latestValues[key] !== void 0 && isMotionValue(value)) value.set(latestValues[key], false);
            }
        }
        mount(instance) {
            this.current = instance;
            visualElementStore.set(instance, this);
            if (this.projection && !this.projection.instance) this.projection.mount(instance);
            if (this.parent && this.isVariantNode && !this.isControllingVariants) this.removeFromVariantTree = this.parent.addVariantChild(this);
            this.values.forEach(((value, key) => this.bindToMotionValue(key, value)));
            if (!hasReducedMotionListener.current) initPrefersReducedMotion();
            this.shouldReduceMotion = this.reducedMotionConfig === "never" ? false : this.reducedMotionConfig === "always" ? true : prefersReducedMotion.current;
            if (false) ;
            if (this.parent) this.parent.children.add(this);
            this.update(this.props, this.presenceContext);
        }
        unmount() {
            this.projection && this.projection.unmount();
            cancelFrame(this.notifyUpdate);
            cancelFrame(this.render);
            this.valueSubscriptions.forEach((remove => remove()));
            this.valueSubscriptions.clear();
            this.removeFromVariantTree && this.removeFromVariantTree();
            this.parent && this.parent.children.delete(this);
            for (const key in this.events) this.events[key].clear();
            for (const key in this.features) {
                const feature = this.features[key];
                if (feature) {
                    feature.unmount();
                    feature.isMounted = false;
                }
            }
            this.current = null;
        }
        bindToMotionValue(key, value) {
            if (this.valueSubscriptions.has(key)) this.valueSubscriptions.get(key)();
            const valueIsTransform = transformProps.has(key);
            if (valueIsTransform && this.onBindTransform) this.onBindTransform();
            const removeOnChange = value.on("change", (latestValue => {
                this.latestValues[key] = latestValue;
                this.props.onUpdate && frame_frame.preRender(this.notifyUpdate);
                if (valueIsTransform && this.projection) this.projection.isTransformDirty = true;
            }));
            const removeOnRenderRequest = value.on("renderRequest", this.scheduleRender);
            let removeSyncCheck;
            if (window.MotionCheckAppearSync) removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
            this.valueSubscriptions.set(key, (() => {
                removeOnChange();
                removeOnRenderRequest();
                if (removeSyncCheck) removeSyncCheck();
                if (value.owner) value.stop();
            }));
        }
        sortNodePosition(other) {
            if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) return 0;
            return this.sortInstanceNodePosition(this.current, other.current);
        }
        updateFeatures() {
            let key = "animation";
            for (key in featureDefinitions) {
                const featureDefinition = featureDefinitions[key];
                if (!featureDefinition) continue;
                const {isEnabled, Feature: FeatureConstructor} = featureDefinition;
                if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) this.features[key] = new FeatureConstructor(this);
                if (this.features[key]) {
                    const feature = this.features[key];
                    if (feature.isMounted) feature.update(); else {
                        feature.mount();
                        feature.isMounted = true;
                    }
                }
            }
        }
        triggerBuild() {
            this.build(this.renderState, this.latestValues, this.props);
        }
        measureViewportBox() {
            return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
        }
        getStaticValue(key) {
            return this.latestValues[key];
        }
        setStaticValue(key, value) {
            this.latestValues[key] = value;
        }
        update(props, presenceContext) {
            if (props.transformTemplate || this.props.transformTemplate) this.scheduleRender();
            this.prevProps = this.props;
            this.props = props;
            this.prevPresenceContext = this.presenceContext;
            this.presenceContext = presenceContext;
            for (let i = 0; i < propEventHandlers.length; i++) {
                const key = propEventHandlers[i];
                if (this.propEventSubscriptions[key]) {
                    this.propEventSubscriptions[key]();
                    delete this.propEventSubscriptions[key];
                }
                const listenerName = "on" + key;
                const listener = props[listenerName];
                if (listener) this.propEventSubscriptions[key] = this.on(key, listener);
            }
            this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps, this), this.prevMotionValues);
            if (this.handleChildMotionValue) this.handleChildMotionValue();
            this.onUpdate && this.onUpdate(this);
        }
        getProps() {
            return this.props;
        }
        getVariant(name) {
            return this.props.variants ? this.props.variants[name] : void 0;
        }
        getDefaultTransition() {
            return this.props.transition;
        }
        getTransformPagePoint() {
            return this.props.transformPagePoint;
        }
        getClosestVariantNode() {
            return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
        }
        addVariantChild(child) {
            const closestVariantNode = this.getClosestVariantNode();
            if (closestVariantNode) {
                closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
                return () => closestVariantNode.variantChildren.delete(child);
            }
        }
        addValue(key, value) {
            const existingValue = this.values.get(key);
            if (value !== existingValue) {
                if (existingValue) this.removeValue(key);
                this.bindToMotionValue(key, value);
                this.values.set(key, value);
                this.latestValues[key] = value.get();
            }
        }
        removeValue(key) {
            this.values.delete(key);
            const unsubscribe = this.valueSubscriptions.get(key);
            if (unsubscribe) {
                unsubscribe();
                this.valueSubscriptions.delete(key);
            }
            delete this.latestValues[key];
            this.removeValueFromRenderState(key, this.renderState);
        }
        hasValue(key) {
            return this.values.has(key);
        }
        getValue(key, defaultValue) {
            if (this.props.values && this.props.values[key]) return this.props.values[key];
            let value = this.values.get(key);
            if (value === void 0 && defaultValue !== void 0) {
                value = motionValue(defaultValue === null ? void 0 : defaultValue, {
                    owner: this
                });
                this.addValue(key, value);
            }
            return value;
        }
        readValue(key, target) {
            let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
            if (value !== void 0 && value !== null) {
                if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) value = parseFloat(value); else if (!findValueType(value) && complex.test(target)) value = animatable_none_getAnimatableNone(key, target);
                this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
            }
            return isMotionValue(value) ? value.get() : value;
        }
        setBaseTarget(key, value) {
            this.baseTarget[key] = value;
        }
        getBaseTarget(key) {
            const {initial} = this.props;
            let valueFromInitial;
            if (typeof initial === "string" || typeof initial === "object") {
                const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
                if (variant) valueFromInitial = variant[key];
            }
            if (initial && valueFromInitial !== void 0) return valueFromInitial;
            const target = this.getBaseTargetFromProps(this.props, key);
            if (target !== void 0 && !isMotionValue(target)) return target;
            return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
        }
        on(eventName, callback) {
            if (!this.events[eventName]) this.events[eventName] = new SubscriptionManager;
            return this.events[eventName].add(callback);
        }
        notify(eventName, ...args) {
            if (this.events[eventName]) this.events[eventName].notify(...args);
        }
    }
    class DOMVisualElement extends VisualElement {
        constructor() {
            super(...arguments);
            this.KeyframeResolver = DOMKeyframesResolver;
        }
        sortInstanceNodePosition(a, b) {
            return a.compareDocumentPosition(b) & 2 ? 1 : -1;
        }
        getBaseTargetFromProps(props, key) {
            return props.style ? props.style[key] : void 0;
        }
        removeValueFromRenderState(key, {vars, style}) {
            delete vars[key];
            delete style[key];
        }
        handleChildMotionValue() {
            if (this.childSubscription) {
                this.childSubscription();
                delete this.childSubscription;
            }
            const {children} = this.props;
            if (isMotionValue(children)) this.childSubscription = children.on("change", (latest => {
                if (this.current) this.current.textContent = `${latest}`;
            }));
        }
    }
    const getValueAsType = (value, type) => type && typeof value === "number" ? type.transform(value) : value;
    const translateAlias = {
        x: "translateX",
        y: "translateY",
        z: "translateZ",
        transformPerspective: "perspective"
    };
    const numTransforms = transformPropOrder.length;
    function buildTransform(latestValues, transform, transformTemplate) {
        let transformString = "";
        let transformIsDefault = true;
        for (let i = 0; i < numTransforms; i++) {
            const key = transformPropOrder[i];
            const value = latestValues[key];
            if (value === void 0) continue;
            let valueIsDefault = true;
            if (typeof value === "number") valueIsDefault = value === (key.startsWith("scale") ? 1 : 0); else valueIsDefault = parseFloat(value) === 0;
            if (!valueIsDefault || transformTemplate) {
                const valueAsType = getValueAsType(value, numberValueTypes[key]);
                if (!valueIsDefault) {
                    transformIsDefault = false;
                    const transformName = translateAlias[key] || key;
                    transformString += `${transformName}(${valueAsType}) `;
                }
                if (transformTemplate) transform[key] = valueAsType;
            }
        }
        transformString = transformString.trim();
        if (transformTemplate) transformString = transformTemplate(transform, transformIsDefault ? "" : transformString); else if (transformIsDefault) transformString = "none";
        return transformString;
    }
    function buildHTMLStyles(state, latestValues, transformTemplate) {
        const {style, vars, transformOrigin} = state;
        let hasTransform = false;
        let hasTransformOrigin = false;
        for (const key in latestValues) {
            const value = latestValues[key];
            if (transformProps.has(key)) {
                hasTransform = true;
                continue;
            } else if (is_css_variable_isCSSVariableName(key)) {
                vars[key] = value;
                continue;
            } else {
                const valueAsType = getValueAsType(value, numberValueTypes[key]);
                if (key.startsWith("origin")) {
                    hasTransformOrigin = true;
                    transformOrigin[key] = valueAsType;
                } else style[key] = valueAsType;
            }
        }
        if (!latestValues.transform) if (hasTransform || transformTemplate) style.transform = buildTransform(latestValues, state.transform, transformTemplate); else if (style.transform) style.transform = "none";
        if (hasTransformOrigin) {
            const {originX = "50%", originY = "50%", originZ = 0} = transformOrigin;
            style.transformOrigin = `${originX} ${originY} ${originZ}`;
        }
    }
    const dashKeys = {
        offset: "stroke-dashoffset",
        array: "stroke-dasharray"
    };
    const camelKeys = {
        offset: "strokeDashoffset",
        array: "strokeDasharray"
    };
    function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
        attrs.pathLength = 1;
        const keys = useDashCase ? dashKeys : camelKeys;
        attrs[keys.offset] = px.transform(-offset);
        const pathLength = px.transform(length);
        const pathSpacing = px.transform(spacing);
        attrs[keys.array] = `${pathLength} ${pathSpacing}`;
    }
    function calcOrigin(origin, offset, size) {
        return typeof origin === "string" ? origin : px.transform(offset + size * origin);
    }
    function calcSVGTransformOrigin(dimensions, originX, originY) {
        const pxOriginX = calcOrigin(originX, dimensions.x, dimensions.width);
        const pxOriginY = calcOrigin(originY, dimensions.y, dimensions.height);
        return `${pxOriginX} ${pxOriginY}`;
    }
    function buildSVGAttrs(state, {attrX, attrY, attrScale, originX, originY, pathLength, pathSpacing = 1, pathOffset = 0, ...latest}, isSVGTag, transformTemplate) {
        buildHTMLStyles(state, latest, transformTemplate);
        if (isSVGTag) {
            if (state.style.viewBox) state.attrs.viewBox = state.style.viewBox;
            return;
        }
        state.attrs = state.style;
        state.style = {};
        const {attrs, style, dimensions} = state;
        if (attrs.transform) {
            if (dimensions) style.transform = attrs.transform;
            delete attrs.transform;
        }
        if (dimensions && (originX !== void 0 || originY !== void 0 || style.transform)) style.transformOrigin = calcSVGTransformOrigin(dimensions, originX !== void 0 ? originX : .5, originY !== void 0 ? originY : .5);
        if (attrX !== void 0) attrs.x = attrX;
        if (attrY !== void 0) attrs.y = attrY;
        if (attrScale !== void 0) attrs.scale = attrScale;
        if (pathLength !== void 0) buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
    }
    const camelCaseAttributes = new Set([ "baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust" ]);
    const isSVGTag = tag => typeof tag === "string" && tag.toLowerCase() === "svg";
    function updateSVGDimensions(instance, renderState) {
        try {
            renderState.dimensions = typeof instance.getBBox === "function" ? instance.getBBox() : instance.getBoundingClientRect();
        } catch (e) {
            renderState.dimensions = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
    }
    function renderHTML(element, {style, vars}, styleProp, projection) {
        Object.assign(element.style, style, projection && projection.getProjectionStyles(styleProp));
        for (const key in vars) element.style.setProperty(key, vars[key]);
    }
    function renderSVG(element, renderState, _styleProp, projection) {
        renderHTML(element, renderState, void 0, projection);
        for (const key in renderState.attrs) element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
    }
    const scaleCorrectors = {};
    function isForcedMotionValue(key, {layout, layoutId}) {
        return transformProps.has(key) || key.startsWith("origin") || (layout || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
    }
    function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
        const {style} = props;
        const newValues = {};
        for (const key in style) if (isMotionValue(style[key]) || prevProps.style && isMotionValue(prevProps.style[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) newValues[key] = style[key];
        return newValues;
    }
    function scrape_motion_values_scrapeMotionValuesFromProps(props, prevProps, visualElement) {
        const newValues = scrapeMotionValuesFromProps(props, prevProps, visualElement);
        for (const key in props) if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
            const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
            newValues[targetKey] = props[key];
        }
        return newValues;
    }
    class SVGVisualElement extends DOMVisualElement {
        constructor() {
            super(...arguments);
            this.type = "svg";
            this.isSVGTag = false;
            this.measureInstanceViewportBox = createBox;
            this.updateDimensions = () => {
                if (this.current && !this.renderState.dimensions) updateSVGDimensions(this.current, this.renderState);
            };
        }
        getBaseTargetFromProps(props, key) {
            return props[key];
        }
        readValueFromInstance(instance, key) {
            if (transformProps.has(key)) {
                const defaultType = getDefaultValueType(key);
                return defaultType ? defaultType.default || 0 : 0;
            }
            key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
            return instance.getAttribute(key);
        }
        scrapeMotionValuesFromProps(props, prevProps, visualElement) {
            return scrape_motion_values_scrapeMotionValuesFromProps(props, prevProps, visualElement);
        }
        onBindTransform() {
            if (this.current && !this.renderState.dimensions) frame_frame.postRender(this.updateDimensions);
        }
        build(renderState, latestValues, props) {
            buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate);
        }
        renderInstance(instance, renderState, styleProp, projection) {
            renderSVG(instance, renderState, styleProp, projection);
        }
        mount(instance) {
            this.isSVGTag = isSVGTag(instance.tagName);
            super.mount(instance);
        }
    }
    function convertBoundingBoxToBox({top, left, right, bottom}) {
        return {
            x: {
                min: left,
                max: right
            },
            y: {
                min: top,
                max: bottom
            }
        };
    }
    function transformBoxPoints(point, transformPoint) {
        if (!transformPoint) return point;
        const topLeft = transformPoint({
            x: point.left,
            y: point.top
        });
        const bottomRight = transformPoint({
            x: point.right,
            y: point.bottom
        });
        return {
            top: topLeft.y,
            left: topLeft.x,
            bottom: bottomRight.y,
            right: bottomRight.x
        };
    }
    function measureViewportBox(instance, transformPoint) {
        return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
    }
    function HTMLVisualElement_getComputedStyle(element) {
        return window.getComputedStyle(element);
    }
    class HTMLVisualElement extends DOMVisualElement {
        constructor() {
            super(...arguments);
            this.type = "html";
            this.renderInstance = renderHTML;
        }
        readValueFromInstance(instance, key) {
            if (transformProps.has(key)) return readTransformValue(instance, key); else {
                const computedStyle = HTMLVisualElement_getComputedStyle(instance);
                const value = (is_css_variable_isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
                return typeof value === "string" ? value.trim() : value;
            }
        }
        measureInstanceViewportBox(instance, {transformPagePoint}) {
            return measureViewportBox(instance, transformPagePoint);
        }
        build(renderState, latestValues, props) {
            buildHTMLStyles(renderState, latestValues, props.transformTemplate);
        }
        scrapeMotionValuesFromProps(props, prevProps, visualElement) {
            return scrapeMotionValuesFromProps(props, prevProps, visualElement);
        }
    }
    function isObjectKey(key, object) {
        return key in object;
    }
    class ObjectVisualElement extends VisualElement {
        constructor() {
            super(...arguments);
            this.type = "object";
        }
        readValueFromInstance(instance, key) {
            if (isObjectKey(key, instance)) {
                const value = instance[key];
                if (typeof value === "string" || typeof value === "number") return value;
            }
            return;
        }
        getBaseTargetFromProps() {
            return;
        }
        removeValueFromRenderState(key, renderState) {
            delete renderState.output[key];
        }
        measureInstanceViewportBox() {
            return createBox();
        }
        build(renderState, latestValues) {
            Object.assign(renderState.output, latestValues);
        }
        renderInstance(instance, {output}) {
            Object.assign(instance, output);
        }
        sortInstanceNodePosition() {
            return 0;
        }
    }
    function createDOMVisualElement(element) {
        const options = {
            presenceContext: null,
            props: {},
            visualState: {
                renderState: {
                    transform: {},
                    transformOrigin: {},
                    style: {},
                    vars: {},
                    attrs: {}
                },
                latestValues: {}
            }
        };
        const node = isSVGElement(element) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
        node.mount(element);
        visualElementStore.set(element, node);
    }
    function createObjectVisualElement(subject) {
        const options = {
            presenceContext: null,
            props: {},
            visualState: {
                renderState: {
                    output: {}
                },
                latestValues: {}
            }
        };
        const node = new ObjectVisualElement(options);
        node.mount(subject);
        visualElementStore.set(subject, node);
    }
    function animateSingleValue(value, keyframes, options) {
        const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
        motionValue$1.start(animateMotionValue("", motionValue$1, keyframes, options));
        return motionValue$1.animation;
    }
    function isSingleValue(subject, keyframes) {
        return isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes);
    }
    function animateSubject(subject, keyframes, options, scope) {
        const animations = [];
        if (isSingleValue(subject, keyframes)) animations.push(animateSingleValue(subject, isDOMKeyframes(keyframes) ? keyframes.default || keyframes : keyframes, options ? options.default || options : options)); else {
            const subjects = resolveSubjects(subject, keyframes, scope);
            const numSubjects = subjects.length;
            invariant(Boolean(numSubjects), "No valid elements provided.");
            for (let i = 0; i < numSubjects; i++) {
                const thisSubject = subjects[i];
                const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;
                if (!visualElementStore.has(thisSubject)) createVisualElement(thisSubject);
                const visualElement = visualElementStore.get(thisSubject);
                const transition = {
                    ...options
                };
                if ("delay" in transition && typeof transition.delay === "function") transition.delay = transition.delay(i, numSubjects);
                animations.push(...animateTarget(visualElement, {
                    ...keyframes,
                    transition
                }, {}));
            }
        }
        return animations;
    }
    function animateSequence(sequence, options, scope) {
        const animations = [];
        const animationDefinitions = createAnimationsFromSequence(sequence, options, scope, {
            spring
        });
        animationDefinitions.forEach((({keyframes, transition}, subject) => {
            animations.push(...animateSubject(subject, keyframes, transition));
        }));
        return animations;
    }
    function isSequence(value) {
        return Array.isArray(value) && value.some(Array.isArray);
    }
    function createScopedAnimate(scope) {
        function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options) {
            let animations = [];
            if (isSequence(subjectOrSequence)) animations = animateSequence(subjectOrSequence, optionsOrKeyframes, scope); else animations = animateSubject(subjectOrSequence, optionsOrKeyframes, options, scope);
            const animation = new GroupAnimationWithThen(animations);
            if (scope) scope.animations.push(animation);
            return animation;
        }
        return scopedAnimate;
    }
    const animate = createScopedAnimate();
    console.log;
    window.addEventListener("DOMContentLoaded", (() => {
        const lenis = new Lenis({
            duration: 2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        const $cardsWrapper = document.querySelector("#cards");
        const $cards = document.querySelectorAll(".card");
        const $cardsWrapper1 = document.querySelector("#cards1");
        const $cards1 = document.querySelectorAll(".card1");
        const $cardsWrapper2 = document.querySelector("#cards2");
        const $cards2 = document.querySelectorAll(".card2");
        if ($cardsWrapper && $cards.length) {
            const numCards = $cards.length;
            const isMobileDevice = window.innerWidth <= 991.98;
            const offSetFactor = isMobileDevice ? 70 : 100;
            $cards.forEach((($card, index0) => {
                const index = index0 + 1;
                const reverseIndex0 = numCards - index;
                scroll_scroll(animate($card, {
                    scale: [ 1, 1 - .1 * reverseIndex0 ],
                    opacity: [ 1, 1 - .6 * reverseIndex0 ]
                }), {
                    target: $cardsWrapper,
                    offset: [ `${index0 / numCards * offSetFactor}%`, `${index / numCards * offSetFactor}%` ]
                });
            }));
        }
        if ($cardsWrapper1 && $cards1.length) $cards1.forEach(($card1 => {
            scroll_scroll(animate($card1, {
                scale: [ 1, .6 ],
                opacity: [ 1, 0 ]
            }), {
                target: $cardsWrapper1,
                offset: [ `start start`, `20% start` ]
            });
        }));
        if ($cardsWrapper2 && $cards2.length) $cards2.forEach(($card2 => {
            scroll_scroll(animate($card2, {
                scale: [ 1, .6 ],
                opacity: [ 1, 0 ]
            }), {
                target: $cardsWrapper2,
                offset: [ `start start`, `20% start` ]
            });
        }));
    }));
    document.querySelectorAll("[data-rotate]").forEach((el => {
        let active = false, tick = false;
        const container = el.closest("[data-rotate-container]");
        const max = parseFloat(el.dataset.rotateMax || 180);
        const axis = el.dataset.rotateAxis || "";
        new IntersectionObserver((([e]) => active = e.isIntersecting)).observe(container);
        const onScroll = () => {
            if (!active || tick) return;
            tick = true;
            requestAnimationFrame((() => {
                const r = container.getBoundingClientRect();
                const p = Math.min(Math.max((innerHeight - r.top) / (r.height + innerHeight), 0), 1);
                el.style.transform = `rotate${axis.toUpperCase()}(${p * max}deg)`;
                tick = false;
            }));
        };
        addEventListener("scroll", onScroll, {
            passive: true
        });
        addEventListener("resize", onScroll);
        onScroll();
    }));
    document.querySelectorAll(".wave-wrapp").forEach((block => {
        const waves = block.querySelectorAll(".wave");
        let lastScrollY = window.scrollY;
        let phaseOffset = 0;
        let ticking = false;
        let active = false;
        const observer = new IntersectionObserver((entries => {
            entries.forEach((entry => {
                active = entry.isIntersecting;
                if (active) {
                    window.addEventListener("scroll", onScroll, {
                        passive: true
                    });
                    requestAnimationFrame(animateWaves);
                } else window.removeEventListener("scroll", onScroll);
            }));
        }), {
            threshold: .1
        });
        observer.observe(block);
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(animateWaves);
                ticking = true;
            }
        }
        function animateWaves() {
            if (!active) return;
            const scrollY = window.scrollY;
            const delta = scrollY - lastScrollY;
            lastScrollY = scrollY;
            phaseOffset += delta * .01;
            const isMobile = window.innerWidth <= 768;
            const baseX = isMobile ? 10 : 15;
            const baseY = isMobile ? 1.5 : 2.5;
            const phaseX = isMobile ? 2.5 : 4;
            waves.forEach(((wave, i) => {
                const phase = phaseOffset + i * .03;
                const x = Math.cos(phase) * (baseX + i % 2 * phaseX);
                const y = Math.sin(phase * 2 + i) * (baseY + i % 3);
                wave.style.transform = `translate(${x}px, ${y}px)`;
            }));
            ticking = false;
        }
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        document.querySelectorAll(".team-member").forEach((function(card) {
            card.querySelectorAll(".trigger").forEach((function(trigger) {
                trigger.addEventListener("click", (function() {
                    card.classList.toggle("active");
                }));
            }));
        }));
    }));
    window["FLS"] = true;
    isWebp();
    addLoadedClass();
    spollers();
    rippleEffect();
    pageNavigation();
    headerScroll();
    digitsCounter();
})();