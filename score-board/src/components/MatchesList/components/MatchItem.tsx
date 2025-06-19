import { useState, type Dispatch } from "react";

import type { Match, MatchId } from "../../../lib/types";
import type { MatchesListProps } from "../types";

type MatchItemProps = {
  match: Match;
  setEditError: Dispatch<React.SetStateAction<string>>;
} & Pick<
  MatchesListProps,
  "scoreBoardInstance" | "setError" | "refreshSummary"
>;

export const MatchItem = ({
  match,
  scoreBoardInstance,
  setEditError,
  setError,
  refreshSummary,
}: MatchItemProps) => {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editHomeScore, setEditHomeScore] = useState<number>(0);
  const [editAwayScore, setEditAwayScore] = useState<number>(0);

  const handleFinishGame = (matchId: MatchId) => {
    try {
      scoreBoardInstance.finishGame({ id: matchId });
      refreshSummary(); // Update UI
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleEditScoreClick = (match: Match) => {
    setEditingMatchId(match.id);
    setEditHomeScore(match.homeScore);
    setEditAwayScore(match.awayScore);
    // Clear previous errors
    setEditError("");
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingMatchId(null);
    setEditHomeScore(0);
    setEditAwayScore(0);
    setEditError(""); // Clear previous errors
  };

  const handleSaveScore = (matchId: MatchId) => {
    setEditError(""); // Clear previous errors

    try {
      scoreBoardInstance.updateScore({
        id: matchId,
        homeScore: editHomeScore,
        awayScore: editAwayScore,
      });
      refreshSummary(); // Update UI with new score
      setEditingMatchId(null); // Exit edit mode
    } catch (err) {
      if (err instanceof Error) setEditError(err.message);
    }
  };

  if (editingMatchId === match.id) {
    return (
      <div className="edit-score-section">
        <div className="edit-score-inputs">
          <input
            type="number"
            value={editHomeScore}
            onChange={(e) => setEditHomeScore(Number(e.target.value))}
            min="0"
          />
          <span> - </span>
          <input
            type="number"
            value={editAwayScore}
            onChange={(e) => setEditAwayScore(Number(e.target.value))}
            min="0"
          />
        </div>
        <button
          onClick={() => handleSaveScore(match.id)}
          className="save-button"
        >
          Save
        </button>
        <button onClick={handleCancelEdit} className="cancel-button">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <>
      <span>
        {match.homeTeam} {match.homeScore} - {match.awayTeam} {match.awayScore}
      </span>
      <div className="match-actions">
        <button onClick={() => handleEditScoreClick(match)}>Edit Score</button>
        <button onClick={() => handleFinishGame(match.id)}>Finish Game</button>
      </div>
    </>
  );
};
