import { Socket } from "socket.io";

class ChannelsHandler {
  async joinChannels(socket: Socket) {
    if (!socket.data.userId) {
      return;
    }

    const channels = await ChannelUser.find({ user: socket.data.userId }).populate("channel");
  }
}

export default new ChannelsHandler();
