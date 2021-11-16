import { CometChat } from "@cometchat-pro/chat";

// import { notification } from 'antd';

// import audio from '../../../assets/audio/audio.mp3';

export class UserListManager {

    userRequest = null;
    userListenerId = "userlist_" + new Date().getTime();

    constructor(friendsOnly, searchKey) {

        if (searchKey) {
            this.usersRequest = new CometChat.UsersRequestBuilder().setLimit(30).friendsOnly(friendsOnly).setSearchKeyword(searchKey).build();
        } else {
            this.usersRequest = new CometChat.UsersRequestBuilder().setLimit(30).friendsOnly(friendsOnly).build();
        }
    }

    fetchNextUsers() {
        return this.usersRequest.fetchNext();
    }

    attachListeners(callback) {
        
        CometChat.addUserListener(
            this.userListenerId,
            new CometChat.UserListener({
                onUserOnline: onlineUser => {
                    /* when someuser/friend comes online, user will be received here */
                    callback(onlineUser);
                },
                onUserOffline: offlineUser => {
                    /* when someuser/friend went offline, user will be received here */
                    callback(offlineUser);
                }
            })
        );

        // CometChat.addMessageListener(
        //     this.conversationListenerId,
        //     new CometChat.MessageListener({
        //         onTextMessageReceived: textMessage => {
        //             const newAudio = new Audio(audio);
        //             newAudio.play();
        //             notification["info"]({
        //                 message: 'Nuevo mensaje',
        //                 description: 'Tienes un nuevo mensaje'
        //             });
        //         }
        //     })
        // );
    }

    removeListeners() {

        CometChat.removeUserListener(this.userListenerId);
    }
}