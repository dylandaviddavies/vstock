export default function tick(callback, time) {
    callback();
    setTimeout(() => tick(callback, time), time);
}