export const sendMessage = (socket: any): void => {
  socket.on('send-message', async (message: any) => {
    console.log(JSON.stringify(message), socket.userId);

    socket.emit('message', 'Hello world');
  });
};
