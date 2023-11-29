import React, { useEffect, useState } from 'react';
import './board.css';
import io from 'socket.io-client';
import axios from "@node_modules/axios/index";
import User from "@app/User";

const socket = io('http://localhost:5000', {reconnect: true})

function Messages() {

    const [user, setUser] = useState(new User());
    const [friends, setFriends] = useState([]);

    const [currentChats, setCurrentChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [currentKeys, setCurrentKeys] = useState([])

    const [currentGroupChats, setCurrentGroupChats] = useState([]);
    const [selectedGroupChat, setSelectedGroupChat] = useState(null);
    const [currentGroupKeys, setCurrentGroupKeys] = useState([])

    const [inputMessage, setInputMessage] = useState('');
    const [inputGroupMessage, setInputGroupMessage] = useState('')
    const hostAddress = user.email;

    const [activeButton, setActiveButton] = useState('DM');

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const [selectedMembers, setSelectedMembers] = useState([]);
    const handleFriendSelect = (friend) => {
        setSelectedMembers(prevMembers => {
            if (prevMembers.includes(friend)) {
                return prevMembers.filter(member => member !== friend);
            } else {
                return [...prevMembers, friend];
            }
        });
    };

    const handleCreateChat = () => {

        const requestData = {
            members: selectedMembers,
            user: user['email']
        };

        axios.post('http://localhost:5000/create_chat', requestData)
            .then(response => {
                console.log('Chat created successfully:', response.data);
                setCurrentGroupChats(prevGChats => [...prevGChats, ...response.data])
                setCurrentGroupKeys(prevGKeys => [...prevGKeys, ...response.data.key])
                togglePopup();
            })
            .catch(error => {
                console.error('Error creating chat:', error);
            });
    };

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
    };
    const buttonStyle = {
        width: '50%', // Each button takes up half the width of the container
        padding: '20px',
        border: 'none',
        borderRadius: '0', // No border radius for a full-width effect
        cursor: 'pointer',
        fontSize: '20px', // Larger font size for better visibility
    };


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
                })
                .catch(error => {
                    console.error('Error making the API call:', error);
                });
            // Fetch group chats
            axios.post('http://localhost:5000/group_messages', {
                email: user['email']
            })
                .then(response => {

                    console.log(response.data)
                    setCurrentGroupChats(response.data.group_chats)
                    setCurrentGroupKeys(response.data.group_keys)
                })
                .catch(error => {
                    console.error('Error fetching group messages:', error);
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

        const messageResponseHandler = async (data) => {
            console.log("Received Response");
            const chatKey = data.key;
            console.log(chatKey);
            try {
                const response = await axios.post("http://localhost:5000/refresh_msg", {
                    chat_key: chatKey
                });
                console.log("Received Updates");

                // Assuming setCurrentChats updates the entire chat state
                setCurrentChats(response.data);

            } catch (error) {
                console.error('Error making the API call:', error);
            }
        };
        const groupMessageResponseHandler = async (data) => {
            console.log("Recieved Group Message")
            let updatedGroupChats = [];
            let chatKey = data.key
            console.log(currentGroupChats.length)
            for (let i = 0; i < currentGroupChats.length; i++) {
                const chat = currentGroupChats[i];

                console.log(chatKey)
                console.log(data.key)
                console.log(currentGroupChats[i])
                if (chat.key === chatKey) {
                    console.log("RAHHHH!");
                    updatedGroupChats.push({
                        ...chat,
                        messages: [...chat.messages, {content: data.content}]
                    });
                } else {
                    updatedGroupChats.push(chat);
                }
            }
            console.log(updatedGroupChats)
        }
        socket.on('message_response', messageResponseHandler);

        socket.on('group_response', groupMessageResponseHandler);
        // Cleanup function
        return () => {
            socket.off('connect');
            socket.off('message');
            socket.off('message_response', messageResponseHandler);
        };
    }, [selectedChat, hostAddress]); // Dependencies

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

    const sendGroupMessage = () => {

        let members = selectedGroupChat.split(':')
        let temp_user = user['email']

        /* remove curr user */
        let filteredMembers = members.filter(member => member !== temp_user);

        console.log(filteredMembers)

        const data = {
            user: temp_user,
            members: filteredMembers,
            content: inputGroupMessage
        };

        socket.emit('group_message', data);

        let chatKey = selectedGroupChat;
        console.log(currentGroupChats)
        const updatedGroupChats = currentGroupChats.map(chat => {

            if (chat.key === chatKey) {
                console.log("Adding Locally!");
                return {
                    ...chat,
                    messages: [...chat.messages, { content: inputGroupMessage }]
                };
            }
            return chat;
        });


        setCurrentGroupChats(updatedGroupChats);
        setInputGroupMessage('');
    };

    return (
        <div className="simple-shadow">
            <div style={{ display: 'flex', width: '100%' }}>
                <button
                    onClick={() => handleClick('DM')}
                    style={{
                        ...buttonStyle,
                        backgroundColor: activeButton === 'DM' ? '#778396' : '#ccc',
                        color: activeButton === 'DM' ? 'white' : 'black',
                    }}
                >
                    Friends
                </button>
                <button
                    onClick={() => handleClick('Groups')}
                    style={{
                        ...buttonStyle,
                        backgroundColor: activeButton === 'Groups' ? '#778396' : '#ccc',
                        color: activeButton === 'Groups' ? 'white' : 'black',
                    }}
                >
                    Groups
                </button>
            </div>
            {activeButton === 'DM' && (
                <div className="App">
                    <div className="chat-list">
                    {currentKeys.map(keyObject => {

                        return (
                            <button
                                key={keyObject}
                                onClick={() => setSelectedChat(keyObject)}
                                className="chat-button">
                                {keyObject}
                            </button>
                        );
                    })}
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
            )}
            {activeButton === 'Groups' && (
                <div className="App">
                    <div className="chat-list">
                        {currentGroupKeys.map(keyObject => {


                            return (
                                <button
                                    key={keyObject}
                                    onClick={() => setSelectedGroupChat(keyObject)}
                                    className="chat-button">
                                    {keyObject}
                                </button>
                            );
                        })}
                        <button className="chat-button" onClick={togglePopup}>New Chat</button>

                    </div>
                    <div className="chat-content">
                        {selectedGroupChat && (
                            currentGroupChats.find(chat => chat.key === selectedGroupChat)?.messages.map((message, index) => (
                                <div key={index}>{message.content}</div>
                            ))
                        )}
                        {selectedGroupChat && (
                            <div className="input-container">
                                <input
                                    value={inputGroupMessage}
                                    onChange={e => setInputGroupMessage(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <button onClick={sendGroupMessage}>Send</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="friends-list">
                            {friends.map(friend => (
                                <button key={friend}
                                        onClick={() => handleFriendSelect(friend)}
                                        className="friend-button">
                                    {friend}
                                </button>
                            ))}
                        </div>
                        <div className="selected-members">
                            {selectedMembers.map((member, index) => (
                                <span
                                    key={index}
                                    className="selected-member-bubble"
                                    onClick={() => handleFriendSelect(member)} // To allow deselection
                                >
                                    {member}
                                </span>
                            ))}
                        </div>
                        <div className="button-container">
                            <button onClick={handleCreateChat} className="popup-button create-button">Create</button>
                            <button onClick={togglePopup} className="popup-button cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messages;
