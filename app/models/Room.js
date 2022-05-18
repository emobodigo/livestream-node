import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const Room = {
    getAllRoomList: async () => {
        const rooms = await prisma.room.findMany();
        return rooms;
    },

    getRoomDetail: async (room_id) => {
        const room = await prisma.room.findUnique({
            where: { room_id: room_id },
        });
        return room;
    },

    updateRoom: async (room_id, reqData) => {
        const updatedRoom = await prisma.room.update({
            where: { room_id: room_id },
            data: reqData
        });
        return updatedRoom;
    },

    createRoom: async (postData) => {
        const room = await prisma.room.create({
            data: postData
        });
        return room;
    },

    sendMessageToRoom: async (postData) => {
        const message = await prisma.messages.create({
            data: postData
        });
        return message;
    }
};

export default Room;