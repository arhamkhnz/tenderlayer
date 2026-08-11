import type { IpcMainInvokeEvent } from "electron/main";
import { isTrustedRendererUrl } from "./renderer-protocol.js";

function isTrustedSender(event: IpcMainInvokeEvent) {
  const senderFrame = event.senderFrame;

  if (!senderFrame || senderFrame !== event.sender.mainFrame) {
    return false;
  }

  return isTrustedRendererUrl(senderFrame.url);
}

export function assertTrustedSender(event: IpcMainInvokeEvent) {
  if (!isTrustedSender(event)) {
    throw new Error("Blocked IPC request from an untrusted sender");
  }
}
