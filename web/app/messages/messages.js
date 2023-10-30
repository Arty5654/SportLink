import React, {useEffect, useState} from 'react';
import './board.css';
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

function Messages() {

    useEffect(() => {

        socket.on('connect', () => {
            // Join a "room" corresponding to its own IP/port
            console.log("HERE");
            socket.emit('join', hostAddress); // or 'localhost:3001' for the other frontend
        });

        socket.on('message', (data) => {
            console.log(data);  // Handle the received message here
        });

        socket.on('message_response', (data) => {
            const { name, content, IP_FROM } = data;

            setCurrentChats(prevChats => {
                if (prevChats[name]) {
                    // If the chat with the given name already exists, append the new message
                    return {
                        ...prevChats,
                        [name]: [...prevChats[name], content]
                    };
                } else {
                    // If the chat with the given name doesn't exist, create it and initialize with the new message
                    return {
                        ...prevChats,
                        [name]: [content]
                    };
                }
            });
            if (!chatIPs[name]) {
                setChatIPs(prevIPs => ({
                    ...prevIPs,
                    [name]: IP_FROM
                }));
            }
        });

    }, []);
    const [currentChats, setCurrentChats] = useState({
        'Alice': ['Hello!', 'How are you?'],
        'Bob': ['Hey!', 'Long time no see.'],
        'Charlie': ['Yo!', 'Whats up?']
    });
    const hostAddress = `${window.location.hostname}:${window.location.port}`;

    const [chatIPs, setChatIPs] = useState({});
    const [selectedChat, setSelectedChat] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [newChatName, setNewChatName] = useState('');
    const [newChatIP, setNewChatIP] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sendMessage = () => {
        // Gather required data for API call
        const data = {
            IP_FROM: hostAddress,
            IP_TO: chatIPs[selectedChat],
            name: selectedChat,
            content: inputMessage
        };

        // Make an API call
        socket.emit('new_message', data);

        setCurrentChats(prevChats => ({
            ...prevChats,
            [selectedChat]: [...prevChats[selectedChat], inputMessage]
        }));
        setInputMessage('');

    };

    const addNewChat = () => {
        if (newChatName && newChatIP) {
            setCurrentChats(prevChats => ({
                ...prevChats,
                [newChatName]: []
            }));
            setChatIPs(prevIPs => ({
                ...prevIPs,
                [newChatName]: newChatIP
            }));
            setNewChatName('');
            setNewChatIP('');
            setIsModalOpen(false);
        }
    };

    return (
        <div className="App">
            <div className="chat-list">
                {Object.keys(currentChats).map(name => (
                    <button
                        key={name}
                        onClick={() => setSelectedChat(name)}
                        className="chat-button">
                        {name}
                    </button>
                ))}
                <button onClick={() => setIsModalOpen(true)}>New Chat</button>
            </div>
            <div className="chat-content">
                <div className="messages-container">
                    {selectedChat && currentChats[selectedChat].map((message, index) => (
                        <div key={index}>{message}</div>
                    ))}
                </div>
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

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add a New Chat</h2>
                        <input
                            placeholder="Name"
                            value={newChatName}
                            onChange={e => setNewChatName(e.target.value)}
                        />
                        <input
                            placeholder="IP Address"
                            value={newChatIP}
                            onChange={e => setNewChatIP(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={addNewChat}>Add</button>
                            <button onClick={() => setIsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messages;
