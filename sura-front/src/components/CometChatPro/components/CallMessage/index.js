import React from "react";

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { CometChat } from "@cometchat-pro/chat";

import { callMessageStyle, callMessageTxtStyle } from "./style";

const callmessage = (props) => {

    const getMessage = () => {

        switch (props.message.action) {
    
            case CometChat.CALL_STATUS.UNANSWERED:
                return <p css={callMessageTxtStyle}>{props.message.receiver.name + " llamada perdida de " + props.message.sender.name}</p>
            case CometChat.CALL_STATUS.REJECTED:
                return <p css={callMessageTxtStyle}>{props.message.sender.name + " rechazó llamada de " + props.message.receiver.name} </p>
            case CometChat.CALL_STATUS.ONGOING:
                return <p css={callMessageTxtStyle}>{props.message.sender.name + " se unió a la llamada con " + props.message.receiver.name}</p>
            case CometChat.CALL_STATUS.INITIATED:
                return <p css={callMessageTxtStyle}>{props.message.sender.name + " inició llamada con " + props.message.receiver.name}</p>
            case CometChat.CALL_STATUS.ENDED:
                return <p css={callMessageTxtStyle}>{props.message.sender.name + " finalizó la llamada con " + props.message.receiver.name}</p>
            case CometChat.CALL_STATUS.CANCELLED:
                return <p css={callMessageTxtStyle}>{props.message.sender.name + " canceló la llamada de " + props.message.receiver.name}</p>
            default:
                break;
        }
    }

    return (
        <div css={callMessageStyle()}>{getMessage()}</div>
    )
}

export default callmessage;