import moment from "moment-timezone";

let mp4FilePath = '';

export const getMp4FilePath = () => mp4FilePath;
export const setMp4FilePath = (path) => {
    mp4FilePath = path;
};

export const getCurrentDateTime = () => {
    const timezone = moment().tz('Asia/Jakarta');
    const currentDateTime = timezone.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return currentDateTime;
};

export const LIVE_STATUS = {
    CANCEL: -1,
    PREPARE: 0,
    ON_LIVE: 1,
    FINISH: 2
};

