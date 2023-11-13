import React, { useEffect, useState } from 'react';
import './board.css';
import io from 'socket.io-client';
import Friends from '../friends/page'
import axios from "@node_modules/axios/index";
import User from "@app/User";

const socket = io('http://localhost:5000', {reconnect: true})

function Messages() {
    const [user, setUser] = useState(new User());
    const [friends, setFriends] = useState([]);
    const [currentChats, setCurrentChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [inputMessage, setInputMessage] = useState('');

    const [currentKeys, setCurrentKeys] = useState([])

    const hostAddress = user.email;

    useEffect(() => {
        const currentUser = JSON.parse(sessionStorage.getItem("user"));
        setUser(currentUser);
    }, []);

    useEffect(() => {
        if (user['email'] !== undefined) {
            axios.post('http://localhost:5000/fetch_friends', {
                email: user['email']
            })
                .then(response => {
                    setFriends(response.data.friends.map(friendObj => friendObj["friend"]));
                })
                .catch(error => {
                    console.error('Error making the API call:', error);
                });


        }
    }, [user]);

    useEffect(() => {
        if (friends.length && user['email'] !== undefined) {
            axios.post('http://localhost:5000/messages', {
                email: user['email'],
                friends: friends
            })
                .then(response => {
                    setCurrentChats(prevChats => [...prevChats, ...response.data.chats]);
                    setCurrentKeys(prevKeys => [...prevKeys, ...response.data.chat_keys]);

                    console.log(friends)
                })
                .catch(error => {
                    console.error('Error making the API call:', error);
                });
        }
    }, [friends]);

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('join', hostAddress);
            console.log("Joined Server:" + hostAddress)
        });

        socket.on('message', (data) => {
            console.log(data);
        });

        socket.on('message_response', async (data) => {
            console.log("Received Response");
            const chatKey = data.key;
            console.log(chatKey);
            await axios.post("http://localhost:5000/refresh_msg", {
                chat_key: chatKey
            }).then(response => {
                console.log("Received Updates");
                setCurrentChats(response.data);
            }).catch(error => {
                console.error('Error making the API call:', error);
            });

            return () => {
                socket.off('message_response');
            };
        });
    }, [selectedChat, hostAddress]);

    const sendMessage = () => {

        let to;
        const users = selectedChat.split(':');
        const user1 = users[0];
        const user2 = users[1];

        if (user1 === hostAddress) {

            to = user2
        } else {
            to = user1
        }

        const data = {
            IP_FROM: hostAddress,
            IP_TO: to,
            content: inputMessage
        };

        socket.emit('new_message', data);

        let chatKey = selectedChat;
        const updatedChats = currentChats.map(chat => {
            if (chat[chatKey]) {
                console.log("Adding Locally!")
                return {
                    ...chat,
                    [chatKey]: [...chat[chatKey], {'content': inputMessage}]
                };
            }
            return chat;
        });

        setCurrentChats(updatedChats);
        setInputMessage('');
    };

    return (
        <div className="App">
            <div className="chat-list">

                <div className="blocky-text">Friends</div>
                {currentKeys.map((keyObject, index) => {

                    return (
                        <button
                            key={keyObject}
                            onClick={() => setSelectedChat(keyObject)}
                            className="chat-button">
                            {friends[index]}
                        </button>
                    );
                })}

                <div className="blocky-text">GroupChats</div>
            </div>
            <div className="chat-content">

                {selectedChat && (
                    currentChats.find(chat => chat.hasOwnProperty(selectedChat))?.[selectedChat]?.map((message, index) => (
                        <div key={index}>{message.content}</div>
                    ))
                )}
                {selectedChat && (
                    <div className="input-container">
                        <input
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;
