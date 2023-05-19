import { faCubes, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LeftNavListElement from "../components/LeftNavListElement";
import Link from "next/link";
import Image from "next/image";

export default function LeftNav() {
  return (
    <>
      <nav className="flex flex-col gap-12 p-4 app-left-navbar">
        <ul className="flex flex-col text-lg">
          <Link href="/">
            <Image
              className="p-2 rounded hover:cursor-pointer"
              alt="logo"
              src="/logo.svg"
              width={55}
              height={0}
            />
          </Link>
          <Link href={"blocks"}>
            <LeftNavListElement>
              <FontAwesomeIcon
                className="p-4 rounded hover:bg-zinc-200 hover:cursor-pointer"
                icon={faCubes}
              />
            </LeftNavListElement>
          </Link>
          <LeftNavListElement>
            <FontAwesomeIcon
              className="p-4 rounded hover:bg-zinc-200 hover:cursor-pointer"
              icon={faReceipt}
            />
          </LeftNavListElement>
        </ul>
      </nav>
    </>
  );
}
