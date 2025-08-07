package com.code2care.analytics.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.*;

import java.util.HashSet;
import java.util.Set;

/**
 * sur ce websocket nous avons un protocole de comunication
 * d'abord lors de la connection d'un utilisateur l'on envoie  un message de demande de credentials {get-credentials}
 * par la suite l'utilsiateur renvoie un credentials sous la  forme (id-auth-credentials)
 * apres validation ;'on notifie a l'utilisateur qu'il c'est bien enregistrer avec le message registed
 */
@Slf4j
@Component
@Service
public class WebSocketHandlerCare implements org.springframework.web.socket.WebSocketHandler {

    private final Set <WebSocketSession> sessions = new HashSet<>();


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        System.out.println("afterConnectionEstablished");
        session.sendMessage(new TextMessage(SocketRequest.GET_CREDENTIALS.name()));

        // this.sessions.add(session);

    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
System.out.println(message.getPayload());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        System.out.println("afterConnectionClosed");
        session.close();
        sessions.remove(session);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }


    public void send(String s) {
        log.info("sent message: {}", s);

        sessions.forEach(session -> {
            try {
                session.sendMessage(new TextMessage(s));
                log.info("sent message: {}", s);
            } catch (Exception e) {
                log.error(e.getMessage());
              throw   new RuntimeException(e);
            }
        });

    }

//    @Async
//    public  void  sendToUser(Data message , String ClientId) throws IOException {
//        try{
//            System.out.println("message sended "+this.sessions.size());
//            System.out.println("my clientId "+ClientId);
//            System.out.println(message.toString());
//            this.sessions.forEach(session -> {
//                System.out.println("session "+session.getAttributes().get("id"));
//
//            });
//
//            WebSocketSession target =   this.sessions.stream().filter(session -> session.getAttributes().get("id").equals(ClientId))
//                    .findAny()
//                    .orElse(null);
//
//            if(target !=null && target.isOpen()){
//
//                ObjectMapper objectMapper = new ObjectMapper();
//
//                String json = objectMapper.writeValueAsString(message);
//
//                target.sendMessage(new TextMessage(json));
//                //System.out.println("unsupported message type");
//            } else {
//                System.out.println("target not exist ");
//            }
//        }catch (Exception e){
//            System.out.println(e);
//        }
//    }

}
