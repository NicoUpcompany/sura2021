import React from "react";

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { SvgAvatar } from '../../util/svgavatar';

import Avatar from "../Avatar";
import ToolTip from "../ToolTip";
import ReplyCount from "../ReplyCount";

import { 
  messageContainerStyle,
  messageWrapperStyle,
  messageThumbnailStyle,
  messageDetailStyle,
  nameWrapperStyle,
  nameStyle,
  messageFileWrapperStyle,
  messageInfoWrapperStyle,
  messageTimestampStyle
} from "./style";

import blueFile from "./resources/file-blue.svg";

const receiverfilebubble = (props) => {

  let avatar = null, name = null;
  if(props.message.receiverType === 'group') {

    if(!props.message.sender.avatar) {

      const uid = props.message.sender.getUid();
      const char = props.message.sender.getName().charAt(0).toUpperCase();

      props.message.sender.setAvatar(SvgAvatar.getAvatar(uid, char));
    } 

    avatar = (
      <div css={messageThumbnailStyle()}>
        <Avatar 
        cornerRadius="50%" 
        borderColor={props.theme.color.secondary}
        borderWidth="1px"
        image={props.message.sender.avatar} />
      </div>
    );

    name = (<div css={nameWrapperStyle(avatar)}><span css={nameStyle(props)}>{props.message.sender.name}</span></div>);
  }

  const message = Object.assign({}, props.message, {messageFrom: "receiver"});

  return (

    <div css={messageContainerStyle()}>
      <div css={messageWrapperStyle()}>
        {avatar}
        <div css={messageDetailStyle(name)}>
          {name}
          <ToolTip action="viewMessageThread" {...props} message={message} />    
          <div css={messageFileWrapperStyle(props)}>
            <a href={props.message.data.attachments[0].url} target="_blank" rel="noopener noreferrer">{props.message.data.attachments[0].name} <img src={blueFile} alt="file"/></a>                        
          </div>
          <div css={messageInfoWrapperStyle()}>
            <span css={messageTimestampStyle(props)}>{new Date(props.message.sentAt * 1000).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
            <ReplyCount action="viewMessageThread" {...props} message={message} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default receiverfilebubble;