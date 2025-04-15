<template>
    <div class="chat-container">
        <!-- 左侧用户列表 -->
        <div class="left-side" :class="{'open': switchActive }">
            <div class="search-wrapper">
                <el-input
                        v-model="searchUserName"
                        placeholder="搜索用户（回车确认）"
                        @keydown.enter="searchUserForFormAction"
                ></el-input>
            </div>
            <el-scrollbar class="user-list-scroll">
                <el-row>
                    <el-col
                            :span="24"
                            v-for="form in messageForm"
                            :key="form.send_user.id"
                            @click="chooseUser(form.send_user)"
                            class="user-item"
                    >
                        <div class="user-avatar-wrapper">
                            <div :class="{ 'online-dot': form.is_online }"></div>
                            <el-badge
                                    :value="form.no_read_message_length"
                                    class="message-badge"
                                    v-if="form.no_read_message_length > 0"
                            >
                                <img :src="server_URL + form.send_user.avatar" class="user-avatar">
                            </el-badge>
                            <img v-else :src="server_URL + form.send_user.avatar" class="user-avatar">
                        </div>
                        <div class="user-details">
                            <div class="user-name">{{ form.send_user.username }}</div>
                            <div class="user-last-message">{{ form.last_message }}</div>
                        </div>
                    </el-col>
                </el-row>
            </el-scrollbar>
        </div>

        <!-- 右侧聊天区域 -->
        <div class="right-side">
            <div class="chat-header">
                <span v-if="currentUser">{{ currentUser.username }}</span>
                <span v-else>请选择聊天对象</span>
            </div>
            <el-scrollbar class="chat-messages" ref="messageContainer">
                <div @click="switchActiveChange" class="switch-action" :class="{ 'active' : switchActive}">
                    <el-icon v-if="!switchActive">
                        <ArrowRight/>
                    </el-icon>
                    <el-icon v-else>
                        <ArrowLeft/>
                    </el-icon>
                </div>
                <div
                        v-for="message in messages"
                        :key="message.handle"
                        class="messageBox"
                        :class="{
                        ownMessage: message.send_user === loginUser.id,
                        otherMessage: message.send_user !== loginUser.id
                    }"
                >
                    <img
                            :src="message.send_user === loginUser.id ? server_URL + loginUser.avatar : server_URL + currentUser?.avatar"
                            class="message-avatar"
                    >
                    <div class="message-content">
                        <div v-if="message.type === 'text'" class="message-text">{{ message.content }}</div>
                        <el-image
                            v-if="message.type === 'image'"
                            :src="getImageSrc(message.content)"
                            class="message-image"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :preview-src-list="[getImageSrc(message.content)]"
                            fit="cover"
                        />
                        <div class="message-time">{{ formatTime(message.create_time) }}</div>
                        <span
                                v-if="message.status === 'sending'"
                                class="message-status"
                        >发送中...</span>
                        <span
                                v-if="message.status === 'failed'"
                                class="message-status error"
                        >发送失败</span>
                    </div>
                </div>
            </el-scrollbar>
            <div class="chat-input">
                <el-button class="img-btn" @click="showEmojiPicker = !showEmojiPicker" link :disabled="!currentUser">😀</el-button>
                <el-button class="img-btn" :icon="Picture" @click="openFileInput" link :disabled="!currentUser"></el-button>
                <el-input
                        v-model="newMessage.content"
                        placeholder="输入消息..."
                        @keydown.enter="sendMessage"
                        :disabled="!currentUser"
                        autosize
                ></el-input>
                <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none;">
                <el-button
                        type="primary"
                        @click="sendMessage"
                        :loading="isSending"
                        :disabled="!currentUser"
                >发送
                </el-button>
            </div>
            <div v-if="showEmojiPicker" class="emoji-picker-container">
                <EmojiPicker @select-emoji="insertEmoji"></EmojiPicker>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick, watch} from 'vue';
import {ElMessage, ElScrollbar} from 'element-plus';
import {Picture, ArrowRight, ArrowLeft} from '@element-plus/icons-vue';
import {findMessageBySendUserAndReceiveUser, searchUserForForm} from '@/request/message';
import {sendMessageTo} from '@/request/webSocketApi.js';
import websocket from '@/utils/websocket.js';
import EmojiPicker from '@/components/pc/common/EmojiPicker.vue';
import {server_URL} from "@/urlConfig.js";

