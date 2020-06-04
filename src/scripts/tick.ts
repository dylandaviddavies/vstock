export default function tick(callback: Function, time: number) {
    callback();
    setTimeout(() => tick(callback, time), time);
}