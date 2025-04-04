import fs from 'fs';


import { ConfigType } from '#/cache/config/ConfigType.js';
import DbTableType from '#/cache/config/DbTableType.js';
import ScriptVarType from '#/cache/config/ScriptVarType.js';
import Packet from '#/io/Packet.js';

export default class DbRowType extends ConfigType {
    private static configNames = new Map<string, number>();
    private static configs: DbRowType[] = [];

    static load(dir: string) {
        if (!fs.existsSync(`${dir}/server/dbrow.dat`)) {
            return;
        }
        const dat = Packet.load(`${dir}/server/dbrow.dat`);
        this.parse(dat);
    }

    static async loadAsync(dir: string) {
        const file = await fetch(`${dir}/server/dbrow.dat`);
        if (!file.ok) {
            return;
        }

        const dat = new Packet(new Uint8Array(await file.arrayBuffer()));
        this.parse(dat);
    }

    static parse(dat: Packet) {
        DbRowType.configNames = new Map();
        DbRowType.configs = [];

        const count = dat.g2();

        for (let id = 0; id < count; id++) {
            const config = new DbRowType(id);
            config.decodeType(dat);

            DbRowType.configs[id] = config;

            if (config.debugname) {
                DbRowType.configNames.set(config.debugname, id);
            }
        }
    }

    static get(id: number): DbRowType {
        return DbRowType.configs[id];
    }

    static getId(name: string): number {
        return DbRowType.configNames.get(name) ?? -1;
    }

    static getByName(name: string): DbRowType | null {
        const id = this.getId(name);
        if (id === -1) {
            return null;
        }

        return this.get(id);
    }

    static get count() {
        return this.configs.length;
    }

    static getInTable(tableId: number): DbRowType[] {
        return DbRowType.configs.filter(config => config.tableId === tableId);
    }

    // ----

    tableId: number = 0;
    types: number[][] = [];
    columnValues: (number | string)[][] = [];

    decode(code: number, dat: Packet) {
        if (code === 3) {
            const numColumns = dat.g1();
            this.types = new Array(numColumns);
            this.columnValues = new Array(numColumns);

            for (let columnId = dat.g1(); columnId != 255; columnId = dat.g1()) {
                const columnTypes = new Array(dat.g1());

                for (let i = 0; i < columnTypes.length; i++) {
                    columnTypes[i] = dat.g1();
                }

                this.types[columnId] = columnTypes;
                this.columnValues[columnId] = this.decodeValues(dat, columnId);
            }
        } else if (code === 4) {
            this.tableId = dat.g2();
        } else if (code === 250) {
            this.debugname = dat.gjstr();
        } else {
            throw new Error(`Unrecognized dbtable config code: ${code}`);
        }
    }

    getValue(column: number, listIndex: number) {
        const value = this.columnValues[column].slice(listIndex * this.types[column].length, (listIndex + 1) * this.types[column].length);
        if (!value.length) {
            return DbTableType.get(this.tableId).getDefault(column);
        }

        return value;
    }

    decodeValues(dat: Packet, column: number) {
        const types = this.types[column];
        const fieldCount = dat.g1();
        const values: string[] | number[] = new Array(fieldCount * types.length);

        for (let fieldId = 0; fieldId < fieldCount; fieldId++) {
            for (let typeId = 0; typeId < types.length; typeId++) {
                const type = types[typeId];
                const index = typeId + fieldId * types.length;

                if (type === ScriptVarType.STRING) {
                    values[index] = dat.gjstr();
                } else {
                    values[index] = dat.g4();
                }
            }
        }

        return values;
    }
}