// 响应式数据
const currentUser = ref(null);
const loginUser = ref(JSON.parse(localStorage.getItem('UserData')) || {});
const messages = ref([]);
const messageForm = ref([]);
const newMessage = ref({content: ''});
const searchUserName = ref('');
const messageContainer = ref(null);
const isSending = ref(false);
const reconnectInterval = 5000;
let reconnectTimer = null;
const showEmojiPicker = ref(false);
const fileInput = ref(null);
const switchActive = ref(false);

const getImageSrc = (content) => {
    if (content && (content.startsWith('blob:') || content.startsWith('data:'))) {
        return content;
    }
    return server_URL + content;
};
const switchActiveChange = () => {
    switchActive.value = !switchActive.value;
}
// 格式化时间
const formatTime = (timeStr) => {
    const messageDate = new Date(timeStr);
    const now = new Date();

    // 获取当前日期的年月日
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDay = now.getDate();

    // 获取消息日期的年月日
    const messageYear = messageDate.getFullYear();
    const messageMonth = messageDate.getMonth();
    const messageDay = messageDate.getDate();

    // 计算日期差
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 获取消息的时分
    const hours = messageDate.getHours().toString().padStart(2, '0');
    const minutes = messageDate.getMinutes().toString().padStart(2, '0');

    if (nowYear === messageYear && nowMonth === messageMonth) {
        if (nowDay === messageDay) {
            // 今天的消息显示时分
            return `${hours}:${minutes}`;
        } else if (nowDay - messageDay === 1) {
            // 昨天的消息显示“昨天”
            return `昨天 ${hours}:${minutes}`;
        } else if (nowDay - messageDay === 2) {
            // 前天的消息显示“前天”
            return `前天 ${hours}:${minutes}`;
        }
    }
    // 其他情况显示年月日时分
    const month = (messageMonth + 1).toString().padStart(2, '0');
    const day = messageDay.toString().padStart(2, '0');
    return `${messageYear}-${month}-${day} ${hours}:${minutes}`;
};

// 获取历史消息
const fetchMessages = async (userId) => {
    if (!userId || !loginUser.value?.id) return;
    try {
        const res = await findMessageBySendUserAndReceiveUser(userId, loginUser.value.id);
        messages.value = res;
        nextTick(scrollToBottom);
    } catch (error) {
        ElMessage.error('消息加载失败');
    }
};

const sendWebSocketMessage = (message) => {
    const ws = websocket.getWebSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error('WebSocket 连接未就绪');
        ElMessage.error('消息发送失败，连接已断开');
    }
};

// 发送消息
const sendMessage = async () => {
    if (!validateMessage()) return;

    isSending.value = true;
    const message = buildMessageObject('text');

    try {
        // 乐观更新
        messages.value.push({...message, status: 'sending'});
        nextTick(scrollToBottom);

        // 持久化到后端
        await sendMessageTo(message);

        // 发送WebSocket
        sendWebSocketMessage(message);


        // 更新状态
        const index = messages.value.findIndex(m => m.handle === message.handle);
        if (index !== -1) {
            messages.value[index].status = 'sent';
        }
    } catch (error) {
        handleSendError(message);
    } finally {
        isSending.value = false;
        newMessage.value.content = '';
    }
};

// 构建消息对象
const buildMessageObject = (type) => ({
    handle: Date.now().toString(),
    send_user: loginUser.value.id,
    receive_user: currentUser.value.id,
    content: newMessage.value.content.trim(),
    create_time: new Date().toISOString(),
    type
});

// 校验消息
const validateMessage = () => {
    if (!newMessage.value.content.trim()) {
        ElMessage.warning('消息不能为空');
        return false;
    }
    if (!currentUser.value) {
        ElMessage.warning('请选择聊天对象');
        return false;
    }
    return true;
};

// 处理发送错误
const handleSendError = (message) => {
    const index = messages.value.findIndex(m => m.handle === message.handle);
    if (index !== -1) {
        messages.value[index].status = 'failed';
    }
    ElMessage.error('发送失败');
};

