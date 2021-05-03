const zigbeeHerdsmanConverters = require('zigbee-herdsman-converters');

const exposes = zigbeeHerdsmanConverters.exposes;
const ea = exposes.access;
const e = exposes.presets;
const fz = zigbeeHerdsmanConverters.fromZigbeeConverters;
const tz = zigbeeHerdsmanConverters.toZigbeeConverters;

const {
    precisionRound, batteryVoltageToPercentage
} = require('zigbee-herdsman-converters/lib/utils');
const globalStore = require('zigbee-herdsman-converters/lib/store');

const ptvo_switch = zigbeeHerdsmanConverters.findByDevice({modelID: 'ptvo.switch'});
fz.legacy = ptvo_switch.meta.tuyaThermostatPreset;

const fzLocal = {
    counter: {
        cluster: 'genAnalogInput',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const payload = {};
            const channel = msg.endpoint.ID;
            if (channel == 2) {
                const val = precisionRound(msg.data['presentValue'], 0) // it may be needed to divide counter value by 2 (depends on pulse output);
                if (!globalStore.hasValue(msg.endpoint, 'counter')) {
                    globalStore.putValue(msg.endpoint, 'counter', {counter: val, since: Date.now()});
                }
                const last = globalStore.getValue(msg.endpoint, 'counter');

                const deltaTimeSec = Math.floor((Date.now() - last.since) / 1000);
                const deltaCount = val - last.counter;
                let power = 0;
                if (deltaTimeSec > 0 && deltaCount > 0) {
                    power = 1000 * (deltaCount / 6400) * (3600 / deltaTimeSec);
                }
                const energy = val / 6400;

                payload['l2_delta'] = precisionRound(deltaCount, 0);
                payload['power'] = precisionRound(power, 0);
                payload['energy'] = precisionRound(energy, 2);

                globalStore.putValue(msg.endpoint, 'counter', {counter: val, since: Date.now()});
            } else if (channel == 4 && msg.data.hasOwnProperty('description')) {
                const data1 = msg.data['description'];
                if (data1) {
                    const data2 = data1.split(',');
                    const unit = data2[0];

                    const valRaw = msg.data['presentValue'];
                    if (unit) {
                        let val = precisionRound(valRaw, 2);

                        if (unit === 'V') {
                            payload['voltage'] = val * 1000;
                            payload['battery'] = batteryVoltageToPercentage(payload['voltage'], '3V_2500');
                        }
                    }
                }
            }
            return payload;
        },
    },
};

const device = {
    zigbeeModel: ['ptvo.counter'],
    model: 'ptvo.counter',
    vendor: 'Custom devices (DiY)',
    description: '[Configurable firmware](https://ptvo.info/zigbee-configurable-firmware-features/)',
    fromZigbee: [fz.ignore_basic_report, fz.ptvo_switch_analog_input, fzLocal.counter],
    toZigbee: [tz.ptvo_switch_trigger, tz.ptvo_switch_analog_input,],
    exposes: [exposes.numeric('l2', ea.STATE_SET).withDescription('Counter value. Write zero to reset the counter or any other initial counter value'),
        e.battery_voltage(),
        e.battery(),
        e.power(),
        e.energy(),
        e.linkquality(),
    ],
    meta: {
        multiEndpoint: true,
    },
    endpoint: (device) => {
        return {
            l2: 2, l4: 4, l1: 1,
        };
    },
};

module.exports = device;
