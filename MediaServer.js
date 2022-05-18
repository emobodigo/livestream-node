import NodeMediaServer from 'node-media-server';
import nodeMediaServerConfig from './NodeMediaServerConfig.js';
import { setMp4FilePath } from './app/utils.js';

const nms = new NodeMediaServer(nodeMediaServerConfig);

nms.on('getFilePath', (streamPath, outPath, mp4FileName) => {
    console.log('---------------- get file path ---------------');
    console.log(streamPath);
    console.log(outPath);
    console.log(mp4FileName);
    setMp4FilePath(`${outPath}/${mp4FileName}`);
});

nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postConnect', (id, args) => {
    console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
    console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
    console.log(
        '[NodeEvent on prePublish]',
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
});

nms.on('postPublish', (id, StreamPath, args) => {
    console.log(
        '[NodeEvent on postPublish]',
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
});

nms.on('donePublish', (id, StreamPath, args) => {
    console.log(
        '[NodeEvent on donePublish]',
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
});

nms.on('prePlay', (id, StreamPath, args) => {
    console.log(
        '[NodeEvent on prePlay]',
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
});

nms.on('postPlay', (id, StreamPath, args) => {
    console.log(
        '[NodeEvent on postPlay]',
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
});

nms.on('donePlay', (id, StreamPath, args) => {
    console.log(
        '[NodeEvent on donePlay]',
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
});

export default nms; 