// WebSocket消息处理
const handleReceivedMessage = (event) => {
    try {
        const message = JSON.parse(event.data);

        // 添加到消息列表
        if (message.receive_user === loginUser.value.id) {
            messages.value.push(message);
            nextTick(scrollToBottom);
        }

        // 更新用户列表的最后一条消息
        const targetUserId = message.send_user === loginUser.value.id
            ? message.receive_user
            : message.send_user;
        const targetUserForm = messageForm.value.find(
            form => form.send_user.id === targetUserId
        );
        if (targetUserForm) {
            targetUserForm.last_message = message.content;
            targetUserForm.create_time = message.create_time;
            targetUserForm.no_read_message_length = (targetUserForm.no_read_message_length || 0) + 1;
        }
    } catch (error) {
        console.error('消息解析失败:', error);
    }
};

// 搜索用户列表
const searchUserForFormAction = async () => {
    if (!loginUser.value?.id) {
        ElMessage.error('请先登录');
        return;
    }

    try {
        const res = await searchUserForForm(loginUser.value.id, searchUserName.value);
        const filtered = res.filter(form =>
            form.send_user &&
            form.send_user.id !== loginUser.value.id
        );

        // 去重
        const uniqueForms = [];
        const seenIds = new Set();
        filtered.forEach(form => {
            if (!seenIds.has(form.send_user.id)) {
                uniqueForms.push(form);
                seenIds.add(form.send_user.id);
            }
        });

        messageForm.value = uniqueForms;
    } catch (error) {
        ElMessage.error('用户搜索失败');
    }
};

// 选择用户
const chooseUser = (user) => {
    currentUser.value = user;
    const form = messageForm.value.find(f => f.send_user.id === user.id);
    if (form) form.no_read_message_length = 0;
    fetchMessages(user.id);
};

// 滚动到底部
const scrollToBottom = () => {
    const container = messageContainer.value?.$el?.querySelector('.el-scrollbar__wrap');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
};

// WebSocket连接
const connectWebSocket = async (userId) => {
    return new Promise((resolve, reject) => {
        websocket.Init(userId);
        const ws = websocket.getWebSocket();

        ws.onopen = () => {
            console.log('WebSocket已连接');
            clearTimeout(reconnectTimer);
            resolve();
        };

        ws.onmessage = handleReceivedMessage;

        ws.onerror = (error) => {
            console.error('连接错误:', error);
            reconnectTimer = setTimeout(() => connectWebSocket(userId), reconnectInterval);
            reject(error);
        };
    });
};

// 插入表情
const insertEmoji = (emoji) => {
    newMessage.value.content += emoji;
    showEmojiPicker.value = false;
};

// 处理文件选择
const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageData = e.target.result;
            const message = {
                handle: Date.now().toString(),
                send_user: loginUser.value.id,
                receive_user: currentUser.value.id,
                content: imageData,
                create_time: new Date().toISOString(),
                type: 'image'
            };

            try {
                // 乐观更新
                messages.value.push({...message, status: 'sending'});
                nextTick(scrollToBottom);
                // 持久化到后端
                await sendMessageTo(message);
                // 发送WebSocket
                sendWebSocketMessage(message);


                // 更新状态
                const index = messages.value.findIndex(m => m.handle === message.handle);
                if (index !== -1) {
                    messages.value[index].status = 'sent';
                }
            } catch (error) {
                handleSendError(message);
            }
        };
        reader.readAsDataURL(file);
    }
    fileInput.value.value = '';
};

// 打开文件选择器
const openFileInput = () => {
    if (currentUser.value) {
        fileInput.value.click();
    } else {
        ElMessage.warning('请选择聊天对象');
    }
};

// 生命周期
onMounted(async () => {
    if (loginUser.value?.id) {
        await connectWebSocket(loginUser.value.id);
        searchUserForFormAction();
    }
    watch(messages, scrollToBottom, {deep: true});
});

onBeforeUnmount(() => {
    websocket.getWebSocket()?.close();
});
</script>

