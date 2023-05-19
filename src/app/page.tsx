"use client";

import { useEffect, useState } from "react";
import IWindow from "./models/iwindow.model";
import LeftNav from "./layouts/LeftNav";

export default function Home() {
  const [isLoading, setLoading] = useState(false);
  const [hasEthereum, setHasEthereum] = useState(false);

  useEffect(() => {
    setHasEthereum((window as unknown as IWindow).ethereum != null);
    setLoading(false);
  }, []);

  return (
    <>
      <LeftNav></LeftNav>
    </>
  );
}
