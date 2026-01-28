export const ConversationUtils = {
  generateDirectKey(senderId: string, receiverId: string) {
    const directKey = [senderId, receiverId].sort().join(":");
    return directKey;
  },
};