<style scoped>
.chat-container {
    display: flex;
    width: 100%;
    background: #f5f6fa;
    overflow: hidden;

    .left-side {
        width: 280px;
        border-right: 1px solid #e8e8e8;
        background: white;
        z-index: 7;
        display: none;
        transform: translateX(calc(-280px));
        transition: transform 0.3s;

        .search-wrapper {
            padding: 16px;
            border-bottom: 1px solid #e8e8e8;
        }

        .user-list-scroll {
            height: calc(100vh - 212px);

            .user-item {
                padding: 12px;
                cursor: pointer;
                transition: background 0.2s;
                display: flex;

                &:hover {
                    background: #f8f9fa;
                }

                .user-avatar-wrapper {
                    position: relative;
                    display: inline-block;
                    margin-right: 12px;
                }

                .online-dot {
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #52c41a;
                    border: 2px solid white;
                }

                .user-avatar {
                    max-width: 40px;
                    max-height: 40px;
                    width: 10vw;
                    height: 10vw;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .user-details {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    vertical-align: top;
                    max-width: calc(100% - 60px);
                }

                .user-name {
                    font-weight: 500;
                    color: #333;
                }

                .user-last-message {
                    color: #666;
                    font-size: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }

    .right-side {
        display: flex;
        flex-direction: column;
        width: 100%;

        .chat-header {
            padding: 16px;
            border-bottom: 1px solid #e8e8e8;
            font-weight: 500;
            background: white;
        }

        .chat-messages {
            flex: 1;
            padding: 16px;
            background: #fafafa;

            .switch-action {
                position: absolute;
                width: 15px;
                height: 60px;
                background: white;
                border: 1px solid #5a99dc;
                border-left: none;
                left: 0;
                top: 10px;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                opacity: 0.4;
                transition: opacity 0.2s, left 0.2s;

                &:hover {
                    opacity: 1;
                }
            }

            .switch-action.active {
                opacity: 1;
            }
        }

        .messageBox {
            display: flex;
            margin-bottom: 16px;

            &.ownMessage {
                flex-direction: row-reverse;

                .message-content {
                    background: #1890ff;
                    color: white;
                }

                .message-time {
                    color: rgba(255, 255, 255, 0.8);
                }
            }
        }

        .message-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .message-content {
            max-width: 70%;
            margin: 0 12px;
            padding: 8px 12px;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .message-text {
            word-wrap: break-word;
            line-height: 1.5;
        }

        .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
        }

        .message-status {
            font-size: 12px;
            color: #666;
            margin-left: 8px;

            &.error {
                color: #ff4d4f;
            }
        }

        .chat-input {
            padding: 16px;
            border-top: 1px solid #e8e8e8;
            background: white;
            display: flex;
            gap: 12px;
            align-items: center;

            .el-button.img-btn {
                width: 35px;
                height: 35px;

                &:hover {
                    background: #f5f5f5;
                    opacity: 0.6;
                }
                &:active{
                    background: #f5f5f5;
                    opacity: 0.6;
                }
            }
            .el-button +.el-button {
                margin-left: 0;
            }
        }

        .message-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            /* 使图片显示为块级元素，便于居中对齐 */
            display: block;
            /* 图片水平居中 */
            margin: 0 auto;
        }

        /* 如果图片加载失败时的样式 */

        .message-image[src=""] {
            /* 可以设置一个默认的背景颜色或图标 */
            background-color: #eee;
            min-height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 14px;
        }

        /* 可以添加一些响应式样式，在不同屏幕尺寸下调整图片的显示 */
        @media (max-width: 768px) {
            .message-image {
                max-width: 80%;
            }
        }
    }

}

@media (min-width: 1025px) {
    .chat-container {
        height: calc(100vh - 100px);

        .left-side {
            height: calc(100vh - 100px);
            display: block;
            transform: translateX(0);
        }

        .right-side {
            .switch-action {
                display: none;
            }
        }
    }
}

@media (max-width: 1024px) {
    .chat-container {
        height: calc(100vh - 1.953vw - 80px);

        .left-side {
            position: fixed;
            height: calc(100vh - 1.953vw - 80px);
            display: block;
        }

        .left-side.open {
            transform: translateX(0);
        }

        .right-side {
            .switch-action {
                display: flex;
            }

            .switch-action.active {
                left: 280px;
            }

            .chat-input{
                padding: 1.5vw;
            }
        }
    }
}
</style>