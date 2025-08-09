import type { Component } from '../types';

export const availableComponents: Component[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'Controls',
    description: 'Interactive push button component',
    svg: '/assets/components/button.svg',
    tags: ['button', 'control', 'input', 'ui'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'button-new',
    name: 'Modern Button',
    category: 'Controls',
    description: 'Modern styled interactive button',
    svg: '/assets/components/button-new.svg',
    tags: ['button', 'modern', 'control', 'input'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'button2',
    name: 'Button Variant 2',
    category: 'Controls',
    description: 'Alternative button design',
    svg: '/assets/components/button2.svg',
    tags: ['button', 'control', 'input', 'alternative'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'Controls',
    description: 'Toggle switch component',
    svg: '/assets/components/switch.svg',
    tags: ['switch', 'toggle', 'control', 'boolean'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'toggle',
    name: 'Toggle',
    category: 'Controls',
    description: 'Binary toggle control',
    svg: '/assets/components/toggle.svg',
    tags: ['toggle', 'switch', 'control', 'boolean'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'knob',
    name: 'Knob',
    category: 'Controls',
    description: 'Rotary control knob',
    svg: '/assets/components/knob.svg',
    tags: ['knob', 'rotary', 'control', 'analog'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'slider',
    name: 'Slider',
    category: 'Controls',
    description: 'Linear slider control',
    svg: '/assets/components/slider.svg',
    tags: ['slider', 'linear', 'control', 'analog'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'display',
    name: 'Display',
    category: 'Displays',
    description: 'Digital display screen',
    svg: '/assets/components/display.svg',
    tags: ['display', 'screen', 'output', 'digital'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'led',
    name: 'LED',
    category: 'Displays',
    description: 'Light emitting diode indicator',
    svg: '/assets/components/led.svg',
    tags: ['led', 'light', 'indicator', 'status'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'gauge',
    name: 'Gauge',
    category: 'Displays',
    description: 'Analog gauge meter',
    svg: '/assets/components/gauge.svg',
    tags: ['gauge', 'meter', 'analog', 'measurement'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'counter',
    name: 'Counter',
    category: 'Displays',
    description: 'Digital counter display',
    svg: '/assets/components/counter.svg',
    tags: ['counter', 'digital', 'number', 'display'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'sensor',
    name: 'Sensor',
    category: 'Sensors',
    description: 'Generic sensor component',
    svg: '/assets/components/sensor.svg',
    tags: ['sensor', 'input', 'measurement', 'data'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'motor',
    name: 'Motor',
    category: 'Actuators',
    description: 'Electric motor component',
    svg: '/assets/components/motor.svg',
    tags: ['motor', 'actuator', 'movement', 'electric'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'pump',
    name: 'Pump',
    category: 'Actuators',
    description: 'Fluid pump component',
    svg: '/assets/components/pump.svg',
    tags: ['pump', 'actuator', 'fluid', 'hydraulic'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'valve',
    name: 'Valve',
    category: 'Actuators',
    description: 'Flow control valve',
    svg: '/assets/components/valve.svg',
    tags: ['valve', 'flow', 'control', 'hydraulic'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'relay',
    name: 'Relay',
    category: 'Electronics',
    description: 'Electrical relay switch',
    svg: '/assets/components/relay.svg',
    tags: ['relay', 'switch', 'electrical', 'control'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'rpi3b',
    name: 'Raspberry Pi 3B',
    category: 'Computers',
    description: 'Raspberry Pi 3 Model B single board computer',
    svg: '/assets/components/rpi3b.svg',
    tags: ['raspberry-pi', 'computer', 'sbc', 'linux'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'rpi4b',
    name: 'Raspberry Pi 4B',
    category: 'Computers',
    description: 'Raspberry Pi 4 Model B single board computer',
    svg: '/assets/components/rpi4b.svg',
    tags: ['raspberry-pi', 'computer', 'sbc', 'linux'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'rpi5b',
    name: 'Raspberry Pi 5B',
    category: 'Computers',
    description: 'Raspberry Pi 5 Model B single board computer',
    svg: '/assets/components/rpi5b.svg',
    tags: ['raspberry-pi', 'computer', 'sbc', 'linux'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'rpizero2w',
    name: 'Raspberry Pi Zero 2W',
    category: 'Computers',
    description: 'Raspberry Pi Zero 2W compact computer',
    svg: '/assets/components/rpizero2w.svg',
    tags: ['raspberry-pi', 'computer', 'compact', 'wireless'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'modbus8adc',
    name: 'Modbus 8-Channel ADC',
    category: 'Industrial',
    description: '8-channel analog-to-digital converter with Modbus interface',
    svg: '/assets/components/modbus8adc.svg',
    tags: ['modbus', 'adc', 'analog', 'converter', 'industrial'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'modbus8i8o',
    name: 'Modbus 8I/8O',
    category: 'Industrial',
    description: '8-input/8-output Modbus I/O module',
    svg: '/assets/components/modbus8i8o.svg',
    tags: ['modbus', 'io', 'digital', 'industrial', 'module'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  },
  {
    id: 'usb2rs485',
    name: 'USB to RS485',
    category: 'Communication',
    description: 'USB to RS485 serial converter',
    svg: '/assets/components/USB2RS485.svg',
    tags: ['usb', 'rs485', 'serial', 'converter', 'communication'],
    version: '1.0.0',
    author: 'Digital Twin Designer',
    license: 'MIT'
  }
];
