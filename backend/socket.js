import { Server } from "socket.io";

export default function initSocket(server) {

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {

    // console.log("connected", socket.id);


    // join personal room
    socket.on("joinUser", (userId) => {
      socket.join(userId);
    });


    socket.on("joinRoom", ({ room }) => {
      socket.join(room);
    });


    socket.on("message", (data) => {

      const { room, receiver } = data;

      // chat room message
      io.to(room).emit("message", data);

      // send only to receiver
      if (receiver) {
        io.to(receiver).emit("notification", data);
      }

    });


    socket.on("disconnect", () => {
      // console.log("disconnect");
    });

  });

}