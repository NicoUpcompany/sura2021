import React from "react";

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";

import CometChatUserList from "../../CometChatUserList";
import CometChatGroupList from "../../CometChatGroupList";
import CometChatConversationList from "../../CometChatConversationList";
import CometChatUserInfoScreen from "../../CometChatUserInfoScreen";
import { Popover, Tooltip } from "antd";

import { getAccessTokenApi } from "../../../../../api/auth";
import { getStreamingApi } from "../../../../../api/Admin/streaming";

import { footerStyle, navbarStyle, itemStyle, itemLinkStyle } from "./style";

// import chatGreyIcon from "./resources/chat-grey-icon.svg";
// import chatBlueIcon from "./resources/chat-blue-icon.svg";
// import contactGreyIcon from "./resources/people-grey-icon.svg";
// import contactBlueIcon from "./resources/people-blue-icon.svg";
// import groupGreyIcon from "./resources/group-chat-grey-icon.svg";
// import groupBlueIcon from "./resources/group-chat-blue-icon.svg";
// import moreGreyIcon from "./resources/more-grey-icon.svg";
// import moreBlueIcon from "./resources/more-blue-icon.svg";

let chatBlueIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21"><g><g><path xmlns="http://www.w3.org/2000/svg" fill="#141414" fill-opacity=".4" d="M15 6.65H5c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm-4 6H5c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-6-5h10c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm13-7H2c-1.1 0-1.99.9-1.99 2l-.01 18 4-4h14c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2z"/></g></g></svg>`;
let chatGreyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21"><g><g><path xmlns="http://www.w3.org/2000/svg" fill="#141414" fill-opacity=".4" d="M15 6.65H5c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm-4 6H5c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-6-5h10c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm13-7H2c-1.1 0-1.99.9-1.99 2l-.01 18 4-4h14c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2z"/></g></g></svg>`;

let contactBlueIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"><g><g><path fill="#141414" fill-opacity=".4" d="M18 16.4v1.125c0 .619-.506 1.125-1.125 1.125H1.125A1.128 1.128 0 0 1 0 17.525V16.4c0-2.993 5.996-4.5 9-4.5 3.004 0 9 1.507 9 4.5zM4.5 5.15C4.5 2.664 6.514.65 9 .65s4.5 2.014 4.5 4.5-2.014 4.5-4.5 4.5a4.499 4.499 0 0 1-4.5-4.5z"/></g></g></svg>`;
let contactGreyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"><g><g><path fill="#141414" fill-opacity=".4" d="M18 16.4v1.125c0 .619-.506 1.125-1.125 1.125H1.125A1.128 1.128 0 0 1 0 17.525V16.4c0-2.993 5.996-4.5 9-4.5 3.004 0 9 1.507 9 4.5zM4.5 5.15C4.5 2.664 6.514.65 9 .65s4.5 2.014 4.5 4.5-2.014 4.5-4.5 4.5a4.499 4.499 0 0 1-4.5-4.5z"/></g></g></svg>`;

let groupBlueIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 17"><g><g><path xmlns="http://www.w3.org/2000/svg" fill="#141414" fill-opacity=".4" d="M16 13.65v2c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1v-2c0-2.66 5.33-4 8-4s8 1.34 8 4zm-3.33-5.24a5.98 5.98 0 0 0 0-7.52c.42-.14.86-.24 1.33-.24 2.21 0 4 1.79 4 4s-1.79 4-4 4c-.47 0-.91-.1-1.33-.24zM4 4.65a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm18 9v2c0 .55-.45 1-1 1h-3v-3c0-1.68-.96-2.94-2.33-3.87 2.76.4 6.33 1.69 6.33 3.87z"/></g></g></svg>`;
let groupGreyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 17"><g><g><path xmlns="http://www.w3.org/2000/svg" fill="#141414" fill-opacity=".4" d="M16 13.65v2c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1v-2c0-2.66 5.33-4 8-4s8 1.34 8 4zm-3.33-5.24a5.98 5.98 0 0 0 0-7.52c.42-.14.86-.24 1.33-.24 2.21 0 4 1.79 4 4s-1.79 4-4 4c-.47 0-.91-.1-1.33-.24zM4 4.65a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm18 9v2c0 .55-.45 1-1 1h-3v-3c0-1.68-.96-2.94-2.33-3.87 2.76.4 6.33 1.69 6.33 3.87z"/></g></g></svg>`;

