const SocketFunctions = (io, socket) => {
  socket.on("JOIN_ROOM", async (user) => {
    await socket.join("GENERAL_CHAT");

    io.to("GENERAL_CHAT").emit("USER_JOINED", {
      firstName: user.firstName,
      lastName: user.lastName,
      auth: {
        email: user.auth.email,
      },
    });
  });

  socket.on("SEND_MESSAGE", async (message) => {
    const date = new Date();
    const hour = date.toISOString();

    console.log(message);

    socket.to("GENERAL_CHAT").emit("RECEIVE_MESSAGE", {
      ...message,
      date: hour,
    });
  });
};

module.exports = SocketFunctions;
