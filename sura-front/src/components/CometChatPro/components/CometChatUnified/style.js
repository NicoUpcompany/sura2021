export const unifiedStyle = (theme) => {

    return {
        display: "flex",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: `${theme.fontFamily}`,
        "*": {
            boxSizing: "border-box",
            fontFamily: `${theme.fontFamily}`,
        }
    }
}

export const unifiedSidebarStyle = (state, theme) => {

    const sidebarView = (state.sidebarview) ? {
        right: "0",
        // boxShadow : "rgba(0, 0, 0, .4) -30px 0 30px 30px"
    } : {
        display: "flex",
        right: "0",
        zIndex: "1"
    };

    const mq = [`@media (min-width : 310px) and (max-width: 320px)`];

    return {

        // width: "400px",
        borderRight: `1px solid ${theme.borderColor.primary}`,
        height: "100%",
        // position: "relative",
        display: "flex",
        flexDirection: "column",
        "> .css-uevzfr": {
            height: "calc(100% - 50px)",
        },
        position: "absolute!important",
        // display: "none",
        right: "-100%",
        top: "0",
        bottom: "0",
        width: "400px",
        zIndex: "2",
        // backgroundColor: `${theme.backgroundColor.white}`,
        backgroundColor: '#2d2d2d',
        transition: "all .3s ease-out",
        ...sidebarView,
        [mq[0]]: {
            position: "fixed!important",
            left: "-100%",
            top: "0",
            bottom: "0",
            width: "100%!important",
            zIndex: "2",
            backgroundColor: `${theme.backgroundColor.white}`,
            transition: "all .3s ease-out",
            ...sidebarView
        }
    }
}

export const unifiedMainStyle = (state) => {

    const secondaryView = (state.threadmessageview || state.detailview) ? {
        width: "calc(100% - 680px)"
    } : {};

    const mq = [`@media (min-width : 310px) and (max-width: 320px)`];

    return {
        // width: "calc(100% - 280px)",
        height: "100%",
        order: "2",
        ...secondaryView,
        width: "100%!important",
        [mq[0]]: {
            width: "100%!important",
        }
    }
}

export const unifiedSecondaryStyle = (theme) => {
    
    const mq = [`@media (min-width : 310px) and (max-width: 320px)`];

    return {
        float: "right",
        borderLeft: `1px solid ${theme.borderColor.primary}`,
        height: "100%",
        // width: "400px",
        display: "flex",
        flexDirection: "column",
        order: "3",
        position: "absolute!important",
        right: "0!important",
        top: "0",
        bottom: "0",
        width: "100%!important",
        zIndex: "2",
        backgroundColor: `${theme.backgroundColor.white}`,
        [mq[0]]: {
            position: "absolute!important",
            right: "0!important",
            top: "0",
            bottom: "0",
            width: "100%!important",
            zIndex: "2",
            backgroundColor: `${theme.backgroundColor.white}`,
        }
    }
}