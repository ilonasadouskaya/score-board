import { render, screen, fireEvent, within } from "@testing-library/react";

import App from "../App";
import { mockMatches, mockScoreBoard } from "./mockScoreBoard.po";

vi.mock("./lib/ScoreBoard", () => ({
  default: vi.fn(() => mockScoreBoard),
}));

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatches.length = 0;

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should display "No live games currently" when no games are active', () => {
    render(<App />);

    expect(
      screen.getByText("No live games currently. Start a new one!")
    ).toBeInTheDocument();
  });

  it("should start a new game and display it in the summary", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Home Team:/i), {
      target: { value: "Mexico" },
    });
    fireEvent.change(screen.getByLabelText(/Away Team:/i), {
      target: { value: "Canada" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Start Game/i }));

    // Advance timers for mock match creation
    vi.advanceTimersByTime(10);

    expect(screen.getByText(/Mexico 0 - Canada 0/i)).toBeInTheDocument();
    expect(mockScoreBoard.startGame).toHaveBeenCalledWith("Mexico", "Canada");
    expect(
      screen.queryByText("No live games currently.")
    ).not.toBeInTheDocument();
  });

  it("should display an error when trying to start a game with empty team names", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Start Game/i }));

    expect(
      screen.getByText("Home team and away team names are required.")
    ).toBeInTheDocument();
    expect(mockScoreBoard.startGame).toHaveBeenCalledWith("", "");
    expect(screen.queryByText(/Mexico 0 - Canada 0/i)).not.toBeInTheDocument();
  });

  it("should allow updating a game score and display the new score", async () => {
    fireEvent.change(screen.getByLabelText(/Home Team:/i), {
      target: { value: "Germany" },
    });
    fireEvent.change(screen.getByLabelText(/Away Team:/i), {
      target: { value: "France" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Start Game/i }));

    // Advance timers for mock match creation
    vi.advanceTimersByTime(10);

    render(<App />); // Re-render to pick up the initial game from the mockScoreBoard

    const gameItem = screen.getByText(/Germany 0 - France 0/i).closest("li");
    expect(gameItem).toBeInTheDocument();

    // Click "Edit Score"
    fireEvent.click(
      within(gameItem).getByRole("button", { name: /Edit Score/i })
    );

    // Ensure input fields appear and have correct initial values
    const homeInput = within(gameItem).getByDisplayValue("0");
    const awayInput = within(gameItem).getByDisplayValue("0");
    expect(homeInput).toBeInTheDocument();
    expect(awayInput).toBeInTheDocument();

    // Type new scores
    fireEvent.change(homeInput, { target: { value: "2" } });
    fireEvent.change(awayInput, { target: { value: "1" } });

    // Click "Save"
    fireEvent.click(within(gameItem).getByRole("button", { name: /Save/i }));
    vi.advanceTimersByTime(10);

    // Check if the score is updated in the display
    expect(screen.getByText(/Germany 2 - France 1/i)).toBeInTheDocument();
    expect(mockScoreBoard.updateScore).toHaveBeenCalledWith(
      expect.any(String),
      2,
      1
    );
    expect(
      screen.queryByRole("button", { name: /Save/i })
    ).not.toBeInTheDocument(); // Ensure not in edit mode anymore
  });

  it("should finish a game and remove it from the display", async () => {
    // Arrange: Start a game first
    fireEvent.change(screen.getByLabelText(/Home Team:/i), {
      target: { value: "Uruguay" },
    });
    fireEvent.change(screen.getByLabelText(/Away Team:/i), {
      target: { value: "Italy" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Start Game/i }));
    vi.advanceTimersByTime(10);

    render(<App />);

    // Check if the game is initially displayed
    expect(screen.getByText(/Uruguay 0 - Italy 0/i)).toBeInTheDocument();

    // Click "Finish Game"
    fireEvent.click(screen.getByRole("button", { name: /Finish Game/i }));
    vi.advanceTimersByTime(10);

    // Check if the game is no longer displayed and "No live games" message returns
    expect(screen.queryByText(/Uruguay 0 - Italy 0/i)).not.toBeInTheDocument();
    expect(
      screen.getByText("No live games currently. Start a new one!")
    ).toBeInTheDocument();
    expect(mockScoreBoard.finishGame).toHaveBeenCalledWith(expect.any(String));
  });
});
