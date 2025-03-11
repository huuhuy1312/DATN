import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faClose, faCommentDots, faComments, faSearch } from '@fortawesome/free-solid-svg-icons';
import './ChatBox.css';
import messageService from '../../../../services/message.service';
import sellerService from '../../../../services/seller.service';
import authService from '../../../../services/auth.service';
function ChatBox({selectedPartnerChatBox,setSelectedPartnerChatBox,showChatBox,setShowChatBox}) {
    // Get username from localStorage
    console.log(showChatBox)
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.id;
    const [userInfo,setUserInfo] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [testMessage, setTestMessage] = useState(""); // For sending to user3
    const [partners, setPartners] = useState([]);
    const [showPartners, setShowPartners] = useState(false);

    const getUserInfo=async ()=>{
        const userInfoRes = await authService.findByIds(username);
        setUserInfo(userInfoRes[0])
    }
    useEffect(() => {
        if (!username) return;

        const connect = () => {
            const socket = new SockJS("http://localhost:8086/ws-chat");
            const stompClient = Stomp.over(socket);
            stompClient.connect({}, () => {
                stompClient.subscribe(`/user/${username}/queue/messages`, onMessageReceived);
            }, onError);
            setStompClient(stompClient);
        };

        const onError = (error) => {
            console.error("WebSocket connection error: ", error);
            setTimeout(connect, 5000); // Retry every 5 seconds
        };
        getUserInfo();
        connect();
    }, [username]);
    const getReceiverBySender = async () => {
        try {
            const partnerResponse = await messageService.findPartnerBySender(username);
            console.log(partnerResponse)
            const partnerIds = partnerResponse.map(item => item.partner).join(',');
            const users = await authService.findByIds(partnerIds);
            console.log(users)
            const merged = users.map(user => {
                const partner = partnerResponse.find(p => p.partner == user.id);
                console.log(partner)
                return partner ? { ...user, unreadCount: partner.unreadCount } : { ...user, unreadCount: 0 };
            });
            console.log(merged)
            setPartners(merged);
        } catch (error) {
            console.error("Error while fetching data:", error);
        }
    };
    const getMessages = async (partner) => {
        const response = await messageService.findMessage(username, partner);
        const response2 = await messageService.updateStatus(username, partner);
        console.log(response)
        setMessages(response);
        getReceiverBySender();
    };

    // Load partner list on mount
    useEffect(() => {
        getReceiverBySender();
    }, []);
    useEffect(()=>{
        console.log(partners)
    },[partners])
    useEffect(() => {
        if (selectedPartnerChatBox) getMessages(selectedPartnerChatBox?.id);
        
    }, [selectedPartnerChatBox]);
    const onMessageReceived = async (payload) => {
        const message = JSON.parse(payload.body);
        //await messageService.updateStatus(username, message.sender);
        // setSelectedPartnerChatBox((prevPartner) => {
        //     if (prevPartner !== message.sender) {
        //         return message.sender;
        //     }
        //     return prevPartner;
        // });

        setMessages((prevMessages) => {
            if (!prevMessages.find(msg => msg.timestamp === message.timestamp && msg.sender === message.sender && msg.content === message.content)) {
                return [...prevMessages, message];
            }
            return prevMessages;
        });

        getReceiverBySender();
    };


    // Send message to selected partner
    const sendMessage = () => {
        if (stompClient && stompClient.connected && selectedPartnerChatBox) {
            const chatMessage = {
                sender: username,
                receiver: selectedPartnerChatBox?.id,
                content: message,
                timestamp: new Date().getTime(),
            };
            console.log(chatMessage)
            stompClient.send("/app/chat.sendPrivateMessage", {}, JSON.stringify(chatMessage));
            setMessage("");

            setMessages((prevMessages) => {
                if (!prevMessages.find(msg => msg.timestamp === chatMessage.timestamp && msg.sender === chatMessage.sender && msg.content === chatMessage.content)) {
                    return [...prevMessages, chatMessage];
                }
                return prevMessages;
            });
        } else {
            console.error("STOMP client is not connected!");
        }
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && message!='') {
          sendMessage()
        }
    };
    // Send test message to user3
    // const sendTestMessage = () => {
    //     if (stompClient && stompClient.connected) {
    //         const chatMessage = {
    //             sender: username,
    //             receiver: 'user3',  // Specific user for test messages
    //             content: testMessage,
    //             timestamp: new Date().getTime(),
    //         };
    //         stompClient.send("/app/chat.sendPrivateMessage", {}, JSON.stringify(chatMessage));
    //         setTestMessage("");
    //         console.log("Test message sent to user3:", chatMessage);
    //     } else {
    //         console.error("STOMP client is not connected!");
    //     }
    // };

    // Handle partner selection
    const handlePartnerClick = (partnerChatBox) => {
        setSelectedPartnerChatBox(partnerChatBox);
    };

    // Toggle partner list
    const togglePartnerList = () => {
        setSelectedPartnerChatBox(null);
        setShowPartners(!showPartners);
    };
    
    return (
        <div >
            {
            showChatBox == false ?(
            <div style={{backgroundColor:"#3498db",display:"flex",alignItems:"center", padding:"1rem 2rem",position:"fixed",bottom:0,right:0, borderRadius:5,color:"white",cursor:"pointer",zIndex:1}}
                onClick={()=>setShowChatBox(true)}
            >
                <FontAwesomeIcon icon={faCommentDots} style={{fontSize:16,marginRight:"0.5rem"}}/>
                <div style={{fontSize:16}}>Chat</div>
            </div>):(
            <div style={{ width:"50rem",height:"40rem",backgroundColor:"white",position: "fixed", right: "0", bottom: 0, color: "#3498db",boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5), 4px 4px 10px rgba(0, 0, 255, 0.4)",borderRadius:5,zIndex:1}}>
                <div className='cb-header'>
                    <div className='cb-header-title' style={{fontWeight:400, fontSize:24}}>Chat</div>
                    <div className='cb-header-icon'>
                        <FontAwesomeIcon icon={faArrowRight} style={{border:"1px dashed gray",padding:1,marginRight:5}}/>
                        <FontAwesomeIcon icon={faClose} style={{border:"1px dashed gray",padding:"1px 2px",cursor:"pointer"}}
                            onClick={()=>setShowChatBox(false)}
                        />
                    </div>
                </div>
                <div className='cb-body'>
                    <div className='cb-navbar'>
                        <div className='cb-search'>
                            <div style={{display:"flex"}}>
                                <div>
                                    <FontAwesomeIcon icon={faSearch}/>
                                </div>
                                <input type="text" style={{marginLeft: "1rem",height:"2rem",border:"none",backgroundColor:"white"}} placeholder="Tìm kiếm..." />
                            </div>
                        </div>
                        <div className='cb-navbar-user'>
                            {
                                partners.map((item,index)=>(
                                    <div className='cb-navbar-user-item' style={{cursor:"pointer"}} onClick={()=>setSelectedPartnerChatBox(item)}>
                                        <div style={{width:"20%",marginRight:"1rem"}}>
                                            <img style={{borderRadius:"50%"}} src={item?.avatar || "/avatar.png"}></img>
                                        </div>
                                        <div >
                                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                                <div style={{fontSize:12, fontWeight:"bold"}}>{item?.fullName}</div>
                                            </div>
                                            <div style={{ fontSize: 12, fontWeight: item?.unreadCount === 0 ? 'normal' : 'bold' }}>
                                                {item?.unreadCount === 0 ? 'Đã xem' : `${item?.unreadCount} chưa đọc`}
                                            </div>

                                        </div>
                                    </div>
                                ))
                            }
                            {
                                selectedPartnerChatBox != null && !partners.some(p => p.id === selectedPartnerChatBox.id) &&(
                                    <div className='cb-navbar-user-item'>
                                        <div style={{width:"20%",marginRight:"1rem"}}>
                                            <img style={{borderRadius:"50%"}} src={selectedPartnerChatBox?.avatar || "/avatar.png"}></img>
                                        </div>
                                        <div >
                                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                                <div style={{fontSize:12, fontWeight:"bold"}}>{selectedPartnerChatBox?.shopName}</div>
                                                <div style={{fontSize:12}}>07/03</div>
                                            </div>
                                            <div style={{fontSize:12}}> Chào bạn ạ Shop c...</div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className='cb-content'>
                        {
                        selectedPartnerChatBox &&(
                        <>
                            <div className='cb-content-header'>{selectedPartnerChatBox?.fullName}</div>
                            <div className='cb-content-body'>
                                <div className='cb-message-list'>
                                {
                                    messages.map((item, index) => {
                                        if (item?.sender == username) {
                                        return (
                                            <div className='cb-message-user' key={index}>
                                            <div style={{ width: "10%", marginRight: "1rem" }}>
                                                <img style={{ borderRadius: "50%" }} src={userInfo?.avatar || "/avatar.png"} alt="Avatar" />
                                            </div>
                                            <div style={{ backgroundColor: "rgba(0,0,0,0.1)", maxWidth: "80%", borderRadius: 5, padding: "0.3rem 1rem" }}>
                                                {item?.content}
                                            </div>
                                            </div>
                                        );
                                        } else {
                                        return (
                                            <div className='cb-message-reception' key={index}>
                                            <div style={{ backgroundColor: "rgba(0,0,0,0.1)", maxWidth: "80%", marginLeft: "auto", borderRadius: 5, padding: "0.3rem 1rem" }}>
                                                {item?.content}
                                            </div>
                                            <div style={{ width: "10%", marginLeft: "1rem" }}>
                                                <img style={{ borderRadius: "50%" }} src={selectedPartnerChatBox?.avatar|| "/avatar.png"} alt="Avatar" />
                                            </div>
                                            </div>
                                        );
                                        }
                                    })
                                    }
                                    {/* <div className='cb-message-user'>
                                        <div style={{width:"10%",marginRight:"1rem"}}>
                                            <img style={{borderRadius:"50%"}}src='/avatar.png'></img>
                                        </div>
                                        <div style={{backgroundColor:"rgba(0,0,0,0.1)",maxWidth:"80%", borderRadius:5,padding:"0.3rem 1rem"}}>Xin chào bạn</div>
                                    </div>
                                    <div className='cb-message-reception'>
                                    <div style={{backgroundColor:"rgba(0,0,0,0.1)",maxWidth:"80%",marginLeft:"auto",borderRadius:5,padding:"0.3rem 1rem"}}>Xin chào bạn</div>
                                        <div style={{width:"10%",marginLeft:"1rem"}}>
                                            <img style={{borderRadius:"50%"}}src='/avatar.png'></img>
                                        </div>
                                    </div>
                                    <div className='cb-message-user'>
                                        <div style={{width:"10%",marginRight:"1rem"}}>
                                            <img style={{borderRadius:"50%"}}src='/avatar.png'></img>
                                        </div>
                                        <div style={{backgroundColor:"rgba(0,0,0,0.1)",maxWidth:"80%", borderRadius:5,padding:"0.3rem 1rem"}}>Xin chào bạn Xin chào bạn Xin chào bạn Xin chào bạn Xin chào bạn Xin chào bạn Xin chào bạn</div>
                                    </div> */}
                                </div>
                                <div className='cb-input' >
                                    <input style={{height:"4rem"}} placeholder='Nhập nội dung tin nhắn' value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    ></input>
                                </div>
                            </div>
                        </>
                        )}
                    </div>
                </div>
            </div>)
            }
        </div>
    );
}

export default ChatBox;


// {showPartners && (
//     <div className="partner-list">
//         {partners.map((item, index) => (
//             <div key={index} className="partner-item" onClick={() => handlePartnerClick(item.partner)}>
//                 <div className="partner-name">{item.partner}</div>
//                 <div className="partner-image-wrapper">
//                     <img src="/avatar.png" alt={item.partner} className="partner-image" />
//                     {item.unreadCount > 0 && (
//                         <span className="unread-count">{item.unreadCount}</span>
//                     )}
//                 </div>
//             </div>
//         ))}
//     </div>
// )}
// <div><FontAwesomeIcon icon={faComments} className="chat-icon" onClick={togglePartnerList} /></div>

// {selectedPartner && (
//     <div className={`chat-box ${selectedPartner ? 'open' : ''}`}>
//         <div className="chat-header">
//             <h3>Chat with {selectedPartner}</h3>
//             <button onClick={() => setSelectedPartner(null)} className="close-btn">X</button>
//         </div>
//         <div className="chat-messages">
//             {messages.map((msg, index) => (
//                 <div key={index} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
//                     <strong>{msg.sender}:</strong> {msg.content}
//                 </div>
//             ))}
//         </div>
//         <div className="message-input">
//             <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message..."
//             />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     </div>
// )}

// {/* Test message input for sending to user3 */}
// <div className="test-message-input">
//     <input
//         type="text"
//         value={testMessage}
//         onChange={(e) => setTestMessage(e.target.value)}
//         placeholder="Send test message to user3..."
//     />
//     <button onClick={sendTestMessage}>Send to User3</button>
// </div>
