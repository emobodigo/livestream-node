import { exec } from 'child_process';
import Room from '../models/Room.js';
import { getMp4FilePath, LIVE_STATUS } from '../utils.js';
import dotenv from 'dotenv';

dotenv.config();

export default (io) => {
    const emitListLiveStreamInfo = () => {
        Room.getAllRoomList().then((room) => {
            return io.emit('list-live-stream', room);
        });
    };

    io.on('connection', (socket) => {
        console.log('New Connection');

        // Get List Live Stream
        socket.on('list-live-stream', () => {
            emitListLiveStreamInfo();
        });

        // Join livestream room
        socket.on('join-room', (data) => {
            console.log("Join room", data);
            const { user_id, room_id } = data;
            if (!user_id || !room_id) return;
            socket.join(room_id);
        });

        // Leave livestream room
        socket.on('leave-room', (data) => {
            console.log('Leave room', data);
            const { user_id, room_id } = data;
            if (!user_id || !room_id) return;
            socket.leave(room_id);
        });

        //The host join the room and prepare live stream
        socket.on('prepare-live-stream', (data) => {
            console.log('Prepare live stream', data);
            if (!data.user_id || !data.room_id) return;
            const condition = {
                room_name: data.room_name,
                host_id: data.user_id,
                live_status: LIVE_STATUS.PREPARE
            };
            Room.createRoom(condition).then((room) => {
                emitListLiveStreamInfo();
            });
        });

        // User begin live stream
        socket.on('begin-live-stream', (data) => {
            console.log('Prepare live stream', data);
            if (!data.user_id || !data.room_id) return;
            Room.getRoomDetail(data.room_id).then((room) => {
                if (room != null) {
                    const condition = {
                        live_status: LIVE_STATUS.ON_LIVE
                    };
                    Room.updateRoom(data.room_id, condition).then((updatedRoom) => {
                        io.in(data.room_id).emit('begin-live-stream', updatedRoom);
                        return emitListLiveStreamInfo();
                    });
                } else {
                    const condition = {
                        room_name: data.room_name,
                        host_id: data.user_id,
                        live_status: LIVE_STATUS.ON_LIVE
                    };
                    Room.createRoom(condition).then((createdRoom) => {
                        io.in(data.room_id).emit('begin-live-stream', createdRoom);
                        return emitListLiveStreamInfo();
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        });

        // finish live stream
        socket.on('finish-live-stream', (data) => {
            console.log('Finish live stream');
            const filePath = getMp4FilePath();
            if (!data.user_id || !data.room_id) return;
            Room.getRoomDetail(data.room_id).then((room) => {
                if (room != null) {
                    const condition = {
                        live_status: LIVE_STATUS.FINISH,
                        file_path: filePath
                    };
                    Room.updateRoom(data.room_id, condition).then((updatedRoom) => {
                        io.in(data.room_id).emit('finish-live-stream', updatedRoom);
                        socket.leave(data.room_id);
                        return emitListLiveStreamInfo();
                    });
                }
            });
        });

        // user comment the stream
        socket.on('send-message', (data) => {
            console.log('Send message');
            return Room.getRoomDetail(data.room_id).then((room) => {
                if (room != null) {
                    const postData = {
                        messages: data.messages,
                        user_id: data.user_id,
                        room_id: data.room_id
                    };
                    Room.sendMessageToRoom(postData).then((message) => {
                        io.in(data.room_id).emit('send-message', message);
                    });
                }
            });
        });

        // Replay video
        socket.on('replay', (data) => {
            console.log('Replay video');
            Room.getRoomDetail(data.room_id).then((room) => {
                if (room != null) {
                    const { file_path } = room;
                    const commandExec = `ffmpeg -re -i ${file_path} -c:v libx264 -preset superfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv ${process.env.RTMP_SERVER}${data.room_id}/replayFor${data.user_id}`;
                    console.log('Command execute : ', commandExec);
                    exec(commandExec, (err, stdout, stderr) => {
                        if (err) {
                            console.log(`Error: ${err.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                }
            });
        });
    });
};

