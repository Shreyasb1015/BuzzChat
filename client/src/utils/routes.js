const server= "https://buzzchat-backend.onrender.com/api/v1";

export const loginRoute = `${server}/users/login`;
export const registerRoute = `${server}/users/register`;
export const updateProfileRoute=`${server}/users/update-profile`;
export const changePasswordRoute=`${server}/users/change-password`;
export const getAllUsersRoute=`${server}/users/allusers`;
export const logoutRoute=`${server}/users/logout`;
export const createConversationRoute=`${server}/conversations/createConversation`;
export const getConversationsByUserRoute=`${server}/conversations/getConversationsByUser`;
export const updateConversationRoute=`${server}/conversations/updateConversation/:conversationId`;
export const deleteConversationRoute=`${server}/conversations/deleteConversation/:conversationId`;
export const sendMessageRoute=`${server}/messages/:conversationId/sendMessage`;
export const getmessageByconversationIdRoute=`${server}/messages/getmessageByconversationId/:conversationId`;
export const updateMessageRoute=`${server}/messages/updateMessage/:messageId`;
export const deleteMessageRoute=`${server}/messages/deleteMessage/:messageId`;
export const markAsReadRoute=`${server}/messages/markAsRead/:messageId`;