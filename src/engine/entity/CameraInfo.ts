import { CameraProt } from '#/network/rs225/server/prot/ServerProt.js';
import Linkable from '#/util/Linkable.js';

export default class CameraInfo extends Linkable {
    readonly type: CameraProt;
    readonly camX: number;
    readonly camZ: number;
    readonly height: number;
    readonly rotationSpeed: number;
    readonly rotationMultiplier: number;

    constructor(type: CameraProt, camX: number, camZ: number, height: number, rotationSpeed: number, rotationMultiplier: number) {
        super();
        this.type = type;
        this.camX = camX;
        this.camZ = camZ;
        this.height = height;
        this.rotationSpeed = rotationSpeed;
        this.rotationMultiplier = rotationMultiplier;
    }
}
