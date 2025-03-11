import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function ChatPage({ username, recipient }) {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const connect = () => {
            const socket = new SockJS("http://localhost:8086/ws-chat");
            const stompClient = Stomp.over(socket);
            stompClient.connect({}, () => {
                console.log("Connected!");
                stompClient.subscribe(`/user/${username}/queue/messages`, onMessageReceived);
            }, onError);
            setStompClient(stompClient);
        };

        const onError = (error) => {
            console.error("WebSocket connection error: ", error);
            setTimeout(connect, 5000); // Retry every 5 seconds
        };

        connect();
    }, [username]);

    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        console.log("Message received: ", message); // Log received message

        // Kiểm tra xem tin nhắn đã tồn tại hay chưa
        setMessages((prevMessages) => {
            if (!prevMessages.find(msg => msg.timestamp === message.timestamp && msg.sender === message.sender && msg.content === message.content)) {
                return [...prevMessages, message];
            }
            return prevMessages; // Không thêm nếu đã tồn tại
        });
    };

    const sendMessage = () => {
        if (stompClient && stompClient.connected) {
            const chatMessage = {
                sender: username,
                receiver: recipient,
                content: message,
                timestamp: new Date().getTime(), // Sử dụng timestamp dạng số để dễ so sánh
            };
            stompClient.send("/app/chat.sendPrivateMessage", {}, JSON.stringify(chatMessage));
            setMessage("");

            // Thêm tin nhắn vào danh sách để hiển thị
            setMessages((prevMessages) => {
                if (!prevMessages.find(msg => msg.timestamp === chatMessage.timestamp && msg.sender === chatMessage.sender && msg.content === chatMessage.content)) {
                    return [...prevMessages, chatMessage];
                }
                return prevMessages; // Không thêm nếu đã tồn tại
            });
            
        } else {
            console.error("STOMP client is not connected!");
        }
    };

    return (
        <div>
            <h2>Chat with {recipient}</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatPage;
