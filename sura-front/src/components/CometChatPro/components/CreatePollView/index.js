import React from "react";

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { removeOptionIconStyle } from "./style";

import removeIcon from "./resources/remove.png";
import { iconWrapperStyle } from "../CometChatCreatePoll/style";

const createpollview = (props) => {

    return (
        <tr>
            <td>&nbsp;</td>
            <td>
                <input 
                autoFocus
                type="text" 
                autoComplete="off" 
                placeholder="Ingrese su opción" 
                value={props.value}
                onChange={(event) => props.optionChangeHandler(event, props.option)} />
            </td>
            <td css={iconWrapperStyle()}><span css={removeOptionIconStyle(removeIcon)} onClick={() => props.removePollOption(props.option)}></span></td>
        </tr>
    );
}

export default createpollview;