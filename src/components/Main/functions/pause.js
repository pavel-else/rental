export default function pause(subOrder) {

    if (subOrder.status != 'ACTIVE' && subOrder.status != 'PAUSE') {
        console.warn('Pause error: unknown status - ', subOrder.status);

        return false;
    }

    const makePause = () => {
        subOrder.status = "PAUSE";

        subOrder.pause_start = Date.now();
    }

    const makeActive = () => {
        subOrder.status = "ACTIVE";

        const pause = Date.now() - +subOrder.pause_start;

        subOrder.pause_time = +subOrder.pause_time + pause;

        subOrder.pause_start = 0;
    }

    subOrder.status == "ACTIVE" ? makePause() : makeActive();

    return subOrder;
}