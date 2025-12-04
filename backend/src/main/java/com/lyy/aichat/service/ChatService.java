package com.lyy.aichat.service;

import com.lyy.aichat.model.ChatRoom;

import java.util.List;

public interface ChatService {

    //通过房间号，来与特定的用户对话；
    String doChat(Long roomId, String userPrompt);

    //获取当前的所有的聊天房间对话；
    List<ChatRoom> getChatRooms();
}
