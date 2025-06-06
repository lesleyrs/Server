import OutgoingMessage from '#/network/server/OutgoingMessage.js';
import { ServerProtPriority } from '#/network/server/prot/ServerProtPriority.js';

export default class TutorialFlashSide extends OutgoingMessage {
    priority = ServerProtPriority.BUFFERED;

    constructor(readonly tab: number) {
        super();
    }
}
