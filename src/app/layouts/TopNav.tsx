import { useEffect } from "react";
import { themeChange } from "theme-change";

export default function TopNav() {
    useEffect(() => {
        themeChange(false);
        // 👆 false parameter is required for react project
    }, []);

    return;
    <></>;
}
