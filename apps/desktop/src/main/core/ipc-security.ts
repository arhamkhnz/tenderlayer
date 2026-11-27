import type { IpcMainInvokeEvent } from "electron/main";

import { isTrustedRendererUrl, trustedRendererOrigin } from "./renderer-protocol.js";

function isTrustedSender(event: IpcMainInvokeEvent) {
  const senderFrame = event.senderFrame;

  if (!senderFrame || senderFrame !== event.sender.mainFrame) {
    return false;
  }

  return senderFrame.origin === trustedRendererOrigin && isTrustedRendererUrl(senderFrame.url);
}

export function assertTrustedSender(event: IpcMainInvokeEvent) {
  if (!isTrustedSender(event)) {
    throw new Error("Blocked IPC request from an untrusted sender");
  }
}
