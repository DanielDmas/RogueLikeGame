import type { Room } from '../../engine/schema';
import { prologue } from './prologue';
import { act1Rooms } from './act1';
import { act2Rooms } from './act2';
import { act3Rooms } from './act3';
import { act4Rooms } from './act4';
import { understoryRooms } from './understory';

export const allRooms: Room[] = [
  prologue,
  ...act1Rooms,
  ...act2Rooms,
  ...act3Rooms,
  ...act4Rooms,
  ...understoryRooms,
];
