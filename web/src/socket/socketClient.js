// socketClient.js

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client'; 
import { setUserCount, setWebsocketConnected ,setSunRiseTime,setSunsetTime,setOceanCode,setParticleCode,setSkyCode,setT1h, setNewBottleList } from '../store/sceneSlice';
import { store } from '../store/index';
import api from "../api/api";


let stompClient = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5; // 최대 재시도 횟수
const INITIAL_RECONNECT_DELAY = 1000; // 1초

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const reissueToken = async () => {
    try {
        const response = await api.get("/member/reissue");
        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

const createWebSocketClient = () => {
    const ws = new SockJS(process.env.REACT_APP_WS_END_POINT, null, {
        withCredentials: process.env.REACT_APP_WITH_CREDENTIALS === 'true'
    });

    return new Client({
        webSocketFactory: () => ws,
        reconnectDelay: 0, // STOMP 자체 재연결 사용 안 함
        debug: (str) => console.log(str),
    });
};

export const connectWebSocket = async () => {


    const { websocketConnected } = store.getState().scene;

    if (websocketConnected) return stompClient;

    stompClient = createWebSocketClient();

    const tryConnect = async () => {
        stompClient.onConnect = () => {
            // console.log('웹소켓 연결 성공');
            store.dispatch(setWebsocketConnected(true));
            reconnectAttempts = 0;

            // 구독
            
            //테스트
            // 날씨/bgm 
            stompClient.subscribe('/user/topic/wthrBgm', (msg) => {
                console.log('받은 메시지:', JSON.parse(msg.body));
               try {
                    const body = JSON.parse(msg.body);
 
                    if (body.data.userCnt !== undefined) {
                        store.dispatch(setOceanCode(body.data.oceanCode));
                        store.dispatch(setSkyCode(body.data.skyCode));
                        store.dispatch(setParticleCode(body.data.particleCode));
                        store.dispatch(setSunRiseTime(body.data.sunRiseTime));
                        store.dispatch(setSunsetTime(body.data.sunSetTime));
                        store.dispatch(setT1h(body.data.t1h));
                    }
                    
                } catch (e) {
                    console.error('날씨 정보 파싱 실패', e);
                }
            });      
             // 유리병 조회 리스트
            stompClient.subscribe('/user/topic/btlList', (msg) => {
               try {
                    const body = JSON.parse(msg.body);
 
                    if (body.data.btlLtrNoList !== undefined) {
                        store.dispatch(setNewBottleList(body.data.btlLtrNoList));
                    }
                    
                } catch (e) {
                    console.error('날씨 정보 파싱 실패', e);
                }
            });   
             // 유리병 답변 글귀 
            stompClient.subscribe('/user/topic/btlReply', (msg) => {
                console.log('받은 메시지:', JSON.parse(msg.body));
            }); 
             //실시간 유저
            stompClient.subscribe('/topic/liveUser', (msg) => {
                try {
                    const body = JSON.parse(msg.body);
 

                    if (body.data.userCnt !== undefined) {
                        store.dispatch(setUserCount(body.data.userCnt)); // Redux 상태 갱신
                        // console.log('실시간 유저 수 갱신:', body.data.userCnt);
                    }
                } catch (e) {
                    console.error('실시간 유저 수 파싱 실패', e);
                }
            });                    
            //개별메시지(웹소켓 세션 강제종료)
            stompClient.subscribe('/user/topic/disconnect', (msg) => {
                console.log('받은 메시지:', JSON.parse(msg.body));
                // 서버에서 강제 종료 신호를 받으면 연결 종료
                if (stompClient && stompClient.connected) {
                    // console.log('서버 요청으로 웹소켓 연결 종료');
                    stompClient.deactivate();
                    store.dispatch(setWebsocketConnected(false));
                }
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('STOMP 에러', frame);
        };

        stompClient.onWebSocketClose = async () => {
            // console.log('웹소켓 연결 종료');
            store.dispatch(setWebsocketConnected(false));

            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                // console.log('최대 재연결 횟수 초과, 재시도 중단');
                return;
            }

            reconnectAttempts++;
            const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1); // 지수 백오프
            // console.log(`재연결 시도 ${reconnectAttempts}, ${delay}ms 후 재시도`);

            const tokenValid = await reissueToken();
            if (!tokenValid) {
                // console.log('토큰 재발급 실패, 재연결 불가');
                return;
            }

            await sleep(delay);
            stompClient = createWebSocketClient();
            tryConnect();
        };

        stompClient.activate();
    };

    tryConnect();

    return stompClient;
};

export const sendLocation = (lat, lot) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/member/location",
      body: JSON.stringify({ lat, lot }),
    });
  }
};


export const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
        stompClient = null;
        store.dispatch(setWebsocketConnected(false));
    }
};
