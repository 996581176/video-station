mouse();
time();
recording();
interceptorsXHR();

/** 鼠标右键解除屏蔽 */
function mouse() {
  const defaultAddEventListener = SYNO.SDS.GetBody().addEventListener;
  SYNO.SDS.GetBody().addEventListener = function () {
    if (arguments[0] === "contextmenu") return;
    defaultAddEventListener(...arguments);
  };
}

/** 播放时间跳转 */
function time() {
  const css = `
    .button {
      margin-left: 5px;
      padding: 7px 15px;
      font-size: 12px;
      color: #606266;
      background: #fff;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      cursor: pointer;
      &:hover{
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }
    .input {
      margin-left: 5px;
      padding: 0 15px;
      width: 20%;
      height: 81%;
      line-height: 40px;
      color: #606266;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
    }
  `;
  GM_addStyle(css);
  // 输入框
  const input = document.createElement("input");
  input.value = localStorage.getItem("time") || "";
  input.classList.add("input");
  // 跳转按钮
  const button = document.createElement("button");
  button.innerText = "跳转";
  button.classList.add("button");
  const callback: (this: HTMLButtonElement, ev: MouseEvent) => any = (e) => {
    const videoPlayer =
      document.querySelector<HTMLVideoElement>("#_html5_video_player") ||
      document.querySelector<HTMLVideoElement>("#_hls_video_player");
    if (!videoPlayer || input.value.length === 0) return;
    localStorage.setItem("time", input.value);
    const timeArr = input.value.split(":");
    let time: number = 0;
    if (timeArr.length === 1) time = +timeArr[0];
    if (timeArr.length === 2) time = +timeArr[0] * 60 + +timeArr[1];
    if (timeArr.length === 3)
      time = +timeArr[0] * 60 * 60 + +timeArr[1] * 60 + +timeArr[2];
    if ((e.target as HTMLButtonElement).innerText === "跳转") {
      videoPlayer.currentTime = time;
    } else if ((e.target as HTMLButtonElement).innerText === "前进") {
      videoPlayer.currentTime += time;
    }
  };
  button.addEventListener("click", callback);
  // 前进按钮
  const button2 = document.createElement("button");
  button2.innerText = "前进";
  button2.classList.add("button");
  button2.addEventListener("click", callback);
  let isCreate = false;
  const observerCallback: MutationCallback = () => {
    const videoPlayer =
      document.querySelector<HTMLVideoElement>("#_html5_video_player") ||
      document.querySelector<HTMLVideoElement>("#_hls_video_player");
    if (!videoPlayer) {
      isCreate = false;
      return;
    }
    if (isCreate) return;
    isCreate = true;
    const timeBar = document.querySelector(".syno-vc-progress-time-bar");
    timeBar?.appendChild(input);
    timeBar?.appendChild(button);
    timeBar?.appendChild(button2);
  };
  const observer = new MutationObserver(observerCallback);
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
  });
}

/** 历史记录 */
function recording() {
  const css = `
    .x-toolbar.x-small-editor.main-toolbar.syno-ux-toolbar.x-toolbar-layout-ct .x-toolbar-right-row .span {
      margin-left: 12px;
      color: #949494;
      cursor: pointer;
      &:hover {
        color: #b5b5b5;
      }
    }
    #sds-desktop {
      .history-list{
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 48px;
        right: 0;
        width: 480px;
        height: 90%;
        z-index: 9013;
        background-color: pink;
        &.hide{
          visibility: hidden;
        }
        .history-item {
          flex: 1;
          margin: 10px;
          min-height: 80px;
          background-color: red;
        }
      }
    }
  `;
  GM_addStyle(css);
  let timer = 0;
  timer = setInterval(() => {
    const el = document.querySelector<HTMLTableRowElement>(
      ".x-toolbar.x-small-editor.main-toolbar.syno-ux-toolbar.x-toolbar-layout-ct .x-toolbar-right-row"
    );
    const desktop = document.querySelector<HTMLDivElement>("#sds-desktop");
    if (el && desktop) {
      clearInterval(timer);
    } else {
      return;
    }
    // 创建按钮
    const td = document.createElement("td");
    const span = document.createElement("span");
    span.innerText = "历史记录";
    span.classList.add("span");
    td.appendChild(span);
    el.appendChild(td);
    // 创建列表
    const div = document.createElement("div");
    div.classList.add("history-list");
    div.classList.add("div", "hide");
    desktop.appendChild(div);
    span.addEventListener("click", () => div.classList.toggle("hide"));
    // 添加历史记录
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    div.appendChild(historyItem);
  }, 500);
}

/** 请求拦截替换，修复VideoStation请求地址是127.0.0.1问题 */
function interceptorsXHR() {
  const oldOpen = XMLHttpRequest.prototype.open;
  // @ts-ignore
  XMLHttpRequest.prototype.open = function (...args) {
    // @ts-ignore
    args[1] = args[1].replace("http://127.0.0.1:5000", location.origin);
    // @ts-ignore
    return oldOpen.call(this, ...args);
  };
}
