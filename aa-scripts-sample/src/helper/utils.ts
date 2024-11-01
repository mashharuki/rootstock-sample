import { ethers } from "ethers";
import { UserOperationStruct } from "./types.ts";
import { toHex } from "viem";

export function toJSON(op: Partial<UserOperationStruct>): Promise<any> {
  return ethers.resolveProperties(op).then((userOp) =>
    Object.keys(userOp)
      .map((key) => {
        let val = (userOp as any)[key];
        if (typeof val !== "string" || !val.startsWith("0x")) {
          val = toHex(val);
        }
        return [key, val];
      })
      .reduce(
        (set, [k, v]) => ({
          ...set,
          [k]: v,
        }),
        {}
      )
  );
}

export async function printOp(
  op: Partial<UserOperationStruct>
): Promise<string> {
  return toJSON(op).then((userOp) => JSON.stringify(userOp, null, 2));
}

export function sleep(sec: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, sec * 1000));
}