const navbar = (props) => {
	const switchComponent = () => {
		getColor();
		switch (props.tab) {
			case "contacts":
				return (
					<CometChatUserList
						theme={props.theme}
						item={props.item}
						actionGenerated={props.actionGenerated}
						enableCloseMenu={props.enableCloseMenu}
						onItemClick={(item, type) =>
							props.actionGenerated("itemClicked", type, item)
						}
					></CometChatUserList>
				);
			case "calls":
				return "calls";
			case "conversations":
				return (
					<CometChatConversationList
						theme={props.theme}
						item={props.item}
						groupToUpdate={props.groupToUpdate}
						actionGenerated={props.actionGenerated}
						enableCloseMenu={props.enableCloseMenu}
						onItemClick={(item, type) =>
							props.actionGenerated("itemClicked", type, item)
						}
					></CometChatConversationList>
				);
			case "groups":
				return (
					<CometChatGroupList
						theme={props.theme}
						groupToLeave={props.groupToLeave}
						groupToDelete={props.groupToDelete}
						groupToUpdate={props.groupToUpdate}
						actionGenerated={props.actionGenerated}
						enableCloseMenu={props.enableCloseMenu}
						onItemClick={(item, type) =>
							props.actionGenerated("itemClicked", type, item)
						}
					></CometChatGroupList>
				);
			case "info":
				return (
					<CometChatUserInfoScreen
						theme={props.theme}
						onItemClick={(item, type) =>
							props.actionGenerated("itemClicked", type, item)
						}
					></CometChatUserInfoScreen>
				);
			default:
				return null;
		}
	};

	const getColor = async () => {
		const resp = await getStreamingApi(getAccessTokenApi());
		if (resp.ok) {
			chatBlueIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21"><g><g><path fill="${resp.streaming.networkingColor}" d="M15 6.65H5c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm-4 6H5c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-6-5h10c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm13-7H2c-1.1 0-1.99.9-1.99 2l-.01 18 4-4h14c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2z"/></g></g></svg>`;
			contactBlueIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"><g><g><path fill="${resp.streaming.networkingColor}" d="M18 16.4v1.125c0 .619-.506 1.125-1.125 1.125H1.125A1.128 1.128 0 0 1 0 17.525V16.4c0-2.993 5.996-4.5 9-4.5 3.004 0 9 1.507 9 4.5zM4.5 5.15C4.5 2.664 6.514.65 9 .65s4.5 2.014 4.5 4.5-2.014 4.5-4.5 4.5a4.499 4.499 0 0 1-4.5-4.5z"/></g></g></svg>`;
			groupBlueIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 17"><g><g><path fill="${resp.streaming.networkingColor}" d="M16 13.65v2c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1v-2c0-2.66 5.33-4 8-4s8 1.34 8 4zm-3.33-5.24a5.98 5.98 0 0 0 0-7.52c.42-.14.86-.24 1.33-.24 2.21 0 4 1.79 4 4s-1.79 4-4 4c-.47 0-.91-.1-1.33-.24zM4 4.65a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm18 9v2c0 .55-.45 1-1 1h-3v-3c0-1.68-.96-2.94-2.33-3.87 2.76.4 6.33 1.69 6.33 3.87z"/></g></g></svg>`;
		}
	};

	const chatsTabActive = props.tab === "conversations" ? true : false;
	const userTabActive = props.tab === "contacts" ? true : false;
	const groupsTabActive = props.tab === "groups" ? true : false;
	const moreTabActive = props.tab === "info" ? true : false;

	return (
		<React.Fragment>
			{switchComponent()}
			<div css={footerStyle()}>
				<div css={navbarStyle()}>
					<div
						css={itemStyle()}
						onClick={() =>
							props.actionGenerated("tabChanged", "conversations")
						}
					>
						<span
							css={itemLinkStyle(
								chatGreyIcon,
								chatBlueIcon,
								chatsTabActive
							)}
						></span>
					</div>
					<div
						css={itemStyle()}
						onClick={() =>
							props.actionGenerated("tabChanged", "contacts")
						}
					>
						<span
							css={itemLinkStyle(
								contactGreyIcon,
								contactBlueIcon,
								userTabActive
							)}
						></span>
					</div>
					<div
						css={itemStyle()}
						onClick={() =>
							props.actionGenerated("tabChanged", "groups")
						}
					>
						<span
							css={itemLinkStyle(
								groupGreyIcon,
								groupBlueIcon,
								groupsTabActive
							)}
						></span>
					</div>
					{/* <Popover title="Grupos disponibles" content={"Puedes crear un grupo en el icono en la barra superior o unirte a uno con solo hacer click"} trigger="hover" placement="topRight" arrowPointAtCenter><span css={itemLinkStyle(groupGreyIcon, groupBlueIcon, groupsTabActive)}></span></Popover> */}
					{/* <div css={itemStyle()} onClick={() => props.actionGenerated('tabChanged', 'info')}>
            <span css={itemLinkStyle(moreGreyIcon, moreBlueIcon, moreTabActive)}></span>
          </div>  */}
				</div>
			</div>
		</React.Fragment>
	);
};

export default React.memo(navbar);
