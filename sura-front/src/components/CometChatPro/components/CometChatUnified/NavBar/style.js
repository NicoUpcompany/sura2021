export const footerStyle = () => {

    return {
        width: "100%",
        zIndex: "1",
    }
}

export const navbarStyle = () => {

    return {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    }
}

export const itemStyle = () => {

    return {
        display: "inline-block",
        padding: "13px",
        cursor: "pointer"
    }
}

export const itemLinkStyle = (icon, activeStateIcon, isActive) => {

    var mySVG64 = window.btoa(activeStateIcon);
    var mySVG642 = window.btoa(icon);
    let activeStateBg = (isActive) ? { background: "url('data:image/svg+xml;base64," + mySVG64 + "') center center / 20px 21px no-repeat" } : {};

    return {
        width: "20px",
        height: "21px",
        display: "inline-block",
        background: "url('data:image/svg+xml;base64," + mySVG642 + "') center center / 20px 21px no-repeat",
        ...activeStateBg
    }
}