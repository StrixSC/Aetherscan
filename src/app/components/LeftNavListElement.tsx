import { PropsWithChildren } from "react";

export default function LeftNavListElement(props: PropsWithChildren) {
  return (
    <>
      <li className="flex items-center justify-start gap-4 align-middle">
        {props.children}
      </li>
    </>
  );
}
