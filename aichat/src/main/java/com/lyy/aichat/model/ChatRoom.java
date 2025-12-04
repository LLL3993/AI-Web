package com.lyy.aichat.model;

import com.volcengine.ark.runtime.model.completion.chat.ChatMessage;
import lombok.Data;

import java.util.List;

@Data
public class ChatRoom {
    private Long roomId;
    private List<ChatMessage> chatMessage;

    public Long getRoomId() {
        return roomId;
    }
    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }
    public List<ChatMessage> getChatMessage() {
        return chatMessage;
    }
    public void setChatMessage(List<ChatMessage> messages) {
        this.chatMessage = messages;
    }
//    public void setChatMessage(List<ChatMessage> messages) {
//        this.chatMessages = messages;
//    }
}
