const _WARNING_NOTIFICATION_ID = "warning-notification";
const _ERROR_NOTIFICATION_ID = "error-notification";
const _INFO_NOTIFICATION_ID = "info-notification";
const _PIXEL_CLOSE = "-56px";
const _PIXEL_OPEN = "8px";

type NotificationType = "ERROR" | "WARN" | "INFO";

export function InfoNotification(): JSX.Element {
  return (
    <div
      id={_INFO_NOTIFICATION_ID}
      className="fixed cursor-help -top-14 w-80 h-14 bg-slate-500 transition-[top] duration-500 rounded-md p-2 flex flex-row">
      <div className="w-14 h-full flex items-center justify-center">
        <h1>?</h1>
      </div>

      <div className="h-full flex flex-col justify-center">
        <h2 className="text-gray-800">Testing</h2>
      </div>
    </div>
  )
}

export function WarningNotification(): JSX.Element {
  return (
    <div
      id={_WARNING_NOTIFICATION_ID}
      className="fixed cursor-help -bottom-14 w-80 h-14 bg-yellow-500 transition-[bottom] duration-500 rounded-md p-2 flex flex-row">
      <div className="w-14 h-full flex items-center justify-center">
        <h1>?</h1>
      </div>

      <div className="h-full flex flex-col justify-center">
        <h2 className="text-gray-800">Testing</h2>
      </div>
    </div>
  )
}

export function ErrorNotification(): JSX.Element {
  return (
    <div
      id={_ERROR_NOTIFICATION_ID}
      className="fixed cursor-help -bottom-14 w-80 h-14 bg-red-500 transition-[bottom] duration-500 rounded-md p-2 flex flex-row">
      <div className="w-14 h-full flex items-center justify-center">
        <h1>?</h1>
      </div>

      <div className="h-full flex flex-col justify-center">
        <h2 className="text-gray-800">Testing</h2>
      </div>
    </div>
  )
}

export const WarningNotificationController = (() => {
  let visible = false;
  let queue = new Array<[NotificationType, string, number]>();
  let typeSelected: NotificationType;

  function getElements(): [HTMLElement, HTMLHeadingElement] {
    const id = (() => {
      switch (typeSelected) {
        case "ERROR": return _ERROR_NOTIFICATION_ID;
        case "WARN": return _WARNING_NOTIFICATION_ID;
        case "INFO": return _INFO_NOTIFICATION_ID;
      }
    })();
    const container = document.getElementById(id);
    if(!container) throw Error("Element (container) don't exists with this id: " + id);

    const content = container.getElementsByTagName("h2").item(0);
    if(!content) throw Error("Element (content) don't exists")

    return [container, content];
  }

  function show(type: NotificationType, message: string, duration: number = 5) {
    if(visible) {
      queue.push([type, message, duration]);
      return;
    }
    visible = true;
    typeSelected = type;

    const [container, content] = getElements();

    typeSelected === "INFO" ? container.style.top = _PIXEL_OPEN : container.style.bottom = _PIXEL_OPEN;
    content.innerText = message;
    container.onclick = (_ev: MouseEvent) => {
      navigator.clipboard.writeText(message);
    }

    setTimeout(() => {
      typeSelected === "INFO" ? container.style.top = _PIXEL_CLOSE : container.style.bottom = _PIXEL_CLOSE;

      setTimeout(() => {
        visible = false;

        if(queue.length) {
          const [type, message, duration] = queue.shift()!;
          show(type, message, duration);
        }
      }, 500);
    }, duration * 1000);
  }

  return {
    show
  }
})();
