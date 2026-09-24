import type { AIPersonality } from '../../types';

export interface PersonalityMessages {
  thinking: string[];
  playerMove: string[];
  aiMove: string[];
  aiWin: string[];
  humanWin: string[];
  draw: string[];
}

const MESSAGES: Record<AIPersonality, PersonalityMessages> = {
  calm: {
    thinking: ['Analyzing board topology...', 'Evaluating options...', 'Considering next sequence...'],
    playerMove: ['Interesting move.', 'A methodical choice.', 'I see your strategy.'],
    aiMove: ['Your turn.', 'Let us proceed.', 'Placing my marker.'],
    aiWin: ['A well-played match.', 'Precision achieves victory.', 'Good effort.'],
    humanWin: ['Impressive tactics.', 'You played masterfully.', 'A deserved win.'],
    draw: ['Equilibrium reached.', 'A balanced match.', 'No mistakes made by either side.'],
  },
  competitive: {
    thinking: ['Calculating your downfall...', 'Formulating counter-attack...', 'Finding the weakness...'],
    playerMove: ['That blocks me.', 'Nice try, but watch this.', 'Bold move.'],
    aiMove: ['Top that!', 'Your move, champion.', 'Let us see what you have.'],
    aiWin: ['Checkmate! Victory is mine.', 'Unstoppable strategy!', 'Game over, well tried!'],
    humanWin: ['Rematch immediately!', 'A rare slip-up. Enjoy your win.', 'Next game will be different!'],
    draw: ['Stalemate! Let us settle this in a rematch.', 'Tied! Next game takes it all.'],
  },
  friendly: {
    thinking: ['Hmm, where should I go?...', 'Good game so far!...', 'Thinking of a fun response...'],
    playerMove: ['Great placement!', 'Clever move!', 'Ooh, nice choice!'],
    aiMove: ['Here is my move!', 'Your turn friend!', 'Hope you like this choice!'],
    aiWin: ['Yay, good game!', 'Thanks for playing! That was fun.', 'Awesome match!'],
    humanWin: ['Congratulations! Great playing!', 'You won! Fantastic job!', 'Superb victory!'],
    draw: ['It is a tie! High five!', 'Well matched friends!', 'Great game both ways!'],
  },
  silent: {
    thinking: ['AI thinking...'],
    playerMove: ['...'],
    aiMove: ['...'],
    aiWin: ['Game over. Winner: AI'],
    humanWin: ['Game over. Winner: Player'],
    draw: ['Game over. Result: Draw'],
  },
};

export function getPersonalityCommentary(
  personality: AIPersonality,
  event: keyof PersonalityMessages
): string {
  const options = MESSAGES[personality][event];
  if (!options || options.length === 0) return '';
  return options[Math.floor(Math.random() * options.length)];
}
