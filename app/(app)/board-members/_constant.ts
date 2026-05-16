import type { TBoardMemberFormValues } from "./_types";

export const BOARD_MEMBERS_KEY = "board-members";

export const INIT_BOARD_MEMBER: TBoardMemberFormValues = {
  name: "",
  role: "",
  email: null,
  photoUrl: null,
  termEnd: null,
  displayOrder: 0,
};
