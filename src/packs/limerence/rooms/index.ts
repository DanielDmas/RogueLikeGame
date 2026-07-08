import type { Room } from '../../../engine/schema';
import { theFrontDesk } from './prologue';
import {
  theReadReceipt,
  theScreenshot,
  thePassword,
  theParty,
  theForward,
  theBestFriendsGirl,
  theSummerEnds,
  theRumor,
} from './act1';
import {
  placeholderRoom2,
  theScoreboard,
  placeholderRoom3,
  theUsualRoom,
  theKitchenTable,
  theUnsent,
  theMorningDesk,
} from './placeholders';

export const limerenceRooms: Room[] = [
  theFrontDesk,
  theReadReceipt,
  theScreenshot,
  thePassword,
  theParty,
  theForward,
  theBestFriendsGirl,
  theSummerEnds,
  theRumor,
  placeholderRoom2,
  theScoreboard,
  placeholderRoom3,
  theUsualRoom,
  theKitchenTable,
  theUnsent,
  theMorningDesk,
];
