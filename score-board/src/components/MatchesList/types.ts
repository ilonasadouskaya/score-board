import type { Dispatch } from "react";

import type ScoreBoard from "../../lib/ScoreBoard";
import type { Match } from "../../lib/types";

export type MatchesListProps = {
  scoreBoardInstance: ScoreBoard;
  matches: Match[];
  setError: Dispatch<React.SetStateAction<string>>;
};
